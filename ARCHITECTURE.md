# ALIVE — Architecture

This document explains how the codebase is organized and why, so that
adding the real backend later is a series of small, contained swaps
rather than a rewrite.

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
- **Supabase** (not yet integrated) — database, auth, and realtime,
  planned for check-ins, trusted contacts, and escalation state.
- **Expo Notifications** (not yet integrated) — push reminders.
- **Twilio** (not yet integrated) — SMS to trusted contacts.

Nothing above the "not yet integrated" line exists in the code yet.
The app so far — onboarding and the daily check-in screen — runs
entirely on local/demo state, so the interaction and visual language
can be judged on their own before any backend complexity is added.

## Folder structure

```
App.tsx                  Root: providers, font loading, and picks
                         OnboardingFlow vs. Home/Settings/HowItWorks
index.ts                 Expo entry point (registers App)

src/
  theme/                 The single source of truth for how ALIVE looks
    colors.ts            Palette (warm background, ink, one deep-pine accent)
    typography.ts        Type scale — serif (Fraunces) for warmth, system
                           sans for everything functional
    spacing.ts            Spacing scale + corner radii
    index.ts              Re-exports the above

  types/
    profile.ts             CheckInWindow type + presets, and TrustedContact
                           ({ name, phone }) + MAX_TRUSTED_CONTACTS (2).

  data/
    howItWorks.ts           The three-sentence explanation of the product,
                           as data — shared by the onboarding step and the
                           standalone screen so the copy exists once.

  state/
    CheckInContext.tsx     Demo state for *today's* check-in — local-only,
                           documented as such. Gets replaced by Supabase
                           reads/writes later; useCheckIn() stays the same.
    ProfileContext.tsx      Demo state for *who the user is*: their name,
                           up to two trusted contacts, their check-in
                           window, and whether onboarding is done. Same
                           local-only pattern as CheckInContext, kept in
                           a separate context because it's conceptually a
                           different thing (a profile, not a daily event).

  hooks/
    useEntranceStyle.ts     The fade + rise used whenever content swaps in
                           place (check-in confirmation, onboarding steps).

  screens/
    HomeScreen.tsx          The "Are they okay?" screen: greeting, the
                           I'M ALIVE button, the confirmed state, and the
                           four escalation states (open/closing soon/
                           missed/escalated).
    SettingsScreen.tsx      Everything onboarding collected, editable live
                           (no draft/save step) — reuses ContactsStep and
                           CheckInWindowStep directly; see below.
    HowItWorksScreen.tsx     The same explainer shown once in onboarding,
                           kept reachable afterward from Settings.
    OnboardingFlow.tsx      Orchestrates the welcome/how-it-works/name/
                           contacts/window wizard; owns which step is
                           showing and writes the result into
                           ProfileContext.
    onboarding/
      WelcomeStep.tsx       Step 1 content: wordmark + tagline.
      HowItWorksStep.tsx    Step 2 content: the 3-point explainer.
      TextStep.tsx          Step 3 content: one question, one text field
                           (the user's own name).
      ContactsStep.tsx      Step 4 content: name + phone for one or two
                           trusted contacts, with add/remove. Also reused
                           by SettingsScreen — see "Why this shape" below.
      CheckInWindowStep.tsx Step 5 content: pick Morning/Afternoon/Evening.
                           Also reused by SettingsScreen.

  components/
    AliveButton.tsx         The primary action: press animation, haptics,
                           and the label -> checkmark confirmation reveal.
    CheckMark.tsx            A hand-drawn, self-drawing checkmark (SVG).
    CheckInSummary.tsx       Two-line fact display (checked in at / next).
    HowItWorksRows.tsx        The numbered 3-row explainer list, shared by
                           HowItWorksStep and HowItWorksScreen.
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

**Demo state is never allowed to impersonate real behavior.** The
product requirement is explicit: the app must never claim a trusted
contact has actually been notified while running on local/demo logic.
Two things enforce that here:

1. The confirmed-state copy describes the *mechanism* ("Dad will only
   hear from ALIVE if you ever miss a check-in") rather than asserting
   a notification just happened — which is also, not coincidentally,
   what the real product will do, since contacts are only ever
   messaged on a *missed* check-in, not on every successful one.
2. `DemoFooter` permanently and visibly discloses that this build is
   local-only and that no one is notified yet, plus a clearly-labeled
   "testing" reset control, separated from the primary flow.

When Supabase + Twilio integration lands, both of those become
unnecessary and get removed in one place.

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
to go back" — `OnboardingFlow` does that with a single `useState`
index, the same pattern already used for the check-in confirmation's
idle/confirming/confirmed states. Settings and "How ALIVE works" added
a second, small triangle (Home ↔ Settings ↔ How it works), handled the
same way one level up, in `Root` (`App.tsx`) — again just a `useState`
holding which of three screens is showing. Neither of these is "a real
information architecture" yet: no tabs, no deep links, nothing that
needs a back *stack* rather than a single "where did I come from"
value. The right moment to add a navigation library is when one of
those shows up — most likely a push notification needing to open the
app directly onto a specific screen, which local `useState` can't do.

**Trusted contacts are typed in by hand, not picked from the phone's
address book.** A real contact picker (`expo-contacts`) means a native
permission prompt and App Store privacy review for a phone number that
nothing in the app actually uses yet — there's no Twilio integration
to send it to. Manual entry gets the real data model in place now
(`TrustedContact { name, phone }`, up to `MAX_TRUSTED_CONTACTS`) so a
native picker can be swapped in later as a change to `ContactsStep.tsx`
alone, not a data model change.

**The circle is reserved.** `AliveButton`'s circular shape only ever
means one thing: the one daily action the whole product exists for.
Every other button in the app — onboarding's "Continue", "Get
started", "Start using ALIVE" — uses `PrimaryButton`, a pill. Using
the same circle for onboarding CTAs would have been easy (it's already
built) but would dilute the one visual cue that's supposed to say
"this button is different from every other button."

**Settings reuses onboarding's step components directly, unmodified in
behavior.** `ContactsStep` and `CheckInWindowStep` don't know or care
whether the `value`/`onChange` they're given is a local draft
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

## What's intentionally not here yet

No persisted storage — onboarding runs again every time the app is
fully reloaded, the same in-memory-only tradeoff `CheckInContext`
already makes, and for the same reason: real persistence is Supabase's
job, not a local cache's. No networking, no auth, no icon library, no
animation library beyond React Native's built-in `Animated`, no
navigation library (see above), no web support (`react-native-web`/
`react-dom`) — this is a phone-only product, aimed at the App Store
and Play Store, not a website. Adding infrastructure for problems that
don't exist yet would make the codebase harder to understand for
exactly zero benefit right now. Each will be introduced deliberately
when the feature that needs it is actually being built.

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
