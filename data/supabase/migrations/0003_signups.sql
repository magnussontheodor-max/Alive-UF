-- ===========================================================================
-- Spark — pre-launch signups
--
-- Everything here is written by anonymous visitors on the public page, so
-- unlike the founder-owned tables in 0001 these rows belong to nobody. Row
-- level security is therefore enabled with NO policies at all: anon and
-- authenticated can neither read nor write. Every access goes through the
-- API routes using the service role key, which bypasses RLS.
--
-- All timestamps are timestamptz, so they are stored in UTC. Conversion to
-- Europe/Stockholm happens once, explicitly, in lib/time.ts — never here and
-- never implicitly, or we read our own launch data an hour out.
--
-- Apply with:
--   supabase db execute --file data/supabase/migrations/0003_signups.sql
-- ===========================================================================

-- --------------------------------------------------------------------------
-- updated_at, maintained by the database rather than by every caller
-- --------------------------------------------------------------------------

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- --------------------------------------------------------------------------
-- signups
-- --------------------------------------------------------------------------

create table if not exists signups (
  id           uuid primary key default gen_random_uuid(),
  email        text unique not null check (position('@' in email) > 1),
  -- "Vad vill du bygga?" — optional free text, capped to match the client
  idea         text check (idea is null or length(idea) <= 500),
  source       text,
  confirmed    boolean not null default false,
  unsubscribed boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- The application lower-cases before writing; this makes the guarantee hold
-- even if something ever writes around it, so a duplicate is a conflict on
-- the unique index rather than a second row.
create unique index if not exists signups_email_lower_idx on signups (lower(email));
create index if not exists signups_created_at_idx on signups (created_at desc);

drop trigger if exists signups_set_updated_at on signups;
create trigger signups_set_updated_at
  before update on signups
  for each row execute function set_updated_at();

alter table signups enable row level security;
-- Deliberately no policies. Service role only.

-- --------------------------------------------------------------------------
-- email_queue
--
-- Sending is never allowed to block a signup, and a send that fails must not
-- vanish. Every message is written here first; the immediate attempt only
-- marks it sent. Whatever is left is drained by the daily cron, which is what
-- carries mail over the free tier's 300/day ceiling into the next day.
-- --------------------------------------------------------------------------

create table if not exists email_queue (
  id          uuid primary key default gen_random_uuid(),
  to_email    text not null,
  subject     text not null,
  html        text not null,
  text_body   text not null,
  status      text not null default 'pending'
                check (status in ('pending', 'sent', 'failed')),
  attempts    integer not null default 0,
  last_error  text,
  -- a provider that reports its quota is spent pushes this to tomorrow
  send_after  timestamptz not null default now(),
  sent_at     timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists email_queue_pending_idx
  on email_queue (status, send_after)
  where status = 'pending';

drop trigger if exists email_queue_set_updated_at on email_queue;
create trigger email_queue_set_updated_at
  before update on email_queue
  for each row execute function set_updated_at();

alter table email_queue enable row level security;

-- --------------------------------------------------------------------------
-- rate_limits
--
-- Vercel's serverless functions do not share memory between invocations, so a
-- counter in a module variable limits nothing. The counter has to live where
-- every invocation can see it.
--
-- check_rate_limit does the prune, the count and the insert in one statement
-- so two simultaneous requests cannot both read "4 so far" and both pass.
-- --------------------------------------------------------------------------

create table if not exists rate_limits (
  id         bigserial primary key,
  bucket     text not null,
  -- an HMAC of the caller's IP, never the address itself
  identifier text not null,
  created_at timestamptz not null default now()
);

create index if not exists rate_limits_lookup_idx
  on rate_limits (bucket, identifier, created_at desc);

create or replace function check_rate_limit(
  p_bucket         text,
  p_identifier     text,
  p_max            integer,
  p_window_seconds integer
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  delete from rate_limits
   where bucket = p_bucket
     and identifier = p_identifier
     and created_at < now() - make_interval(secs => p_window_seconds);

  select count(*) into v_count
    from rate_limits
   where bucket = p_bucket
     and identifier = p_identifier
     and created_at >= now() - make_interval(secs => p_window_seconds);

  if v_count >= p_max then
    return false;
  end if;

  insert into rate_limits (bucket, identifier) values (p_bucket, p_identifier);
  return true;
end;
$$;

alter table rate_limits enable row level security;

-- Locking the function down.
--
-- Revoking from anon and authenticated alone does nothing: Postgres grants
-- EXECUTE on a new function to PUBLIC, and both roles inherit it from there.
-- Without the PUBLIC revoke below, anyone holding the anon key can call a
-- SECURITY DEFINER function and write rows into rate_limits.
revoke all on function check_rate_limit(text, text, integer, integer) from public;
revoke all on function check_rate_limit(text, text, integer, integer) from anon, authenticated;

-- Only the service role, which is what the API routes authenticate as.
-- Guarded so the migration also applies to a plain Postgres, where Supabase's
-- roles do not exist.
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    execute 'grant execute on function check_rate_limit(text, text, integer, integer) to service_role';
  end if;
end
$$;
