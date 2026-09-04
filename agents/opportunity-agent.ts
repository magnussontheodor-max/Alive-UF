import {
  Assumption,
  Claim,
  FounderProfile,
  ObservedProblem,
  Opportunity,
  OpportunityRisk,
  ScoreComponent,
  confidence,
  newId,
  now,
  scoreFromComponents,
} from "@/domain";
import { Agent, AgentContext, AgentResult, emptyResult } from "./types";

// ---------------------------------------------------------------------------
// Opportunity Agent
//
// Every opportunity begins with a problem the founder personally witnessed.
// There is no code path in this agent that can produce an opportunity from
// anything else — if the founder has recorded no observed problems, it returns
// `blocked` rather than inventing something plausible.
//
// That constraint is the entire point. An "AI startup idea generator" is what
// this product must not be.
// ---------------------------------------------------------------------------

export interface OpportunityAgentInput {
  profile: FounderProfile;
}

export const opportunityAgent: Agent<OpportunityAgentInput> = {
  name: "OPPORTUNITY_AGENT",
  mission:
    "Turn problems you have witnessed into opportunities worth investigating, and be explicit about what is still unknown.",
  boundaries: [
    "Only works from problems you have personally observed.",
    "Does not invent market sizes or growth figures.",
    "Does not choose for you — selection is your decision.",
  ],

  async run(input, context): Promise<AgentResult> {
    return generateOpportunities(input.profile, context);
  },
};

function generateOpportunities(
  profile: FounderProfile,
  context: AgentContext
): AgentResult {
  const result = emptyResult("OPPORTUNITY_AGENT", "Opportunities identified");
  const timestamp = now();
  const startupId = profile.startupId;

  const problems = profile.domainExposure.flatMap((domain) =>
    domain.observedProblems.map((problem) => ({ domain, problem }))
  );

  if (problems.length === 0) {
    result.blocked =
      "No opportunities can be generated yet. You have not recorded a problem you witnessed first-hand, and anything produced without one would be a guess.";
    result.summary = "Not enough recorded observations to identify an opportunity.";
    result.openQuestions = [
      "What went wrong repeatedly in the work you have actually done?",
    ];
    return result;
  }

  const opportunities: Opportunity[] = [];
  const assumptions: Assumption[] = [];

  for (const { domain, problem } of problems) {
    const evidenceForProblem = context.memory.evidence.filter((e) =>
      e.claim.includes(problem.description)
    );
    const evidenceIds = evidenceForProblem.map((e) => e.id);

    const matchingNetwork = profile.networkAccess.filter(
      (n) => overlaps(n.group, problem.whoHasIt) || overlaps(n.group, domain.domain)
    );
    const reach = matchingNetwork.reduce((s, n) => s + n.reachableThisWeek, 0);

    const opportunityId = newId("opp");

    // --- Claims: what we know vs what we are guessing ---------------------

    const claims: Claim[] = [
      {
        id: newId("clm"),
        statement: `You observed this problem directly: ${problem.description}`,
        status: "FACT",
        basis: evidenceIds,
        origin: { kind: "AGENT", agent: "OPPORTUNITY_AGENT" },
        createdAt: timestamp,
      },
      {
        id: newId("clm"),
        statement: `Because you saw it ${problem.frequency.toLowerCase()} in ${domain.domain}, it may be a recurring problem there rather than a one-off.`,
        status: "INFERENCE",
        basis: evidenceIds,
        origin: { kind: "AGENT", agent: "OPPORTUNITY_AGENT" },
        createdAt: timestamp,
      },
      {
        id: newId("clm"),
        statement: `Other ${problem.whoHasIt || "people in this position"} outside your own experience have the same problem. Nobody has confirmed this.`,
        status: "HYPOTHESIS",
        basis: [],
        origin: { kind: "AGENT", agent: "OPPORTUNITY_AGENT" },
        createdAt: timestamp,
      },
      {
        id: newId("clm"),
        statement: `They would pay to have it solved. This is the belief most likely to be wrong, and nothing supports it yet.`,
        status: "HYPOTHESIS",
        basis: [],
        origin: { kind: "AGENT", agent: "OPPORTUNITY_AGENT" },
        createdAt: timestamp,
      },
    ];

    // --- Score, with every component carrying its reasoning ---------------

    const components: ScoreComponent[] = [
      {
        key: "founderFit",
        label: "Your fit",
        value: fitScore(domain.yearsExposure ?? 0, problem.howFounderKnows),
        weight: 0.3,
        reasoning: problem.howFounderKnows
          ? `You saw this yourself: ${problem.howFounderKnows}.`
          : `Based on ${domain.yearsExposure ?? 0} year(s) of exposure to ${domain.domain}.`,
        grounded: evidenceIds.length > 0,
      },
      {
        key: "problemEvidence",
        label: "Evidence the problem is real",
        value: problemEvidenceScore(problem),
        weight: 0.3,
        reasoning:
          problem.frequency === "DAILY" || problem.frequency === "WEEKLY"
            ? `You saw it ${problem.frequency.toLowerCase()}, but only within one organisation. Nobody outside your own experience has confirmed it.`
            : "Recorded from your own experience only. Frequency outside that is unknown.",
        grounded: false,
      },
      {
        key: "reachability",
        label: "Can you reach these people",
        value: reachScore(reach),
        weight: 0.25,
        reasoning:
          reach > 0
            ? `You believe you can reach about ${reach} relevant people this week.`
            : "You have not recorded anyone you could reach who has this problem. That makes testing it slow.",
        grounded: matchingNetwork.length > 0,
      },
      {
        key: "feasibility",
        label: "Could you build something",
        value: feasibilityScore(profile),
        weight: 0.15,
        reasoning: feasibilityReasoning(profile),
        grounded: true,
      },
    ];

    const score = scoreFromComponents(components, [
      "This score reflects your position and what you have observed. It says nothing about market size, competition or profitability — none of which have been researched yet.",
      "It cannot tell you whether anyone will pay. That has to be tested.",
    ]);

    // --- Risks -------------------------------------------------------------

    const risks: OpportunityRisk[] = [
      {
        id: newId("rsk"),
        statement:
          "The problem may be specific to the organisation you worked in rather than common across the segment.",
        severity: "HIGH",
        howToCheck: `Describe the problem to ${problem.whoHasIt || "people in this role"} at three other organisations without suggesting a solution, and see whether they recognise it unprompted.`,
      },
      {
        id: newId("rsk"),
        statement:
          "People may recognise the problem but already have a workaround they are content with.",
        severity: "MEDIUM",
        howToCheck: "Ask what they currently do about it and how much that costs them.",
      },
    ];

    if (reach < 3) {
      risks.push({
        id: newId("rsk"),
        statement:
          "You do not currently have enough access to the affected people to test this cheaply.",
        severity: "HIGH",
        howToCheck:
          "Try to arrange two conversations this week. If that proves hard, this opportunity is expensive to validate regardless of its merit.",
      });
    }

    const keyUnknowns = [
      `Whether ${problem.whoHasIt || "these people"} outside your own experience have this problem.`,
      "How they solve it today, and what that costs them.",
      "Whether solving it is worth paying for.",
    ];

    const opportunity: Opportunity = {
      id: opportunityId,
      startupId,
      title: shortTitle(problem, domain.domain),
      problem: problem.description,
      customer: problem.whoHasIt || `People in ${domain.domain} (not yet specific enough to find)`,
      context: `Observed in ${domain.domain}. ${problem.howFounderKnows || "How this was observed was not recorded."}`,
      proposedSolution: null,
      founderFit: {
        basedOn: [domain.id, ...matchingNetwork.map((n) => n.id)],
        statement: buildFitStatement(domain.domain, domain.yearsExposure, reach),
        reachableCustomers: reach || null,
        strength: fitStrength(domain.yearsExposure ?? 0, reach),
      },
      claims,
      keyUnknowns,
      risks,
      score,
      confidence:
        evidenceIds.length > 0
          ? confidence(
              "LOW",
              "Rests only on your own observation. No independent source has confirmed any part of it.",
              evidenceIds
            )
          : confidence("NONE", "Nothing recorded beyond your description."),
      status: "PROPOSED",
      approval: "AI_RECOMMENDED",
      createdBy: "AGENT",
      agentName: "OPPORTUNITY_AGENT",
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    opportunities.push(opportunity);

    // --- Assumptions: the things that must be true ------------------------

    assumptions.push(
      {
        id: newId("asm"),
        startupId,
        opportunityId,
        statement: `${capitalise(problem.whoHasIt || "People in this role")} outside your own former workplace experience this problem regularly.`,
        category: "PROBLEM",
        importance: "CRITICAL",
        importanceReason:
          "If the problem is local to where you worked, there is no business here regardless of how good a solution would be.",
        status: "UNTESTED",
        confidence: confidence("NONE", "No one outside your own experience has been asked."),
        supportingEvidenceIds: [],
        contradictingEvidenceIds: [],
        validationMethod: "CUSTOMER_INTERVIEW",
        experimentId: null,
        createdBy: "AGENT",
        agentName: "OPPORTUNITY_AGENT",
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      {
        id: newId("asm"),
        startupId,
        opportunityId,
        statement: `${capitalise(problem.whoHasIt || "These people")} can be identified and contacted without an introduction.`,
        category: "CUSTOMER",
        importance: reach >= 5 ? "MEDIUM" : "HIGH",
        importanceReason:
          reach >= 5
            ? "You have some access already, so this is less pressing — but it will matter when you go beyond your own network."
            : "You have little access today. If these people are also hard to reach cold, every step gets slower and more expensive.",
        status: "UNTESTED",
        confidence: confidence("NONE", "Not yet attempted."),
        supportingEvidenceIds: [],
        contradictingEvidenceIds: [],
        validationMethod: "DESK_RESEARCH",
        experimentId: null,
        createdBy: "AGENT",
        agentName: "OPPORTUNITY_AGENT",
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      {
        id: newId("asm"),
        startupId,
        opportunityId,
        statement: `${capitalise(problem.whoHasIt || "They")} would pay to have this problem solved.`,
        category: "WILLINGNESS_TO_PAY",
        importance: "CRITICAL",
        importanceReason:
          "People confirm problems readily and pay for solutions rarely. This is where most first-time founders are misled.",
        status: "UNTESTED",
        confidence: confidence("NONE", "Nobody has been asked to pay."),
        supportingEvidenceIds: [],
        contradictingEvidenceIds: [],
        validationMethod: "PRICING_TEST",
        experimentId: null,
        createdBy: "AGENT",
        agentName: "OPPORTUNITY_AGENT",
        createdAt: timestamp,
        updatedAt: timestamp,
      }
    );
  }

  // Rank by score, but the founder chooses.
  opportunities.sort((a, b) => b.score.total - a.score.total);

  result.opportunities = opportunities;
  result.assumptions = assumptions;
  result.summary = `Built ${opportunities.length} opportunit${opportunities.length === 1 ? "y" : "ies"} from problems you witnessed, with ${assumptions.length} assumptions to test.`;
  result.openQuestions = [
    "Whether any of these problems exist beyond your own experience.",
    "What people currently do instead, and whether that is good enough for them.",
  ];
  result.limitations = [
    "These come only from what you have described. No market research has been done.",
    "No competitor or pricing information has been gathered.",
    "The ranking reflects your position, not the size of the prize.",
  ];

  const top = opportunities[0];
  result.explanation = {
    recommendation: top
      ? `Look at "${top.title}" first, but choose for yourself.`
      : "No opportunity to recommend.",
    why: top
      ? `It scores highest mainly on your own position: ${top.founderFit.statement}`
      : "",
    evidenceUsed: context.memory.evidence
      .filter((e) => e.sourceType === "FOUNDER_INTERVIEW")
      .slice(0, 5)
      .map((e) => e.claim),
    risks: [
      "Every one of these rests on a single person's experience — yours.",
      "None of them has been checked against anyone in the market.",
    ],
    wouldChangeIf:
      "You speak to three people in the affected group and find the problem is either bigger, smaller, or different from what you remember.",
  };

  return result;
}

// --- scoring helpers -------------------------------------------------------

function fitScore(years: number, howKnows: string): number {
  let score = Math.min(years * 15, 60);
  if (howKnows) score += 25;
  return Math.min(score, 100);
}

function problemEvidenceScore(problem: ObservedProblem): number {
  const frequency = { DAILY: 45, WEEKLY: 35, OCCASIONAL: 20, RARE: 8, UNKNOWN: 5 }[
    problem.frequency
  ];
  const severity = {
    SEVERE: 40,
    COSTLY: 32,
    ANNOYING: 18,
    MINOR: 6,
    UNKNOWN: 5,
  }[problem.founderPerceivedSeverity];
  // Capped well below 100: this is one person's recollection, not evidence.
  return Math.min(frequency + severity, 70);
}

function reachScore(reach: number): number {
  if (reach >= 15) return 95;
  if (reach >= 8) return 80;
  if (reach >= 5) return 65;
  if (reach >= 2) return 40;
  return 10;
}

function feasibilityScore(profile: FounderProfile): number {
  const technical = {
    CAN_BUILD_PRODUCTION: 90,
    CAN_BUILD_SIMPLE: 70,
    BASIC: 45,
    NONE: 30,
  }[profile.constraints.technicalAbility];
  const hours = profile.constraints.hoursPerWeek ?? 0;
  const timeFactor = hours >= 20 ? 1 : hours >= 10 ? 0.85 : 0.65;
  return Math.round(technical * timeFactor);
}

function feasibilityReasoning(profile: FounderProfile): string {
  const hours = profile.constraints.hoursPerWeek ?? 0;
  const ability = profile.constraints.technicalAbility;
  if (ability === "NONE") {
    return `You do not build software yourself and have ${hours} hours a week, so a first version has to be something you can deliver manually.`;
  }
  if (ability === "CAN_BUILD_PRODUCTION") {
    return `You can build and ship software, with ${hours} hours a week available.`;
  }
  return `You can build simple things, with ${hours} hours a week. Enough for a narrow first version.`;
}

function fitStrength(years: number, reach: number): "NONE" | "WEAK" | "MODERATE" | "STRONG" {
  if (years >= 3 && reach >= 10) return "STRONG";
  if (years >= 2 && reach >= 5) return "MODERATE";
  if (years >= 1 || reach >= 2) return "WEAK";
  return "NONE";
}

function buildFitStatement(
  domain: string,
  years: number | null,
  reach: number
): string {
  const parts: string[] = [];
  if (years) parts.push(`${years} year${years === 1 ? "" : "s"} inside ${domain}`);
  else parts.push(`direct exposure to ${domain}`);
  if (reach > 0) parts.push(`about ${reach} people you could speak to this week`);
  else parts.push("no confirmed access to the affected people yet");
  return `You have ${parts.join(", and ")}.`;
}

/**
 * A label for the opportunity, taken from the founder's own words rather than
 * invented. Cuts at a clause boundary so it reads as a phrase rather than a
 * sentence truncated mid-thought, and never fabricates a product name.
 */
function shortTitle(problem: ObservedProblem, domain: string): string {
  const text = problem.description.trim();
  if (text.length <= 64) return capitalise(text.replace(/[.,;:]$/, ""));

  const clause = text.split(/,| that | which | because | so that /i)[0].trim();
  const source = clause.length >= 24 && clause.length <= 64 ? clause : text;
  if (source.length <= 64) return capitalise(source.replace(/[.,;:]$/, ""));

  const cut = source.slice(0, 64);
  const atWord = cut.slice(0, cut.lastIndexOf(" "));
  return `${capitalise((atWord || cut).replace(/[.,;:]$/, ""))}…`;
}

function capitalise(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function overlaps(a: string, b: string): boolean {
  if (!a || !b) return false;
  const normalise = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-zà-ÿ0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3);
  const wordsA = new Set(normalise(a));
  return normalise(b).some((w) => wordsA.has(w));
}
