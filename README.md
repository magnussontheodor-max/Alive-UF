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

`/` is the pre-launch page, in the `app/(marketing)` route group; the product
lives at `/dashboard` under `app/(app)`. The app group carries `force-dynamic`
because every page reads one founder's memory, while the pre-launch page reads
nothing and is statically prerendered.

It is four parts: a nav, a full-bleed slab carrying the opening, the seven
steps of the journey, and the footer. The slab runs to both edges of the
window — a panel with page-coloured margins around it reads as a banner ad, a
band that reaches both edges reads as architecture — while everything else
sits on one centred 1100px column.

Every colour comes from the tokens at the top of the `.brand` block in
`app/globals.css` and nowhere else. Surfaces are flat; there are no gradients.
The call to action is the only white element on the page, and is meant to be
the clearest thing on screen. Inside the slab there is one ink colour at three
opacities.

**Typography.** One face, Chakra Petch, loaded through `next/font/google`
rather than an `@import` — an `@import` is only fetched after the stylesheet parses, so the
first paint lands in the system default, and next/font self-hosts the file
instead of leaving a third-party request on the critical path.

Every word on the page is uppercase, set with `text-transform` in CSS and never
in the content: the markup stays in sentence case so a screen reader announces
words instead of spelling out letters, and a search result shows a readable
title. Weight and letter-spacing carry the hierarchy — short labels take
0.18–0.24em, running sentences never past 0.12em, and the headline takes
*negative* tracking, because large caps need pulling together rather than
spreading apart. Multi-line text sits at 1.8 line-height: å, ä and ö rise above
cap height and collide with the line above at normal leading.

**Measured contrast.** The palette's one stated requirement — the placeholder
against the field's fill — is met as specified, at 6.17:1. Three values sit
below the 4.5:1 AA minimum for small text and are shipped as specified rather
than quietly altered:

| Element | Colour | Measured | To reach 4.5:1 |
|---|---|---|---|
| Nav links, step numbers, footer date | `--dim` `#6B757D` on `--page` | 3.03:1 | `#87939E` |
| Hero eyebrow | `--slab-ink` at 75% on `--slab` | 3.54:1 | opacity `1` (5.38:1) |
| Hero subline | `--slab-ink` at 80% on `--slab` | 3.89:1 | opacity `1` (5.38:1) |

`app/fonts/Might.ttf` is no longer referenced. It is licensed for **personal
use only** — see `app/fonts/Might-LICENCE.txt` — so bringing it back means
buying a commercial licence from funtypefonts.com first.

## Signups

```
formulär → POST /api/signup → validering → rate limit → signups-tabellen
                                                     → email_queue → Brevo
```

Everything about the endpoint is ordered deliberately (`app/api/signup/route.ts`):

1. **Honeypot first**, before anything costs a database round trip. A filled
   hidden field answers 200 and saves nothing — a bot told it failed simply
   retries with the field empty.
2. **Rate limit next**, before validation, so a flood of malformed bodies is
   as cheap to refuse as a flood of well-formed ones. Five requests per IP per
   ten minutes, counted in Postgres (`check_rate_limit`) rather than in a
   module variable: Vercel's functions do not share memory between
   invocations, so an in-process counter limits nothing in production while
   looking convincing locally. The prune, count and insert happen inside one
   SQL function so two simultaneous requests cannot both pass. IPs are stored
   as an HMAC, never as addresses.
3. **Validation on the server.** The browser validates too, for a fast and
   kind message, but a form post can be made with curl.
4. **Save.** A repeat address returns the same confirmation as a first-time
   signup, writes no second row and sends no second email — telling whoever
   typed the address that it is "already on the list" turns the form into a
   way to test who is on it.
5. **Email last**, and it can never fail the signup. The row is already saved.

**Email addresses are canonicalised.** Chrome IDNA-encodes the domain of an
`<input type="email">` before the value can be read, so `anna@företag.se`
arrives as `anna@xn--fretag-wxa.se` from a browser and unencoded from curl.
Stored as typed those are two rows the unique index cannot see. `normaliseEmail`
keeps the punycode form — which is what travels over SMTP anyway — and
`displayEmail` turns it back for the admin table and the CSV.

**Time.** Everything is stored in UTC (`timestamptz`). Every human-facing
rendering goes through `lib/time.ts` and is converted to Europe/Stockholm
explicitly, never left to the runtime's default zone — Vercel runs in UTC and
a laptop does not, so an implicit conversion means launch-week numbers differ
by an hour or two depending on where they are read.

**Email provider.** Every send goes through `sendEmail()` in
`lib/email/provider.ts`; nothing that calls it knows Brevo exists. Moving to
SES means adding one file beside `brevo.ts` and changing `EMAIL_PROVIDER`.
With no keys configured the message is printed rather than sent, so a local
run never pretends to have delivered.

**The queue.** Every message is written to `email_queue` before it is
attempted and only marked sent afterwards, so nothing is lost. Brevo's free
tier allows 300 a day; a quota refusal (402/429) is not counted as a failed
attempt but rescheduled past the next UTC midnight, and the daily cron sends
what is waiting.

Apply the schema with:

```bash
supabase db execute --file data/supabase/migrations/0003_signups.sql
```

Row level security is enabled on all three tables **with no policies at all**,
so `anon` and `authenticated` can neither read nor write them. Every access is
through the API routes using the service role key, which bypasses RLS. Note
that `revoke ... from anon, authenticated` is not enough on its own for
`check_rate_limit`: Postgres grants EXECUTE on a new function to `PUBLIC`, and
both roles inherit it from there, so the migration revokes from `PUBLIC` too.

## GDPR

`/integritetspolicy` is a complete Swedish draft — **it is a draft, not legal
advice**, and the `[PLACEHOLDERS]` in it must be filled in before launch. It
is linked from the footer and in microcopy directly under the form.

Both self-service routes take an HMAC-signed token rather than a row id, so
they cannot be guessed, and the action is inside the signed payload, so an
unsubscribe link cannot be replayed against the deletion endpoint:

- `/api/unsubscribe?token=…` sets `unsubscribed = true` and keeps the row —
  the record is what stops us mailing that address again.
- `/api/delete-me?token=…` deletes the row outright, and any mail still queued
  to that address with it.

Analytics is Umami, self-hosted and cookie-free, which is why the site has no
cookie banner. `lib/analytics.ts` forwards only that an event happened, never
an address. Page views are counted by Umami's own script; only
`signup_completed` is sent from the app, so visits are not double-counted.

## Admin

`/admin` and `/api/admin/*` sit behind HTTP Basic Auth, enforced in
`middleware.ts` rather than in the page — middleware never reaches the browser,
so the comparison and the password cannot end up in a client bundle. With
`ADMIN_USER`/`ADMIN_PASSWORD` unset the area returns 503 rather than opening.

It shows the total, the last seven days, the table (email, the free text, the
date in Stockholm time, source) and a CSV export. The CSV prefixes any cell
starting with `=`, `+`, `-` or `@` with an apostrophe: those are executed as
formulas when the file is opened in Excel or Sheets, so an unescaped free-text
field turns our own export into an attack on whoever opens it.

## Cron

Vercel's free plan allows exactly one cron job, so `/api/cron` is the whole
scheduler and runs three things in order, each isolated so one failure does
not stop the next:

1. **Keepalive** — a free-tier Supabase project pauses after 7 days of
   inactivity, which would take the form down after one quiet week.
2. **Drain `email_queue`** — whatever yesterday's ceiling deferred.
3. **Backup** — the whole table as CSV, mailed to `ADMIN_EMAIL`.

It requires `CRON_SECRET` in `x-cron-secret` or as `Authorization: Bearer`,
which is the form Vercel Cron sends. The schedule lives in `vercel.json`
(03:00 UTC daily).

## Deploying

### 1 · Supabase

1. Create a project (choose an EU region — the privacy policy says the data
   stays in the EU).
2. Run the migration: `supabase db execute --file data/supabase/migrations/0003_signups.sql`,
   or paste it into the SQL editor.
3. Copy the project URL, the `anon` key and the `service_role` key from
   Project Settings → API into the environment variables below.

### 2 · Brevo

1. Create an account and verify the sending domain under Senders, Domains &
   Dedicated IPs.
2. Create an API key under SMTP & API → API Keys and set `BREVO_API_KEY`.
3. Set `EMAIL_FROM` to an address on the verified domain.

**DNS for deliverability.** Without all three, the confirmation lands in spam
or is rejected. Replace the domain with yours and take the exact DKIM values
from Brevo's own panel — the selector and key below are placeholders:

| Type | Name | Value |
|---|---|---|
| TXT | `@` | `v=spf1 include:spf.brevo.com mx ~all` |
| TXT | `mail._domainkey` | `k=rsa; p=…` (copy verbatim from Brevo) |
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:dmarc@dindomän.se; fo=1` |

Start DMARC at `p=none` and read the reports for a couple of weeks before
tightening to `p=quarantine` and then `p=reject`. Going straight to `reject`
with SPF or DKIM misconfigured silently drops your own mail.

If a `v=spf1` record already exists, merge `include:spf.brevo.com` into it —
a domain may have only one SPF record, and a second one makes both invalid.

### 3 · Vercel

1. Import the repository.
2. Add every variable from `.env.example` under Settings → Environment
   Variables. `SUPABASE_SERVICE_ROLE_KEY`, `TOKEN_SECRET`, `CRON_SECRET`,
   `ADMIN_PASSWORD` and `BREVO_API_KEY` are secrets — no `NEXT_PUBLIC_` prefix,
   and never committed.
3. Deploy. `vercel.json` registers the cron automatically.

### 4 · The domain

1. Add the domain under Settings → Domains in Vercel.
2. Point DNS at Vercel — an `A` record for the apex at `76.76.21.21`, and a
   `CNAME` for `www` at `cname.vercel-dns.com`. Vercel shows the exact values
   for your project; use those if they differ.
3. Set `NEXT_PUBLIC_SITE_URL` to the final `https://` origin **with no
   trailing slash** and redeploy. It is what canonical tags, the sitemap, the
   OG tags and — most importantly — the unsubscribe and deletion links in
   every email are built from. Set it wrong and those links point nowhere.

## Checked

Verified against a real Postgres 16 and a real browser, not by inspection:

- the migration applies cleanly and is safe to re-run
- the `updated_at` trigger fires on UPDATE; the unique index rejects duplicates;
  the 500-character check rejects over-long text
- RLS is on for all three tables with zero policies; `anon` is refused both the
  table and `check_rate_limit`
- the limiter allows exactly five per window, isolates callers, and expires
- both email spellings, from browser and from curl, produce one row and one
  message
- a forged token, a tampered signature and a cross-action replay are all refused
- Basic Auth returns 401 without credentials and 503 with none configured
- the cron route refuses an absent or wrong secret and runs all three jobs
- Lighthouse 100/100/100/100 on `/` and `/integritetspolicy`

