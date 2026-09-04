import { Confidence, Id, Importance } from "./primitives";

// ---------------------------------------------------------------------------
// Assumptions
//
// The spine of the whole system. Spark UF's job is to find the belief that
// would hurt most if it were wrong, and get it tested before the founder
// spends months building on top of it.
// ---------------------------------------------------------------------------

export type AssumptionCategory =
  | "PROBLEM"
  | "CUSTOMER"
  | "MARKET"
  | "SOLUTION"
  | "WILLINGNESS_TO_PAY"
  | "PRICING"
  | "DISTRIBUTION"
  | "TECHNICAL";

export const CATEGORY_LABEL: Record<AssumptionCategory, string> = {
  PROBLEM: "Problem",
  CUSTOMER: "Customer",
  MARKET: "Market",
  SOLUTION: "Solution",
  WILLINGNESS_TO_PAY: "Willingness to pay",
  PRICING: "Pricing",
  DISTRIBUTION: "Distribution",
  TECHNICAL: "Technical",
};

/**
 * Which stage each category most needs to be resolved in. Used by the Next
 * Best Action engine so it does not push a pricing experiment at someone who
 * has not yet established that the problem exists.
 */
export const CATEGORY_STAGE_RELEVANCE: Record<AssumptionCategory, string[]> = {
  PROBLEM: ["OPPORTUNITY", "RESEARCH", "VALIDATION"],
  CUSTOMER: ["OPPORTUNITY", "RESEARCH", "VALIDATION"],
  MARKET: ["RESEARCH"],
  SOLUTION: ["VALIDATION", "PRODUCT"],
  WILLINGNESS_TO_PAY: ["VALIDATION"],
  PRICING: ["VALIDATION"],
  DISTRIBUTION: ["RESEARCH", "VALIDATION"],
  TECHNICAL: ["PRODUCT", "BUILD"],
};

export type AssumptionStatus =
  | "UNTESTED"
  | "TESTING"
  | "SUPPORTED"
  | "PARTIALLY_SUPPORTED"
  | "REJECTED";

export const STATUS_LABEL: Record<AssumptionStatus, string> = {
  UNTESTED: "Untested",
  TESTING: "Being tested",
  SUPPORTED: "Supported",
  PARTIALLY_SUPPORTED: "Partly supported",
  REJECTED: "Rejected",
};

/**
 * How this assumption could be tested. Recorded up-front so the Validation
 * Agent has a starting point and does not default to "go do interviews" for
 * every single belief.
 */
export type ValidationMethod =
  | "CUSTOMER_INTERVIEW"
  | "LANDING_PAGE"
  | "FAKE_DOOR"
  | "WAITLIST"
  | "CONCIERGE"
  | "PRICING_TEST"
  | "PRE_ORDER"
  | "PROTOTYPE_TEST"
  | "DESK_RESEARCH"
  | "UNKNOWN";

export const METHOD_LABEL: Record<ValidationMethod, string> = {
  CUSTOMER_INTERVIEW: "Customer interviews",
  LANDING_PAGE: "Landing page test",
  FAKE_DOOR: "Fake-door test",
  WAITLIST: "Waitlist",
  CONCIERGE: "Manual concierge test",
  PRICING_TEST: "Pricing test",
  PRE_ORDER: "Pre-order",
  PROTOTYPE_TEST: "Prototype test",
  DESK_RESEARCH: "Desk research",
  UNKNOWN: "Not yet decided",
};

export interface Assumption {
  id: Id;
  startupId: Id;

  /** Written so it could be proven false. "Customers want this" is not valid. */
  statement: string;
  category: AssumptionCategory;
  importance: Importance;
  /** Why it matters this much — shown to the founder, never a bare label. */
  importanceReason: string;

  status: AssumptionStatus;
  confidence: Confidence;

  supportingEvidenceIds: Id[];
  contradictingEvidenceIds: Id[];

  validationMethod: ValidationMethod;
  /** Populated once an experiment is designed for it. */
  experimentId: Id | null;

  /** Which opportunity this belongs to, if any. */
  opportunityId: Id | null;

  createdBy: "FOUNDER" | "AGENT";
  agentName: string | null;

  createdAt: string;
  updatedAt: string;
}

export function isOpen(a: Assumption): boolean {
  return a.status === "UNTESTED" || a.status === "TESTING" || a.status === "PARTIALLY_SUPPORTED";
}

export function isResolved(a: Assumption): boolean {
  return a.status === "SUPPORTED" || a.status === "REJECTED";
}

/**
 * How testable an assumption is right now, 0-1. Feeds Next Best Action ranking:
 * a critical-but-untestable assumption should not block a founder who could
 * instead go and resolve something concrete today.
 */
export function testability(a: Assumption): number {
  switch (a.validationMethod) {
    case "CUSTOMER_INTERVIEW":
    case "DESK_RESEARCH":
      return 1;
    case "LANDING_PAGE":
    case "FAKE_DOOR":
    case "WAITLIST":
    case "PRICING_TEST":
    case "CONCIERGE":
      return 0.75;
    case "PRE_ORDER":
    case "PROTOTYPE_TEST":
      return 0.5;
    case "UNKNOWN":
      return 0.4;
  }
}
