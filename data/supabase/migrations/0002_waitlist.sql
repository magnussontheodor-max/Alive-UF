-- ===========================================================================
-- Spark UF — pre-launch waitlist
--
-- Unlike every other table in this schema, waitlist rows are not owned by a
-- founder: they are written by anonymous visitors on the public landing page.
-- Row level security therefore inverts. Anonymous visitors may insert and
-- nothing else — they can never read the list back, so one signup cannot
-- enumerate everyone else's email address.
--
-- Apply with:  supabase db execute --file data/supabase/migrations/0002_waitlist.sql
-- ===========================================================================

create table waitlist (
  id           text primary key,
  -- nullable: the opening frame captures an email only
  first_name   text check (first_name is null or length(trim(first_name)) between 1 and 80),
  email        text not null check (position('@' in email) > 1),
  source       text not null default 'landing',
  utm_source   text,
  utm_medium   text,
  utm_campaign text,
  created_at   timestamptz not null default now()
);

-- Emails are stored lower-cased by the application; this enforces uniqueness
-- regardless, so a duplicate signup surfaces as 23505 rather than a second row.
create unique index waitlist_email_key on waitlist (lower(email));

create index waitlist_created_at_idx on waitlist (created_at desc);

alter table waitlist enable row level security;

-- Insert only. No select, update or delete policy exists for anon or
-- authenticated roles, so the list is readable only with the service role.
create policy "anyone may join the waitlist"
  on waitlist for insert
  to anon, authenticated
  with check (true);
