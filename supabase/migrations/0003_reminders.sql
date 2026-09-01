-- ALIVE — self-reminders: the two pushes that go to the profile owner
-- themselves, not their trusted contacts.
--
-- Until now, check-escalations only ever notified a person's trusted
-- contacts, after the fact, once a check-in had already been missed
-- past the grace period. Nothing told the person themselves that their
-- window was closing or that grace was about to run out — despite the
-- client already computing that state (`closingSoon` in
-- checkInStatus.ts) for its own display. This table is what lets the
-- same scheduled function also fire those two self-reminders, once
-- each per day, without re-sending on every subsequent 5-minute run.
--
-- One row per (person, day, which reminder) rather than one row per
-- (person, day) like escalation_notifications, because the two
-- reminders are independent events that can both legitimately fire on
-- the same day for the same person — the `kind` column plus the
-- three-way unique constraint is what keeps each one idempotent on its
-- own instead of the first reminder accidentally blocking the second.

create table public.reminder_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  day date not null,
  kind text not null check (kind in ('window_closing', 'grace_ending')),
  notified_at timestamptz not null default now(),
  unique (user_id, day, kind)
);

alter table public.reminder_notifications enable row level security;
-- No policies: not readable or writable by ordinary signed-in clients,
-- only by the service-role key check-escalations runs with — same
-- posture as escalation_notifications.
