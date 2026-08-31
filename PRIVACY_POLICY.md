# Privacy Policy

> **This is the same text rendered in-app** (Settings → Privacy Policy, and shown during onboarding) — see `src/legal/content.ts`, the source of truth. Kept here as a plain root-level copy so it's reviewable without running the app. Edit both together.
>
> **Not legal advice.** Fill in every `[BRACKETED]` placeholder with your real details and have this reviewed by a lawyer qualified in your users' jurisdiction before real users rely on it.

Last updated: 2026-08-31

This policy explains what personal data the ALIVE app collects, why, and what rights you have over it, in plain language. ALIVE is a daily check-in app: you confirm you're okay once a day, and if you miss it, the people you've chosen to trust are told.

## Who is responsible for your data

[LEGAL ENTITY OR INDIVIDUAL NAME], [ADDRESS], [COUNTRY] ("we", "us") is the data controller for the personal data described below. Contact us about your data at [PRIVACY CONTACT EMAIL].

## What we collect

- Your email address — to create your account and sign you in (a one-time code is emailed to you; we never see or store a password).
- Your name — shown back to you and, if you're setting ALIVE up for someone else, used to identify them to their trusted contacts.
- Your check-in time and grace period — what time you've chosen to check in by, and how long we wait after a missed check-in before telling anyone.
- Your device's time zone — captured once, automatically, so "10:00" means your actual local morning, not a server's.
- Each trusted contact's name and phone number — so an invite can be sent to the right person. We do not use the phone number to call or text; it identifies the contact to you and, once they accept, links their own account to yours.
- A timestamp each time you check in — nothing else is recorded about that day, no notes or location.
- A push notification token for your device — only if you enable notifications — used solely to deliver ALIVE's own reminders and escalation alerts.

## Why we process it, and on what basis

Everything above is collected because it's necessary to provide the check-in and escalation service you're signing up for — this is our legal basis under GDPR Article 6(1)(b), performance of a contract with you. We don't use your data for advertising, and we don't sell it.

## Who else sees it

We use a small number of service providers ("processors") to run ALIVE. They only ever act on our instructions and only see what's needed to do their job:

- **Supabase** (database, authentication, and the server-side job that checks for missed check-ins) — hosted at [SUPABASE PROJECT REGION].
- **Resend** (sends the sign-in code and any notification emails).
- **Expo's push notification service** (delivers push alerts to devices).

We don't share your data with anyone else, and we don't transfer it outside these providers' own infrastructure.

## How long we keep it

We keep your data for as long as your account exists. If you delete your account (Settings → Delete my account, or by writing to us), your profile, trusted contacts, check-in history, and device token are permanently deleted within [X DAYS — FILL IN] and cannot be recovered. A trusted contact's own record of you isn't affected by your deletion, since that's their data, not yours — only the link between your two accounts is removed.

## Your rights

Under GDPR, you can:

- **Access** the personal data we hold about you (Settings → Download my data gives you a full copy immediately).
- **Correct** it if it's wrong (every field in Settings is editable directly).
- **Delete** it (Settings → Delete my account).
- **Port** it — get a copy in a portable format to take elsewhere (the same export above is plain JSON).
- **Object to or restrict** how we use it, or withdraw consent where we rely on it.
- **Complain** to your local data protection authority if you think we've got this wrong.

To exercise any of these beyond what Settings already gives you directly, contact [PRIVACY CONTACT EMAIL].

## Security

Your data is encrypted in transit (HTTPS/TLS) and at rest. Row-level access rules on our database mean your data is only ever readable by you, or by a trusted contact you've specifically linked — not by other ALIVE users, and not by us browsing the database casually.

## Children

ALIVE isn't directed at children, and we don't knowingly collect data from anyone under 16.

## Changes

If this policy changes in a way that matters, we'll ask you to review and re-accept it before you can keep using ALIVE — the same way you accepted it the first time.
