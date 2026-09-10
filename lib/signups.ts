import { z } from "zod";
import { domainToASCII, domainToUnicode } from "node:url";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isDatabaseConfigured } from "@/lib/env";

// ---------------------------------------------------------------------------
// Signups
//
// The single place a signup is written. The schema here is the server's own —
// the browser runs the same shape check for a fast, kind error message, but
// this one is the one that decides, because a form post can be made by anyone
// with curl.
// ---------------------------------------------------------------------------

export const signupSchema = z.object({
  // Deliberately not zod's .email(), which is ASCII-only and would reject
  // anna@företag.se — an entirely plausible address for a Swedish product.
  // Shape is all that can honestly be checked here; deliverability is proven
  // by the confirmation actually arriving.
  email: z
    .string()
    .trim()
    .min(1, "Skriv din e-postadress.")
    .max(254, "Adressen är för lång.")
    .refine(
      (value) => /^[^@\s]+@[^@\s.]+\.[^@\s]{2,}$/u.test(value),
      "Kontrollera e-postadressen."
    ),
  idea: z
    .string()
    .trim()
    .max(500, "Håll det under 500 tecken.")
    .optional()
    .transform((value) => (value ? value : null)),
  source: z.string().trim().max(120).optional().transform((value) => value || null),
});

export type SignupInput = z.infer<typeof signupSchema>;

/**
 * One canonical spelling per address.
 *
 * Chrome IDNA-encodes the domain of an <input type="email"> before the value
 * is ever read, so the same person typing anna@företag.se lands as
 * anna@xn--fretag-wxa.se from the browser and as anna@företag.se from curl or
 * a browser that does not. Stored as typed, those are two rows the unique
 * index cannot see, and the second one gets a second confirmation email.
 *
 * Punycode is the form the domain travels in over SMTP anyway, so that is the
 * form kept. displayEmail() turns it back for anything a person reads.
 */
export function normaliseEmail(raw: string): string {
  const trimmed = raw.trim().toLowerCase();
  const at = trimmed.lastIndexOf("@");
  if (at < 1) return trimmed;

  const local = trimmed.slice(0, at);
  const domain = trimmed.slice(at + 1);
  const ascii = domainToASCII(domain);

  // domainToASCII returns "" for a domain it cannot encode. Keep what we were
  // given rather than storing an address with no domain at all.
  return `${local}@${ascii || domain}`;
}

/** The readable spelling, for the admin table and the CSV export. */
export function displayEmail(stored: string): string {
  const at = stored.lastIndexOf("@");
  if (at < 1) return stored;
  const unicode = domainToUnicode(stored.slice(at + 1));
  return unicode ? `${stored.slice(0, at)}@${unicode}` : stored;
}

export type SignupOutcome =
  | { kind: "created"; id: string }
  | { kind: "already_signed_up" }
  | { kind: "unavailable" };

/**
 * A repeat address is not an error and is never told apart from a first-time
 * signup in the response: saying "you are already on this list" to whoever
 * typed the address turns the form into a way to test whether someone is on it.
 * No second row, no second email.
 */
export async function createSignup(input: SignupInput): Promise<SignupOutcome> {
  if (!isDatabaseConfigured()) {
    console.warn("[signups] ingen databas konfigurerad — anmälan sparades inte");
    return { kind: "unavailable" };
  }

  const email = normaliseEmail(input.email);
  const db = supabaseAdmin();

  const existing = await db.from("signups").select("id").eq("email", email).maybeSingle();

  if (existing.error) {
    console.error("[signups] kunde inte slå upp adressen", existing.error.message);
    return { kind: "unavailable" };
  }
  if (existing.data) return { kind: "already_signed_up" };

  const inserted = await db
    .from("signups")
    .insert({ email, idea: input.idea, source: input.source })
    .select("id")
    .single();

  if (inserted.error) {
    // 23505: two requests for the same new address raced each other. The
    // second one loses the insert, which is exactly the right outcome.
    if (inserted.error.code === "23505") return { kind: "already_signed_up" };
    console.error("[signups] kunde inte spara", inserted.error.message);
    return { kind: "unavailable" };
  }

  return { kind: "created", id: inserted.data.id as string };
}

export interface SignupRow {
  id: string;
  email: string;
  idea: string | null;
  source: string | null;
  confirmed: boolean;
  unsubscribed: boolean;
  created_at: string;
}

export async function listSignups(limit = 1000): Promise<SignupRow[]> {
  if (!isDatabaseConfigured()) return [];

  const { data, error } = await supabaseAdmin()
    .from("signups")
    .select("id, email, idea, source, confirmed, unsubscribed, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[signups] kunde inte läsa listan", error.message);
    return [];
  }
  return (data ?? []) as SignupRow[];
}

export async function countSignups(since?: Date): Promise<number> {
  if (!isDatabaseConfigured()) return 0;

  let query = supabaseAdmin().from("signups").select("id", { count: "exact", head: true });
  if (since) query = query.gte("created_at", since.toISOString());

  const { count, error } = await query;
  if (error) {
    console.error("[signups] kunde inte räkna", error.message);
    return 0;
  }
  return count ?? 0;
}
