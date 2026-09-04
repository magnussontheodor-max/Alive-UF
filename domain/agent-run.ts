import { Id } from "./primitives";
import { AgentName } from "./task";

// ---------------------------------------------------------------------------
// Agent runs
//
// Every agent invocation is recorded: what it was asked, what it produced, what
// it cost, and how long it took. Cost data is estimated rather than billed, but
// the model exists from day one so the numbers are real as soon as a live
// provider is connected.
// ---------------------------------------------------------------------------

export interface AgentRun {
  id: Id;
  startupId: Id;

  agent: AgentName;
  provider: string;
  model: string;
  /** Which capability tier was requested. */
  role: "reasoning" | "fast" | "research";

  /** Short summary of the input, for the activity log. Not the raw prompt. */
  inputSummary: string;
  /** Short summary of what came back. Never raw chain-of-thought. */
  outputSummary: string;

  inputTokens: number;
  outputTokens: number;
  estimatedCostSek: number;
  durationMs: number;

  status: AgentRunStatus;
  error: string | null;

  /** What changed in Startup Memory as a result. */
  stateChanges: string[];

  startedAt: string;
  finishedAt: string | null;
}

export type AgentRunStatus = "RUNNING" | "SUCCESS" | "FAILED" | "REJECTED";

export const RUN_STATUS_LABEL: Record<AgentRunStatus, string> = {
  RUNNING: "Running",
  SUCCESS: "Completed",
  FAILED: "Failed",
  REJECTED: "Output rejected",
};
