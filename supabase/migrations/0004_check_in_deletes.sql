-- ALIVE — check_ins: missing DELETE policy, plus SECURITY DEFINER
-- search_path hardening.
--
-- 1. check_ins had RLS enabled (0001_init.sql) with SELECT and INSERT
--    policies but no DELETE policy. Under Postgres RLS, a DELETE with
--    no matching policy simply affects 0 rows — no error, nothing in
--    the response to signal it. CheckInContext.reset() (used by the
--    in-app "Reset today's check-in" testing control) does an
--    optimistic local clear then a `.delete()` call that, against a
--    real backend, was silently a no-op: the row reappeared on
--    reload, and a subsequent checkIn() insert could then fail the
--    `unique (user_id, day)` constraint. This policy scopes deletes to
--    the owner only, same as every other owner-write policy in this
--    schema.
--
-- 2. accept_invite(), delete_own_account(), and handle_new_user() are
--    all SECURITY DEFINER without an explicit search_path — a known
--    Postgres hardening gap (a writable `public` schema could shadow
--    an unqualified reference and run as the function's privileges
--    instead of the caller's). All three already fully-qualify every
--    table/function they touch (public.*, auth.*), so pinning
--    search_path to the empty string is safe — it can't break
--    resolution of anything they actually reference — and is the
--    strictest form of this fix: pg_catalog is always searched
--    implicitly regardless of search_path, so built-in types/operators
--    are unaffected. Bodies below are unchanged from
--    0001_init.sql/0002_gdpr.sql except for that one addition.

create policy "check-ins are removed by their owner"
  on public.check_ins for delete
  using (user_id = auth.uid());

create or replace function public.accept_invite(token uuid)
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
$$ language plpgsql security definer set search_path = '';

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$ language plpgsql security definer set search_path = '';

create or replace function public.delete_own_account()
returns void as $$
begin
  delete from auth.users where id = auth.uid();
end;
$$ language plpgsql security definer set search_path = '';
