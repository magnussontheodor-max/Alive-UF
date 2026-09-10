import {
  AgentRun,
  Claim,
  Id,
  computeAssumptionConfidence,
  groundClaims,
  newId,
  now,
} from "@/domain";
import { Repositories } from "@/data";
import { AgentResult } from "@/agents/types";

// ---------------------------------------------------------------------------
// Applying agent results to Startup Memory
//
// This is the only place where agent output becomes persisted state, and it is
// where the grounding rules are enforced. An agent can propose whatever it
// likes; what actually lands in memory is filtered here.
// ---------------------------------------------------------------------------

export interface AppliedChanges {
  changes: string[];
  rejectedClaims: { statement: string; reason: string }[];
  demotedClaims: { statement: string; reason: string }[];
}

export async function applyAgentResult(
  repos: Repositories,
  startupId: Id,
  result: AgentResult
): Promise<AppliedChanges> {
  const changes: string[] = [];
  const rejectedClaims: { statement: string; reason: string }[] = [];
  const demotedClaims: { statement: string; reason: string }[] = [];

  // 1. Evidence first — claims can only be grounded in evidence that exists.
  for (const evidence of result.evidence) {
    await repos.evidence.create(evidence);
  }
  if (result.evidence.length > 0) {
    changes.push(`${result.evidence.length} piece(s) of evidence recorded`);
  }

  // 2. Ground every claim against the evidence now in memory.
  const existingEvidence = await repos.evidence.listByStartup(startupId);
  const evidenceIds = new Set(existingEvidence.map((e) => e.id));

  const grounded = groundClaims(collectClaims(result), evidenceIds);
  rejectedClaims.push(
    ...grounded.rejected.map((r) => ({
      statement: r.claim.statement,
      reason: r.reason,
    }))
  );
  demotedClaims.push(
    ...grounded.demoted.map((d) => ({
      statement: d.claim.statement,
      reason: d.reason,
    }))
  );

  const acceptedById = new Map(grounded.accepted.map((c) => [c.id, c]));
  const keep = (claims: Claim[]) =>
    claims.map((c) => acceptedById.get(c.id)).filter((c): c is Claim => Boolean(c));

  if (grounded.rejected.length > 0) {
    changes.push(
      `${grounded.rejected.length} unsupported statement(s) discarded before saving`
    );
  }

  // 3. Founder profile.
  if (result.founderProfile) {
    await repos.profiles.upsert({
      ...result.founderProfile,
      claims: keep(result.founderProfile.claims),
    });
    changes.push("Founder profile updated");
  }

  // 4. Opportunities.
  for (const opportunity of result.opportunities) {
    await repos.opportunities.create({
      ...opportunity,
      claims: keep(opportunity.claims),
    });
  }
  if (result.opportunities.length > 0) {
    changes.push(`${result.opportunities.length} opportunity(ies) added`);
  }

  // 5. Assumptions.
  for (const assumption of result.assumptions) {
    await repos.assumptions.create(assumption);
  }
  if (result.assumptions.length > 0) {
    changes.push(`${result.assumptions.length} assumption(s) identified`);
  }

  // 6. Experiments.
  for (const experiment of result.experiments) {
    await repos.experiments.create(experiment);
  }
  if (result.experiments.length > 0) {
    changes.push(`${result.experiments.length} experiment(s) designed`);
  }

  // 7. Decisions the agent recommends are recorded as system recommendations,
  //    never as founder decisions.
  for (const decision of result.decisions) {
    await repos.decisions.create(decision);
    changes.push("Decision recorded");
  }

  // 8. Product spec.
  if (result.productSpec) {
    await repos.productSpecs.upsert(result.productSpec);
    changes.push("MVP specification updated");
  }

  // 9. Direct startup patch.
  if (result.startupPatch) {
    await repos.startups.update(startupId, {
      ...result.startupPatch,
      updatedAt: now(),
    });
    changes.push("Startup details updated");
  }

  // 10. Recompute confidence on every assumption touched by new evidence.
  await refreshAssumptionConfidence(repos, startupId);

  return { changes, rejectedClaims, demotedClaims };
}

function collectClaims(result: AgentResult): Claim[] {
  return [
    ...result.claims,
    ...(result.founderProfile?.claims ?? []),
    ...result.opportunities.flatMap((o) => o.claims),
  ];
}

/**
 * Confidence is derived, never stored by an agent. Recomputing after every
 * change keeps it impossible for a stale figure to linger in the UI.
 */
export async function refreshAssumptionConfidence(
  repos: Repositories,
  startupId: Id
): Promise<void> {
  const [assumptions, evidence] = await Promise.all([
    repos.assumptions.listByStartup(startupId),
    repos.evidence.listByStartup(startupId),
  ]);

  for (const assumption of assumptions) {
    const computed = computeAssumptionConfidence(assumption, evidence);
    const supporting = evidence
      .filter((e) => e.supports.includes(assumption.id))
      .map((e) => e.id);
    const contradicting = evidence
      .filter((e) => e.contradicts.includes(assumption.id))
      .map((e) => e.id);

    const changed =
      assumption.confidence.level !== computed.confidence.level ||
      assumption.supportingEvidenceIds.length !== supporting.length ||
      assumption.contradictingEvidenceIds.length !== contradicting.length;

    if (changed) {
      await repos.assumptions.update(assumption.id, {
        confidence: computed.confidence,
        supportingEvidenceIds: supporting,
        contradictingEvidenceIds: contradicting,
        updatedAt: now(),
      });
    }
  }
}

// ---------------------------------------------------------------------------
// Agent run logging
// ---------------------------------------------------------------------------

export async function startRun(
  repos: Repositories,
  startupId: Id,
  agent: AgentRun["agent"],
  inputSummary: string,
  provider: { name: string; model: string; role: AgentRun["role"] }
): Promise<AgentRun> {
  return repos.agentRuns.create({
    id: newId("run"),
    startupId,
    agent,
    provider: provider.name,
    model: provider.model,
    role: provider.role,
    inputSummary,
    outputSummary: "",
    inputTokens: 0,
    outputTokens: 0,
    estimatedCostSek: 0,
    durationMs: 0,
    status: "RUNNING",
    error: null,
    stateChanges: [],
    startedAt: now(),
    finishedAt: null,
  });
}

export async function finishRun(
  repos: Repositories,
  run: AgentRun,
  patch: Partial<AgentRun>
): Promise<void> {
  const startedAt = new Date(run.startedAt).getTime();
  await repos.agentRuns.update(run.id, {
    ...patch,
    durationMs: Date.now() - startedAt,
    finishedAt: now(),
  });
}
