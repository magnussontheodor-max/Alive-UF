import { createHmac, timingSafeEqual } from "node:crypto";
import { tokenSecret } from "@/lib/env";

// ---------------------------------------------------------------------------
// Signed action tokens
//
// The unsubscribe and deletion links carry one of these instead of a row id.
// A raw uuid in a URL is a capability anyone can guess at scale, and would let
// someone walk the table deleting other people's signups.
//
// The action is inside the signed payload, so a token minted for unsubscribing
// cannot be replayed against the deletion endpoint.
// ---------------------------------------------------------------------------

export type TokenAction = "unsubscribe" | "delete";

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromBase64url(input: string): string {
  return Buffer.from(input.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
}

function sign(payload: string): string {
  return base64url(createHmac("sha256", tokenSecret()).update(payload).digest());
}

export function createToken(action: TokenAction, id: string): string {
  const payload = `${action}:${id}`;
  return `${base64url(payload)}.${sign(payload)}`;
}

/** Returns the row id, or null for anything that does not verify. */
export function verifyToken(action: TokenAction, token: string | null): string | null {
  if (!token) return null;

  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  let payload: string;
  try {
    payload = fromBase64url(encoded);
  } catch {
    return null;
  }

  const expected = sign(payload);
  // Compared byte-wise in constant time: a plain === leaks how much of a
  // forged signature was right through how long the comparison took.
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  const separator = payload.indexOf(":");
  if (separator < 1) return null;
  if (payload.slice(0, separator) !== action) return null;

  const id = payload.slice(separator + 1);
  return id || null;
}

/** An IP is personal data; the rate limiter only ever sees this digest. */
export function hashIdentifier(value: string): string {
  return createHmac("sha256", tokenSecret()).update(value).digest("hex").slice(0, 32);
}
