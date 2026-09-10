import { NextResponse } from "next/server";
import { signupSchema, createSignup, normaliseEmail } from "@/lib/signups";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";
import { confirmationEmail } from "@/lib/email/templates";
import { enqueueEmail, tryDeliverNow } from "@/lib/email/queue";

// Node, not edge: the token signing uses node:crypto.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// POST /api/signup
//
// The order below is the security of this endpoint, so it is deliberate:
//
//   1. Honeypot first, before anything costs a database round trip.
//   2. Rate limit next, before validation, so a flood of malformed bodies is
//      just as cheap to refuse as a flood of well-formed ones.
//   3. Validate on the server. The browser also validates, for a fast and
//      kind error, but this is the check that decides.
//   4. Save. Only then does email happen, and email can never fail the signup.
// ---------------------------------------------------------------------------

const RATE_LIMIT = { max: 5, windowSeconds: 10 * 60 };

/** One shape for every outcome the visitor is allowed to tell apart. */
function ok() {
  return NextResponse.json({ status: "ok" as const });
}

function fail(message: string, status: number, field?: "email" | "idea") {
  return NextResponse.json({ status: "error" as const, message, field }, { status });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail("Kunde inte läsa formuläret. Ladda om sidan och försök igen.", 400);
  }

  const payload = (body ?? {}) as Record<string, unknown>;

  // 1 — Honeypot. A real browser never fills a field it cannot see, so anything
  // that does is automated. Answer 200 and save nothing: a bot told it failed
  // simply tries again with the field left empty.
  if (typeof payload.company === "string" && payload.company.trim() !== "") {
    return ok();
  }

  // 2 — Rate limit, per IP, before any parsing work.
  const limit = await checkRateLimit({
    bucket: "signup",
    identifier: clientIp(request.headers),
    ...RATE_LIMIT,
  });
  if (!limit.allowed) {
    return fail("För många försök. Vänta en stund och försök igen.", 429);
  }

  // 3 — Validate here, whatever the browser believed.
  const parsed = signupSchema.safeParse({
    email: payload.email,
    idea: payload.idea,
    source: payload.source,
  });

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const field = issue?.path[0] === "idea" ? "idea" : "email";
    return fail(issue?.message ?? "Kontrollera uppgifterna.", 400, field);
  }

  // 4 — Save.
  const outcome = await createSignup(parsed.data);

  if (outcome.kind === "unavailable") {
    // The one case where the visitor is told something went wrong, because
    // something did and their address was not kept.
    return fail("Anmälan kunde inte sparas just nu. Försök igen om en stund.", 503);
  }

  // A repeat address gets the same confirmation and no second email, so the
  // form cannot be used to find out who is on the list.
  if (outcome.kind === "already_signed_up") return ok();

  // 5 — Email, after the row is safe. Nothing below can fail the request.
  try {
    const message = confirmationEmail(outcome.id);
    const envelope = {
      // The same canonical spelling that was saved, so the queue and the row
      // can never disagree about who was written to.
      to: normaliseEmail(parsed.data.email),
      subject: message.subject,
      html: message.html,
      text: message.text,
    };
    await tryDeliverNow(await enqueueEmail(envelope), envelope);
  } catch (error) {
    console.error("[signup] bekräftelsemejlet kunde inte hanteras", error);
  }

  return ok();
}
