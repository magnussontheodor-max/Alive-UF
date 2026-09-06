import { Id } from "./primitives";

// ---------------------------------------------------------------------------
// Waitlist
//
// Pre-launch early access signups. Deliberately the smallest record that can
// still be acted on: a name to address someone by, an email to reach them, and
// where they came from. No company, no idea, no survey — every extra field is
// a reason not to sign up.
// ---------------------------------------------------------------------------

export interface WaitlistEntry {
  id: Id;
  firstName: string;
  email: string;
  /** Which surface the signup came from, e.g. "landing-hero", "landing-final". */
  source: string;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  createdAt: string;
}

export type WaitlistOutcome =
  | { kind: "ADDED"; entry: WaitlistEntry }
  /** Already signed up. Not an error — the founder should be told they are in. */
  | { kind: "ALREADY_ON_LIST" }
  | { kind: "FAILED"; reason: string };

/** Emails are compared case-insensitively, so duplicates are stored one way. */
export function normaliseEmail(email: string): string {
  return email.trim().toLowerCase();
}
