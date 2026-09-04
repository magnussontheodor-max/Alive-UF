"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  Assumption,
  AssumptionStatus,
  DomainExposure,
  Evidence,
  EvidenceSourceType,
  FounderProfile,
  NetworkAccess,
  ObservedProblem,
  Opportunity,
  SOURCE_TYPE_BASE_RELIABILITY,
  confidence,
  newId,
  now,
} from "@/domain";
import { getRepositories, loadMemory } from "@/data";
import { orchestrate, refreshAssumptionConfidence } from "@/orchestrator";
import { createStartup, getCurrentStartup } from "@/lib/current";
import { requireSession } from "@/lib/session";
import { seedDemoStartup } from "@/lib/demo-seed";
import { markAnswered } from "@/lib/interview-state";

// ---------------------------------------------------------------------------
// Server actions
//
// The only write path from the UI. Each one mutates state, then asks the
// orchestrator to work out what should happen next — the loop from the spec,
// driven by real user events rather than a timer.
// ---------------------------------------------------------------------------

function refresh() {
  revalidatePath("/", "layout");
}

// --- startup lifecycle -----------------------------------------------------

export async function createStartupAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  await createStartup(name);
  refresh();
  redirect("/founder");
}

export async function seedDemoAction() {
  await seedDemoStartup();
  refresh();
  redirect("/");
}

export async function resetWorkspaceAction() {
  const session = await requireSession();
  const repos = getRepositories();
  const startups = await repos.startups.listByFounder(session.founder.id);
  for (const startup of startups) {
    await repos.startups.update(startup.id, { name: `${startup.name} (archived)` });
  }
  refresh();
}

// --- founder interview -----------------------------------------------------

/**
 * Records one interview answer. Each question knows which field it fills, so
 * answers land in structured form rather than as chat history.
 */
export async function answerInterviewAction(formData: FormData) {
  const questionId = String(formData.get("questionId") ?? "");
  const answer = String(formData.get("answer") ?? "").trim();
  const targetId = String(formData.get("targetId") ?? "");
  const skipped = String(formData.get("skip") ?? "") === "true";

  const startup = await getCurrentStartup();
  if (!startup) return;

  const repos = getRepositories();
  const profile = await repos.profiles.getByStartup(startup.id);
  if (!profile) return;

  const updated = applyAnswer(profile, questionId, answer, targetId, skipped);
  await repos.profiles.upsert(updated);

  await orchestrate(repos, startup.id);
  refresh();
}

function applyAnswer(
  profile: FounderProfile,
  questionId: string,
  answer: string,
  targetId: string,
  skipped: boolean
): FounderProfile {
  const timestamp = now();
  const next: FounderProfile = {
    ...profile,
    // Claims are cleared whenever new input arrives, so the Founder Agent
    // re-derives them rather than accumulating stale conclusions.
    claims: [],
    updatedAt: timestamp,
  };

  const lines = answer
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  if (!skipped) {
    if (questionId === "domain.first" || questionId === "domain.second") {
      if (answer) {
        next.domainExposure = [
          ...profile.domainExposure,
          {
            id: newId("dom"),
            domain: answer,
            howAcquired: "",
            yearsExposure: null,
            observedProblems: [],
          } satisfies DomainExposure,
        ];
      }
    } else if (questionId.startsWith("domain.") && questionId.endsWith(".how")) {
      next.domainExposure = profile.domainExposure.map((d) =>
        d.id === targetId ? { ...d, howAcquired: answer } : d
      );
    } else if (questionId.startsWith("domain.") && questionId.endsWith(".years")) {
      next.domainExposure = profile.domainExposure.map((d) =>
        d.id === targetId ? { ...d, yearsExposure: Number(answer) || 0 } : d
      );
    } else if (questionId.startsWith("domain.") && questionId.endsWith(".problems")) {
      next.domainExposure = profile.domainExposure.map((d) =>
        d.id === targetId
          ? {
              ...d,
              observedProblems: lines.map(
                (line): ObservedProblem => ({
                  id: newId("prb"),
                  description: line,
                  whoHasIt: "",
                  howFounderKnows: "",
                  frequency: "UNKNOWN",
                  founderPerceivedSeverity: "UNKNOWN",
                })
              ),
            }
          : d
      );
    } else if (questionId.startsWith("problem.")) {
      const field = questionId.split(".").pop();
      next.domainExposure = profile.domainExposure.map((d) => ({
        ...d,
        observedProblems: d.observedProblems.map((p) => {
          if (p.id !== targetId) return p;
          if (field === "who") return { ...p, whoHasIt: answer };
          if (field === "how") return { ...p, howFounderKnows: answer };
          if (field === "frequency")
            return { ...p, frequency: answer as ObservedProblem["frequency"] };
          if (field === "severity")
            return {
              ...p,
              founderPerceivedSeverity: answer as ObservedProblem["founderPerceivedSeverity"],
            };
          return p;
        }),
      }));
    } else if (questionId === "network.first") {
      if (answer) {
        next.networkAccess = [
          ...profile.networkAccess,
          {
            id: newId("net"),
            group: answer,
            reachableThisWeek: 0,
            relationship: "",
            verified: false,
          } satisfies NetworkAccess,
        ];
      }
    } else if (questionId.startsWith("network.") && questionId.endsWith(".count")) {
      next.networkAccess = profile.networkAccess.map((n) =>
        n.id === targetId ? { ...n, reachableThisWeek: Number(answer) || 0 } : n
      );
    } else if (questionId.startsWith("network.") && questionId.endsWith(".relationship")) {
      next.networkAccess = profile.networkAccess.map((n) =>
        n.id === targetId ? { ...n, relationship: answer } : n
      );
    } else if (questionId === "constraints.hours") {
      next.constraints = { ...profile.constraints, hoursPerWeek: Number(answer) || 0 };
    } else if (questionId === "constraints.budget") {
      next.constraints = { ...profile.constraints, budgetSek: Number(answer) || 0 };
    } else if (questionId === "constraints.technical") {
      next.constraints = {
        ...profile.constraints,
        technicalAbility: answer as FounderProfile["constraints"]["technicalAbility"],
      };
    } else if (questionId === "constraints.hard") {
      next.constraints = { ...profile.constraints, hardConstraints: lines };
    } else if (questionId === "motivation.goal") {
      next.motivation = {
        ...profile.motivation,
        goal: answer as FounderProfile["motivation"]["goal"],
      };
    } else if (questionId === "motivation.statement") {
      next.motivation = { ...profile.motivation, statement: answer };
    } else if (questionId === "preferences.b2b") {
      next.preferences = {
        ...profile.preferences,
        b2bOrB2c: answer as FounderProfile["preferences"]["b2bOrB2c"],
      };
    } else if (questionId === "preferences.excluded") {
      next.preferences = { ...profile.preferences, industriesExcluded: lines };
    }
  }

  markAnswered(profile.id, questionId);
  return next;
}

// --- orchestration ---------------------------------------------------------

export async function runOrchestratorAction() {
  const startup = await getCurrentStartup();
  if (!startup) return;
  await orchestrate(getRepositories(), startup.id);
  refresh();
}

// --- opportunities ---------------------------------------------------------

export async function selectOpportunityAction(formData: FormData) {
  const opportunityId = String(formData.get("opportunityId") ?? "");
  const reason = String(formData.get("reason") ?? "").trim();

  const startup = await getCurrentStartup();
  if (!startup || !opportunityId) return;

  const repos = getRepositories();
  const memory = await loadMemory(repos, startup.id);
  if (!memory) return;

  const chosen = memory.opportunities.find((o) => o.id === opportunityId);
  if (!chosen) return;

  // Deselect any previous choice.
  for (const opportunity of memory.opportunities) {
    if (opportunity.id === opportunityId) continue;
    if (opportunity.status === "SELECTED") {
      await repos.opportunities.update(opportunity.id, { status: "PARKED", updatedAt: now() });
    }
  }

  await repos.opportunities.update(opportunityId, {
    status: "SELECTED",
    approval: "FOUNDER_APPROVED",
    updatedAt: now(),
  });

  await repos.startups.update(startup.id, {
    selectedOpportunityId: opportunityId,
    problem: {
      value: chosen.problem,
      source: "OPPORTUNITY",
      confidence: chosen.confidence,
      updatedAt: now(),
    },
    targetCustomer: {
      value: chosen.customer,
      source: "OPPORTUNITY",
      confidence: chosen.confidence,
      updatedAt: now(),
    },
    updatedAt: now(),
  });

  // The founder's decision is recorded with their reasoning, not the system's.
  await repos.decisions.create({
    id: newId("dec"),
    startupId: startup.id,
    type: "OPPORTUNITY_SELECTED",
    decision: `Pursue: ${chosen.title}`,
    reason: reason || "No reason given.",
    evidenceIds: chosen.confidence.basis,
    alternativesConsidered: memory.opportunities
      .filter((o) => o.id !== opportunityId)
      .map((o) => ({ option: o.title, whyNot: "Not chosen." })),
    confidence: chosen.confidence,
    madeBy: "FOUNDER",
    systemRecommendation: topScoring(memory.opportunities)?.title ?? null,
    wouldChangeIf:
      "The problem turns out not to exist outside your own experience, or you cannot reach the affected people.",
    createdAt: now(),
  });

  await orchestrate(repos, startup.id);
  refresh();
  redirect("/");
}

function topScoring(opportunities: Opportunity[]): Opportunity | null {
  return (
    [...opportunities].sort((a, b) => b.score.total - a.score.total)[0] ?? null
  );
}

export async function discardOpportunityAction(formData: FormData) {
  const opportunityId = String(formData.get("opportunityId") ?? "");
  const reason = String(formData.get("reason") ?? "").trim();
  const startup = await getCurrentStartup();
  if (!startup || !opportunityId) return;

  const repos = getRepositories();
  await repos.opportunities.update(opportunityId, {
    status: "DISCARDED",
    approval: "FOUNDER_REJECTED",
    updatedAt: now(),
  });

  await repos.decisions.create({
    id: newId("dec"),
    startupId: startup.id,
    type: "OPPORTUNITY_DISCARDED",
    decision: "Discarded an opportunity",
    reason: reason || "No reason given.",
    evidenceIds: [],
    alternativesConsidered: [],
    confidence: confidence("NONE", "A judgement call by the founder."),
    madeBy: "FOUNDER",
    systemRecommendation: null,
    wouldChangeIf: null,
    createdAt: now(),
  });

  refresh();
}

// --- assumptions and evidence ---------------------------------------------

export async function addEvidenceAction(formData: FormData) {
  const startup = await getCurrentStartup();
  if (!startup) return;

  const claim = String(formData.get("claim") ?? "").trim();
  if (!claim) return;

  const sourceType = String(formData.get("sourceType") ?? "USER_INPUT") as EvidenceSourceType;
  const assumptionId = String(formData.get("assumptionId") ?? "");
  const direction = String(formData.get("direction") ?? "supports");

  const repos = getRepositories();
  const evidence: Evidence = {
    id: newId("ev"),
    startupId: startup.id,
    claim,
    source: String(formData.get("source") ?? "").trim() || "Not stated",
    sourceType,
    epistemicStatus:
      (String(formData.get("epistemicStatus") ?? "FACT") as Evidence["epistemicStatus"]) ?? "FACT",
    reliability: SOURCE_TYPE_BASE_RELIABILITY[sourceType] ?? "MEDIUM",
    relevance: "HIGH",
    supports: assumptionId && direction === "supports" ? [assumptionId] : [],
    contradicts: assumptionId && direction === "contradicts" ? [assumptionId] : [],
    detail: String(formData.get("detail") ?? "").trim() || null,
    recordedBy: "FOUNDER",
    agentName: null,
    observedAt: now(),
    createdAt: now(),
  };

  await repos.evidence.create(evidence);
  await refreshAssumptionConfidence(repos, startup.id);
  refresh();
}

export async function addAssumptionAction(formData: FormData) {
  const startup = await getCurrentStartup();
  if (!startup) return;

  const statement = String(formData.get("statement") ?? "").trim();
  if (!statement) return;

  const repos = getRepositories();
  const assumption: Assumption = {
    id: newId("asm"),
    startupId: startup.id,
    opportunityId: startup.selectedOpportunityId,
    statement,
    category: String(formData.get("category") ?? "PROBLEM") as Assumption["category"],
    importance: String(formData.get("importance") ?? "MEDIUM") as Assumption["importance"],
    importanceReason:
      String(formData.get("importanceReason") ?? "").trim() ||
      "Added by the founder without a stated reason.",
    status: "UNTESTED",
    confidence: confidence("NONE", "Nothing recorded yet."),
    supportingEvidenceIds: [],
    contradictingEvidenceIds: [],
    validationMethod: String(formData.get("validationMethod") ?? "UNKNOWN") as Assumption["validationMethod"],
    experimentId: null,
    createdBy: "FOUNDER",
    agentName: null,
    createdAt: now(),
    updatedAt: now(),
  };

  await repos.assumptions.create(assumption);
  refresh();
}

export async function updateAssumptionStatusAction(formData: FormData) {
  const startup = await getCurrentStartup();
  const assumptionId = String(formData.get("assumptionId") ?? "");
  const status = String(formData.get("status") ?? "") as AssumptionStatus;
  if (!startup || !assumptionId || !status) return;

  const repos = getRepositories();
  await repos.assumptions.update(assumptionId, { status, updatedAt: now() });
  await orchestrate(repos, startup.id);
  refresh();
}

// --- tasks -----------------------------------------------------------------

export async function completeTaskAction(formData: FormData) {
  const startup = await getCurrentStartup();
  const taskId = String(formData.get("taskId") ?? "");
  const note = String(formData.get("note") ?? "").trim();
  if (!startup || !taskId) return;

  const repos = getRepositories();
  await repos.tasks.update(taskId, {
    status: "COMPLETE",
    completedAt: now(),
    outcomeNote: note || null,
  });

  await orchestrate(repos, startup.id);
  refresh();
}

export async function skipTaskAction(formData: FormData) {
  const startup = await getCurrentStartup();
  const taskId = String(formData.get("taskId") ?? "");
  const reason = String(formData.get("reason") ?? "").trim();
  if (!startup || !taskId) return;

  const repos = getRepositories();
  await repos.tasks.update(taskId, {
    status: "SKIPPED",
    completedAt: now(),
    outcomeNote: reason || "Skipped without a reason.",
  });

  await orchestrate(repos, startup.id);
  refresh();
}

// --- stage advance ---------------------------------------------------------

export async function advanceStageAction() {
  const startup = await getCurrentStartup();
  if (!startup) return;

  const repos = getRepositories();
  const memory = await loadMemory(repos, startup.id);
  if (!memory) return;

  const { evaluateGate } = await import("@/domain");
  const gate = evaluateGate(memory);
  if (!gate.canAdvance || !gate.to) return;

  await repos.startups.update(startup.id, {
    stage: gate.to,
    stageStatus: "IN_PROGRESS",
    updatedAt: now(),
  });

  await repos.decisions.create({
    id: newId("dec"),
    startupId: startup.id,
    type: "STAGE_ADVANCED",
    decision: `Moved from ${gate.from} to ${gate.to}`,
    reason: gate.requirements.map((r) => r.label).join("; "),
    evidenceIds: [],
    alternativesConsidered: [],
    confidence: confidence("NONE", "A stage change, not a claim about the business."),
    madeBy: "FOUNDER",
    systemRecommendation: `Requirements for ${gate.from} were met.`,
    wouldChangeIf: null,
    createdAt: now(),
  });

  await orchestrate(repos, startup.id);
  refresh();
}
