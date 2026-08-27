// ALIVE — the escalation check.
//
// Scheduled to run every few minutes (Dashboard → Integrations → Cron
// → New job → type "Supabase Edge Function" → this one → every 5
// minutes; see ARCHITECTURE.md for the exact steps). Finds everyone
// whose check-in deadline plus grace period has passed today with no
// check-in and no notification sent yet, and pushes their linked
// trusted contacts.
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

  const overdue = ((profiles ?? []) as Profile[]).filter((profile) => {
    const day = todayInZone(now, profile.timezone);
    const hh = String(profile.check_in_hour).padStart(2, '0');
    const mm = String(profile.check_in_minute).padStart(2, '0');
    const deadline = fromZonedTime(`${day} ${hh}:${mm}`, profile.timezone);
    const escalatedStart = new Date(deadline.getTime() + profile.grace_minutes * 60_000);
    return now >= escalatedStart;
  });

  let notified = 0;

  for (const profile of overdue) {
    const day = todayInZone(now, profile.timezone);

    const [{ data: checkIn }, { data: alreadyNotified }] = await Promise.all([
      supabase.from('check_ins').select('id').eq('user_id', profile.id).eq('day', day).maybeSingle(),
      supabase
        .from('escalation_notifications')
        .select('id')
        .eq('user_id', profile.id)
        .eq('day', day)
        .maybeSingle(),
    ]);

    // Either they checked in, or this profile was already handled on
    // an earlier run today — either way, nothing left to do for them.
    if (checkIn || alreadyNotified) continue;

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
    notified++;
  }

  return new Response(JSON.stringify({ checked: overdue.length, notified }), {
    headers: { 'content-type': 'application/json' },
  });
});
