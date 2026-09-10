import { Id, Startup, StartupMemory, emptyFounderProfile, newId, now } from "@/domain";
import { getRepositories, loadMemory } from "@/data";
import { getSession } from "./session";

// ---------------------------------------------------------------------------
// The current startup
//
// V2 works with one startup per founder. The dashboard is the control centre
// for that one company, which is the whole point — a founder juggling three
// ideas at once is the problem this product exists to fix.
// ---------------------------------------------------------------------------

export async function getCurrentStartup(): Promise<Startup | null> {
  const session = await getSession();
  if (!session) return null;

  const repos = getRepositories();
  const startups = await repos.startups.listByFounder(session.founder.id);
  return startups[0] ?? null;
}

export async function getCurrentMemory(): Promise<StartupMemory | null> {
  const startup = await getCurrentStartup();
  if (!startup) return null;
  return loadMemory(getRepositories(), startup.id);
}

export async function createStartup(name: string, country = "SE"): Promise<Startup> {
  const session = await getSession();
  if (!session) throw new Error("Not signed in");

  const repos = getRepositories();
  const timestamp = now();
  const startupId: Id = newId("stp");

  const startup = await repos.startups.create({
    id: startupId,
    founderId: session.founder.id,
    name,
    country,
    stage: "FOUNDER",
    stageStatus: "IN_PROGRESS",
    selectedOpportunityId: null,
    problem: null,
    targetCustomer: null,
    solution: null,
    valueProposition: null,
    businessModel: null,
    productType: null,
    isDemo: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  // An empty profile exists from the start, so the interview has somewhere to
  // write and the dashboard can show real emptiness rather than a fake state.
  await repos.profiles.upsert(
    emptyFounderProfile(newId("prf"), session.founder.id, startupId, timestamp)
  );

  return startup;
}
