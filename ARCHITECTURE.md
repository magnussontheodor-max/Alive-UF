# ALIVE — Architecture

This document explains how the codebase is organized and why. The app
was deliberately built local-only first, then had a real backend
(Supabase) swapped in behind the exact same hooks screens already used
— see "Real backend" below for what that took and what it needs from
you to actually run.

## Stack

- **Expo (SDK 54) + React Native + TypeScript** — the mobile app, one
  codebase for iOS and Android. Started on SDK 57, deliberately moved
  back to 54: the Expo Go app on the App Store/Play Store only supports
  up to SDK 54 (55–57 are approved for local/simulator use and EAS
  builds, but not yet published to the public Expo Go client). Since
  the whole point right now is being able to hand this to anyone —
  co-founders included — and have it open in the Expo Go they already
  have installed, targeting the store-supported version matters more
  than being on the newest SDK. Worth moving back to 57 once Expo Go's
  store listing catches up (`npx expo install expo@latest && npx expo
  install --fix`, the same mechanism used to move to 54).
- **Supabase** — Postgres, Auth, Row Level Security, and a scheduled
  Edge Function, for check-ins, trusted contacts, escalation state, and
  the two self-reminders leading up to it. Wired up in code; needs a
  real project's URL and anon key in `.env` to actually run — see "Real
  backend" below for exact setup steps.
- **Expo Notifications** — how a trusted contact is actually told a
  check-in was missed: a push to their device, not SMS (see "Real
  backend" for why).
- Twilio/SMS — not built. Reaching a phone number that hasn't
  installed ALIVE is a real, separate piece of work (a paid account,
  business-texting registration for volume) — see "What's intentionally
  not here yet."

The interaction and visual language were deliberately built and judged
on local-only state first, before any backend complexity — see
"Onboarding v2" below for how much got settled that way. That phase is
over: everything user-specific now reads and writes Supabase for real.

## Folder structure

```
App.tsx                  Root: font loading, then AuthGate (pre-auth
                         onboarding / sign in / not-configured / the
                         real app), then Root picks OnboardingFlow vs.
                         Home/Settings/HowItWorks

index.ts                 Expo entry point (registers App)

supabase/
  migrations/0001_init.sql  The whole schema: profiles, trusted_contacts,
                           check_ins, push_tokens, escalation_notifications,
                           their RLS policies, and the signup trigger.
  migrations/0002_gdpr.sql  privacy_accepted_at/privacy_policy_version on
                           profiles, and delete_own_account() — see the
                           GDPR section below.
  migrations/0003_reminders.sql  reminder_notifications — the same
                           once-per-day dedup pattern as
                           escalation_notifications, but keyed by which
                           of the two self-reminders (see below) fired,
                           so they don't block each other.
  migrations/0004_check_in_deletes.sql  The check_ins DELETE policy
                           missing from 0001_init.sql (owner-only, same
                           as everywhere else), plus an explicit
                           search_path on the three SECURITY DEFINER
                           functions.
  functions/
    check-escalations/     The scheduled Edge Function: notifies trusted
                           contacts on a missed check-in, and pushes the
                           person themselves twice before that ever
                           happens — see "Real backend".

src/
  theme/                 The single source of truth for how ALIVE looks
    colors.ts            Palette (warm background, ink, one deep-pine accent)
    typography.ts        Type scale — serif (Fraunces) for warmth, system
                           sans for everything functional
    spacing.ts            Spacing scale + corner radii
    index.ts              Re-exports the above

  types/
    profile.ts             CheckInWindow, SubjectMode, GRACE_OPTIONS, and
                           TrustedContact (name/phone, plus inviteToken/
                           status once it's actually been saved) +
                           MAX_TRUSTED_CONTACTS (2).

  data/
    howItWorks.ts           The problem-first intro paragraph plus the
                           three-row explanation of the product, as
                           data — shared by the onboarding step and the
                           standalone screen so the copy exists once.

  lib/
    supabase.ts             The one Supabase client, reading EXPO_PUBLIC_
                           env vars — see "Real backend" below.

  state/
    AuthContext.tsx         The signed-in session — email + a 6-digit
                           code, not a magic link (see its own doc
                           comment for why). Gates everything else.
    CheckInContext.tsx      *Today's* check-in — real Supabase reads and
                           writes now, keyed to the signed-in user;
                           useCheckIn()'s shape didn't change.
    ProfileContext.tsx      *Who the user is*: name, trusted contacts,
                           check-in time, grace period, onboarding
                           status — real Supabase reads and writes;
                           useProfile()'s shape didn't change either.

  hooks/
    useEntranceStyle.ts     The fade + rise used whenever content swaps in
                           place (check-in confirmation, onboarding steps).
    useRegisterPushToken.ts Registers this device for push once signed
                           in — what the escalation function sends to.
    usePendingInvite.ts     Watches for a trusted-contact invite link
                           (alive://join/<token>) and holds the token
                           until AuthGate can claim it.

  screens/
    PreAuthOnboarding.tsx   The pitch: welcome/consent/how-it-works/
                           persona, shown before there's any account to
                           attach them to — see "Sign-in moved after the
                           pitch" below. Hands its result to AuthGate as
                           a small draft object once persona's
                           "Continue" is pressed; also owns the
                           welcome-step "Already have an account? Sign
                           in" link that skips straight past all four.
    SignInScreen.tsx        Email, then the code sent to it — reached
                           after PreAuthOnboarding finishes or is
                           skipped, not before it.
    NotConfiguredScreen.tsx Shown instead of crashing when .env has no
                           real Supabase project in it yet.
    HomeScreen.tsx          The "Are they okay?" screen: greeting, the
                           I'M ALIVE button, the confirmed state, and the
                           four escalation states (open/closing soon/
                           missed/escalated).
    SettingsScreen.tsx      Everything onboarding collected, editable live
                           (no draft/save step) — reuses every onboarding
                           step component directly; see below.
    HowItWorksScreen.tsx     The same explainer shown once in onboarding,
                           kept reachable afterward from Settings — both
                           screens render the same HowItWorksRows list.
    OnboardingFlow.tsx      Orchestrates the name/contacts/time/grace
                           wizard; owns which step is showing and writes
                           the result into ProfileContext. Normally
                           starts straight at `name` — consent and
                           persona already happened in PreAuthOnboarding
                           — but falls back to asking both again itself
                           if it's ever handed no valid draft for them;
                           see "Sign-in moved after the pitch" below.
    onboarding/
      WelcomeStep.tsx       PreAuthOnboarding step 1: wordmark + the
                           headline/supporting line making the case for
                           ALIVE before anything else is asked.
      ConsentStep.tsx        PreAuthOnboarding step 2 (normally) — GDPR's
                           recorded "I agree", plus links to the actual
                           documents (LegalScreen). Also OnboardingFlow's
                           own fallback step 1 when it's run without a
                           completed pre-auth draft.
      HowItWorksStep.tsx    PreAuthOnboarding step 3: HowItWorksRows, the
                           same numbered 3-point list Settings shows.
      PersonaStep.tsx       PreAuthOnboarding step 4 (normally) — who
                           ALIVE is for (self, or someone the user cares
                           about). Also OnboardingFlow's fallback step 2,
                           and reused as-is by SettingsScreen.
      TextStep.tsx          OnboardingFlow content: one question, one
                           text field (the checked-in person's name).
      ContactsStep.tsx      OnboardingFlow content: name + phone for one
                           or two trusted contacts, with add/remove.
                           Also reused by SettingsScreen — see "Why this
                           shape" below.
      CheckInTimeStep.tsx   OnboardingFlow content: a precise check-in
                           time, on two WheelPickers. Also reused by
                           SettingsScreen.
      GracePeriodStep.tsx   OnboardingFlow content: how long to wait
                           after a missed check-in before telling
                           contacts. Also reused by SettingsScreen.

  components/
    AliveButton.tsx         The primary action: press animation, haptics,
                           and the label -> checkmark confirmation reveal.
    CheckMark.tsx            A hand-drawn, self-drawing checkmark (SVG).
    CheckInSummary.tsx       Two-line fact display (checked in at / next).
    HowItWorksRows.tsx        The numbered 3-row explainer list, shared by
                           HowItWorksStep and HowItWorksScreen.
    OptionCard.tsx            Bordered radio-row-with-checkmark, shared by
                           PersonaStep and GracePeriodStep.
    WheelPicker.tsx           The hand-rolled scrolling time wheel behind
                           CheckInTimeStep.
    DemoFooter.tsx           Demo disclosure + reset-for-testing controls.
    Wordmark.tsx             The "ALIVE" brand mark (small in-app, large
                           on the welcome step).
    PrimaryButton.tsx        The pill CTA used by onboarding steps —
                           deliberately not a circle; see below.
    TextField.tsx            A single underlined input line.
    OnboardingHeader.tsx      Back button + step-progress dots.
    OnboardingProgress.tsx    The dots themselves.
    StatusPreview.tsx         Testing-only: jump to any escalation state
                           without waiting for the real clock.

  utils/
    time.ts                 Greeting, date, time, and formatting helpers.
    checkInStatus.ts         getCheckInStatus(): purely a function of the
                           clock and the chosen window — see below.
```

## Why this shape

**Theme is centralized.** Every color, font size, and spacing value the
app uses comes from `src/theme`. A screen never hardcodes `#243B2C` or
`fontSize: 17` directly — it imports from theme. This is what lets the
whole app feel like one considered product instead of a pile of
one-off screens, and it means a future dark mode or rebrand touches
three files, not forty. It's also what made the v2 type pass (below)
a one-file change instead of a find-and-replace across a dozen screens.

**Typography carries more of the brand identity than color does.**
After the first visual pass, the feedback was that it still felt
generic. The fix wasn't a new color or a new shape — it was pushing
the type: the hero went from 32px to 44px and switched to the semibold
cut, set at a dense 1.05 line-height instead of an airy paragraph, so
headlines stack like a magazine cover rather than reading like body
copy that happens to be centered. The tracked-caps labels (the
eyebrow date, row labels) went the opposite direction — smaller and
more tracked-out — specifically to read as a quiet contrast against
the now-much-louder headline, not to compete with it. Both moves came
from one place: `typography.hero` and `typography.label` in
`src/theme/typography.ts`. One layout had to change to survive it:
`CheckInSummary`'s label/value pairs used to sit side by side on one
line ("NEXT CHECK-IN" ... "Tomorrow morning"), which broke — no room
left between them — once the value font got bigger. It's now a
stacked "stat block" (label above, value below), which is both more
robust as values get longer and fits the bolder direction better: the
value gets to be as big as everything else.

**State is behind a hook, not scattered in components.** `HomeScreen`
doesn't know or care whether `useCheckIn()` is backed by `useState`
(today) or a Supabase query (later). When we build the real backend,
we write a new provider with the same shape and swap it in `App.tsx`.
No screen code changes.

**Components are small and single-purpose.** `AliveButton` only knows
how to be a satisfying button. `CheckInSummary` only knows how to lay
out label/value rows. `DemoFooter` only knows how to disclose demo
status and offer a reset. `HomeScreen` composes them and owns the
transition between "not checked in" and "checked in" states. This
keeps each file readable on its own and easy to reuse when we add
future screens (e.g. a settings screen will likely reuse
`CheckInSummary`-style rows).

**The app is never allowed to claim more than it actually does.** That
was true when this was local-only demo state, and it's still the rule
now that the backend is real: `DemoFooter` still permanently discloses
the one real limitation that remains — a trusted contact is notified
by push, which means they need ALIVE installed and signed in too, not
just a phone number on file. That's true today, not a stand-in for
something realer coming later; it stays until SMS (or some other
channel that reaches a non-user) actually exists. `DemoFooter` also
still offers the "testing" reset controls, separated from the primary
flow, since those remain genuinely useful even against a real backend.

The confirmed-state copy describes the *mechanism* ("Dad will only
hear from ALIVE if you ever miss a check-in") rather than asserting a
notification just happened, which is also, not coincidentally, what
actually happens now: contacts are only ever pushed on a missed
check-in, never on a successful one.

The `escalated` state is the one place this got a real decision rather
than an obvious default: its copy ("Dad and Mom have been notified.")
states the consequence directly, the same way the very first version
of the confirmed-state copy did ("Sara knows you're okay."), instead
of hedging it with an on-screen "preview" label. The reasoning: the
standing `DemoFooter` disclosure is already how *every* screen in the
app stays honest, and giving this one state a bespoke, heavier
treatment would be inconsistent with that — and would draw more
attention to "this isn't real" in a way that undercuts the calm,
composed tone the app is going for at exactly the moment it matters
most. One mechanism, applied everywhere, is easier to reason about
than a special case.

**The escalation timeline is a pure function of the clock, not a
timer.** `getCheckInStatus(now, window)` in `checkInStatus.ts` takes
the current time and the user's chosen window and returns one of
`open` / `closingSoon` / `missed` / `escalated` — there's no
`setTimeout` counting down in the background, no scheduled job. This
is deliberate: a demo app that's been closed and reopened, or just sat
idle for an hour, gives the same answer as one that's been open the
whole time, because the answer only ever depends on what time it
actually is right now. The cadence itself — a reminder 30 minutes
before the window closes, another 30 minutes after, contacts informed
30 minutes after that — lives in one place (`ESCALATION` in
`types/profile.ts`) and is currently fixed for everyone; making it a
per-user setting later is a UI addition, not a rework of this
function. `StatusPreview` (testing-only) doesn't fake the state
directly — it only feeds `getCheckInStatus` a different "now" via
`previewTimeFor`, so what you see in preview is the same real logic
that will run at 3pm on a Tuesday, not a parallel hand-built mock.

**No navigation library, on purpose — still.** Onboarding was the
first time the app had more than one screen, and it was tempting to
reach for React Navigation or Expo Router to handle that. What it
actually needed was "show one of several things, in order, with a way
to go back" — `PreAuthOnboarding` and `OnboardingFlow` each do that
with their own single `useState` index, the same pattern already used
for the check-in confirmation's idle/confirming/confirmed states.
Settings and "How ALIVE works" added a second, small triangle (Home ↔
Settings ↔ How it works), handled the same way one level up, in `Root`
(`App.tsx`) — again just a `useState` holding which of three screens is
showing. `AuthGate`, one level up again, holds a third small piece of
state the same way: whether the pre-auth pitch has finished (or been
skipped) yet, so it knows whether to show `PreAuthOnboarding` or
`SignInScreen`. Neither of these is "a real information architecture"
yet: no tabs, nothing that needs a back *stack* rather than a single
"where did I come from" value. There is now exactly one deep link
(`alive://join/<token>`, the trusted-contact invite — see "Real
backend"), handled directly by `usePendingInvite` rather than a router,
because it's one path with one job: hold a token until sign-in
finishes. The right moment to add a real navigation library is when a
second one of these shows up with its own screen to jump to — most
likely a tapped push notification wanting to open straight onto a
specific screen, which today's local `useState` can't do (a tap
currently just opens the app to whatever Root already had).

**Sign-in moved after the pitch, not before it.** The whole app used to
gate on a session first: `AuthGate` showed `SignInScreen` whenever
there was no session, and `OnboardingFlow` — welcome screen included —
never even mounted until after that. That's backwards for a product
that has to earn "give me your email" before asking for it: a
brand-new person should meet what ALIVE actually is (the welcome
headline, how it works, who it's for) before being asked to create an
account for it, the same reasoning as "problem before mechanism" in the
copy itself (see the onboarding v2 UX pass). `PreAuthOnboarding` is
that meet-the-product sequence — welcome, consent, how it works,
persona — held entirely in its own local `useState` drafts, same shape
as `OnboardingFlow`'s, since there's no account yet to write anything
to. `AuthGate` holds the result (a small `{ subjectMode,
privacyAccepted }` draft) across the transition to `SignInScreen` and,
once a session exists, hands it to `OnboardingFlow`, which now starts
straight at `name` instead of repeating ground already covered.

The one thing this reordering can't skip is GDPR consent actually being
recorded (see "GDPR" below) — and a person can reach a signed-in,
not-yet-onboarded `OnboardingFlow` two ways that *don't* carry a
completed draft: tapping the welcome step's "Already have an account?
Sign in" link (a returning person re-authenticating shouldn't have to
sit through the pitch again, so it skips consent/how-it-works/persona
entirely — see below), or restarting onboarding from Settings while
already signed in (there's no pre-auth phase to have come from at all).
`OnboardingFlow` treats both the same way: no valid
`privacyAccepted: true` draft means it falls back to asking for consent
and persona itself, as its own first two steps, rather than ever
completing onboarding with unrecorded consent. `AuthGate` also clears
the draft once `OnboardingFlow` actually applies it (`handleFinish`),
so a Settings restart — same signed-in session, `AuthGate` never
remounts to reset itself — doesn't keep silently re-using a
by-then-stale draft from the original sign-up instead of falling back
correctly.

That `onPreAuthDraftConsumed` callback only covers the case where
`OnboardingFlow` actually ran and used the draft — it says nothing
about a session that ends *without* `OnboardingFlow` ever mounting,
which happens whenever someone finishes `PreAuthOnboarding` and then
signs into an already-onboarded account. The invariant that actually
has to hold is broader: **a signed-out session must never be able to
inherit a previous account's pre-auth draft.** Without it, the stale
`preAuthDraft`/`readyForSignIn` pair sits there until the next sign-in
attempt — skipping `PreAuthOnboarding` entirely for whoever's about to
create the next account, *and* handing their brand-new,
not-yet-onboarded `OnboardingFlow` a draft with `privacyAccepted: true`
that belonged to somebody else, which `handleFinish` would then use to
call `profile.acceptPrivacyPolicy()` — recording GDPR consent this
person never actually gave. So `AuthGate` also resets both
`preAuthDraft` and `readyForSignIn` in a `useEffect` keyed on
`session`, any time `session` goes falsy — covering account deletion,
session expiry, and manual sign-out alike, not just the one path
`onPreAuthDraftConsumed` was written for.

The welcome step's "Already have an account? Sign in" link (in
`PreAuthOnboarding`, not `WelcomeStep.tsx` itself — that component
still only knows how to be the welcome step's content, on the same
"components don't know why they're shown" principle as PersonaStep
below) is deliberately quiet: an underlined caption, not a button,
matching `DemoFooter`/Settings' link-row register rather than competing
with "Get started". It only appears on welcome, not consent/how-it-
works/persona, because by then someone's already chosen to keep going
through the pitch.

**Trusted contacts are typed in by hand, not picked from the phone's
address book.** A real contact picker (`expo-contacts`) means a native
permission prompt and App Store privacy review for data the product
doesn't need in bulk — it only ever needs the one or two people
actually being invited. Manual entry keeps the real data model
(`TrustedContact { name, phone }`, up to `MAX_TRUSTED_CONTACTS`) in
place either way, so a native picker can be swapped in later as a
change to `ContactsStep.tsx` alone, not a data model change.

**The circle is reserved.** `AliveButton`'s circular shape only ever
means one thing: the one daily action the whole product exists for.
Every other button in the app — onboarding's "Continue", "Get
started", "Start using ALIVE" — uses `PrimaryButton`, a pill. Using
the same circle for onboarding CTAs would have been easy (it's already
built) but would dilute the one visual cue that's supposed to say
"this button is different from every other button."

**Settings reuses onboarding's step components directly, unmodified in
behavior.** `PersonaStep`, `ContactsStep`, `CheckInTimeStep`, and
`GracePeriodStep` don't know or care whether the `value`/`onChange`
they're given is a local draft
(onboarding, committed only when the wizard finishes) or the live
profile (Settings, applied immediately, no save button — the way a
settings screen is expected to work). The only thing either screen
customizes is the heading: onboarding asks a question ("Who should
know you're okay?"), Settings shows a plain section label ("TRUSTED
CONTACTS") because it's reviewing known information, not asking a
first-time question. That's the `title`/`subtitle` props on both
components — `undefined` for the onboarding default, `null` to hide it
entirely. Getting a whole editable Settings screen mostly "for free"
from components built for onboarding is the payoff of keeping those
components ignorant of *why* they're being shown, only *what* they do.

## Onboarding v2: Snuggy's principles, not its look

After trying a competitor app (Snuggy), the request was specific.
Build ALIVE's onboarding like that, but better: less generic, similar
principles. That's a useful distinction to keep separate in the
codebase too, so here's what was borrowed, what was deliberately not,
and where each decision lives.

**Borrowed: a precise check-in time instead of a block of the day.**
`CheckInWindow` used to be one of three fixed presets
(morning/afternoon/evening, `CHECK_IN_WINDOW_OPTIONS`). It's now
`{ hour, minute }`, chosen on `WheelPicker`, two scrollable columns of
numerals in 15-minute steps. `getCheckInStatus` simplified along with
it: instead of a window with a separate open/close bound, there's one
deadline, with `open`/`closingSoon`/`missed`/`escalated` all computed
as offsets from it. `WheelPicker` is hand-rolled, not a library or the
system time picker. Fraunces numerals, not the OS's own type; a
scroll-linked opacity/scale fade around a two-hairline band, not a
boxed pill. Every number is also directly tappable (`scrollTo` plus
commit the value on press), not just draggable, because a vertical
scroll wheel nested inside this screen's own vertical scroll container
is a known-flaky gesture on a real device: the outer ScrollView tends
to win the touch. The onboarding screen also turns off its own scroll
during this one step (`scrollEnabled={step !== 'time'}` in
`OnboardingFlow.tsx`) since that step's content never needs it, which
removes the conflict outright there; the tap-to-select path is what
keeps the picker usable in Settings too, where the surrounding screen
can't have its scroll turned off.

**Borrowed: a configurable grace period.** `ESCALATION.escalateAfterCloseMin`
used to be a fixed 60 minutes for everyone. It's now
`graceMinutes`, chosen from `GRACE_OPTIONS` (30 min / 1 hr / 3 hr)
during onboarding and editable later in Settings. A genuine judgment
call (a fast-paced day and a slow one warrant different amounts of
grace) rather than a platform default. The 30-minute lead-in reminder
before the deadline stayed fixed; that one isn't really a preference,
it's closer to how this feature behaves.

**Borrowed, deliberately lightweight: "who is this for."** `SubjectMode`
('self' | 'other') is one new field, asked once, that only changes
copy (the name step's question, the contacts step's framing) for the
rest of onboarding. It does not change the check-in mechanism: it's
still one phone, one person pressing the button. Building the fuller
caregiver-configures-for-someone-else product (a different phone
checks in, a different notification model) would be a real scope
expansion, not an onboarding tweak. Worth doing deliberately later if
this direction earns it, not folded in here as a side effect.

**Not borrowed: the visual language.** No mascot, no soft-3D
illustration set, no personified "I" voice. A first pass tried turning
the three-point explainer into a swiped carousel with a hand-drawn
icon per slide, but the icons read as decoration rather than
communication (an abstract circle for "check in," a bell for
"reminder") and got rolled back. `HowItWorksStep` (onboarding) and
`HowItWorksScreen` (the Settings recall page) now both render the same
`HowItWorksRows`, a plain numbered list, one component instead of two
diverging versions of the same three sentences.

**Not borrowed: a real phone-call escalation.** Snuggy's model calls a
contact first, then texts, then emails. ALIVE has no telephony
integration and isn't getting one to chase this; see the demo/local
state notes in `CheckInContext.tsx` and `ProfileContext.tsx`. Copy
never promises a call; it says a trusted contact is "told."

**`OptionCard`** is the one small refactor this pass did in passing:
the bordered radio-row-with-checkmark pattern (previously
`WindowOptionRow`, private to the old preset-list component) is now
shared by `PersonaStep` and `GracePeriodStep`, both of which needed the
exact same shape. Same reasoning as `ContactsStep`/`CheckInTimeStep`
being reused between onboarding and Settings: one considered component
beats two copies drifting apart.

## Real backend

Everything under `supabase/`, plus `src/lib/supabase.ts`,
`src/state/AuthContext.tsx`, and the Supabase-backed `ProfileContext`/
`CheckInContext`, is real — not scaffolding for later. It just needs a
live project to run against. One-time setup:

1. Create a project at supabase.com (free tier, no card needed to start).
2. Project Settings → API: copy the Project URL and the `anon` `public`
   key into a `.env` file at the repo root (copy `.env.example` first)
   as `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY`, then
   restart `expo start` — Expo only reads `.env` at startup.
3. Run every migration file in `supabase/migrations/`, in order, once —
   `0001_init.sql`, then `0002_gdpr.sql`, then `0003_reminders.sql`, then
   `0004_check_in_deletes.sql`, and whatever's added after them.
   `supabase db push` with the CLI picks up all of them automatically;
   if you're pasting into the SQL Editor by hand instead, paste each
   file in order yourself, since it's easy to stop after the first one
   and miss the rest.
4. Authentication → Email Templates: edit **both** "Confirm signup" and
   "Magic Link" — Supabase picks whichever one applies to the specific
   email (first-ever OTP for a brand-new address uses Confirm signup;
   every request after that uses Magic Link), so editing only one
   leaves the other still sending a link. For each: click the
   **Source** tab (not the WYSIWYG preview — edits made outside Source
   don't save) and replace the body with something that renders
   `{{ .Token }}` instead of the default `{{ .ConfirmationURL }}` link,
   e.g.:
   ```html
   <h2>Your ALIVE code</h2>
   <p>Enter this code in the app to sign in:</p>
   <h1 style="font-size: 32px; letter-spacing: 4px;">{{ .Token }}</h1>
   <p>This code expires shortly and can only be used once.</p>
   ```
   Click **Save** on each template separately. This is what turns
   sign-in into a typed 6-digit code instead of a tapped link — see
   AuthContext's doc comment for why that's deliberate, not an
   oversight. Skip either template and that email will contain a link
   the app never reads. (Editing templates requires custom SMTP to be
   enabled first — Supabase locks Source editing to the built-in
   mailer.)
5. `supabase functions deploy check-escalations` (needs the CLI,
   `supabase login` once). It reads `SUPABASE_URL`/
   `SUPABASE_SERVICE_ROLE_KEY`, which Supabase injects automatically —
   nothing to configure there.
6. Schedule it: Dashboard → Integrations → Cron → New job → type
   "Supabase Edge Function" → `check-escalations` → every 5 minutes (or
   similar). This is the piece that actually notices a missed
   check-in — every step above can be done correctly and nothing will
   ever fire without this one. The same run also covers the two
   self-reminders (below); there's nothing extra to schedule for those.
7. Push needs an EAS project id (`npx eas init`, free) before
   `useRegisterPushToken` has anywhere to register a device — until
   that's done it fails quietly rather than crashing.

**Data model.** `profiles` (one per person, created automatically on
signup by a trigger), `trusted_contacts` (who to notify — each row
carries an `invite_token` that a second account claims via
`accept_invite()`, a `security definer` Postgres function, to become
the linked watcher), `check_ins` (one append-only row per person per
day), `push_tokens`, `escalation_notifications` (stops the scheduled
function from notifying the same missed day twice, even across
overlapping runs), and `reminder_notifications` (the same dedup shape,
but one row per person per day *per reminder kind* — `window_closing`
and `grace_ending` are independent events that can both legitimately
fire on the same day for the same person, so a `kind` column and a
three-way unique constraint keep each one idempotent on its own instead
of the first reminder blocking the second). Every table has Row Level
Security on: a person reads/writes their own rows, and a *linked* trusted contact can
additionally read — never write — the profile, check-ins, and contact
record of whoever they're watching over. That boundary is enforced by
Postgres itself, not by app code remembering to check it, which is
exactly what "won't collapse" actually depends on at real scale — not
raw server capacity, which Postgres has plenty of, but data staying
correctly walled off as more of it accumulates.

**Timezone.** `profiles.timezone` is captured once, silently, from the
device (`Intl.DateTimeFormat().resolvedOptions().timeZone`) when
onboarding finishes. `check-escalations` runs with no device of its
own, so this is the only record of what "10:00" means for each person
— without it, every deadline (and both reminder times computed from
it) would be read as UTC.

**The two self-reminders.** Escalation only ever tells someone's
*contacts*, and only after the fact. `check-escalations` also pushes
the person themselves, twice, on the way there — their own
`push_tokens`, not their contacts' — computed in the same pass over
`profiles`, from the same deadline math, rather than as a second Edge
Function re-scanning the same table on its own schedule: a "window
closing" push 30 minutes before the deadline (mirroring the client's
own `closingSoon` status in `checkInStatus.ts`, which until now nothing
server-side acted on), and a "grace ending" push 10 minutes before
escalation would actually fire. Both are one-shot per person per day,
gated the same way escalation is (not checked in yet, not already
sent) via `reminder_notifications`, and neither ever fires for someone
who's already checked in.

**Scale.** `check-escalations` currently scans every onboarded profile
on each run — fine at thousands of users, and simple enough to reason
about while the product is still this young. If that scan ever becomes
the bottleneck, the fix is a computed, indexed `next_deadline_utc`
column recalculated on check-in or settings change (an added column
and an indexed range query), not a rewrite — noted directly in the
function's own comments, not just here, so it's found by whoever's
actually touching that code when it matters.

## GDPR

What ALIVE actually collects — email, name, timezone, check-in
time/grace period, each trusted contact's name and phone, a timestamp
per check-in, a push token — is covered end to end, both in code and in
the two documents users are asked to actually read, not just link to:

- **Consent, recorded, not assumed.** `profiles.privacy_accepted_at` /
  `privacy_policy_version` (`supabase/migrations/0002_gdpr.sql`) are
  null until `ConsentStep` — normally `PreAuthOnboarding`'s second step,
  right after the welcome screen and before anything else is collected,
  well before an account even exists — is affirmatively accepted. The
  acceptance itself is only actually written once `OnboardingFlow`
  finishes (`ProfileContext.acceptPrivacyPolicy()`, called from
  `handleFinish`), since there's no profile row to write it to until
  then; `ConsentStep`'s answer just rides along as part of the draft
  handed from `PreAuthOnboarding` through sign-in until that point. If
  `OnboardingFlow` ever runs without a completed draft to carry that
  answer (see "Sign-in moved after the pitch, not before it" above), it
  asks `ConsentStep` again itself rather than completing onboarding with
  nothing recorded. Because that draft rides in `AuthGate`'s own state
  across the sign-in transition, and not scoped to any particular
  account, `AuthGate` resets it to `null` (along with `readyForSignIn`)
  any time `session` goes falsy — see "Sign-in moved after the pitch,
  not before it" above — so a signed-out session can never hand a new
  account someone else's already-`privacyAccepted: true` draft and have
  `handleFinish` record consent for a person who never saw `ConsentStep`
  at all. `PRIVACY_POLICY_VERSION` in `src/legal/content.ts`
  is what gets stamped; bump it and anyone who already accepted an
  older version needs to accept again (not wired automatically yet —
  see below).
- **Right of access / portability (Art. 15/20).** Settings → "Download
  my data" queries every row that exists about the signed-in account
  (profile, trusted contacts, check-ins — all already scoped by RLS to
  `auth.uid()`, nothing to filter client-side) and hands it back as
  plain JSON via the native share sheet.
- **Right to erasure (Art. 17).** Settings → "Delete my account" calls
  `delete_own_account()`, a `security definer` Postgres function scoped
  to `auth.uid()` — the anon/publishable key can't touch `auth.users`
  directly, so this is the one narrow hole punched through that, and
  only for your own row. Deleting it cascades to `profiles` and from
  there to everything owned by that person; a `trusted_contacts` row
  where they were the *linked* contact rather than the owner survives
  with `linked_user_id` set to null, since that's the owner's address
  book entry, not the deleted account's data.
- **Security (Art. 32).** Every table has Row Level Security on already
  (see "Real backend" above) — someone's data is only readable by them
  or a linked contact, enforced by Postgres, not app code. Supabase
  encrypts in transit and at rest by default; nothing extra to set up.
- **The actual documents.** `src/legal/content.ts` is the single source
  of truth; `LegalScreen` renders it both from `ConsentStep` and from
  Settings afterward, and `PRIVACY_POLICY.md` / `TERMS_OF_SERVICE.md`
  at the repo root are the same text kept in sync for reviewing without
  running the app.

**What's still a human decision, not a code change:**

1. Every `[BRACKETED]` placeholder in `src/legal/content.ts` (and the
   two root `.md` files) — legal entity/individual name, address,
   contact email, jurisdiction, data retention window — needs your real
   details filled in.
2. Both documents need an actual lawyer's review before real users rely
   on them. This is a solid, specific draft matched to what the code
   really does, not boilerplate — but it isn't legal advice, and GDPR
   compliance ultimately turns on facts (who your data controller
   legally is, whether a DPO is required at your scale) that only that
   review settles.
3. Confirm your Supabase project's hosting region (Project Settings →
   General) is appropriate for your users — this can't be changed after
   creation without migrating to a new project, so it's worth checking
   deliberately rather than assuming.
4. Accept Supabase's Data Processing Addendum and check Resend's — both
   publish one; whether you need to countersign anything depends on
   your plan tier on each.
5. A policy-version bump doesn't yet force re-consent from someone who
   already onboarded under an older version — worth wiring
   (`privacy_policy_version !== PRIVACY_POLICY_VERSION` gating a
   re-consent prompt) before the text changes in any way that matters,
   rather than after.

## What's intentionally not here yet

**A way to reach a trusted contact who hasn't installed ALIVE.** Right
now "notified" means a push to their own device, which means they
need the app and a linked account. That's a real, known limitation
(`DemoFooter` says so on Home), not an oversight — SMS (Twilio, plus
business-texting registration for real volume) is the honest fix, and
it's a deliberately separate piece of work with its own cost, not
something to bolt on quietly.

**Anything for the linked contact to actually look at.** RLS already
lets them read the profile, check-ins, and status of whoever they
watch — the policies were written that way on purpose — but there's no
screen that uses it yet. A push is a start; a "here's how they're
doing" view is the natural next increment, in its own right, not
squeezed into this pass.

**Invite tokens don't expire.** Whoever has the link can claim it,
once — fine for a token shared privately with the specific person it's
meant for, not yet hardened against a leaked link circulating further
than intended.

**No production build.** Everything above runs through `expo start` /
Expo Go. Getting onto an actual App Store or Play Store listing is EAS
Build + Submit, a separate, deliberate step once there's something
ready to ship that way.

No icon library, no animation library beyond React Native's built-in
`Animated`, no navigation library (see above), no web support
(`react-native-web`/`react-dom` are dev-only, used solely to render the
browser preview artifacts — never shipped) — this is a phone-only
product, aimed at the App Store and Play Store, not a website. Adding
infrastructure for problems that don't exist yet would make the
codebase harder to understand for exactly zero benefit right now.

The one deliberate exception is the serif typeface (`expo-font` +
`@expo-google-fonts/fraunces`) — added after the first visual pass read
as a generic "safety app" (flat white background, flat green button —
the same pattern SnugSafety and "Are You Dead Yet" both use). Real
typographic craft is one of the few things that reliably separates a
premium product from a utility one, and it's cheap: the font ships as
a bundled file, no network calls, no ongoing cost.

`react-native-svg` was added for the same reason as the font: the
check-in confirmation needed a precise, hand-drawn checkmark that
draws itself on, and neither a Unicode glyph (renders inconsistently
across platforms) nor a full icon library (we'd use one icon out of
hundreds) fit. `react-native-svg` is the standard, Expo-supported way
to draw exact vector shapes, and `CheckMark.tsx` is the only thing
using it.
