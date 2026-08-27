-- ALIVE — initial schema.
--
-- One row per signed-in person in `profiles` (created automatically on
-- signup by the trigger at the bottom). Everything else hangs off that:
-- who they trust (`trusted_contacts`), their daily check-ins
-- (`check_ins`), where to push-notify them (`push_tokens`), and a log
-- of escalations already sent so the scheduled check never double-fires
-- (`escalation_notifications`).
--
-- Row Level Security is on for every table. The scheduled Edge Function
-- that actually sends escalation pushes runs with the service-role key,
-- which bypasses RLS entirely — the policies below are what a signed-in
-- user's own device is allowed to read/write directly.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  subject_mode text not null default 'self' check (subject_mode in ('self', 'other')),
  user_name text not null default '',
  -- IANA zone, e.g. 'Europe/Stockholm' — captured from the device at
  -- onboarding time. The escalation check runs server-side with no
  -- device of its own, so it needs this to know what "10:00" means for
  -- each person rather than assuming everyone is in one timezone.
  timezone text not null default 'UTC',
  check_in_hour smallint not null default 10 check (check_in_hour between 0 and 23),
  check_in_minute smallint not null default 0 check (check_in_minute in (0, 15, 30, 45)),
  grace_minutes integer not null default 60 check (grace_minutes > 0),
  -- Null until OnboardingFlow finishes. Whether someone has an account
  -- (auth.users) and whether they've finished onboarding are different
  -- questions — this column is what ProfileContext's `isOnboarded`
  -- actually reflects, not just "a profile row exists" (the trigger at
  -- the bottom of this file creates one immediately on signup).
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles are only editable by their owner"
  on public.profiles for update
  using (auth.uid() = id);

-- No insert policy: rows are created only by handle_new_user() below.
-- The SELECT policy (owner, or a linked trusted contact) is created
-- further down, once trusted_contacts exists — it needs to reference
-- that table.

create function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- ---------------------------------------------------------------------
-- trusted_contacts
-- ---------------------------------------------------------------------

create table public.trusted_contacts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  phone text not null,
  -- Shared as part of an invite link (alive://join/<token>). Whoever
  -- opens it and signs in gets linked as this contact's account, via
  -- accept_invite() below — never by a direct client update, since
  -- "I know the token" isn't something a row-ownership RLS check alone
  -- can express safely.
  invite_token uuid not null default gen_random_uuid() unique,
  linked_user_id uuid references public.profiles (id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'linked')),
  created_at timestamptz not null default now()
);

create index trusted_contacts_owner_id_idx on public.trusted_contacts (owner_id);
create index trusted_contacts_linked_user_id_idx on public.trusted_contacts (linked_user_id);

alter table public.trusted_contacts enable row level security;

create policy "contacts are readable by their owner or the linked account"
  on public.trusted_contacts for select
  using (owner_id = auth.uid() or linked_user_id = auth.uid());

create policy "contacts are managed by their owner"
  on public.trusted_contacts for insert
  with check (owner_id = auth.uid());

create policy "contacts are edited by their owner"
  on public.trusted_contacts for update
  using (owner_id = auth.uid());

create policy "contacts are removed by their owner"
  on public.trusted_contacts for delete
  using (owner_id = auth.uid());

-- Claims a pending invite for whoever calls this while signed in.
-- SECURITY DEFINER so it can update a row the caller doesn't own yet
-- (that's the whole point), but it only ever does so for the exact
-- token handed to it, and only while the invite is still pending.
create function public.accept_invite(token uuid)
returns public.trusted_contacts as $$
declare
  updated public.trusted_contacts;
begin
  update public.trusted_contacts
  set linked_user_id = auth.uid(), status = 'linked'
  where invite_token = token and status = 'pending'
  returning * into updated;

  if updated is null then
    raise exception 'Invite not found or already used';
  end if;

  return updated;
end;
$$ language plpgsql security definer;

-- Now that trusted_contacts exists: a profile is readable by its
-- owner, or by whoever is linked as one of their trusted contacts.
create policy "profiles are readable by their owner or a linked contact"
  on public.profiles for select
  using (
    auth.uid() = id
    or id in (
      select owner_id from public.trusted_contacts
      where linked_user_id = auth.uid() and status = 'linked'
    )
  );

-- ---------------------------------------------------------------------
-- check_ins — one row per person per day, never mutated after insert.
-- ---------------------------------------------------------------------

create table public.check_ins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  day date not null,
  checked_in_at timestamptz not null default now(),
  unique (user_id, day)
);

create index check_ins_user_id_day_idx on public.check_ins (user_id, day);

alter table public.check_ins enable row level security;

create policy "check-ins are readable by their owner or a linked contact"
  on public.check_ins for select
  using (
    user_id = auth.uid()
    or user_id in (
      select owner_id from public.trusted_contacts
      where linked_user_id = auth.uid() and status = 'linked'
    )
  );

create policy "check-ins are recorded by their owner"
  on public.check_ins for insert
  with check (user_id = auth.uid());

-- ---------------------------------------------------------------------
-- push_tokens — Expo push tokens, never exposed to anyone but the
-- owning device and the (service-role) escalation function.
-- ---------------------------------------------------------------------

create table public.push_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  token text not null unique,
  platform text,
  created_at timestamptz not null default now()
);

create index push_tokens_user_id_idx on public.push_tokens (user_id);

alter table public.push_tokens enable row level security;

create policy "push tokens are managed by their owner"
  on public.push_tokens for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ---------------------------------------------------------------------
-- escalation_notifications — one row per person per day an escalation
-- push actually went out. Only ever written by the Edge Function
-- (service role, bypasses RLS) — this is what stops it from re-sending
-- every few minutes for the rest of the day once it's already fired.
-- ---------------------------------------------------------------------

create table public.escalation_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  day date not null,
  notified_at timestamptz not null default now(),
  unique (user_id, day)
);

alter table public.escalation_notifications enable row level security;
-- No policies: not readable or writable by ordinary signed-in clients,
-- only by the service-role key the Edge Function runs with.

-- ---------------------------------------------------------------------
-- Auto-create a profile row the moment someone signs up.
-- ---------------------------------------------------------------------

create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
