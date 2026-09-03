// ---------------------------------------------------------------------------
// Orchestrator (mocked)
//
// In the real system, the Orchestrator is the only thing that talks to every
// part of the startup. It never lets an Agent act on its own. Its loop is:
//
//   1. Read startup state (Startup Memory)
//   2. Understand the current stage
//   3. Determine the next best action
//   4. Select the appropriate Agent for that action
//   5. Save the result to Startup Memory
//   6. Update startup progress
//   7. Create the next Task
//
// For the prototype this is entirely mocked: `decideNextAction` just reads
// the current stage and highest-risk assumption from mock data and returns a
// canned Task. The function signature and step-by-step shape are written so
// a real implementation (backed by an LLM + a real Startup Memory store)
// can slot in later without the UI layer changing.
// ---------------------------------------------------------------------------

import { agents, nextTask, startupMemory } from "./mock-data";
import { Agent, AgentId, StartupMemory, Task } from "./types";

export function getAgent(id: AgentId): Agent {
  const agent = agents.find((a) => a.id === id);
  if (!agent) throw new Error(`Unknown agent: ${id}`);
  return agent;
}

export interface OrchestratorDecision {
  task: Task;
  agent: Agent;
  memory: StartupMemory;
}

/**
 * Mocked version of the Orchestrator's core decision loop.
 * A real implementation would inspect `memory` (evidence, assumptions,
 * stage) and reason about which agent + action best reduces the startup's
 * biggest risk right now.
 */
export function decideNextAction(memory: StartupMemory = startupMemory): OrchestratorDecision {
  return {
    task: nextTask,
    agent: getAgent(nextTask.agent),
    memory,
  };
}

export function highestRiskAssumption(memory: StartupMemory = startupMemory) {
  const rank = { high: 0, medium: 1, low: 2 };
  const openStatuses = new Set(["untested", "testing", "partially validated"]);
  return [...memory.assumptions]
    .filter((a) => openStatuses.has(a.status))
    .sort((a, b) => rank[a.risk] - rank[b.risk])[0];
}
