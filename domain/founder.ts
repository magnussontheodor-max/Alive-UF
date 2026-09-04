import { Claim, Confidence, Id, NO_CONFIDENCE } from "./primitives";

// ---------------------------------------------------------------------------
// Founder
//
// The Founder Agent's job is to understand the person, not to collect form
// fields. The structure below is built around the thing that actually matters
// for a first-time founder's odds: what they already have access to.
//
// "Domain access" and "network access" are separated deliberately. Knowing an
// industry and being able to get five people from it on a call this week are
// different assets, and only the second one makes validation cheap.
// ---------------------------------------------------------------------------

export interface Founder {
  id: Id;
  /** Supabase auth user id when authenticated; the local dev user otherwise. */
  userId: string;
  name: string;
  email: string;
  country: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * A domain the founder has real, lived exposure to. This is the raw material
 * the Opportunity Agent is allowed to reason from — it may not invent domains
 * the founder has never mentioned.
 */
export interface DomainExposure {
  id: Id;
  /** e.g. "B2B SaaS sales to Swedish manufacturing companies" */
  domain: string;
  /** How the founder got this exposure, in their own words. */
  howAcquired: string;
  yearsExposure: number | null;
  /** Problems the founder personally saw in this domain. Evidence, not guesses. */
  observedProblems: ObservedProblem[];
}

/**
 * A problem the founder has actually witnessed. This is first-hand evidence
 * and is treated as such: the Opportunity Agent grounds opportunities in these
 * rather than in generic market trends.
 */
export interface ObservedProblem {
  id: Id;
  description: string;
  /** Who has this problem, as the founder described them. */
  whoHasIt: string;
  /** How the founder knows: "I did this job for 4 years", "3 clients told me". */
  howFounderKnows: string;
  frequency: "UNKNOWN" | "RARE" | "OCCASIONAL" | "WEEKLY" | "DAILY";
  /** Founder's read on severity. Explicitly their opinion, not measured. */
  founderPerceivedSeverity: "UNKNOWN" | "MINOR" | "ANNOYING" | "COSTLY" | "SEVERE";
}

/**
 * Reachable people. The single biggest predictor of whether this founder can
 * validate anything cheaply. Counted, named where possible, never assumed.
 */
export interface NetworkAccess {
  id: Id;
  /** e.g. "Sales managers at 10-50 person Swedish B2B firms" */
  group: string;
  /** How many the founder believes they could actually reach this week. */
  reachableThisWeek: number;
  relationship: string;
  /** Have they actually confirmed they can reach them, or is this a guess? */
  verified: boolean;
}

export interface FounderConstraints {
  hoursPerWeek: number | null;
  budgetSek: number | null;
  runwayMonths: number | null;
  technicalAbility: "NONE" | "BASIC" | "CAN_BUILD_SIMPLE" | "CAN_BUILD_PRODUCTION";
  riskPreference: "LOW" | "MEDIUM" | "HIGH" | "UNKNOWN";
  /** Anything that rules options out: employment clauses, location, visa, family. */
  hardConstraints: string[];
}

export interface FounderMotivation {
  /** Why they want to do this, in their words. Shapes what "success" means. */
  statement: string;
  /** What they want out of it: income replacement, big outcome, learning, impact. */
  goal: "INCOME" | "GROWTH_COMPANY" | "SIDE_INCOME" | "LEARNING" | "IMPACT" | "UNKNOWN";
}

export interface BusinessPreferences {
  b2bOrB2c: "B2B" | "B2C" | "EITHER" | "UNKNOWN";
  productTypes: string[];
  industriesOfInterest: string[];
  industriesExcluded: string[];
}

/**
 * The structured output of the Founder Agent.
 *
 * `completeness` drives the stage gate out of FOUNDER — but note it is
 * computed from whether the *decision-relevant* fields are present, not from
 * how many form fields are filled in.
 */
export interface FounderProfile {
  id: Id;
  founderId: Id;
  startupId: Id;

  skills: string[];
  professionalExperience: string[];
  domainExposure: DomainExposure[];
  networkAccess: NetworkAccess[];
  constraints: FounderConstraints;
  motivation: FounderMotivation;
  preferences: BusinessPreferences;

  /** What the Founder Agent concluded, each marked FACT/INFERENCE/HYPOTHESIS. */
  claims: Claim[];
  /** Things the agent still does not know about this founder. */
  openQuestions: string[];
  /** Where this founder has a real, defensible edge — or an empty list. */
  advantages: FounderAdvantage[];

  confidence: Confidence;
  createdAt: string;
  updatedAt: string;
}

export interface FounderAdvantage {
  id: Id;
  statement: string;
  /** Which domain exposure or network access this rests on. */
  basedOn: Id[];
  /** Honest strength assessment. Most first-time founders have few of these. */
  strength: "WEAK" | "MODERATE" | "STRONG";
  reasoning: string;
}

export function emptyFounderProfile(
  id: Id,
  founderId: Id,
  startupId: Id,
  timestamp: string
): FounderProfile {
  return {
    id,
    founderId,
    startupId,
    skills: [],
    professionalExperience: [],
    domainExposure: [],
    networkAccess: [],
    constraints: {
      hoursPerWeek: null,
      budgetSek: null,
      runwayMonths: null,
      technicalAbility: "NONE",
      riskPreference: "UNKNOWN",
      hardConstraints: [],
    },
    motivation: { statement: "", goal: "UNKNOWN" },
    preferences: {
      b2bOrB2c: "UNKNOWN",
      productTypes: [],
      industriesOfInterest: [],
      industriesExcluded: [],
    },
    claims: [],
    openQuestions: [],
    advantages: [],
    confidence: NO_CONFIDENCE,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

/**
 * Which parts of the profile actually gate progress. Used by the stage rules
 * and shown to the founder so "what's missing" is never a mystery.
 */
export interface ProfileGap {
  field: string;
  label: string;
  whyItMatters: string;
}

export function profileGaps(profile: FounderProfile): ProfileGap[] {
  const gaps: ProfileGap[] = [];

  if (profile.domainExposure.length === 0) {
    gaps.push({
      field: "domainExposure",
      label: "Where you have real-world exposure",
      whyItMatters:
        "Opportunities are built from problems you have actually seen. Without this, anything suggested would be a guess.",
    });
  }

  const hasObservedProblem = profile.domainExposure.some(
    (d) => d.observedProblems.length > 0
  );
  if (!hasObservedProblem) {
    gaps.push({
      field: "observedProblems",
      label: "Problems you have personally witnessed",
      whyItMatters:
        "A problem you have seen first-hand is evidence. A problem from a trend report is not.",
    });
  }

  if (profile.networkAccess.length === 0) {
    gaps.push({
      field: "networkAccess",
      label: "People you can actually reach",
      whyItMatters:
        "Validation costs almost nothing if you can reach the right people, and stalls completely if you cannot.",
    });
  }

  if (profile.constraints.hoursPerWeek === null) {
    gaps.push({
      field: "constraints.hoursPerWeek",
      label: "Time available per week",
      whyItMatters:
        "Determines which experiments are realistic and how long the next step should take.",
    });
  }

  if (profile.constraints.budgetSek === null) {
    gaps.push({
      field: "constraints.budgetSek",
      label: "Budget available",
      whyItMatters:
        "Rules out paid experiments and certain business models before you waste time on them.",
    });
  }

  return gaps;
}
