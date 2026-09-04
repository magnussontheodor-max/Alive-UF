import {
  AgentRun,
  Assumption,
  Decision,
  Evidence,
  Experiment,
  Founder,
  FounderProfile,
  Id,
  Opportunity,
  ProductSpec,
  Startup,
  StartupMemory,
  Task,
} from "@/domain";

// ---------------------------------------------------------------------------
// Repository interfaces
//
// The only contract between the application and persistence. Two
// implementations exist:
//
//   data/local     — in-process store, used when Supabase is not configured.
//                    Lets the whole product run and be demoed with no backend.
//   data/supabase  — Postgres via Supabase, with row level security.
//
// Nothing above this layer knows or cares which one is active.
// ---------------------------------------------------------------------------

export interface FounderRepository {
  getByUserId(userId: string): Promise<Founder | null>;
  create(founder: Founder): Promise<Founder>;
  update(id: Id, patch: Partial<Founder>): Promise<Founder>;
}

export interface StartupRepository {
  listByFounder(founderId: Id): Promise<Startup[]>;
  get(id: Id): Promise<Startup | null>;
  create(startup: Startup): Promise<Startup>;
  update(id: Id, patch: Partial<Startup>): Promise<Startup>;
}

export interface FounderProfileRepository {
  getByStartup(startupId: Id): Promise<FounderProfile | null>;
  upsert(profile: FounderProfile): Promise<FounderProfile>;
}

export interface OpportunityRepository {
  listByStartup(startupId: Id): Promise<Opportunity[]>;
  get(id: Id): Promise<Opportunity | null>;
  create(opportunity: Opportunity): Promise<Opportunity>;
  update(id: Id, patch: Partial<Opportunity>): Promise<Opportunity>;
}

export interface AssumptionRepository {
  listByStartup(startupId: Id): Promise<Assumption[]>;
  get(id: Id): Promise<Assumption | null>;
  create(assumption: Assumption): Promise<Assumption>;
  update(id: Id, patch: Partial<Assumption>): Promise<Assumption>;
}

export interface EvidenceRepository {
  listByStartup(startupId: Id): Promise<Evidence[]>;
  create(evidence: Evidence): Promise<Evidence>;
  update(id: Id, patch: Partial<Evidence>): Promise<Evidence>;
}

export interface DecisionRepository {
  listByStartup(startupId: Id): Promise<Decision[]>;
  create(decision: Decision): Promise<Decision>;
}

export interface ExperimentRepository {
  listByStartup(startupId: Id): Promise<Experiment[]>;
  get(id: Id): Promise<Experiment | null>;
  create(experiment: Experiment): Promise<Experiment>;
  update(id: Id, patch: Partial<Experiment>): Promise<Experiment>;
}

export interface TaskRepository {
  listByStartup(startupId: Id): Promise<Task[]>;
  get(id: Id): Promise<Task | null>;
  create(task: Task): Promise<Task>;
  update(id: Id, patch: Partial<Task>): Promise<Task>;
}

export interface ProductSpecRepository {
  getByStartup(startupId: Id): Promise<ProductSpec | null>;
  upsert(spec: ProductSpec): Promise<ProductSpec>;
}

export interface AgentRunRepository {
  listByStartup(startupId: Id, limit?: number): Promise<AgentRun[]>;
  create(run: AgentRun): Promise<AgentRun>;
  update(id: Id, patch: Partial<AgentRun>): Promise<AgentRun>;
}

export interface Repositories {
  founders: FounderRepository;
  startups: StartupRepository;
  profiles: FounderProfileRepository;
  opportunities: OpportunityRepository;
  assumptions: AssumptionRepository;
  evidence: EvidenceRepository;
  decisions: DecisionRepository;
  experiments: ExperimentRepository;
  tasks: TaskRepository;
  productSpecs: ProductSpecRepository;
  agentRuns: AgentRunRepository;
  /** Which backend is active. Surfaced in the UI so the mode is never hidden. */
  backend: "local" | "supabase";
}

/**
 * Assembles the full Startup Memory for one startup. Used by every agent and
 * by the orchestrator — they never query repositories individually.
 */
export async function loadMemory(
  repos: Repositories,
  startupId: Id
): Promise<StartupMemory | null> {
  const startup = await repos.startups.get(startupId);
  if (!startup) return null;

  const [
    founderProfile,
    opportunities,
    assumptions,
    evidence,
    decisions,
    experiments,
    productSpec,
    tasks,
  ] = await Promise.all([
    repos.profiles.getByStartup(startupId),
    repos.opportunities.listByStartup(startupId),
    repos.assumptions.listByStartup(startupId),
    repos.evidence.listByStartup(startupId),
    repos.decisions.listByStartup(startupId),
    repos.experiments.listByStartup(startupId),
    repos.productSpecs.getByStartup(startupId),
    repos.tasks.listByStartup(startupId),
  ]);

  return {
    startup,
    founderProfile,
    opportunities,
    assumptions,
    evidence,
    decisions,
    experiments,
    productSpec,
    tasks,
  };
}
