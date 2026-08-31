-- ALIVE — GDPR: recorded consent + self-service account deletion.
--
-- Two things, both required before this app can honestly be called
-- GDPR-ready:
--
-- 1. A record of *when* (and which version of the policy) someone
--    actually agreed to the Privacy Policy / Terms — so there's never
--    a profile holding real personal data with no consent behind it.
--    Onboarding won't complete without setting this (see
--    src/screens/onboarding/ConsentStep.tsx).
--
-- 2. A way for a signed-in person to permanently delete their own
--    account (GDPR Art. 17, right to erasure) without needing the
--    service-role key. The anon/publishable key the app ships with is
--    deliberately not allowed to touch auth.users directly, so this
--    is a SECURITY DEFINER function scoped to auth.uid() — it can only
--    ever delete the row belonging to whoever is calling it.

alter table public.profiles
  add column privacy_accepted_at timestamptz,
  add column privacy_policy_version text;

-- Deleting the auth.users row cascades everywhere that matters:
-- profiles (on delete cascade, 0001_init.sql), and from there
-- trusted_contacts owned by them, check_ins, push_tokens, and
-- escalation_notifications. A trusted_contacts row where this person
-- was the *linked* contact rather than the owner is kept, with
-- linked_user_id set to null (on delete set null) — the other
-- person's own address-book entry for them isn't this account's data
-- to erase, only the link between the two accounts is.
create function public.delete_own_account()
returns void as $$
begin
  delete from auth.users where id = auth.uid();
end;
$$ language plpgsql security definer;

-- Explicit, rather than relying on Postgres's default "every role can
-- call it" grant — auth.uid() returns null for an unauthenticated
-- (anon) caller so this would already be a harmless no-op for them,
-- but a destructive function is worth locking down anyway.
revoke all on function public.delete_own_account() from public;
grant execute on function public.delete_own_account() to authenticated;
