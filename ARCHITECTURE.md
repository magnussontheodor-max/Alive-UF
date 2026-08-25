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
This first milestone is the app shell and the first real screen, built
entirely on local/demo state so the interaction and visual language can
be judged on their own before any backend complexity is added.

## Folder structure

```
App.tsx                  Root component: providers + status bar + screen
index.ts                 Expo entry point (registers App)

src/
  theme/                 The single source of truth for how ALIVE looks
    colors.ts            Palette (warm background, ink, one deep-pine accent)
    typography.ts        Type scale — serif (Fraunces) for warmth, system
                           sans for everything functional
    spacing.ts            Spacing scale + corner radii
    index.ts              Re-exports the above

  state/
    CheckInContext.tsx    Demo check-in state (React Context), clearly
                           documented as local-only. This is the one file
                           that gets replaced with real Supabase reads/
                           writes later — screens keep using the same
                           useCheckIn() hook either way.

  screens/
    HomeScreen.tsx         The "Are they okay?" screen: greeting, the
                           I'M ALIVE button, and the confirmed state.

  components/
    AliveButton.tsx        The primary action: press animation + haptics.
    CheckInSummary.tsx      Two-line fact display (checked in at / next).
    DemoFooter.tsx          Demo disclosure + reset-for-testing control.
    Wordmark.tsx            The small "ALIVE" brand mark.

  utils/
    time.ts                Greeting, date, and time formatting helpers.
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

## What's intentionally not here yet

No navigation library, no persisted storage, no networking, no auth,
no icon library, no animation library beyond React Native's built-in
`Animated`, no web support (`react-native-web`/`react-dom`) — this is
a phone-only product, aimed at the App Store and Play Store, not a
website. This is one screen with one interaction; adding
infrastructure for screens and problems that don't exist yet would
make the codebase harder to understand for exactly zero benefit right
now. Each will be introduced deliberately when the feature that needs
it is actually being built.

The one deliberate exception is the serif typeface (`expo-font` +
`@expo-google-fonts/fraunces`) — added after the first visual pass read
as a generic "safety app" (flat white background, flat green button —
the same pattern SnugSafety and "Are You Dead Yet" both use). Real
typographic craft is one of the few things that reliably separates a
premium product from a utility one, and it's cheap: the font ships as
a bundled file, no network calls, no ongoing cost.
