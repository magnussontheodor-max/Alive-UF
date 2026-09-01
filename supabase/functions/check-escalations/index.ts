// ALIVE — the escalation check, plus the two self-reminders.
//
// Scheduled to run every few minutes (Dashboard → Integrations → Cron
// → New job → type "Supabase Edge Function" → this one → every 5
// minutes; see ARCHITECTURE.md for the exact steps). Three separate
// things can be true for a given profile on a given run, all computed
// from the same deadline math and handled in the same pass over
// `profiles` rather than three separate scans of the same table:
//
// 1. Escalation — check-in deadline plus grace period has passed today
//    with no check-in and no notification sent yet: push it to their
//    linked trusted contacts.
// 2. "Window closing" reminder — 30 minutes before the deadline, still
//    no check-in: push a reminder to the person themselves (their own
//    `push_tokens`, not their contacts').
// 3. "Grace ending" reminder — 10 minutes before escalation would fire,
//    still no check-in: another push to the person themselves.
//
// This scans every onboarded profile on each run. Fine at "thousands"
// of users; if that stops being true, the fix is a computed and
// indexed `next_deadline_utc` column recalculated whenever someone
// checks in or changes their settings, turning this into an indexed
// range query instead of a scan — an added column, not a rewrite.

import { createClient } from 'npm:@supabase/supabase-js@2';
import { fromZonedTime } from 'npm:date-fns-tz@3.2.0';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
// Supabase injects this automatically for every Edge Function — it's
// what lets this run as a scheduled job with no signed-in user of its
// own, bypassing Row Level Security entirely. Never expose this key to
// a client; only this server-side function ever sees it.
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Must stay in sync with ESCALATION.reminderBeforeCloseMin in
// src/types/profile.ts — that's what the client's own `closingSoon`
// status (checkInStatus.ts) is computed against, and this is the
// server-side push that acts on the same moment.
const WINDOW_CLOSING_LEAD_MIN = 30;
// How long before escalation the "grace ending" reminder fires. Every
// GRACE_OPTIONS value (src/types/profile.ts) is at least 30 minutes,
// so this point always falls strictly after the deadline and strictly
// before escalation — no grace-period length needs special-casing.
const GRACE_ENDING_LEAD_MIN = 10;

type Profile = {
  id: string;
  timezone: string;
  check_in_hour: number;
  check_in_minute: number;
  grace_minutes: number;
  user_name: string;
};

/** Today's date as seen in `timeZone`, as YYYY-MM-DD — en-CA is the locale that happens to format that way directly. */
function todayInZone(now: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

async function sendExpoPush(tokens: string[], title: string, body: string): Promise<void> {
  if (tokens.length === 0) return;
  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify(tokens.map((to) => ({ to, title, body, sound: 'default' }))),
  });
}

Deno.serve(async () => {
  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const now = new Date();

  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, timezone, check_in_hour, check_in_minute, grace_minutes, user_name')
    .not('onboarding_completed_at', 'is', null);

  if (profilesError) {
    return new Response(JSON.stringify({ error: profilesError.message }), { status: 500 });
  }

  let escalated = 0;
  let remindedWindowClosing = 0;
  let remindedGraceEnding = 0;

  for (const profile of (profiles ?? []) as Profile[]) {
    const day = todayInZone(now, profile.timezone);
    const hh = String(profile.check_in_hour).padStart(2, '0');
    const mm = String(profile.check_in_minute).padStart(2, '0');
    const deadline = fromZonedTime(`${day} ${hh}:${mm}`, profile.timezone);
    const closingSoonAt = new Date(deadline.getTime() - WINDOW_CLOSING_LEAD_MIN * 60_000);
    const escalatedAt = new Date(deadline.getTime() + profile.grace_minutes * 60_000);
    const graceEndingAt = new Date(escalatedAt.getTime() - GRACE_ENDING_LEAD_MIN * 60_000);

    // Windows, not instants: each is true from its trigger moment
    // onward (matching the original escalation check's `now >=
    // escalatedStart`), except the two reminders also close once the
    // *next* stage starts — a run that's late enough to have crossed
    // the deadline has nothing sensible left to say about "closes at
    // {time}", and one that's crossed escalatedAt is handled by
    // escalation instead, not the grace-ending reminder.
    const needsWindowClosing = now >= closingSoonAt && now < deadline;
    const needsGraceEnding = now >= graceEndingAt && now < escalatedAt;
    const needsEscalation = now >= escalatedAt;

    // Nothing for this profile on this run at all — skip every lookup
    // below rather than querying for no reason.
    if (!needsWindowClosing && !needsGraceEnding && !needsEscalation) continue;

    const [{ data: checkIn }, { data: reminderRows }] = await Promise.all([
      supabase.from('check_ins').select('id').eq('user_id', profile.id).eq('day', day).maybeSingle(),
      // Both kinds in one query — cheap either way, and simpler than
      // conditionally filtering by whichever reminder(s) are due.
      supabase.from('reminder_notifications').select('kind').eq('user_id', profile.id).eq('day', day),
    ]);

    // Already checked in today — none of the three ever apply, same as
    // the original escalation-only check.
    if (checkIn) continue;

    // Only looked up when escalation is actually in play this run —
    // same query, same "already handled today" meaning as the
    // original `alreadyNotified`, just fetched lazily instead of
    // unconditionally.
    const escalationRow = needsEscalation
      ? (
          await supabase
            .from('escalation_notifications')
            .select('id')
            .eq('user_id', profile.id)
            .eq('day', day)
            .maybeSingle()
        ).data
      : null;

    const alreadyReminded = new Set((reminderRows ?? []).map((r) => r.kind as string));
    let ownTokens: string[] | null = null;
    const ownPushTokens = async () => {
      if (ownTokens === null) {
        const { data } = await supabase.from('push_tokens').select('token').eq('user_id', profile.id);
        ownTokens = (data ?? []).map((t) => t.token as string);
      }
      return ownTokens;
    };

    if (needsWindowClosing && !alreadyReminded.has('window_closing')) {
      await sendExpoPush(await ownPushTokens(), 'ALIVE', `Check-in window closes at ${hh}:${mm}.`);
      // Recorded even with zero tokens on file — same "handled for
      // today either way" reasoning as escalation_notifications below;
      // the (user_id, day, kind) unique constraint makes a duplicate
      // insert from an overlapping run fail harmlessly.
      await supabase.from('reminder_notifications').insert({ user_id: profile.id, day, kind: 'window_closing' });
      remindedWindowClosing++;
    }

    if (needsGraceEnding && !alreadyReminded.has('grace_ending')) {
      await sendExpoPush(await ownPushTokens(), 'ALIVE', 'Grace period ends in 10 minutes.');
      await supabase.from('reminder_notifications').insert({ user_id: profile.id, day, kind: 'grace_ending' });
      remindedGraceEnding++;
    }

    if (needsEscalation && !escalationRow) {
      const { data: contacts } = await supabase
        .from('trusted_contacts')
        .select('linked_user_id')
        .eq('owner_id', profile.id)
        .eq('status', 'linked');

      const linkedIds = (contacts ?? [])
        .map((c) => c.linked_user_id as string | null)
        .filter((id): id is string => Boolean(id));

      if (linkedIds.length > 0) {
        const { data: tokens } = await supabase.from('push_tokens').select('token').in('user_id', linkedIds);
        await sendExpoPush(
          (tokens ?? []).map((t) => t.token as string),
          'ALIVE',
          `${profile.user_name || 'Someone you watch over'} hasn't checked in today.`
        );
      }

      // Recorded even when there were no linked contacts to push yet —
      // this profile is "handled" for today either way, and the unique
      // (user_id, day) constraint means a duplicate insert here (e.g.
      // two overlapping runs) just fails harmlessly rather than
      // double-notifying.
      await supabase.from('escalation_notifications').insert({ user_id: profile.id, day });
      escalated++;
    }
  }

  return new Response(
    JSON.stringify({
      checked: (profiles ?? []).length,
      escalated,
      remindedWindowClosing,
      remindedGraceEnding,
    }),
    { headers: { 'content-type': 'application/json' } }
  );
});
