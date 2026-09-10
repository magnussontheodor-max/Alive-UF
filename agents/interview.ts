import { FounderProfile } from "@/domain";

// ---------------------------------------------------------------------------
// The founder interview
//
// Not a questionnaire. The next question depends on what has already been
// said: naming a domain triggers questions about the problems seen inside it;
// naming a problem triggers questions about who had it and how the founder
// knows. That is the difference between collecting form fields and actually
// understanding someone.
//
// Every question carries `why`, shown in the UI. A founder should never be
// asked for something without being told what it will be used for.
// ---------------------------------------------------------------------------

export type QuestionKind =
  | "text"
  | "longtext"
  | "number"
  | "select"
  | "multiselect"
  | "list";

export interface InterviewQuestion {
  id: string;
  question: string;
  why: string;
  kind: QuestionKind;
  placeholder?: string;
  helpText?: string;
  options?: { value: string; label: string }[];
  /** Optional context: which domain or problem this question drills into. */
  targetId?: string;
  /** Label for the thing being discussed, shown above the question. */
  targetLabel?: string;
  optional?: boolean;
}

export interface InterviewState {
  profile: FounderProfile;
  /** Ids of questions already answered, so we never repeat one. */
  answered: string[];
}

const FREQUENCY_OPTIONS = [
  { value: "DAILY", label: "Daily" },
  { value: "WEEKLY", label: "Weekly" },
  { value: "OCCASIONAL", label: "Every few weeks" },
  { value: "RARE", label: "Rarely" },
  { value: "UNKNOWN", label: "I'm not sure" },
];

const SEVERITY_OPTIONS = [
  { value: "SEVERE", label: "Severe — it blocked real work" },
  { value: "COSTLY", label: "Costly — it wasted money or hours" },
  { value: "ANNOYING", label: "Annoying — people complained" },
  { value: "MINOR", label: "Minor" },
  { value: "UNKNOWN", label: "I'm not sure" },
];

const TECHNICAL_OPTIONS = [
  { value: "NONE", label: "I don't code" },
  { value: "BASIC", label: "I can edit things, not build from scratch" },
  { value: "CAN_BUILD_SIMPLE", label: "I can build simple applications" },
  { value: "CAN_BUILD_PRODUCTION", label: "I can build and ship production software" },
];

const GOAL_OPTIONS = [
  { value: "INCOME", label: "Replace my income" },
  { value: "SIDE_INCOME", label: "Extra income alongside my job" },
  { value: "GROWTH_COMPANY", label: "Build something large" },
  { value: "LEARNING", label: "Learn by doing" },
  { value: "IMPACT", label: "Solve a problem I care about" },
];

const B2B_OPTIONS = [
  { value: "B2B", label: "Selling to businesses" },
  { value: "B2C", label: "Selling to consumers" },
  { value: "EITHER", label: "No preference" },
];

/**
 * Returns the next question, or null when there is nothing left worth asking.
 *
 * The ordering encodes a judgement: exposure and observed problems first,
 * because without them nothing else matters; preferences last, because they
 * are the least predictive of whether a first-time founder succeeds.
 */
export function nextQuestion(state: InterviewState): InterviewQuestion | null {
  const { profile, answered } = state;
  const asked = new Set(answered);

  const ask = (q: InterviewQuestion) => (asked.has(q.id) ? null : q);

  // 1. At least one domain of real exposure.
  if (profile.domainExposure.length === 0) {
    return ask({
      id: "domain.first",
      question: "Where do you have real, first-hand experience?",
      why: "Everything Spark suggests will be built from what you have actually seen. This is the raw material.",
      kind: "text",
      placeholder: "e.g. B2B sales at a logistics company, or nursing in primary care",
      helpText:
        "A job, an industry, a side project, a community you're part of. Be specific about the setting, not the job title.",
    });
  }

  // 2. Drill into each domain: how it was acquired, then the problems seen.
  for (const domain of profile.domainExposure) {
    const q1 = `domain.${domain.id}.how`;
    if (!asked.has(q1) && !domain.howAcquired) {
      return {
        id: q1,
        question: "How did you get that experience?",
        why: "Determines how much weight to put on what you observed there.",
        kind: "text",
        placeholder: "e.g. Four years as an account manager, dealing with them daily",
        targetId: domain.id,
        targetLabel: domain.domain,
      };
    }

    const q2 = `domain.${domain.id}.years`;
    if (!asked.has(q2) && domain.yearsExposure === null) {
      return {
        id: q2,
        question: "Roughly how many years?",
        why: "Longer exposure usually means you saw the recurring problems, not just the visible ones.",
        kind: "number",
        targetId: domain.id,
        targetLabel: domain.domain,
      };
    }

    const q3 = `domain.${domain.id}.problems`;
    if (!asked.has(q3) && domain.observedProblems.length === 0) {
      return {
        id: q3,
        question: "What went wrong repeatedly there?",
        why: "A problem you watched happen is evidence. A problem from a trend article is not.",
        kind: "list",
        placeholder: "One problem per line",
        helpText:
          "Think about what people complained about, what wasted time, what everyone worked around. Don't filter for business potential yet.",
        targetId: domain.id,
        targetLabel: domain.domain,
      };
    }

    // 3. For each observed problem, establish who and how we know.
    for (const problem of domain.observedProblems) {
      const p1 = `problem.${problem.id}.who`;
      if (!asked.has(p1) && !problem.whoHasIt) {
        return {
          id: p1,
          question: "Who specifically had this problem?",
          why: "A customer you could find and contact this week, not a market segment.",
          kind: "text",
          placeholder: "e.g. Sales managers at 10–50 person Swedish B2B firms",
          targetId: problem.id,
          targetLabel: problem.description,
        };
      }

      const p2 = `problem.${problem.id}.how`;
      if (!asked.has(p2) && !problem.howFounderKnows) {
        return {
          id: p2,
          question: "How do you know they had it?",
          why: "This separates what you observed from what you assume.",
          kind: "text",
          placeholder: "e.g. I did this job for four years, or three clients told me directly",
          targetId: problem.id,
          targetLabel: problem.description,
        };
      }

      const p3 = `problem.${problem.id}.frequency`;
      if (!asked.has(p3) && problem.frequency === "UNKNOWN") {
        return {
          id: p3,
          question: "How often did it come up?",
          why: "A daily irritation is a business. An annual one usually isn't.",
          kind: "select",
          options: FREQUENCY_OPTIONS,
          targetId: problem.id,
          targetLabel: problem.description,
        };
      }

      const p4 = `problem.${problem.id}.severity`;
      if (!asked.has(p4) && problem.founderPerceivedSeverity === "UNKNOWN") {
        return {
          id: p4,
          question: "How much did it actually cost them?",
          why: "Your read on this is a starting point — we will test it against what customers say.",
          kind: "select",
          options: SEVERITY_OPTIONS,
          targetId: problem.id,
          targetLabel: problem.description,
        };
      }
    }
  }

  // 4. A second domain, once the first is fully explored. Optional.
  if (profile.domainExposure.length === 1 && !asked.has("domain.second")) {
    return {
      id: "domain.second",
      question: "Anywhere else you know from the inside?",
      why: "More than one domain gives us more real problems to work from. Skip if there isn't one.",
      kind: "text",
      placeholder: "Leave empty if not",
      optional: true,
    };
  }

  // 5. Network access — the thing that decides whether validation is cheap.
  if (profile.networkAccess.length === 0) {
    return ask({
      id: "network.first",
      question: "Which of these people could you actually get hold of?",
      why: "This is the single biggest factor in whether you can test an idea cheaply. Without it, everything gets slower and more expensive.",
      kind: "text",
      placeholder: "e.g. Former colleagues in logistics sales",
    });
  }

  for (const group of profile.networkAccess) {
    const n1 = `network.${group.id}.count`;
    if (!asked.has(n1) && group.reachableThisWeek === 0) {
      return {
        id: n1,
        question: "How many of them could you realistically speak to this week?",
        why: "Be honest — this number sets what experiments are possible. If it is low, we plan differently.",
        kind: "number",
        targetId: group.id,
        targetLabel: group.group,
      };
    }

    const n2 = `network.${group.id}.relationship`;
    if (!asked.has(n2) && !group.relationship) {
      return {
        id: n2,
        question: "What's your relationship with them?",
        why: "A former colleague answers. A cold contact usually doesn't.",
        kind: "text",
        placeholder: "e.g. Worked with them directly, still in touch",
        targetId: group.id,
        targetLabel: group.group,
      };
    }
  }

  // 6. Constraints.
  if (profile.constraints.hoursPerWeek === null) {
    return ask({
      id: "constraints.hours",
      question: "How many hours a week can you genuinely put into this?",
      why: "Determines how long each next step can be. We would rather plan for 5 real hours than 20 imaginary ones.",
      kind: "number",
    });
  }

  if (profile.constraints.budgetSek === null) {
    return ask({
      id: "constraints.budget",
      question: "How much money can you put in, in SEK?",
      why: "Rules out experiments and business models you can't afford before you waste time on them.",
      kind: "number",
      placeholder: "e.g. 20000",
    });
  }

  if (!asked.has("constraints.technical")) {
    return {
      id: "constraints.technical",
      question: "How much can you build yourself?",
      why: "Changes what an MVP can be, and whether your first cost is time or money.",
      kind: "select",
      options: TECHNICAL_OPTIONS,
    };
  }

  if (!asked.has("constraints.hard")) {
    return {
      id: "constraints.hard",
      question: "Anything that rules options out?",
      why: "Non-compete clauses, industries you can't work in, location, time commitments. Better to know now.",
      kind: "list",
      optional: true,
      placeholder: "One per line, or leave empty",
    };
  }

  // 7. Motivation — shapes what counts as success.
  if (!asked.has("motivation.goal")) {
    return {
      id: "motivation.goal",
      question: "What would make this worth it for you?",
      why: "A company that replaces your salary and one that raises investment are different products. We should know which you want.",
      kind: "select",
      options: GOAL_OPTIONS,
    };
  }

  if (!asked.has("motivation.statement")) {
    return {
      id: "motivation.statement",
      question: "Why do you want to do this?",
      why: "When validation gets uncomfortable, this is what decides whether you keep going.",
      kind: "longtext",
      optional: true,
    };
  }

  // 8. Preferences — asked last, because they matter least.
  if (!asked.has("preferences.b2b")) {
    return {
      id: "preferences.b2b",
      question: "Do you have a preference for who you'd sell to?",
      why: "A preference, not a constraint. If the evidence points elsewhere, we will say so.",
      kind: "select",
      options: B2B_OPTIONS,
    };
  }

  if (!asked.has("preferences.excluded")) {
    return {
      id: "preferences.excluded",
      question: "Anything you definitely don't want to work on?",
      why: "So we don't spend your time on directions you would never pursue.",
      kind: "list",
      optional: true,
      placeholder: "One per line, or leave empty",
    };
  }

  return null;
}

/** Rough progress indicator. Deliberately not presented as a percentage of truth. */
export function interviewProgress(state: InterviewState): {
  answered: number;
  essentialRemaining: number;
} {
  const essentialIds = [
    "domain.first",
    "network.first",
    "constraints.hours",
    "constraints.budget",
  ];
  const answered = state.answered.length;
  const essentialRemaining = essentialIds.filter(
    (id) => !state.answered.includes(id)
  ).length;
  return { answered, essentialRemaining };
}
