import { FounderProfile } from "@/domain";

// ---------------------------------------------------------------------------
// Interview progress
//
// Which questions have already been shown is UI state, not something the
// startup believes — so it does not belong in Startup Memory. It is kept in
// process, and rebuilt from the profile's actual contents when that cache is
// empty, which makes it safe to lose.
// ---------------------------------------------------------------------------

const answeredStore = new Map<string, string[]>();

export function markAnswered(profileId: string, questionId: string): void {
  const current = answeredStore.get(profileId) ?? [];
  if (!current.includes(questionId)) {
    answeredStore.set(profileId, [...current, questionId]);
  }
}

export function profileAnswered(profile: FounderProfile): string[] {
  const stored = answeredStore.get(profile.id);
  const derived = deriveAnswered(profile);
  if (!stored) return derived;
  return Array.from(new Set([...stored, ...derived]));
}

/**
 * Works out which questions must already have been answered, purely from what
 * the profile contains. Keeps the interview coherent across restarts.
 */
function deriveAnswered(profile: FounderProfile): string[] {
  const answered: string[] = [];

  if (profile.domainExposure.length > 0) answered.push("domain.first");
  if (profile.domainExposure.length > 1) answered.push("domain.second");

  for (const domain of profile.domainExposure) {
    if (domain.howAcquired) answered.push(`domain.${domain.id}.how`);
    if (domain.yearsExposure !== null) answered.push(`domain.${domain.id}.years`);
    if (domain.observedProblems.length > 0) answered.push(`domain.${domain.id}.problems`);

    for (const problem of domain.observedProblems) {
      if (problem.whoHasIt) answered.push(`problem.${problem.id}.who`);
      if (problem.howFounderKnows) answered.push(`problem.${problem.id}.how`);
      if (problem.frequency !== "UNKNOWN") answered.push(`problem.${problem.id}.frequency`);
      if (problem.founderPerceivedSeverity !== "UNKNOWN")
        answered.push(`problem.${problem.id}.severity`);
    }
  }

  if (profile.networkAccess.length > 0) answered.push("network.first");
  for (const group of profile.networkAccess) {
    if (group.reachableThisWeek > 0) answered.push(`network.${group.id}.count`);
    if (group.relationship) answered.push(`network.${group.id}.relationship`);
  }

  if (profile.constraints.hoursPerWeek !== null) answered.push("constraints.hours");
  if (profile.constraints.budgetSek !== null) answered.push("constraints.budget");
  if (profile.constraints.technicalAbility !== "NONE") answered.push("constraints.technical");
  if (profile.constraints.hardConstraints.length > 0) answered.push("constraints.hard");
  if (profile.motivation.goal !== "UNKNOWN") answered.push("motivation.goal");
  if (profile.motivation.statement) answered.push("motivation.statement");
  if (profile.preferences.b2bOrB2c !== "UNKNOWN") answered.push("preferences.b2b");
  if (profile.preferences.industriesExcluded.length > 0) answered.push("preferences.excluded");

  return answered;
}
