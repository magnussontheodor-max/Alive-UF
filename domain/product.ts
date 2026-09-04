import { ApprovalStatus, Id } from "./primitives";

// ---------------------------------------------------------------------------
// Product specification
//
// The defining rule: every in-scope feature must name the validated assumption
// it serves. A feature with no `justifiedBy` cannot be marked in-scope — the
// Product Agent has to either find the evidence or leave it out.
// ---------------------------------------------------------------------------

export interface ProductSpec {
  id: Id;
  startupId: Id;
  opportunityId: Id;

  problem: string;
  targetCustomer: string;
  /** The job the customer is hiring this to do. */
  coreJobToBeDone: string;
  valueProposition: string;

  coreWorkflow: WorkflowStep[];
  features: Feature[];
  outOfScope: OutOfScopeItem[];
  userFlows: UserFlow[];

  /** The one number that tells us whether the MVP worked. */
  successMetric: SuccessMetric;

  /** Assumptions that are still untested but that this spec depends on. */
  remainingRisks: string[];

  approval: ApprovalStatus;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowStep {
  order: number;
  actor: string;
  action: string;
}

export interface Feature {
  id: Id;
  name: string;
  description: string;
  /** The assumption ids that justify building this. Required and non-empty. */
  justifiedBy: Id[];
  /** Plain-language statement of the validated need this serves. */
  justification: string;
  /** Is the justification actually validated, or is this a bet? */
  justificationStrength: "VALIDATED" | "PARTIAL" | "UNVALIDATED";
  effort: "S" | "M" | "L";
}

export interface OutOfScopeItem {
  name: string;
  /** Why it is not being built now. */
  reason: string;
  /** What would have to be true to bring it in scope. */
  reconsiderIf: string;
}

export interface UserFlow {
  name: string;
  steps: string[];
}

export interface SuccessMetric {
  metric: string;
  target: string;
  /** Why this number and not a vanity metric. */
  reasoning: string;
  measurableBy: string;
}

/** Features that made it into scope without validation. Surfaced prominently. */
export function unvalidatedFeatures(spec: ProductSpec): Feature[] {
  return spec.features.filter((f) => f.justificationStrength === "UNVALIDATED");
}
