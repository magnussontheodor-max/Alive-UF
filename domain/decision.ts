import { Confidence, Id } from "./primitives";

// ---------------------------------------------------------------------------
// Decisions
//
// Startups fail slowly because nobody remembers why they chose what they chose.
// Every significant fork is recorded with its reasoning, the evidence available
// at the time, and what was rejected — so a pivot six weeks later is an
// informed reversal rather than a fresh guess.
// ---------------------------------------------------------------------------

export type DecisionType =
  | "OPPORTUNITY_SELECTED"
  | "OPPORTUNITY_DISCARDED"
  | "PIVOT"
  | "STAGE_ADVANCED"
  | "EXPERIMENT_CONCLUDED"
  | "SCOPE_DECISION"
  | "STRATEGY"
  | "OTHER";

export const DECISION_TYPE_LABEL: Record<DecisionType, string> = {
  OPPORTUNITY_SELECTED: "Opportunity selected",
  OPPORTUNITY_DISCARDED: "Opportunity discarded",
  PIVOT: "Pivot",
  STAGE_ADVANCED: "Stage advanced",
  EXPERIMENT_CONCLUDED: "Experiment concluded",
  SCOPE_DECISION: "Scope decision",
  STRATEGY: "Strategy",
  OTHER: "Other",
};

export interface Decision {
  id: Id;
  startupId: Id;

  type: DecisionType;
  /** What was decided, in one sentence. */
  decision: string;
  /** Why. Must reference what was known at the time. */
  reason: string;

  evidenceIds: Id[];
  /** Options considered and why they were not chosen. */
  alternativesConsidered: Alternative[];

  confidence: Confidence;

  /** Who actually made the call. The founder decides; the system suggests. */
  madeBy: "FOUNDER" | "SYSTEM";
  /** If the system recommended something, what was it? */
  systemRecommendation: string | null;

  /** What would make us revisit this. */
  wouldChangeIf: string | null;

  createdAt: string;
}

export interface Alternative {
  option: string;
  whyNot: string;
}
