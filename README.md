# Startup OS — prototype

A visual, interactive prototype of **Startup OS**, an AI co-founder that guides
first-time Swedish entrepreneurs from "I want to start a business" to a
validated, built, and launch-ready digital company.

This is a **product/UX prototype**, not the production app: all data is
mocked, there is no backend, database, auth, or real AI integration. The goal
is to make the product experience and journey feel real and compelling.

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## What's here

- **Dashboard** — the startup's current state, its Next Best Action, a
  Startup Snapshot, the highest-risk assumption, recent Startup Memory
  activity, and what's queued next.
- **My Startup** — the full, persistent understanding Startup OS has of the
  company (snapshot, founder profile, tracked assumptions, memory log,
  agents involved).
- **Idea** — a short questionnaire that generates three scored business
  opportunities for founders without an idea yet.
- **Research** — market / competitor / customer / trend / risk findings,
  open unknowns, and the assumptions they feed into Validation.
- **Validation** — the core hypothesis, evidence gathered so far, a
  confidence score, and a runnable experiment.
- **Product** — the MVP specification: core user, core workflow, what's in
  scope for v1, and what's deliberately deferred.
- **Build** — a simulated build pipeline showing Startup OS orchestrating
  AI coding agents step by step, ending in a shipped MVP.
- **Legal** — a Swedish company-setup checklist generated for this specific
  startup (not legal advice).
- **Launch** — overall launch readiness across the pieces that matter.
- **AI Co-Founder** — a slide-over chat available from anywhere in the app;
  telling it what you learned from customers updates Startup Memory and
  reprioritizes the next action.

The fictional example company throughout is **LeadFlow AI** — AI-powered
lead qualification for small Swedish B2B companies — currently at the
Validation stage.

## Architecture

The prototype is intentionally structured around the conceptual system the
real product will become, even though everything is mocked today:

```
lib/types.ts         Startup, Founder, StartupMemory, Task, Agent, etc.
lib/mock-data.ts      LeadFlow AI's mock data — the "database" for now
lib/orchestrator.ts   Mocked Orchestrator: reads memory, decides next action
lib/stages.ts         The 8-stage founder journey
```

The **Orchestrator** is the only thing that is meant to talk to every part
of the startup. Founders never pick an agent directly — the Orchestrator
reads Startup Memory, decides what the startup needs next, and selects the
right agent (Idea, Research, Validation, Product Architect, Build, or
Legal) to act. In this prototype that loop is mocked (`decideNextAction`
in `lib/orchestrator.ts`), but the shape is written so a real
LLM-backed implementation can replace the mock without changing the UI
layer.

Every stage page answers the same four questions — **Where am I? What have
I accomplished? What's blocking me? What should I do next?** — via the
shared `OrientationBar` component, so orientation is never more than a
glance away.

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS. No backend, no database,
no real AI calls — everything is mock data in `lib/`.
