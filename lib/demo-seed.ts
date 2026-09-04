import { Id, emptyFounderProfile, newId, now } from "@/domain";
import { getRepositories } from "@/data";
import { orchestrate } from "@/orchestrator";
import { requireSession } from "./session";

// ---------------------------------------------------------------------------
// Demo workspace
//
// Seeds a founder profile and then lets the real agents and orchestrator
// produce everything else. Nothing here is hand-written output pretending to
// be system output — the demo shows exactly what the system actually does with
// this input, which is the only kind of demo worth showing an entrepreneur.
//
// The startup is flagged `isDemo`, and the UI badges it everywhere.
// ---------------------------------------------------------------------------

const DEMO_FOUNDER = {
  startupName: "Demo: Nordic B2B sales",
  domain: "B2B sales at a mid-sized Swedish logistics company",
  howAcquired: "Four years as an account manager, running the inbound pipeline myself",
  years: 4,
  problems: [
    {
      description:
        "Reps spent the first two hours of every day working through inbound leads that were never going to buy",
      whoHasIt: "Sales managers at Swedish B2B companies with 2-20 person sales teams",
      howFounderKnows: "I did this myself daily for four years, and managed two people who did the same",
      frequency: "DAILY" as const,
      severity: "COSTLY" as const,
    },
    {
      description:
        "Nobody could tell which marketing campaigns produced leads that actually closed",
      whoHasIt: "Marketing managers at the same companies",
      howFounderKnows: "Watched three quarterly reviews argue about it without resolving it",
      frequency: "OCCASIONAL" as const,
      severity: "ANNOYING" as const,
    },
  ],
  network: [
    {
      group: "Sales managers at Swedish B2B firms",
      reachableThisWeek: 12,
      relationship: "Former colleagues and customers, still in contact",
    },
  ],
  hoursPerWeek: 20,
  budgetSek: 40000,
};

export async function seedDemoStartup(): Promise<Id> {
  const session = await requireSession();
  const repos = getRepositories();
  const timestamp = now();
  const startupId = newId("stp");

  await repos.startups.create({
    id: startupId,
    founderId: session.founder.id,
    name: DEMO_FOUNDER.startupName,
    country: "SE",
    // Starts at FOUNDER and is walked forward below by the real orchestrator,
    // so the demo contains a genuine evidence trail rather than a fabricated one.
    stage: "FOUNDER",
    stageStatus: "IN_PROGRESS",
    selectedOpportunityId: null,
    problem: null,
    targetCustomer: null,
    solution: null,
    valueProposition: null,
    businessModel: null,
    productType: null,
    isDemo: true,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  const domainId = newId("dom");
  const profile = emptyFounderProfile(
    newId("prf"),
    session.founder.id,
    startupId,
    timestamp
  );

  profile.domainExposure = [
    {
      id: domainId,
      domain: DEMO_FOUNDER.domain,
      howAcquired: DEMO_FOUNDER.howAcquired,
      yearsExposure: DEMO_FOUNDER.years,
      observedProblems: DEMO_FOUNDER.problems.map((p) => ({
        id: newId("prb"),
        description: p.description,
        whoHasIt: p.whoHasIt,
        howFounderKnows: p.howFounderKnows,
        frequency: p.frequency,
        founderPerceivedSeverity: p.severity,
      })),
    },
  ];

  profile.networkAccess = DEMO_FOUNDER.network.map((n) => ({
    id: newId("net"),
    group: n.group,
    reachableThisWeek: n.reachableThisWeek,
    relationship: n.relationship,
    verified: false,
  }));

  profile.constraints = {
    hoursPerWeek: DEMO_FOUNDER.hoursPerWeek,
    budgetSek: DEMO_FOUNDER.budgetSek,
    runwayMonths: null,
    technicalAbility: "BASIC",
    riskPreference: "MEDIUM",
    hardConstraints: ["Still employed full time until the end of the quarter"],
  };

  profile.motivation = {
    statement: "I watched this waste people's time for four years and nobody fixed it.",
    goal: "INCOME",
  };

  profile.preferences = {
    b2bOrB2c: "B2B",
    productTypes: ["SaaS"],
    industriesOfInterest: ["Logistics", "B2B services"],
    industriesExcluded: [],
  };

  profile.skills = ["B2B sales", "Pipeline management", "Basic SQL"];
  profile.professionalExperience = [
    "Account manager, logistics (4 years)",
    "Team lead, inside sales (1 year)",
  ];

  await repos.profiles.upsert(profile);

  // Let the real system do the rest. First cycle: the Founder Agent assesses
  // the profile and records evidence about what this founder actually saw.
  await orchestrate(repos, startupId);

  // Close the "move on" task the way a founder would, then advance the stage.
  // The one-open-task rule applies to the seed too — it is not bypassed here.
  await completeOpenTask(startupId);
  await repos.startups.update(startupId, {
    stage: "OPPORTUNITY",
    updatedAt: now(),
  });

  // Second cycle: the Opportunity Agent builds opportunities from the observed
  // problems, and the orchestrator sets the next action.
  await orchestrate(repos, startupId);

  return startupId;
}

async function completeOpenTask(startupId: Id): Promise<void> {
  const repos = getRepositories();
  const tasks = await repos.tasks.listByStartup(startupId);
  const open = tasks.find((t) => t.status === "OPEN" || t.status === "IN_PROGRESS");
  if (!open) return;

  await repos.tasks.update(open.id, {
    status: "COMPLETE",
    completedAt: now(),
    outcomeNote: "Completed as part of setting up the demo workspace.",
  });
}
