import { Confidence, Id } from "./primitives";

// ---------------------------------------------------------------------------
// Startup + stages
// ---------------------------------------------------------------------------

export type StageId =
  | "FOUNDER"
  | "OPPORTUNITY"
  | "RESEARCH"
  | "VALIDATION"
  | "PRODUCT"
  | "BUILD"
  | "SETUP"
  | "LAUNCH";

export const STAGE_ORDER: StageId[] = [
  "FOUNDER",
  "OPPORTUNITY",
  "RESEARCH",
  "VALIDATION",
  "PRODUCT",
  "BUILD",
  "SETUP",
  "LAUNCH",
];

/**
 * How complete each stage is in this version of the product. Shown in the UI
 * so nobody is misled into thinking a placeholder is a working feature.
 */
export type StageImplementation = "FULL" | "SIMPLIFIED" | "PLACEHOLDER";

export interface Stage {
  id: StageId;
  label: string;
  question: string;
  description: string;
  implementation: StageImplementation;
}

export const STAGES: Stage[] = [
  {
    id: "FOUNDER",
    label: "Founder",
    question: "What do you actually have to work with?",
    description:
      "Your experience, the domains you know first-hand, the people you can reach, and your real constraints.",
    implementation: "FULL",
  },
  {
    id: "OPPORTUNITY",
    label: "Opportunity",
    question: "Which problem is worth pursuing?",
    description:
      "Problems drawn from what you have witnessed, not from generic idea lists.",
    implementation: "FULL",
  },
  {
    id: "RESEARCH",
    label: "Research",
    question: "What can we find out before spending money?",
    description:
      "Specific questions answered with sources, separating fact from inference.",
    implementation: "FULL",
  },
  {
    id: "VALIDATION",
    label: "Validation",
    question: "Is the riskiest belief actually true?",
    description:
      "The smallest experiment that could prove you wrong, run before you build.",
    implementation: "FULL",
  },
  {
    id: "PRODUCT",
    label: "Product",
    question: "What is the smallest thing worth building?",
    description:
      "An MVP where every feature traces back to something you validated.",
    implementation: "FULL",
  },
  {
    id: "BUILD",
    label: "Build",
    question: "How does it get built?",
    description: "Build planning. Simplified in this version.",
    implementation: "SIMPLIFIED",
  },
  {
    id: "SETUP",
    label: "Setup",
    question: "How do you set up the company in Sweden?",
    description:
      "Company form, registration and tax. Not implemented in this version.",
    implementation: "PLACEHOLDER",
  },
  {
    id: "LAUNCH",
    label: "Launch",
    question: "How do you get the first customers?",
    description: "Launch and acquisition. Not implemented in this version.",
    implementation: "PLACEHOLDER",
  },
];

export function getStage(id: StageId): Stage {
  const stage = STAGES.find((s) => s.id === id);
  if (!stage) throw new Error(`Unknown stage: ${id}`);
  return stage;
}

export function stageIndex(id: StageId): number {
  return STAGE_ORDER.indexOf(id);
}

export function stageIsBefore(a: StageId, b: StageId): boolean {
  return stageIndex(a) < stageIndex(b);
}

export type StageStatus = "NOT_STARTED" | "IN_PROGRESS" | "BLOCKED" | "COMPLETE";

// ---------------------------------------------------------------------------
// Startup
//
// Note what is NOT here: no free-text "description" blob. Every field the
// system reasons about is structured and carries its own confidence, so the
// UI can always show what is known versus assumed.
// ---------------------------------------------------------------------------

export interface Startup {
  id: Id;
  founderId: Id;
  name: string;
  country: string;

  stage: StageId;
  stageStatus: StageStatus;

  /** The selected opportunity, once the founder has approved one. */
  selectedOpportunityId: Id | null;

  /** Structured understanding. Each may be null — null means "we don't know". */
  problem: StartupField | null;
  targetCustomer: StartupField | null;
  solution: StartupField | null;
  valueProposition: StartupField | null;
  businessModel: StartupField | null;
  productType: StartupField | null;

  /** Marks the seeded demo workspace so it is never confused with real work. */
  isDemo: boolean;

  createdAt: string;
  updatedAt: string;
}

/**
 * A single piece of the startup's definition, with its provenance attached.
 * The UI renders `source` next to the value so the founder always knows
 * whether they said it or the system inferred it.
 */
export interface StartupField {
  value: string;
  source: "FOUNDER" | "AGENT" | "OPPORTUNITY";
  confidence: Confidence;
  updatedAt: string;
}

export function startupFieldsDefined(startup: Startup): number {
  return [
    startup.problem,
    startup.targetCustomer,
    startup.solution,
    startup.valueProposition,
    startup.businessModel,
    startup.productType,
  ].filter(Boolean).length;
}
