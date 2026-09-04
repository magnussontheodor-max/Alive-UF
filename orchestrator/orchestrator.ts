import {
  AGENT_LABEL,
  AgentName,
  Assumption,
  Id,
  METHOD_LABEL,
  StageId,
  StartupMemory,
  Task,
  checkNarrative,
  evaluateGate,
  newId,
  now,
  openTask,
  selectNextAssumption,
  selectedOpportunity,
} from "@/domain";
import { Repositories, loadMemory } from "@/data";
import { getProvider } from "@/ai";
import { AgentResult } from "@/agents/types";
import { founderAgent } from "@/agents/founder-agent";
import { opportunityAgent } from "@/agents/opportunity-agent";
import { applyAgentResult, finishRun, startRun } from "./state-updates";

// ---------------------------------------------------------------------------
// The Orchestrator
//
// The loop from the spec, in order:
//
//   1. read startup state         → loadMemory
//   2. understand the stage       → evaluateGate
//   3. find what is missing       → gate requirements + open assumptions
//   4. find the riskiest belief   → selectNextAssumption
//   5. decide whether an agent should act
//   6. select the agent
//   7. apply structured updates   → applyAgentResult (grounding enforced)
//   8. create the next task
//
// Deliberately: no AI decides stage progression, no agent writes to memory,
// and exactly one task is open at a time.
// ---------------------------------------------------------------------------

export interface OrchestrationOutcome {
  memory: StartupMemory;
  task: Task | null;
  /** What the orchestrator did this cycle, for the activity log. */
  actions: string[];
  /** Set when the orchestrator cannot produce a next action, and why. */
  blocked: string | null;
}

export async function orchestrate(
  repos: Repositories,
  startupId: Id
): Promise<OrchestrationOutcome> {
  const memory = await loadMemory(repos, startupId);
  if (!memory) throw new Error(`Startup not found: ${startupId}`);

  const actions: string[] = [];

  // A task already open? Then the founder has work to do and the orchestrator
  // stays out of the way. One action at a time is the entire discipline.
  const existing = openTask(memory);
  if (existing) {
    return { memory, task: existing, actions, blocked: null };
  }

  const gate = evaluateGate(memory);

  // Step 5/6: does an agent need to act before a task can be created?
  const agentNeeded = decideAgent(memory, gate.canAdvance);

  if (agentNeeded) {
    const result = await runAgent(repos, memory, agentNeeded);
    if (result) {
      actions.push(result.summary);
      if (result.blocked) {
        // The agent honestly could not proceed. Surface it rather than
        // fabricating something to show.
        const task = await createFounderInputTask(repos, memory, result.blocked);
        const refreshed = await loadMemory(repos, startupId);
        return {
          memory: refreshed ?? memory,
          task,
          actions,
          blocked: result.blocked,
        };
      }
    }
  }

  // Reload after any agent writes.
  const current = (await loadMemory(repos, startupId)) ?? memory;

  // Step 8: create the single next action.
  const task = await createNextTask(repos, current);
  if (task) actions.push(`Next action set: ${task.title}`);

  return {
    memory: current,
    task,
    actions,
    blocked: task ? null : "Nothing to do next. This is unexpected — check the stage requirements.",
  };
}

// ---------------------------------------------------------------------------
// Step 5 + 6: which agent, if any, should act
// ---------------------------------------------------------------------------

function decideAgent(memory: StartupMemory, canAdvance: boolean): AgentName | null {
  const stage = memory.startup.stage;

  if (stage === "FOUNDER") {
    // The Founder Agent re-assesses whenever the profile has content but no
    // conclusions drawn from it yet.
    const profile = memory.founderProfile;
    if (profile && profile.domainExposure.length > 0 && profile.claims.length === 0) {
      return "FOUNDER_AGENT";
    }
    return null;
  }

  if (stage === "OPPORTUNITY") {
    if (memory.opportunities.length === 0 && memory.founderProfile) {
      return "OPPORTUNITY_AGENT";
    }
    return null;
  }

  // Later stages are handled by their own agents in subsequent phases.
  void canAdvance;
  return null;
}

async function runAgent(
  repos: Repositories,
  memory: StartupMemory,
  name: AgentName
): Promise<AgentResult | null> {
  const provider = getProvider();
  const profile = memory.founderProfile;
  if (!profile) return null;

  const run = await startRun(repos, memory.startup.id, name, `Stage: ${memory.startup.stage}`, {
    name: provider?.name ?? "deterministic",
    model: provider?.modelFor("reasoning") ?? "rules",
    role: "reasoning",
  });

  try {
    const context = { memory, provider };
    let result: AgentResult;

    switch (name) {
      case "FOUNDER_AGENT":
        result = await founderAgent.run({ profile }, context);
        break;
      case "OPPORTUNITY_AGENT":
        result = await opportunityAgent.run({ profile }, context);
        break;
      default:
        await finishRun(repos, run, {
          status: "FAILED",
          error: `No implementation for ${name} in this version.`,
        });
        return null;
    }

    const applied = await applyAgentResult(repos, memory.startup.id, result);

    await finishRun(repos, run, {
      status: result.blocked ? "REJECTED" : "SUCCESS",
      outputSummary: result.summary,
      stateChanges: applied.changes,
      error: result.blocked,
    });

    return result;
  } catch (error) {
    await finishRun(repos, run, {
      status: "FAILED",
      error: error instanceof Error ? error.message : "Unknown error",
    });
    throw error;
  }
}

// ---------------------------------------------------------------------------
// Step 8: the Next Best Action
// ---------------------------------------------------------------------------

async function createNextTask(
  repos: Repositories,
  memory: StartupMemory
): Promise<Task | null> {
  const stage = memory.startup.stage;
  const gate = evaluateGate(memory);
  const unmet = gate.requirements.filter((r) => !r.met);

  // While stage requirements are unmet, the next action is to meet them.
  // This is what stops the system from suggesting pricing experiments to
  // someone who has not yet described a problem.
  if (unmet.length > 0) {
    const blocker = unmet[0];
    const task = buildGateTask(memory, stage, blocker.id, blocker.label, blocker.detail);
    return repos.tasks.create(task);
  }

  // Requirements met: work the riskiest open assumption.
  const candidate = selectNextAssumption(memory);
  if (candidate.ranked) {
    const task = buildAssumptionTask(memory, candidate.ranked.assumption, {
      score: Math.round(candidate.ranked.score * 100),
      reasoning: candidate.ranked.reasoning,
      alternatives: candidate.alternatives,
    });
    return repos.tasks.create(task);
  }

  // Nothing open and the gate is clear: the next action is to advance.
  if (gate.canAdvance && gate.to) {
    return repos.tasks.create({
      id: newId("tsk"),
      startupId: memory.startup.id,
      title: `Move to ${gate.to.toLowerCase()}`,
      why: `Everything required at this stage has been done: ${gate.requirements
        .map((r) => r.label.toLowerCase())
        .join(", ")}.`,
      expectedOutcome: `The startup moves into ${gate.to.toLowerCase()}, where the next set of questions applies.`,
      assumptionId: null,
      experimentId: null,
      stage,
      agent: "ORCHESTRATOR",
      actor: "FOUNDER",
      founderAction: `Confirm you are ready to move on to ${gate.to.toLowerCase()}.`,
      successCriteria: ["You have reviewed what was learned at this stage."],
      estimatedMinutes: 5,
      status: "OPEN",
      priority: {
        score: 100,
        reasoning: "All requirements for this stage are met.",
        alternatives: [],
      },
      createdAt: now(),
      completedAt: null,
      outcomeNote: null,
    });
  }

  return null;
}

function buildGateTask(
  memory: StartupMemory,
  stage: StageId,
  requirementId: string,
  label: string,
  detail: string
): Task {
  const { title, action, outcome, minutes, agent } = gateTaskContent(
    stage,
    requirementId,
    memory
  );

  return {
    id: newId("tsk"),
    startupId: memory.startup.id,
    title,
    why: detail,
    expectedOutcome: outcome,
    assumptionId: null,
    experimentId: null,
    stage,
    agent,
    actor: "FOUNDER",
    founderAction: action,
    successCriteria: [label],
    estimatedMinutes: minutes,
    status: "OPEN",
    priority: {
      score: 100,
      reasoning: `This is required before ${stage.toLowerCase()} can be completed.`,
      alternatives: [],
    },
    createdAt: now(),
    completedAt: null,
    outcomeNote: null,
  };
}

function gateTaskContent(
  stage: StageId,
  requirementId: string,
  memory: StartupMemory
): {
  title: string;
  action: string;
  outcome: string;
  minutes: number;
  agent: AgentName;
} {
  const selected = selectedOpportunity(memory);

  const content: Record<string, ReturnType<typeof gateTaskContent>> = {
    profile: {
      title: "Tell Spark about your experience",
      action: "Answer the founder questions so there is something real to work from.",
      outcome: "A profile that opportunities can actually be built from.",
      minutes: 15,
      agent: "FOUNDER_AGENT",
    },
    domain: {
      title: "Describe where you have first-hand experience",
      action: "Name a setting you know from the inside — a job, an industry, a community.",
      outcome: "A domain to draw real problems from.",
      minutes: 10,
      agent: "FOUNDER_AGENT",
    },
    problems: {
      title: "Write down the problems you witnessed",
      action:
        "List what went wrong repeatedly where you worked. Don't filter for business potential.",
      outcome: "Observed problems that opportunities can be grounded in.",
      minutes: 15,
      agent: "FOUNDER_AGENT",
    },
    network: {
      title: "List the people you can reach",
      action: "Name the groups you could contact, and how many of each you could reach this week.",
      outcome: "A realistic picture of how cheaply you can test things.",
      minutes: 10,
      agent: "FOUNDER_AGENT",
    },
    constraints: {
      title: "Set your time and budget",
      action: "Enter the hours per week and the money you can genuinely commit.",
      outcome: "Recommendations that fit what you actually have.",
      minutes: 5,
      agent: "FOUNDER_AGENT",
    },
    generated: {
      title: "Generate opportunities from what you have seen",
      action: "Review the problems you recorded and let Spark build opportunities from them.",
      outcome: "A small set of problem-first opportunities to choose between.",
      minutes: 10,
      agent: "OPPORTUNITY_AGENT",
    },
    selected: {
      title: "Choose one opportunity to pursue",
      action:
        "Read each opportunity, including what is unknown about it, and pick the one you want to test.",
      outcome: "A single focus, so effort is not spread across three directions.",
      minutes: 20,
      agent: "ORCHESTRATOR",
    },
    approved: {
      title: "Confirm your choice",
      action: "Approve your selected opportunity so it is recorded as your decision.",
      outcome: "The decision and its reasoning are on record.",
      minutes: 5,
      agent: "ORCHESTRATOR",
    },
    assumptions: {
      title: "Write down what must be true",
      action: `Review the assumptions behind ${selected ? `"${selected.title}"` : "your chosen opportunity"} and add anything missing.`,
      outcome: "A clear list of beliefs that could sink this if wrong.",
      minutes: 15,
      agent: "OPPORTUNITY_AGENT",
    },
    evidence: {
      title: "Do the cheap research first",
      action:
        "Find out how this problem is handled today: who already sells something, what it costs, what people use instead.",
      outcome: "Evidence that either supports the opportunity or saves you weeks.",
      minutes: 90,
      agent: "RESEARCH_AGENT",
    },
    important: {
      title: "Identify what would sink this",
      action: "Mark which assumptions would end the whole direction if they turned out false.",
      outcome: "A prioritised list of risks worth testing.",
      minutes: 15,
      agent: "RESEARCH_AGENT",
    },
  };

  return (
    content[requirementId] ?? {
      title: "Complete what this stage requires",
      action: "Review the stage requirements and fill the gap.",
      outcome: "The stage requirements are met.",
      minutes: 20,
      agent: "ORCHESTRATOR",
    }
  );
}

function buildAssumptionTask(
  memory: StartupMemory,
  assumption: Assumption,
  priority: Task["priority"]
): Task {
  const agent: AgentName =
    memory.startup.stage === "RESEARCH" ? "RESEARCH_AGENT" : "VALIDATION_AGENT";

  const method = METHOD_LABEL[assumption.validationMethod];
  const title =
    assumption.validationMethod === "UNKNOWN"
      ? "Decide how to test your riskiest assumption"
      : `Test: ${truncate(assumption.statement, 60)}`;

  const why = `${assumption.importanceReason} ${assumption.confidence.explanation}`.trim();

  // The narrative guard: if the generated reason reads like generic advice,
  // it does not go out.
  const problem = checkNarrative(why);
  const safeWhy = problem
    ? `This assumption is currently ${assumption.status.toLowerCase().replace(/_/g, " ")} and rated ${assumption.importance.toLowerCase()} importance.`
    : why;

  return {
    id: newId("tsk"),
    startupId: memory.startup.id,
    title,
    why: safeWhy,
    expectedOutcome: `Enough evidence to move "${truncate(assumption.statement, 50)}" out of ${assumption.status.toLowerCase().replace(/_/g, " ")}.`,
    assumptionId: assumption.id,
    experimentId: assumption.experimentId,
    stage: memory.startup.stage,
    agent,
    actor: "BOTH",
    founderAction:
      assumption.validationMethod === "UNKNOWN"
        ? "Choose how this could realistically be tested with the time and access you have."
        : `Run a ${method.toLowerCase()} focused on this one question.`,
    successCriteria: [
      "Evidence recorded for or against the assumption",
      "The assumption's status updated to reflect what you found",
    ],
    estimatedMinutes: estimateMinutes(assumption),
    status: "OPEN",
    priority,
    createdAt: now(),
    completedAt: null,
    outcomeNote: null,
  };
}

function estimateMinutes(assumption: Assumption): number {
  switch (assumption.validationMethod) {
    case "DESK_RESEARCH":
      return 60;
    case "CUSTOMER_INTERVIEW":
      return 180;
    case "LANDING_PAGE":
    case "FAKE_DOOR":
    case "WAITLIST":
      return 240;
    case "PRICING_TEST":
      return 180;
    case "CONCIERGE":
    case "PROTOTYPE_TEST":
    case "PRE_ORDER":
      return 480;
    default:
      return 30;
  }
}

async function createFounderInputTask(
  repos: Repositories,
  memory: StartupMemory,
  blocked: string
): Promise<Task> {
  return repos.tasks.create({
    id: newId("tsk"),
    startupId: memory.startup.id,
    title: "More detail needed before Spark can help",
    why: blocked,
    expectedOutcome: "Enough recorded observation to work from.",
    assumptionId: null,
    experimentId: null,
    stage: memory.startup.stage,
    agent: "FOUNDER_AGENT",
    actor: "FOUNDER",
    founderAction: "Add the missing detail to your founder profile.",
    successCriteria: ["The gap described above is filled"],
    estimatedMinutes: 15,
    status: "OPEN",
    priority: {
      score: 100,
      reasoning: "Nothing else can proceed without this.",
      alternatives: [],
    },
    createdAt: now(),
    completedAt: null,
    outcomeNote: null,
  });
}

function truncate(text: string, max: number): string {
  return text.length <= max ? text : `${text.slice(0, max - 1)}…`;
}

export { AGENT_LABEL };
