import { SupabaseClient } from "@supabase/supabase-js";
import { Id } from "@/domain";
import { Repositories } from "../repositories";

// ---------------------------------------------------------------------------
// Supabase repository implementations.
//
// Domain objects are camelCase, Postgres columns are snake_case, and the
// mapping between them is entirely mechanical — so it is done generically
// rather than with a few hundred lines of hand-written field assignments.
// jsonb columns round-trip as-is.
// ---------------------------------------------------------------------------

type Row = Record<string, unknown>;

function toSnake(key: string): string {
  return key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
}

function toCamel(key: string): string {
  return key.replace(/_([a-z0-9])/g, (_, c: string) => c.toUpperCase());
}

function toRow<T extends object>(entity: T): Row {
  const row: Row = {};
  for (const [key, value] of Object.entries(entity)) {
    row[toSnake(key)] = value;
  }
  return row;
}

function fromRow<T>(row: Row | null): T | null {
  if (!row) return null;
  const entity: Row = {};
  for (const [key, value] of Object.entries(row)) {
    entity[toCamel(key)] = value;
  }
  return entity as T;
}

function fromRows<T>(rows: Row[] | null): T[] {
  return (rows ?? []).map((r) => fromRow<T>(r) as T);
}

function unwrap<T>(result: { data: T | null; error: { message: string } | null }): T {
  if (result.error) throw new Error(`Supabase: ${result.error.message}`);
  if (result.data === null) throw new Error("Supabase returned no data");
  return result.data;
}

/**
 * Builds the standard set of operations for one table. Every repository below
 * is a thin, typed wrapper over these.
 */
function table(client: SupabaseClient, name: string) {
  return {
    async listBy<T>(column: string, value: string, orderBy?: { column: string; ascending: boolean }, limit?: number): Promise<T[]> {
      let query = client.from(name).select("*").eq(column, value);
      if (orderBy) query = query.order(orderBy.column, { ascending: orderBy.ascending });
      if (limit) query = query.limit(limit);
      const { data, error } = await query;
      if (error) throw new Error(`Supabase (${name}): ${error.message}`);
      return fromRows<T>(data as Row[]);
    },

    async getBy<T>(column: string, value: string): Promise<T | null> {
      const { data, error } = await client
        .from(name)
        .select("*")
        .eq(column, value)
        .maybeSingle();
      if (error) throw new Error(`Supabase (${name}): ${error.message}`);
      return fromRow<T>(data as Row | null);
    },

    async insert<T extends object>(entity: T): Promise<T> {
      const result = await client.from(name).insert(toRow(entity)).select().single();
      return fromRow<T>(unwrap(result) as Row) as T;
    },

    async patch<T extends object>(id: Id, patch: Partial<T>): Promise<T> {
      const result = await client
        .from(name)
        .update(toRow(patch as object))
        .eq("id", id)
        .select()
        .single();
      return fromRow<T>(unwrap(result) as Row) as T;
    },

    async upsert<T extends object>(entity: T): Promise<T> {
      const result = await client
        .from(name)
        .upsert(toRow(entity), { onConflict: "id" })
        .select()
        .single();
      return fromRow<T>(unwrap(result) as Row) as T;
    },
  };
}

export function createSupabaseRepositories(client: SupabaseClient): Repositories {
  const founders = table(client, "founders");
  const startups = table(client, "startups");
  const profiles = table(client, "founder_profiles");
  const opportunities = table(client, "opportunities");
  const assumptions = table(client, "assumptions");
  const evidence = table(client, "evidence");
  const decisions = table(client, "decisions");
  const experiments = table(client, "experiments");
  const tasks = table(client, "tasks");
  const productSpecs = table(client, "product_specs");
  const agentRuns = table(client, "agent_runs");

  return {
    backend: "supabase",

    founders: {
      getByUserId: (userId) => founders.getBy("user_id", userId),
      create: (founder) => founders.insert(founder),
      update: (id, patch) => founders.patch(id, patch),
    },
    startups: {
      listByFounder: (founderId) => startups.listBy("founder_id", founderId),
      get: (id) => startups.getBy("id", id),
      create: (startup) => startups.insert(startup),
      update: (id, patch) => startups.patch(id, patch),
    },
    profiles: {
      getByStartup: (startupId) => profiles.getBy("startup_id", startupId),
      upsert: (profile) => profiles.upsert(profile),
    },
    opportunities: {
      listByStartup: (startupId) => opportunities.listBy("startup_id", startupId),
      get: (id) => opportunities.getBy("id", id),
      create: (o) => opportunities.insert(o),
      update: (id, patch) => opportunities.patch(id, patch),
    },
    assumptions: {
      listByStartup: (startupId) => assumptions.listBy("startup_id", startupId),
      get: (id) => assumptions.getBy("id", id),
      create: (a) => assumptions.insert(a),
      update: (id, patch) => assumptions.patch(id, patch),
    },
    evidence: {
      listByStartup: (startupId) => evidence.listBy("startup_id", startupId),
      create: (e) => evidence.insert(e),
      update: (id, patch) => evidence.patch(id, patch),
    },
    decisions: {
      listByStartup: (startupId) =>
        decisions.listBy("startup_id", startupId, { column: "created_at", ascending: false }),
      create: (d) => decisions.insert(d),
    },
    experiments: {
      listByStartup: (startupId) => experiments.listBy("startup_id", startupId),
      get: (id) => experiments.getBy("id", id),
      create: (e) => experiments.insert(e),
      update: (id, patch) => experiments.patch(id, patch),
    },
    tasks: {
      listByStartup: (startupId) =>
        tasks.listBy("startup_id", startupId, { column: "created_at", ascending: false }),
      get: (id) => tasks.getBy("id", id),
      create: (t) => tasks.insert(t),
      update: (id, patch) => tasks.patch(id, patch),
    },
    productSpecs: {
      getByStartup: (startupId) => productSpecs.getBy("startup_id", startupId),
      upsert: (spec) => productSpecs.upsert(spec),
    },
    agentRuns: {
      listByStartup: (startupId, limit = 50) =>
        agentRuns.listBy("startup_id", startupId, { column: "started_at", ascending: false }, limit),
      create: (run) => agentRuns.insert(run),
      update: (id, patch) => agentRuns.patch(id, patch),
    },
  };
}
