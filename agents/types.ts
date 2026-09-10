import {
  Assumption,
  Claim,
  Decision,
  Evidence,
  Experiment,
  FounderProfile,
  Opportunity,
  ProductSpec,
  StartupMemory,
  AgentName,
  Startup,
} from "@/domain";
import { LLMProvider } from "@/ai";

// ---------------------------------------------------------------------------
// Agent contract
//
// Every agent takes Startup Memory plus a specific input, and returns a
// structured result. Agents never write to the database, never call each
// other, and never decide what happens next — the orchestrator does all three.
//
// The result deliberately separates *what the agent produced* from *what it
// wants changed*, so the orchestrator can apply grounding rules in between.
// ---------------------------------------------------------------------------

export interface AgentContext {
  memory: StartupMemory;
  /** Null when no model is configured; agents then use their rule-based path. */
  provider: LLMProvider | null;
}

export type AgentInput = object;

/**
 * What an agent produces. Everything is optional because an honest agent
 * frequently has nothing to add — which is a valid, and often correct, result.
 */
export interface AgentResult {
  agent: AgentName;

  /** One-line summary for the activity log. */
  summary: string;

  /** New claims for Startup Memory. Subject to grounding rules. */
  claims: Claim[];
  /** New evidence the agent recorded. */
  evidence: Evidence[];
  /** Assumptions the agent identified. */
  assumptions: Assumption[];
  /** Opportunities produced. */
  opportunities: Opportunity[];
  /** Experiments designed. */
  experiments: Experiment[];
  /** Decisions the agent recommends (never applies itself). */
  decisions: Decision[];

  /** Direct patches to the startup record. */
  startupPatch: Partial<Startup> | null;
  /** A replacement founder profile, when the Founder Agent has updated it. */
  founderProfile: FounderProfile | null;
  /** A product specification, when the Product Agent has produced one. */
  productSpec: ProductSpec | null;

  /** What the agent could not determine. Surfaced to the founder verbatim. */
  openQuestions: string[];
  /** Explicit statement of what this result does not cover. */
  limitations: string[];

  /** The founder-facing explanation. Never raw chain-of-thought. */
  explanation: AgentExplanation | null;

  /** Anything that stopped the agent from doing its job. */
  blocked: string | null;
}

/**
 * The transparency contract from the spec: recommendation, why, evidence used,
 * risks, and what would change the recommendation. Not reasoning traces.
 */
export interface AgentExplanation {
  recommendation: string;
  why: string;
  evidenceUsed: string[];
  risks: string[];
  wouldChangeIf: string;
}

export function emptyResult(agent: AgentName, summary: string): AgentResult {
  return {
    agent,
    summary,
    claims: [],
    evidence: [],
    assumptions: [],
    opportunities: [],
    experiments: [],
    decisions: [],
    startupPatch: null,
    founderProfile: null,
    productSpec: null,
    openQuestions: [],
    limitations: [],
    explanation: null,
    blocked: null,
  };
}

export interface Agent<I extends AgentInput = AgentInput> {
  readonly name: AgentName;
  /** One sentence: what this agent is for. Shown in the UI. */
  readonly mission: string;
  /** What it is explicitly not allowed to do. Shown in the UI. */
  readonly boundaries: string[];
  run(input: I, context: AgentContext): Promise<AgentResult>;
}
