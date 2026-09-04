import { ApprovalStatus, Claim, Confidence, Id } from "./primitives";

// ---------------------------------------------------------------------------
// Opportunity
//
// An opportunity starts with a PROBLEM, not a product idea. It is deliberately
// impossible to express "an AI SaaS for X" in this type without first saying
// who has the problem and how we know.
//
// There is a score, but it is never shown without its components and their
// reasoning — see `OpportunityScore` below.
// ---------------------------------------------------------------------------

export interface Opportunity {
  id: Id;
  startupId: Id;

  /** Short handle for the UI. Derived from the problem, not a product name. */
  title: string;

  /** The problem. Specific, observable, attributable to real people. */
  problem: string;
  /** Who has it — a description you could use to find five of them tomorrow. */
  customer: string;
  /** The circumstances in which the problem shows up. */
  context: string;

  /** What we might build. Explicitly a hypothesis at this stage. */
  proposedSolution: string | null;

  /** Why this founder specifically. Grounded in their profile, or absent. */
  founderFit: FounderFit;

  /** What we actually know versus what we are guessing. */
  claims: Claim[];
  /** The things that must be true for this to work, created as Assumptions. */
  keyUnknowns: string[];
  risks: OpportunityRisk[];

  score: OpportunityScore;
  confidence: Confidence;

  status: OpportunityStatus;
  approval: ApprovalStatus;

  createdBy: "FOUNDER" | "AGENT";
  agentName: string | null;
  createdAt: string;
  updatedAt: string;
}

export type OpportunityStatus =
  | "PROPOSED"
  | "SELECTED"
  | "PARKED"
  | "DISCARDED";

export const OPPORTUNITY_STATUS_LABEL: Record<OpportunityStatus, string> = {
  PROPOSED: "Proposed",
  SELECTED: "Selected",
  PARKED: "Parked",
  DISCARDED: "Discarded",
};

export interface FounderFit {
  /** Which domain exposure / network entries this rests on. */
  basedOn: Id[];
  /** Plain-language statement of the fit, or why there isn't one. */
  statement: string;
  /** Can the founder reach people with this problem this week? Decisive. */
  reachableCustomers: number | null;
  strength: "NONE" | "WEAK" | "MODERATE" | "STRONG";
}

export interface OpportunityRisk {
  id: Id;
  statement: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  /** What would tell us whether this risk is real. */
  howToCheck: string;
}

/**
 * A score exists because founders need to compare options, but every component
 * carries its own reasoning and the UI is required to show them. A total with
 * no components is not renderable.
 */
export interface OpportunityScore {
  total: number;
  components: ScoreComponent[];
  /** Explicit statement of what this score does NOT account for. */
  limitations: string[];
}

export interface ScoreComponent {
  key: "founderFit" | "problemEvidence" | "reachability" | "feasibility";
  label: string;
  /** 0-100 */
  value: number;
  weight: number;
  reasoning: string;
  /** Whether this component rests on evidence or is currently a guess. */
  grounded: boolean;
}

export function scoreFromComponents(
  components: ScoreComponent[],
  limitations: string[]
): OpportunityScore {
  const totalWeight = components.reduce((sum, c) => sum + c.weight, 0) || 1;
  const total = Math.round(
    components.reduce((sum, c) => sum + c.value * c.weight, 0) / totalWeight
  );
  return { total, components, limitations };
}

/** How much of the score rests on actual evidence rather than inference. */
export function groundedFraction(score: OpportunityScore): number {
  if (score.components.length === 0) return 0;
  const grounded = score.components.filter((c) => c.grounded);
  const groundedWeight = grounded.reduce((s, c) => s + c.weight, 0);
  const totalWeight = score.components.reduce((s, c) => s + c.weight, 0) || 1;
  return groundedWeight / totalWeight;
}
