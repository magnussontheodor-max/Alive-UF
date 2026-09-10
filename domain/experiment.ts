import { Id } from "./primitives";
import { ValidationMethod } from "./assumption";

// ---------------------------------------------------------------------------
// Experiments
//
// Designed to make being wrong cheap and early. Note that failure criteria are
// required, not optional: an experiment you cannot fail is not an experiment,
// it is a demo.
// ---------------------------------------------------------------------------

export interface Experiment {
  id: Id;
  startupId: Id;
  assumptionId: Id;

  title: string;
  /** The specific, falsifiable prediction being tested. */
  hypothesis: string;
  method: ValidationMethod;
  /** Why this method rather than the obvious one. */
  methodReasoning: string;

  /** Who to run it with, specific enough to act on. */
  targetParticipants: string;
  targetSampleSize: number;

  /** What result would count as the assumption holding. */
  successCriteria: string[];
  /** What result would count as it failing. Required. */
  failureCriteria: string[];

  estimatedHours: number;
  estimatedCostSek: number;

  status: ExperimentStatus;
  result: ExperimentResult | null;

  createdBy: "FOUNDER" | "AGENT";
  agentName: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ExperimentStatus = "DESIGNED" | "RUNNING" | "COMPLETE" | "ABANDONED";

export const EXPERIMENT_STATUS_LABEL: Record<ExperimentStatus, string> = {
  DESIGNED: "Designed",
  RUNNING: "Running",
  COMPLETE: "Complete",
  ABANDONED: "Abandoned",
};

/**
 * INCONCLUSIVE is a first-class outcome. Most real experiments land here, and
 * a system that cannot say so will quietly manufacture false confidence.
 */
export type ExperimentOutcome =
  | "SUPPORTED"
  | "PARTIALLY_SUPPORTED"
  | "REJECTED"
  | "INCONCLUSIVE";

export const OUTCOME_LABEL: Record<ExperimentOutcome, string> = {
  SUPPORTED: "Assumption supported",
  PARTIALLY_SUPPORTED: "Partly supported",
  REJECTED: "Assumption rejected",
  INCONCLUSIVE: "Inconclusive",
};

export type Recommendation = "PROCEED" | "CONTINUE_TESTING" | "PIVOT" | "STOP";

export const RECOMMENDATION_LABEL: Record<Recommendation, string> = {
  PROCEED: "Proceed",
  CONTINUE_TESTING: "Keep testing",
  PIVOT: "Pivot",
  STOP: "Stop this direction",
};

export interface ExperimentResult {
  outcome: ExperimentOutcome;
  /** What actually happened, recorded by the founder. */
  whatHappened: string;
  participantsReached: number;

  /** Which success criteria were met, individually. No hand-waving. */
  criteriaMet: CriterionResult[];

  /** Evidence created from this experiment. */
  evidenceIds: Id[];

  recommendation: Recommendation;
  recommendationReasoning: string;
  /** What would change this recommendation. */
  wouldChangeIf: string | null;

  /** Honest note on what this experiment could not tell us. */
  limitations: string[];

  recordedAt: string;
}

export interface CriterionResult {
  criterion: string;
  met: boolean;
  note: string | null;
}
