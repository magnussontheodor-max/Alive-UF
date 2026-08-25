# ALIVE — Architecture

This document explains how the codebase is organized and why, so that
adding the real backend later is a series of small, contained swaps
rather than a rewrite.

## Stack

- **Expo + React Native + TypeScript** — the mobile app, one codebase
  for iOS and Android.
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
                         OnboardingFlow vs. HomeScreen
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
                           I'M ALIVE button, and the confirmed state.
    OnboardingFlow.tsx      Orchestrates the 4-step welcome/name/contacts/
                           window wizard; owns which step is showing and
                           writes the result into ProfileContext.
    onboarding/
      WelcomeStep.tsx       Step 1 content: wordmark + tagline.
      TextStep.tsx          Step 2 content: one question, one text field
                           (the user's own name).
      ContactsStep.tsx      Step 3 content: name + phone for one or two
                           trusted contacts, with add/remove.
      CheckInWindowStep.tsx Step 4 content: pick Morning/Afternoon/Evening.

  components/
    AliveButton.tsx         The primary action: press animation, haptics,
                           and the label -> checkmark confirmation reveal.
    CheckMark.tsx            A hand-drawn, self-drawing checkmark (SVG).
    CheckInSummary.tsx       Two-line fact display (checked in at / next).
    DemoFooter.tsx           Demo disclosure + reset-for-testing controls.
    Wordmark.tsx             The "ALIVE" brand mark (small in-app, large
                           on the welcome step).
    PrimaryButton.tsx        The pill CTA used by onboarding steps —
                           deliberately not a circle; see below.
    TextField.tsx            A single underlined input line.
    OnboardingHeader.tsx      Back button + step-progress dots.
    OnboardingProgress.tsx    The dots themselves.

  utils/
    time.ts                 Greeting, date, time, and next-check-in-label
                           formatting helpers.
```

## Why this shape

**Theme is centralized.** Every color, font size, and spacing value the
app uses comes from `src/theme`. A screen never hardcodes `#243B2C` or
`fontSize: 17` directly — it imports from theme. This is what lets the
whole app feel like one considered product instead of a pile of
one-off screens, and it means a future dark mode or rebrand touches
three files, not forty.

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

**No navigation library, on purpose — for now.** Onboarding is the
first time the app has more than one screen, and it was tempting to
reach for React Navigation or Expo Router to handle that. Both are
good tools, but what onboarding actually needs is "show one of four
things, in order, with a way to go back" — `OnboardingFlow` does that
with a single `useState` index, the same pattern already used for the
check-in confirmation's idle/confirming/confirmed states. Pulling in a
navigation library now would mean learning its API, its screen
registration, and its typing for a problem four lines of state already
solve. The right moment to add one is when the app grows a real
information architecture — tabs, a settings stack, deep links from a
push notification — not before.

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
