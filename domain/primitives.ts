// ---------------------------------------------------------------------------
// Domain primitives: identity, provenance and confidence.
//
// These three ideas carry most of Spark UF's product philosophy, so they live
// at the bottom of the dependency graph and everything else is built on them.
//
//  - Provenance:  nothing enters Startup Memory without saying where it came
//                 from and whether it is a fact, an inference or a hypothesis.
//  - Confidence:  never a bare number. A confidence value that cannot explain
//                 itself is not allowed to exist.
// ---------------------------------------------------------------------------

export type Id = string;

export function newId(prefix: string): Id {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().replace(/-/g, "").slice(0, 12)
      : Math.random().toString(36).slice(2, 14);
  return `${prefix}_${rand}`;
}

export function now(): string {
  return new Date().toISOString();
}

// ---------------------------------------------------------------------------
// Epistemic status — the single most important distinction in the product.
//
// A FACT is something we observed or read from a source we can name.
// An INFERENCE is a conclusion we drew from facts. It can be wrong.
// A HYPOTHESIS is a belief we have not tested at all.
//
// The UI renders these three differently, and the orchestrator treats them
// differently. Presenting a hypothesis as a fact is the specific failure mode
// this type exists to prevent.
// ---------------------------------------------------------------------------

export type EpistemicStatus = "FACT" | "INFERENCE" | "HYPOTHESIS";

export const EPISTEMIC_LABEL: Record<EpistemicStatus, string> = {
  FACT: "Fact",
  INFERENCE: "Inference",
  HYPOTHESIS: "Hypothesis",
};

export const EPISTEMIC_EXPLANATION: Record<EpistemicStatus, string> = {
  FACT: "Observed directly or taken from a named source.",
  INFERENCE: "Reasoned from the facts we have. Could be wrong.",
  HYPOTHESIS: "A belief we have not tested yet.",
};

/**
 * A single claim held in Startup Memory.
 *
 * `basis` lists the evidence ids this claim rests on. A FACT with an empty
 * basis is invalid — see `rules/grounding.ts`, which rejects it before it can
 * reach memory.
 */
export interface Claim {
  id: Id;
  statement: string;
  status: EpistemicStatus;
  basis: Id[];
  /** Where this claim came from: which agent, or the founder directly. */
  origin: ClaimOrigin;
  createdAt: string;
}

export type ClaimOrigin =
  | { kind: "FOUNDER" }
  | { kind: "AGENT"; agent: string }
  | { kind: "SYSTEM" };

// ---------------------------------------------------------------------------
// Confidence
//
// Deliberately not a number. A confidence value must carry the evidence it
// rests on and a sentence a founder can read. `value` is coarse on purpose:
// implying two decimal places of precision about an untested startup belief
// would be dishonest.
// ---------------------------------------------------------------------------

export type ConfidenceLevel = "NONE" | "LOW" | "MODERATE" | "HIGH";

export interface Confidence {
  level: ConfidenceLevel;
  /** 0-1, used for ranking only. Never render this as a percentage alone. */
  value: number;
  /** Evidence ids this confidence rests on. Empty means level must be NONE. */
  basis: Id[];
  /** How the level was arrived at, in one sentence a founder can read. */
  explanation: string;
}

export const CONFIDENCE_VALUE: Record<ConfidenceLevel, number> = {
  NONE: 0,
  LOW: 0.25,
  MODERATE: 0.55,
  HIGH: 0.8,
};

export const CONFIDENCE_LABEL: Record<ConfidenceLevel, string> = {
  NONE: "No evidence",
  LOW: "Weak evidence",
  MODERATE: "Some evidence",
  HIGH: "Well supported",
};

export function confidence(
  level: ConfidenceLevel,
  explanation: string,
  basis: Id[] = []
): Confidence {
  // A confidence above NONE with no supporting evidence is a lie. Collapse it.
  const honestLevel = basis.length === 0 && level !== "NONE" ? "NONE" : level;
  return {
    level: honestLevel,
    value: CONFIDENCE_VALUE[honestLevel],
    basis,
    explanation:
      honestLevel === "NONE" && level !== "NONE"
        ? "No evidence recorded yet, so no confidence can be claimed."
        : explanation,
  };
}

export const NO_CONFIDENCE: Confidence = {
  level: "NONE",
  value: 0,
  basis: [],
  explanation: "Nothing has been recorded about this yet.",
};

// ---------------------------------------------------------------------------
// Approval — AI recommendation vs founder decision.
// The founder owns the startup. The system proposes; it never silently decides.
// ---------------------------------------------------------------------------

export type ApprovalStatus =
  | "AI_RECOMMENDED"
  | "FOUNDER_APPROVED"
  | "FOUNDER_REJECTED"
  | "FOUNDER_EDITED";

export const APPROVAL_LABEL: Record<ApprovalStatus, string> = {
  AI_RECOMMENDED: "Suggested by Spark",
  FOUNDER_APPROVED: "You approved this",
  FOUNDER_REJECTED: "You rejected this",
  FOUNDER_EDITED: "You edited this",
};

export type Importance = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export const IMPORTANCE_WEIGHT: Record<Importance, number> = {
  LOW: 0.25,
  MEDIUM: 0.5,
  HIGH: 0.8,
  CRITICAL: 1,
};
