# Spark UF

An intelligent co-founder for first-time entrepreneurs in Sweden.

Spark UF is not a chatbot, an idea generator, or a collection of AI buttons. It
maintains a structured understanding of one startup, tracks what is actually
known versus assumed, works out which uncertainty matters most right now, and
gives the founder exactly one next action.

```
founder input → understand → startup memory → identify what is unknown
     → agent action → evidence → update memory → next best action
```

That loop is the product.

## Running it

```bash
npm install
npm run dev            # http://localhost:3000
```

It runs with no backend and no API key. Both are optional upgrades:

| Variable | Effect when set |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Data moves from the local store to Postgres with row level security |
| `ANTHROPIC_API_KEY` | Agents reason with a live model instead of built-in rules |

Neither changes any application code — the repository interfaces and the
provider abstraction switch implementations. The current mode is always shown in
the top bar, never hidden.

To apply the database schema:

```bash
supabase db execute --file data/supabase/migrations/0001_init.sql
```

## What it refuses to do

The hard requirement is no AI slop, and it is enforced in code rather than in
prompts:

- **Unsourced numbers are rejected.** A claim containing a quantity with no
  attribution never reaches Startup Memory (`domain/rules/grounding.ts`).
- **Generic advice is rejected by pattern.** "Talk to your customers", "validate
  your idea", "build a simple MVP" are matched and discarded. If the system
  cannot say something specific to this founder, it says nothing.
- **Facts without evidence are demoted.** A claim stated as fact with nothing
  behind it becomes a hypothesis, visibly.
- **Confidence cannot be asserted, only derived.** It is computed from evidence
  weight and always carries its explanation. With no evidence it is `NONE`.
- **Opportunities require a witnessed problem.** The Opportunity Agent has no
  code path that produces an opportunity from anything else. With no observed
  problem it returns blocked, and says why.

## Architecture

Dependencies point inward. Nothing above a layer knows how the one below is
implemented.

```
app/            UI and server actions
orchestrator/   the loop, next-best-action generation, state application
agents/         five agents, one interface, no direct communication
ai/             LLMProvider abstraction (Anthropic adapter + offline rules)
domain/         pure TypeScript: model + rules, zero I/O, unit-testable
data/           repository interfaces, local store, Supabase + SQL migrations
```

**Domain.** `Claim` carries an epistemic status (`FACT` / `INFERENCE` /
`HYPOTHESIS`) and its provenance. `Confidence` carries the evidence it rests on
and a sentence explaining itself. `Evidence` is weighted by reliability ×
relevance × epistemic status, because a competitor's marketing page and five
customer interviews are not the same thing.

**Rules** (`domain/rules/`) are deterministic and pure:

- `stage-gates.ts` — every stage transition is a predicate with named unmet
  requirements. AI never advances a stage.
- `next-best-action.ts` — ranks open assumptions by
  `importance × uncertainty × stageRelevance × testability`.
- `confidence.ts` — derives confidence from evidence, counts contradicting
  evidence at 1.5×, and caps startup confidence at its weakest load-bearing
  assumption.
- `grounding.ts` — the anti-slop enforcement point described above.

**Orchestrator.** The only thing that writes to Startup Memory. Reads state,
evaluates the gate, decides whether an agent should act, selects it, grounds the
result, applies it, and creates exactly one task. The database enforces the
one-open-task rule with a partial unique index.

**Agents.** Structured input, structured output, no direct communication. Each
declares its mission and its boundaries, and both are shown in the UI. Agents
never write to the database and never decide what happens next.

## Status

| Stage | State |
|---|---|
| Founder | Built — adaptive interview, structured profile, honest advantage assessment |
| Opportunity | Built — problem-first, grounded in witnessed problems, founder approval |
| Research | Partial — gate rules and evidence tracking live; Research Agent not built |
| Validation | Partial — assumption ranking live; Validation Agent not built |
| Product | Partial — gate rules and spec model live; Product Agent not built |
| Build | Not built |
| Setup, Launch | Not built |

Unfinished stages say so on screen rather than showing a placeholder that looks
finished.

## Demo workspace

The dashboard offers a demo workspace. It seeds a founder profile only — every
opportunity, assumption, claim and task in it is produced by the real agents and
orchestrator from that input. It is badged **Demo data** throughout.

## Stack

Next.js (App Router), TypeScript, Tailwind CSS, Supabase/Postgres, zod. No UI
component library: the design system is a small set of local components.

## The public site

`/` is the pre-launch brand surface, in the `app/(marketing)` route group; the
product lives at `/dashboard` under `app/(app)`. The app group carries
`force-dynamic` because every page reads one founder's memory, while the brand
surface reads nothing and is statically prerendered.

It opens on a full-viewport dark frame — navigation, the claim, one line and
one email field, centred — then continues on warm paper to explain the product,
and closes dark again. Depth comes from a fine
grain and a warm falloff rather than photography or gradients. Every colour is
a token under `.brand`, which is why inverting a section is one class
(`.b-invert`) and every component inside it follows.

**Typography.** Headlines, labels and controls are set in Might
(`app/fonts/Might.ttf`), which is uppercase-only, so running paragraphs stay in
Inter for legibility. The wordmark uses Orbitron. Might is licensed for
**personal use only** — see `app/fonts/Might-LICENCE.txt`; a commercial licence
must be bought from funtypefonts.com before launch. Swapping it is one
declaration in `app/layout.tsx`.

Nothing on the page claims traction that does not exist: no counts,
testimonials, statistics or customers. The one worked example, contrasting
Spark with a generic AI answer, is labelled illustrative.

Waitlist signups go through `WaitlistRepository`, following the same pattern as
the rest of the data layer — Supabase when configured, the local store
otherwise. Apply the table with:

```bash
supabase db execute --file data/supabase/migrations/0002_waitlist.sql
```

`first_name` is nullable because the opening frame captures an email only;
`source` records which surface a signup came from. Row level security inverts
for this table: anonymous visitors may insert and nothing else, so a signup
cannot read back anyone else's address.

Analytics events are named and called at the right places (`lib/analytics.ts`)
but go to a no-op sink; connecting a provider means implementing one function.
