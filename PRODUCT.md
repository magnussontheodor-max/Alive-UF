# Product

<!-- impeccable:product-schema 1 -->

## Platform

adaptive

## Users

Two overlapping roles on the same app: (1) someone checking in for themselves — living alone, recovering, traveling, or simply wanting a family member's peace of mind; (2) that same person's trusted contact(s) — a parent, partner, or friend who wants to know without calling to check, and without it feeling like surveillance. Skews toward people managing worry about someone at a distance, not toward the person being worried about being unwell or in crisis themselves.

## Product Purpose

A once-a-day proof-of-life tap. If it doesn't happen by a chosen deadline plus a grace period, the trusted contacts who accepted an invite are told. Success is silence: most days, nothing happens beyond one tap, and that's the product working, not a feature going unused.

## Positioning

Not a medical device, not an emergency service, not a social/wellness app. The mechanism a neighboring product couldn't copy unchanged: reassurance without intrusion — the contact never watches or checks, they're only ever told on genuine, extended silence, and the person checking in is never surveilled, timed, or scored day-to-day. This is the whole reason sign-in uses a typed code rather than a magic link, and why there are no streaks, badges, or engagement mechanics — see Product Principles.

## Operating Context

A daily, brief, low-attention interaction — opened once, tapped once, closed. Not a destination app. Used in ordinary domestic moments (kitchen counter in the morning, bedside at night), not dramatic ones. The emotional weight is real but the interaction itself is mundane by design.

## Capabilities and Constraints

Real backend (Supabase: Postgres, RLS, email-OTP auth, a scheduled Edge Function for escalation + two self-reminders). Trusted contacts must accept an invite and install the app themselves — no SMS/phone-based fallback yet, a known and disclosed limitation. Push notifications require a linked contact's own device; EAS project just linked, not yet verified on a real device.

## Brand Commitments

Name: ALIVE. The single daily check-in control ("AliveButton") is already treated as a considered physical instrument in the existing copy and code comments — "less like a flat 'go' button and more like a physical dial... the kind of detail Scandinavian product design (Braun, Bang & Olufsen) uses to make a single control feel deliberate." This is a real, existing commitment worth preserving even where its current rendering (cream ground + serif display) is being replaced — the *instrument* framing is the asset; the *cream-and-serif* execution of it is what reads generic.

## Evidence on Hand

Working app (this repo), backend proven end-to-end this session. No real user testimonials, press, or case studies — none should be fabricated or implied.

## Product Principles

1. Calm confidence, never urgency or loss-aversion — a missed check-in during grace period is normal, not alarming.
2. No gamification: no streaks, badges, leaderboards, or engagement mechanics, ever.
3. Honesty about mechanism over vague reassurance — copy states what actually happens ("Dad will only hear from ALIVE if you miss a check-in"), not just a feeling.
4. Reassurance without intrusion, both directions — the checker-in isn't watched; the contact isn't left wondering.
5. One meaningful daily action, everything else in service of it.

## Accessibility & Inclusion

Real prefers-reduced-motion support was added to AliveButton this session (the app's only instance so far) — worth extending app-wide as design work touches other components.
