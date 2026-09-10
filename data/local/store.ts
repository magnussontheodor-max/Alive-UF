import fs from "node:fs";
import path from "node:path";
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
  Task,

} from "@/domain";
import { Repositories } from "../repositories";

// ---------------------------------------------------------------------------
// Local development store
//
// Used automatically when Supabase environment variables are absent, so the
// product runs end-to-end with no backend. State is held in memory and
// mirrored to a JSON file so a restart does not wipe a demo mid-conversation.
//
// This is not a production database and does not pretend to be one: no
// concurrency control, no migrations, single process. The UI displays which
// backend is active.
// ---------------------------------------------------------------------------

interface StoreShape {
  founders: Founder[];
  startups: Startup[];
  profiles: FounderProfile[];
  opportunities: Opportunity[];
  assumptions: Assumption[];
  evidence: Evidence[];
  decisions: Decision[];
  experiments: Experiment[];
  tasks: Task[];
  productSpecs: ProductSpec[];
  agentRuns: AgentRun[];
}

function emptyStore(): StoreShape {
  return {
    founders: [],
    startups: [],
    profiles: [],
    opportunities: [],
    assumptions: [],
    evidence: [],
    decisions: [],
    experiments: [],
    tasks: [],
    productSpecs: [],
    agentRuns: [],
  };
}

const DATA_DIR = path.join(process.cwd(), ".spark-data");
const DATA_FILE = path.join(DATA_DIR, "store.json");

function readFromDisk(): StoreShape | null {
  try {
    if (!fs.existsSync(DATA_FILE)) return null;
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    return { ...emptyStore(), ...(JSON.parse(raw) as StoreShape) };
  } catch {
    return null;
  }
}

function writeToDisk(store: StoreShape): void {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), "utf8");
  } catch {
    // Persistence is best-effort. In-memory state is still correct.
  }
}

// Survives Next.js dev hot reloads.
const globalStore = globalThis as unknown as { __sparkStore?: StoreShape };

function getStore(): StoreShape {
  if (!globalStore.__sparkStore) {
    globalStore.__sparkStore = readFromDisk() ?? emptyStore();
  }
  return globalStore.__sparkStore;
}

function persist(): void {
  writeToDisk(getStore());
}

export function resetLocalStore(): void {
  globalStore.__sparkStore = emptyStore();
  persist();
}

// --- generic helpers -------------------------------------------------------

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function patchItem<T extends { id: Id }>(
  collection: T[],
  id: Id,
  patch: Partial<T>,
  label: string
): T {
  const index = collection.findIndex((item) => item.id === id);
  if (index === -1) throw new Error(`${label} not found: ${id}`);
  const updated = { ...collection[index], ...patch } as T;
  collection[index] = updated;
  persist();
  return clone(updated);
}

function insert<T>(collection: T[], item: T): T {
  collection.push(item);
  persist();
  return clone(item);
}

// --- repositories ----------------------------------------------------------

export function createLocalRepositories(): Repositories {
  return {
    backend: "local",

    founders: {
      async getByUserId(userId) {
        return clone(getStore().founders.find((f) => f.userId === userId) ?? null);
      },
      async create(founder) {
        return insert(getStore().founders, founder);
      },
      async update(id, patch) {
        return patchItem(getStore().founders, id, patch, "Founder");
      },
    },

    startups: {
      async listByFounder(founderId) {
        return clone(getStore().startups.filter((s) => s.founderId === founderId));
      },
      async get(id) {
        return clone(getStore().startups.find((s) => s.id === id) ?? null);
      },
      async create(startup) {
        return insert(getStore().startups, startup);
      },
      async update(id, patch) {
        return patchItem(getStore().startups, id, patch, "Startup");
      },
    },

    profiles: {
      async getByStartup(startupId) {
        return clone(
          getStore().profiles.find((p) => p.startupId === startupId) ?? null
        );
      },
      async upsert(profile) {
        const store = getStore();
        const index = store.profiles.findIndex((p) => p.id === profile.id);
        if (index === -1) return insert(store.profiles, profile);
        store.profiles[index] = profile;
        persist();
        return clone(profile);
      },
    },

    opportunities: {
      async listByStartup(startupId) {
        return clone(
          getStore().opportunities.filter((o) => o.startupId === startupId)
        );
      },
      async get(id) {
        return clone(getStore().opportunities.find((o) => o.id === id) ?? null);
      },
      async create(opportunity) {
        return insert(getStore().opportunities, opportunity);
      },
      async update(id, patch) {
        return patchItem(getStore().opportunities, id, patch, "Opportunity");
      },
    },

    assumptions: {
      async listByStartup(startupId) {
        return clone(
          getStore().assumptions.filter((a) => a.startupId === startupId)
        );
      },
      async get(id) {
        return clone(getStore().assumptions.find((a) => a.id === id) ?? null);
      },
      async create(assumption) {
        return insert(getStore().assumptions, assumption);
      },
      async update(id, patch) {
        return patchItem(getStore().assumptions, id, patch, "Assumption");
      },
    },

    evidence: {
      async listByStartup(startupId) {
        return clone(getStore().evidence.filter((e) => e.startupId === startupId));
      },
      async create(evidence) {
        return insert(getStore().evidence, evidence);
      },
      async update(id, patch) {
        return patchItem(getStore().evidence, id, patch, "Evidence");
      },
    },

    decisions: {
      async listByStartup(startupId) {
        return clone(
          getStore()
            .decisions.filter((d) => d.startupId === startupId)
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        );
      },
      async create(decision) {
        return insert(getStore().decisions, decision);
      },
    },

    experiments: {
      async listByStartup(startupId) {
        return clone(
          getStore().experiments.filter((e) => e.startupId === startupId)
        );
      },
      async get(id) {
        return clone(getStore().experiments.find((e) => e.id === id) ?? null);
      },
      async create(experiment) {
        return insert(getStore().experiments, experiment);
      },
      async update(id, patch) {
        return patchItem(getStore().experiments, id, patch, "Experiment");
      },
    },

    tasks: {
      async listByStartup(startupId) {
        return clone(
          getStore()
            .tasks.filter((t) => t.startupId === startupId)
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        );
      },
      async get(id) {
        return clone(getStore().tasks.find((t) => t.id === id) ?? null);
      },
      async create(task) {
        return insert(getStore().tasks, task);
      },
      async update(id, patch) {
        return patchItem(getStore().tasks, id, patch, "Task");
      },
    },

    productSpecs: {
      async getByStartup(startupId) {
        return clone(
          getStore().productSpecs.find((s) => s.startupId === startupId) ?? null
        );
      },
      async upsert(spec) {
        const store = getStore();
        const index = store.productSpecs.findIndex((s) => s.id === spec.id);
        if (index === -1) return insert(store.productSpecs, spec);
        store.productSpecs[index] = spec;
        persist();
        return clone(spec);
      },
    },

    agentRuns: {
      async listByStartup(startupId, limit = 50) {
        return clone(
          getStore()
            .agentRuns.filter((r) => r.startupId === startupId)
            .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
            .slice(0, limit)
        );
      },
      async create(run) {
        return insert(getStore().agentRuns, run);
      },
      async update(id, patch) {
        return patchItem(getStore().agentRuns, id, patch, "Agent run");
      },
    },

  };
}
