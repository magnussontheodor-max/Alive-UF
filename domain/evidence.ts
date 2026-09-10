import { EpistemicStatus, Id } from "./primitives";

// ---------------------------------------------------------------------------
// Evidence
//
// The system's memory is only as good as what it can point at. Every claim
// that matters should trace back to one of these.
//
// Evidence is explicitly NOT all equal: reliability and relevance are recorded
// separately, and the confidence maths in rules/confidence.ts weights them.
// A competitor's marketing page and five customer interviews do not count the
// same, and the product should never pretend otherwise.
// ---------------------------------------------------------------------------

export type EvidenceSourceType =
  | "FOUNDER_INTERVIEW"
  | "CUSTOMER_INTERVIEW"
  | "MARKET_RESEARCH"
  | "COMPETITOR"
  | "PUBLIC_DATA"
  | "OFFICIAL_SOURCE"
  | "EXPERIMENT"
  | "USER_INPUT"
  | "OTHER";

export const SOURCE_TYPE_LABEL: Record<EvidenceSourceType, string> = {
  FOUNDER_INTERVIEW: "Founder interview",
  CUSTOMER_INTERVIEW: "Customer interview",
  MARKET_RESEARCH: "Market research",
  COMPETITOR: "Competitor",
  PUBLIC_DATA: "Public data",
  OFFICIAL_SOURCE: "Official source",
  EXPERIMENT: "Experiment",
  USER_INPUT: "Entered by you",
  OTHER: "Other",
};

/**
 * Default reliability by source type. A founder talking about their own past
 * is reliable about their experience but not about the market; a competitor's
 * website tells you what they claim, not what is true.
 */
export const SOURCE_TYPE_BASE_RELIABILITY: Record<EvidenceSourceType, Reliability> = {
  CUSTOMER_INTERVIEW: "MEDIUM",
  EXPERIMENT: "HIGH",
  OFFICIAL_SOURCE: "HIGH",
  PUBLIC_DATA: "MEDIUM",
  FOUNDER_INTERVIEW: "MEDIUM",
  MARKET_RESEARCH: "LOW",
  COMPETITOR: "LOW",
  USER_INPUT: "MEDIUM",
  OTHER: "LOW",
};

export type Reliability = "LOW" | "MEDIUM" | "HIGH";
export type Relevance = "LOW" | "MEDIUM" | "HIGH";

export const RELIABILITY_WEIGHT: Record<Reliability, number> = {
  LOW: 0.3,
  MEDIUM: 0.65,
  HIGH: 1,
};

export const RELEVANCE_WEIGHT: Record<Relevance, number> = {
  LOW: 0.3,
  MEDIUM: 0.65,
  HIGH: 1,
};

export interface Evidence {
  id: Id;
  startupId: Id;

  /** What this evidence actually says. One sentence, specific. */
  claim: string;
  /** Named source: a person's role, a URL, a document, an experiment id. */
  source: string;
  sourceType: EvidenceSourceType;

  /** Is this an observation, or someone's opinion about the future? */
  epistemicStatus: EpistemicStatus;

  reliability: Reliability;
  relevance: Relevance;

  /** Which assumptions this bears on, and in which direction. */
  supports: Id[];
  contradicts: Id[];

  /** Free-text detail: quotes, numbers, caveats. */
  detail: string | null;

  /** Who recorded it. */
  recordedBy: "FOUNDER" | "AGENT";
  agentName: string | null;

  observedAt: string;
  createdAt: string;
}

/**
 * How much a single piece of evidence is worth when computing confidence.
 * Range 0-1.
 */
export function evidenceWeight(e: Evidence): number {
  const base = RELIABILITY_WEIGHT[e.reliability] * RELEVANCE_WEIGHT[e.relevance];
  // A hypothesis recorded as "evidence" barely counts; it is someone's belief.
  const epistemicFactor =
    e.epistemicStatus === "FACT" ? 1 : e.epistemicStatus === "INFERENCE" ? 0.6 : 0.25;
  return base * epistemicFactor;
}
