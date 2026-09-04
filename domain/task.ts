import { Id } from "./primitives";
import { StageId } from "./startup";

// ---------------------------------------------------------------------------
// Next Best Action
//
// There is exactly one open primary task per startup, ever. That constraint is
// the product: a first-time founder's real problem is not a shortage of things
// they could do, it is not knowing which one matters.
// ---------------------------------------------------------------------------

export type AgentName =
  | "FOUNDER_AGENT"
  | "OPPORTUNITY_AGENT"
  | "RESEARCH_AGENT"
  | "VALIDATION_AGENT"
  | "PRODUCT_AGENT"
  | "ORCHESTRATOR";

export const AGENT_LABEL: Record<AgentName, string> = {
  FOUNDER_AGENT: "Founder Agent",
  OPPORTUNITY_AGENT: "Opportunity Agent",
  RESEARCH_AGENT: "Research Agent",
  VALIDATION_AGENT: "Validation Agent",
  PRODUCT_AGENT: "Product Agent",
  ORCHESTRATOR: "Orchestrator",
};

/** Who has to do the work. Determines what the task screen shows. */
export type ActorKind = "FOUNDER" | "SYSTEM" | "BOTH";

export interface Task {
  id: Id;
  startupId: Id;

  title: string;
  /** Why this matters — must name the uncertainty it reduces. */
  why: string;
  /** What we expect to learn. Not what we hope will happen. */
  expectedOutcome: string;

  /** The assumption this action exists to resolve, if any. */
  assumptionId: Id | null;
  /** The experiment this task runs, if any. */
  experimentId: Id | null;

  stage: StageId;
  agent: AgentName;
  actor: ActorKind;

  /** Concretely what the founder does. Actionable today, not a theme. */
  founderAction: string | null;
  successCriteria: string[];
  estimatedMinutes: number;

  status: TaskStatus;
  /** Ranking score from the Next Best Action engine, with its reasoning. */
  priority: TaskPriority;

  createdAt: string;
  completedAt: string | null;
  outcomeNote: string | null;
}

export type TaskStatus = "OPEN" | "IN_PROGRESS" | "COMPLETE" | "SKIPPED";

export interface TaskPriority {
  score: number;
  /** Human-readable breakdown of why this beat everything else. */
  reasoning: string;
  /** The runners-up, so the founder can see the system considered alternatives. */
  alternatives: { title: string; score: number; whyNot: string }[];
}
