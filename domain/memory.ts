import { Assumption, isOpen } from "./assumption";
import { Decision } from "./decision";
import { Evidence } from "./evidence";
import { Experiment } from "./experiment";
import { FounderProfile } from "./founder";
import { Opportunity } from "./opportunity";
import { ProductSpec } from "./product";
import { Claim } from "./primitives";
import { Startup } from "./startup";
import { Task } from "./task";

// ---------------------------------------------------------------------------
// Startup Memory
//
// The complete state of what the system understands about one startup. Every
// agent reads this; the orchestrator is the only thing that writes to it.
//
// `StartupMemory` is assembled from the repositories rather than stored as a
// blob, so there is exactly one source of truth for each fact.
// ---------------------------------------------------------------------------

export interface StartupMemory {
  startup: Startup;
  founderProfile: FounderProfile | null;
  opportunities: Opportunity[];
  assumptions: Assumption[];
  evidence: Evidence[];
  decisions: Decision[];
  experiments: Experiment[];
  productSpec: ProductSpec | null;
  tasks: Task[];
}

/**
 * The founder-facing view of memory: what we know, what we believe, and what we
 * still need to learn. Derived, never stored — so it can never drift out of
 * sync with the underlying evidence.
 */
export interface MemoryView {
  known: Claim[];
  believed: Claim[];
  needToLearn: OpenQuestion[];
  risks: MemoryRisk[];
  decisions: Decision[];
}

export interface OpenQuestion {
  question: string;
  whyItMatters: string;
  assumptionId: string | null;
  /** How it could be answered. */
  howToAnswer: string;
}

export interface MemoryRisk {
  statement: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  source: string;
}

export function buildMemoryView(memory: StartupMemory): MemoryView {
  const allClaims: Claim[] = [
    ...(memory.founderProfile?.claims ?? []),
    ...memory.opportunities.flatMap((o) => o.claims),
  ];

  const known = allClaims.filter((c) => c.status === "FACT");
  const believed = allClaims.filter(
    (c) => c.status === "INFERENCE" || c.status === "HYPOTHESIS"
  );

  const needToLearn: OpenQuestion[] = memory.assumptions
    .filter(isOpen)
    .map((a) => ({
      question: a.statement,
      whyItMatters: a.importanceReason,
      assumptionId: a.id,
      howToAnswer:
        a.validationMethod === "UNKNOWN"
          ? "No test designed yet."
          : `Test method: ${a.validationMethod.toLowerCase().replace(/_/g, " ")}.`,
    }));

  const risks: MemoryRisk[] = [
    ...memory.opportunities
      .filter((o) => o.status === "SELECTED")
      .flatMap((o) =>
        o.risks.map((r) => ({
          statement: r.statement,
          severity: r.severity,
          source: `Opportunity: ${o.title}`,
        }))
      ),
    ...memory.assumptions
      .filter((a) => a.status === "REJECTED")
      .map((a) => ({
        statement: `Rejected assumption still affecting the plan: ${a.statement}`,
        severity: "HIGH" as const,
        source: "Validation",
      })),
  ];

  return { known, believed, needToLearn, risks, decisions: memory.decisions };
}

export function openAssumptions(memory: StartupMemory): Assumption[] {
  return memory.assumptions.filter(isOpen);
}

export function openTask(memory: StartupMemory): Task | null {
  return (
    memory.tasks.find((t) => t.status === "OPEN" || t.status === "IN_PROGRESS") ??
    null
  );
}

export function selectedOpportunity(memory: StartupMemory): Opportunity | null {
  if (!memory.startup.selectedOpportunityId) return null;
  return (
    memory.opportunities.find(
      (o) => o.id === memory.startup.selectedOpportunityId
    ) ?? null
  );
}

export function evidenceFor(memory: StartupMemory, assumptionId: string) {
  return {
    supporting: memory.evidence.filter((e) => e.supports.includes(assumptionId)),
    contradicting: memory.evidence.filter((e) =>
      e.contradicts.includes(assumptionId)
    ),
  };
}
