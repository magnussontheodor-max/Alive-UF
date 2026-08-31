/**
 * Privacy Policy and Terms of Service, as actual TypeScript strings —
 * this is the single source of truth LegalScreen renders in-app, and
 * ConsentStep gates onboarding on. PRIVACY_POLICY.md / TERMS_OF_SERVICE.md
 * at the repo root are the same text, kept there so it's reviewable
 * without running the app; if you edit one, edit the other to match.
 *
 * IMPORTANT: this is a real, substantive draft written to match
 * exactly what ALIVE's code actually does — not boilerplate — but it
 * is not legal advice, and neither of us (you or Claude) is your
 * lawyer. Before real users rely on this:
 *   1. Replace every [BRACKETED] placeholder below with your actual
 *      details (legal entity/individual name, address, contact email,
 *      country).
 *   2. Have both documents reviewed by a lawyer qualified in your
 *      users' jurisdiction — GDPR compliance depends on facts a
 *      document can't settle on its own (who your data controller
 *      legally is, whether you need a DPO, whether your Supabase
 *      project's hosting region is adequate for your users).
 *   3. Confirm the operational items ARCHITECTURE.md's GDPR section
 *      lists as "still needs a human" are actually done.
 */

export const PRIVACY_POLICY_VERSION = '2026-08-31';

export const PRIVACY_POLICY_TITLE = 'Privacy Policy';
export const TERMS_TITLE = 'Terms of Service';

export const PRIVACY_POLICY_TEXT = `Last updated: ${PRIVACY_POLICY_VERSION}

This policy explains what personal data the ALIVE app collects, why, and what rights you have over it, in plain language. ALIVE is a daily check-in app: you confirm you're okay once a day, and if you miss it, the people you've chosen to trust are told.

WHO IS RESPONSIBLE FOR YOUR DATA

[LEGAL ENTITY OR INDIVIDUAL NAME], [ADDRESS], [COUNTRY] ("we", "us") is the data controller for the personal data described below. Contact us about your data at [PRIVACY CONTACT EMAIL].

WHAT WE COLLECT

- Your email address — to create your account and sign you in (a one-time code is emailed to you; we never see or store a password).
- Your name — shown back to you and, if you're setting ALIVE up for someone else, used to identify them to their trusted contacts.
- Your check-in time and grace period — what time you've chosen to check in by, and how long we wait after a missed check-in before telling anyone.
- Your device's time zone — captured once, automatically, so "10:00" means your actual local morning, not a server's.
- Each trusted contact's name and phone number — so an invite can be sent to the right person. We do not use the phone number to call or text; it identifies the contact to you and, once they accept, links their own account to yours.
- A timestamp each time you check in — nothing else is recorded about that day, no notes or location.
- A push notification token for your device — only if you enable notifications — used solely to deliver ALIVE's own reminders and escalation alerts.

WHY WE PROCESS IT, AND ON WHAT BASIS

Everything above is collected because it's necessary to provide the check-in and escalation service you're signing up for — this is our legal basis under GDPR Article 6(1)(b), performance of a contract with you. We don't use your data for advertising, and we don't sell it.

WHO ELSE SEES IT

We use a small number of service providers ("processors") to run ALIVE. They only ever act on our instructions and only see what's needed to do their job:

- Supabase (database, authentication, and the server-side job that checks for missed check-ins) — hosted at [SUPABASE PROJECT REGION].
- Resend (sends the sign-in code and any notification emails).
- Expo's push notification service (delivers push alerts to devices).

We don't share your data with anyone else, and we don't transfer it outside these providers' own infrastructure.

HOW LONG WE KEEP IT

We keep your data for as long as your account exists. If you delete your account (Settings → Delete my account, or by writing to us), your profile, trusted contacts, check-in history, and device token are permanently deleted within [X DAYS — FILL IN] and cannot be recovered. A trusted contact's own record of you isn't affected by your deletion, since that's their data, not yours — only the link between your two accounts is removed.

YOUR RIGHTS

Under GDPR, you can:

- Access the personal data we hold about you (Settings → Download my data gives you a full copy immediately).
- Correct it if it's wrong (every field in Settings is editable directly).
- Delete it (Settings → Delete my account).
- Get a copy in a portable format to take elsewhere (the same export above is plain JSON).
- Object to or restrict how we use it, or withdraw consent where we rely on it.
- Complain to your local data protection authority if you think we've got this wrong.

To exercise any of these beyond what Settings already gives you directly, contact [PRIVACY CONTACT EMAIL].

SECURITY

Your data is encrypted in transit (HTTPS/TLS) and at rest. Row-level access rules on our database mean your data is only ever readable by you, or by a trusted contact you've specifically linked — not by other ALIVE users, and not by us browsing the database casually.

CHILDREN

ALIVE isn't directed at children, and we don't knowingly collect data from anyone under 16.

CHANGES

If this policy changes in a way that matters, we'll ask you to review and re-accept it before you can keep using ALIVE — the same way you accepted it the first time.`;

export const TERMS_TEXT = `Last updated: ${PRIVACY_POLICY_VERSION}

These terms are the agreement between you and [LEGAL ENTITY OR INDIVIDUAL NAME] ("we", "us") for using the ALIVE app. By creating an account, you agree to them.

WHAT ALIVE DOES

ALIVE lets you check in once a day to say you're okay. If you miss your check-in by more than the grace period you chose, we notify the trusted contacts you've added — but only once they've each accepted your invite and installed ALIVE themselves.

WHAT ALIVE IS NOT

ALIVE is not a medical device, an emergency service, or a substitute for one. It does not call emergency services, and a missed check-in does not guarantee anyone will see the notification promptly, or at all — push delivery, a contact's phone being off, or a missed notification are all real possibilities we can't eliminate. If you or someone else is in immediate danger, contact your local emergency number directly, not ALIVE.

YOUR ACCOUNT

You're responsible for keeping your sign-in email accessible, and for the accuracy of what you enter — your check-in time, grace period, and your trusted contacts' details. You can add, remove, or edit any of it at any time in Settings.

TRUSTED CONTACTS

Adding someone as a trusted contact sends them an invite; nothing is shared with them until they accept it by signing in themselves. You're responsible for having a real reason to believe the phone number/name you enter is theirs and that they'd want to be added.

ACCEPTABLE USE

Don't use ALIVE to harass, monitor without consent, or impersonate someone else. We can suspend or delete an account used that way.

DELETING YOUR ACCOUNT

You can delete your account at any time from Settings. This is permanent — see the Privacy Policy for exactly what that removes and how long it takes.

CHANGES TO THE SERVICE

We may change or discontinue features of ALIVE. If we make a change that meaningfully affects how the service works, we'll tell you before it takes effect where practical.

LIABILITY

To the fullest extent the law allows, we aren't liable for indirect or consequential losses arising from your use of ALIVE, including a missed or delayed notification. Nothing here limits liability that can't legally be limited (e.g. for our own fraud or, where applicable, gross negligence).

GOVERNING LAW

These terms are governed by the laws of [JURISDICTION — FILL IN].

CONTACT

Questions about these terms: [CONTACT EMAIL].`;
