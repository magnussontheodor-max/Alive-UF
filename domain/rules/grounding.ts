import { Claim, EpistemicStatus, Id } from "../primitives";

// ---------------------------------------------------------------------------
// Grounding rules — the anti-slop enforcement point.
//
// Everything an agent produces passes through here before it can reach Startup
// Memory. The rules are deliberately blunt:
//
//   1. A FACT with no evidence behind it is not a fact. It is demoted to a
//      HYPOTHESIS, or dropped.
//   2. Claims containing unsourced quantities ("40% of companies…") are
//      rejected outright. Invented numbers are the most damaging form of AI
//      slop because they look like research.
//   3. Generic startup advice is rejected by pattern. If the system cannot say
//      something specific to this founder, it says nothing.
//
// This module is pure and unit-testable, and it runs regardless of which AI
// provider produced the output.
// ---------------------------------------------------------------------------

export interface GroundingResult {
  accepted: Claim[];
  rejected: RejectedClaim[];
  demoted: DemotedClaim[];
}

export interface RejectedClaim {
  claim: Claim;
  reason: string;
}

export interface DemotedClaim {
  claim: Claim;
  from: EpistemicStatus;
  to: EpistemicStatus;
  reason: string;
}

/**
 * Phrases that indicate generic filler rather than a claim about this specific
 * startup. Matched case-insensitively against whole claims.
 */
const GENERIC_PATTERNS: { pattern: RegExp; reason: string }[] = [
  {
    pattern: /\b(talk to|speak to|interview) (your |some |potential )?customers\b/i,
    reason:
      "Generic advice. An action must name who to talk to and what it would settle.",
  },
  {
    pattern: /\bvalidate your idea\b/i,
    reason: "Generic advice. Name the specific assumption to be tested.",
  },
  {
    pattern: /\b(build|create) a (simple|basic) mvp\b/i,
    reason: "Generic advice. An MVP must be derived from validated needs.",
  },
  {
    pattern: /\btarget (audience|market) is small businesses\b/i,
    reason: "Too vague to act on. A customer definition must be findable.",
  },
  {
    pattern: /\bhuge (market|opportunity)\b|\bmassive potential\b/i,
    reason: "Unsupportable enthusiasm rather than an observation.",
  },
  {
    pattern: /\bgrowing (rapidly|fast)\b(?!.*\b(source|according to)\b)/i,
    reason: "Growth claim with no source.",
  },
  {
    pattern: /\bleverage (ai|technology)\b/i,
    reason: "Filler phrasing with no specific content.",
  },
];

/**
 * Numeric claims that are not attributed. We allow numbers that the founder
 * supplied or that cite a source in the same sentence.
 */
const UNSOURCED_NUMBER = /\b\d+([.,]\d+)?\s?(%|percent|million|billion|mdr|miljoner|k\b|sek\b|kr\b)/i;
const HAS_ATTRIBUTION = /\b(according to|source|per |based on|from the|interview|founder said|we measured|observed)\b/i;

export function checkClaim(
  claim: Claim,
  knownEvidenceIds: Set<Id>
): { verdict: "ACCEPT" | "DEMOTE" | "REJECT"; reason: string; to?: EpistemicStatus } {
  const text = claim.statement.trim();

  if (text.length < 12) {
    return { verdict: "REJECT", reason: "Too short to carry meaning." };
  }

  for (const { pattern, reason } of GENERIC_PATTERNS) {
    if (pattern.test(text)) {
      return { verdict: "REJECT", reason };
    }
  }

  if (UNSOURCED_NUMBER.test(text) && !HAS_ATTRIBUTION.test(text)) {
    // The founder is allowed to state numbers about their own situation.
    if (claim.origin.kind !== "FOUNDER") {
      return {
        verdict: "REJECT",
        reason:
          "Contains a quantity with no source. Unsourced numbers are not recorded.",
      };
    }
  }

  // A fact must rest on evidence that actually exists.
  const validBasis = claim.basis.filter((id) => knownEvidenceIds.has(id));

  if (claim.status === "FACT" && validBasis.length === 0) {
    return {
      verdict: "DEMOTE",
      to: "HYPOTHESIS",
      reason:
        "Stated as fact but no evidence is attached, so it is recorded as an untested belief.",
    };
  }

  if (claim.status === "INFERENCE" && validBasis.length === 0) {
    return {
      verdict: "DEMOTE",
      to: "HYPOTHESIS",
      reason: "Inference with nothing to infer from.",
    };
  }

  return { verdict: "ACCEPT", reason: "Grounded." };
}

export function groundClaims(
  claims: Claim[],
  knownEvidenceIds: Set<Id>
): GroundingResult {
  const accepted: Claim[] = [];
  const rejected: RejectedClaim[] = [];
  const demoted: DemotedClaim[] = [];

  for (const claim of claims) {
    const check = checkClaim(claim, knownEvidenceIds);

    if (check.verdict === "REJECT") {
      rejected.push({ claim, reason: check.reason });
      continue;
    }

    if (check.verdict === "DEMOTE" && check.to) {
      const next: Claim = {
        ...claim,
        status: check.to,
        basis: claim.basis.filter((id) => knownEvidenceIds.has(id)),
      };
      demoted.push({ claim: next, from: claim.status, to: check.to, reason: check.reason });
      accepted.push(next);
      continue;
    }

    accepted.push({
      ...claim,
      basis: claim.basis.filter((id) => knownEvidenceIds.has(id)),
    });
  }

  return { accepted, rejected, demoted };
}

/**
 * Guards free text produced by an agent and shown directly to the founder
 * (task rationales, recommendations). Returns null if the text is acceptable,
 * or the reason it is not.
 */
export function checkNarrative(text: string): string | null {
  for (const { pattern, reason } of GENERIC_PATTERNS) {
    if (pattern.test(text)) return reason;
  }
  if (UNSOURCED_NUMBER.test(text) && !HAS_ATTRIBUTION.test(text)) {
    return "Contains an unsourced quantity.";
  }
  return null;
}
