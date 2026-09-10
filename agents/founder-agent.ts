import {
  Claim,
  Evidence,
  FounderAdvantage,
  FounderProfile,
  confidence,
  newId,
  now,
} from "@/domain";
import { Agent, AgentContext, AgentResult, emptyResult } from "./types";

// ---------------------------------------------------------------------------
// Founder Agent
//
// Mission: understand the person, and be honest about what that understanding
// implies. It does not generate business ideas — that boundary is enforced by
// the orchestrator, which will not call the Opportunity Agent until this one
// has produced a profile that clears the FOUNDER stage gate.
//
// The interesting work here is the assessment: turning "I worked in B2B sales
// for four years and know 20 sales managers" into a defensible statement about
// what this founder can actually do cheaply that others cannot.
// ---------------------------------------------------------------------------

export interface FounderAgentInput {
  profile: FounderProfile;
}

export const founderAgent: Agent<FounderAgentInput> = {
  name: "FOUNDER_AGENT",
  mission: "Understand your experience, access and constraints before anything is suggested.",
  boundaries: [
    "Does not generate business ideas.",
    "Does not assess markets.",
    "Only records what you have said about yourself.",
  ],

  async run(input, context): Promise<AgentResult> {
    return assessFounder(input.profile, context);
  },
};

function assessFounder(
  profile: FounderProfile,
  _context: AgentContext
): AgentResult {
  const result = emptyResult("FOUNDER_AGENT", "Founder profile assessed");
  const timestamp = now();

  // --- Evidence -----------------------------------------------------------
  // A founder is a reliable source about their own history, and an unreliable
  // one about the market. Only the first kind of statement becomes evidence.

  const evidence: Evidence[] = [];
  const claims: Claim[] = [];

  for (const domain of profile.domainExposure) {
    if (!domain.domain) continue;

    const domainEvidence: Evidence = {
      id: newId("ev"),
      startupId: profile.startupId,
      claim: `Founder has direct exposure to ${domain.domain}${
        domain.yearsExposure ? ` over roughly ${domain.yearsExposure} year${domain.yearsExposure === 1 ? "" : "s"}` : ""
      }.`,
      source: domain.howAcquired || "Founder interview",
      sourceType: "FOUNDER_INTERVIEW",
      epistemicStatus: "FACT",
      reliability: domain.howAcquired ? "HIGH" : "MEDIUM",
      relevance: "HIGH",
      supports: [],
      contradicts: [],
      detail: domain.howAcquired || null,
      recordedBy: "AGENT",
      agentName: "FOUNDER_AGENT",
      observedAt: timestamp,
      createdAt: timestamp,
    };
    evidence.push(domainEvidence);

    claims.push({
      id: newId("clm"),
      statement: `You have first-hand exposure to ${domain.domain}.`,
      status: "FACT",
      basis: [domainEvidence.id],
      origin: { kind: "AGENT", agent: "FOUNDER_AGENT" },
      createdAt: timestamp,
    });

    // Observed problems are evidence about the founder's observations —
    // explicitly not evidence that the problem is widespread.
    for (const problem of domain.observedProblems) {
      if (!problem.description) continue;

      const problemEvidence: Evidence = {
        id: newId("ev"),
        startupId: profile.startupId,
        claim: `Founder observed: ${problem.description}`,
        source: problem.howFounderKnows || "Founder interview",
        sourceType: "FOUNDER_INTERVIEW",
        epistemicStatus: "FACT",
        reliability: problem.howFounderKnows ? "MEDIUM" : "LOW",
        relevance: "HIGH",
        supports: [],
        contradicts: [],
        detail: problem.whoHasIt
          ? `Affected: ${problem.whoHasIt}. Frequency as recalled: ${problem.frequency.toLowerCase()}.`
          : null,
        recordedBy: "AGENT",
        agentName: "FOUNDER_AGENT",
        observedAt: timestamp,
        createdAt: timestamp,
      };
      evidence.push(problemEvidence);

      // The observation is a fact. Its generality is not.
      claims.push({
        id: newId("clm"),
        statement: `You personally observed this problem: ${problem.description}`,
        status: "FACT",
        basis: [problemEvidence.id],
        origin: { kind: "AGENT", agent: "FOUNDER_AGENT" },
        createdAt: timestamp,
      });

      if (problem.frequency === "DAILY" || problem.frequency === "WEEKLY") {
        claims.push({
          id: newId("clm"),
          statement: `This problem may be recurring rather than occasional, based on how often you saw it (${problem.frequency.toLowerCase()}). Whether that holds beyond your own experience is untested.`,
          status: "INFERENCE",
          basis: [problemEvidence.id],
          origin: { kind: "AGENT", agent: "FOUNDER_AGENT" },
          createdAt: timestamp,
        });
      }
    }
  }

  // --- Network ------------------------------------------------------------

  const totalReach = profile.networkAccess.reduce(
    (sum, n) => sum + (n.reachableThisWeek || 0),
    0
  );

  if (profile.networkAccess.length > 0) {
    const networkEvidence: Evidence = {
      id: newId("ev"),
      startupId: profile.startupId,
      claim: `Founder reports being able to reach approximately ${totalReach} relevant people within a week.`,
      source: "Founder interview",
      sourceType: "FOUNDER_INTERVIEW",
      epistemicStatus: "FACT",
      reliability: "MEDIUM",
      relevance: "HIGH",
      supports: [],
      contradicts: [],
      detail: profile.networkAccess
        .map((n) => `${n.group}: ~${n.reachableThisWeek} (${n.relationship || "relationship not stated"})`)
        .join("; "),
      recordedBy: "AGENT",
      agentName: "FOUNDER_AGENT",
      observedAt: timestamp,
      createdAt: timestamp,
    };
    evidence.push(networkEvidence);

    if (totalReach >= 5) {
      claims.push({
        id: newId("clm"),
        statement: `You can reach roughly ${totalReach} relevant people in a week, which makes interview-based validation practical.`,
        status: "INFERENCE",
        basis: [networkEvidence.id],
        origin: { kind: "AGENT", agent: "FOUNDER_AGENT" },
        createdAt: timestamp,
      });
    } else if (totalReach > 0) {
      claims.push({
        id: newId("clm"),
        statement: `Your reachable network is small (about ${totalReach} people), so validation will need methods that do not depend on warm introductions.`,
        status: "INFERENCE",
        basis: [networkEvidence.id],
        origin: { kind: "AGENT", agent: "FOUNDER_AGENT" },
        createdAt: timestamp,
      });
    }
  }

  // --- Advantages ---------------------------------------------------------
  // Deliberately conservative. Most first-time founders have one real edge or
  // none, and telling someone they have five is how this product would start
  // producing the exact slop it exists to avoid.

  const advantages: FounderAdvantage[] = [];

  for (const domain of profile.domainExposure) {
    const years = domain.yearsExposure ?? 0;
    const problems = domain.observedProblems.length;
    const matchingNetwork = profile.networkAccess.filter((n) =>
      overlaps(n.group, domain.domain)
    );
    const reach = matchingNetwork.reduce((s, n) => s + n.reachableThisWeek, 0);

    // The real edge is knowledge plus access. Either alone is weak.
    if (years >= 2 && problems >= 1 && reach >= 5) {
      advantages.push({
        id: newId("adv"),
        statement: `You know ${domain.domain} from the inside and can reach about ${reach} people in it. Most people starting here have one or the other.`,
        basedOn: [domain.id, ...matchingNetwork.map((n) => n.id)],
        strength: reach >= 10 && years >= 3 ? "STRONG" : "MODERATE",
        reasoning: `${years} years of exposure, ${problems} observed problem${problems === 1 ? "" : "s"}, and direct access to ${reach} people who may have them.`,
      });
    } else if (years >= 2 && problems >= 1) {
      advantages.push({
        id: newId("adv"),
        statement: `You understand ${domain.domain} well, but do not currently have proven access to the people in it.`,
        basedOn: [domain.id],
        strength: "WEAK",
        reasoning:
          "Domain knowledge without reachable customers means validation will be slower and more expensive than it needs to be.",
      });
    }
  }

  // --- Open questions -----------------------------------------------------

  const openQuestions: string[] = [];

  if (profile.domainExposure.every((d) => d.observedProblems.length === 0)) {
    openQuestions.push(
      "No specific problems have been recorded yet, so there is nothing concrete to build an opportunity from."
    );
  }
  if (totalReach === 0 && profile.networkAccess.length > 0) {
    openQuestions.push(
      "How many people you can actually reach is still unknown, and it determines which experiments are realistic."
    );
  }
  if (profile.networkAccess.some((n) => !n.verified)) {
    openQuestions.push(
      "Your reachable network is self-reported. It is worth checking by actually contacting two or three people before we plan around it."
    );
  }
  if (advantages.length === 0) {
    openQuestions.push(
      "Nothing yet amounts to a clear advantage over anyone else attempting the same thing. That is normal at this point, but it means the first opportunities will need more validation, not less."
    );
  }

  // --- Confidence ---------------------------------------------------------

  const evidenceIds = evidence.map((e) => e.id);
  const profileConfidence =
    evidence.length === 0
      ? confidence("NONE", "Nothing has been recorded about you yet.")
      : evidence.length < 3
        ? confidence(
            "LOW",
            "Based on a small number of things you have told us, none of it verified.",
            evidenceIds
          )
        : confidence(
            "MODERATE",
            `Based on ${evidence.length} statements you have made about your own experience. Self-reported, but you are a reliable source about your own history.`,
            evidenceIds
          );

  const updatedProfile: FounderProfile = {
    ...profile,
    claims,
    advantages,
    openQuestions,
    confidence: profileConfidence,
    updatedAt: timestamp,
  };

  result.evidence = evidence;
  result.claims = claims;
  result.founderProfile = updatedProfile;
  result.openQuestions = openQuestions;
  result.limitations = [
    "Everything here is what you told us about yourself. None of it has been checked against anyone else.",
    "Your sense of how severe these problems are is a starting hypothesis, not a finding.",
  ];
  result.summary = `Recorded ${profile.domainExposure.length} domain${profile.domainExposure.length === 1 ? "" : "s"}, ${countProblems(profile)} observed problem${countProblems(profile) === 1 ? "" : "s"}, and ${advantages.length} potential advantage${advantages.length === 1 ? "" : "s"}.`;

  result.explanation = {
    recommendation:
      advantages.length > 0
        ? "Move on to identifying opportunities from the problems you have seen."
        : "Add more detail about problems you witnessed before moving on — right now there is not enough to build a real opportunity from.",
    why:
      advantages.length > 0
        ? `You have described ${countProblems(profile)} problem${countProblems(profile) === 1 ? "" : "s"} you saw first-hand and people you can reach to test them.`
        : "Opportunities generated without observed problems would be guesses dressed up as analysis.",
    evidenceUsed: evidence.slice(0, 5).map((e) => e.claim),
    risks: openQuestions,
    wouldChangeIf:
      "You add another domain you know well, or discover you can reach more people than you thought.",
  };

  return result;
}

function countProblems(profile: FounderProfile): number {
  return profile.domainExposure.reduce(
    (sum, d) => sum + d.observedProblems.length,
    0
  );
}

/** Loose overlap check between a network group and a domain description. */
function overlaps(a: string, b: string): boolean {
  const normalise = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-zà-ÿ0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3);
  const wordsA = new Set(normalise(a));
  return normalise(b).some((w) => wordsA.has(w));
}
