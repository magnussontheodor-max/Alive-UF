import {
  Assumption,
  CATEGORY_STAGE_RELEVANCE,
  isOpen,
  testability,
} from "../assumption";
import { StartupMemory } from "../memory";
import { IMPORTANCE_WEIGHT } from "../primitives";
import { computeAssumptionConfidence } from "./confidence";

// ---------------------------------------------------------------------------
// Next Best Action ranking
//
// Produces ONE candidate, plus the runners-up so the founder can see that
// alternatives were considered and why they lost.
//
//   priority = importance x uncertainty x stageRelevance x testability
//
// Each factor is there for a reason:
//   - importance:    how badly being wrong would hurt
//   - uncertainty:   how little we currently know (1 - confidence)
//   - stageRelevance: don't test pricing before the problem exists
//   - testability:   a critical belief nobody can test today should not
//                    outrank one that could be settled this afternoon
// ---------------------------------------------------------------------------

export interface RankedAssumption {
  assumption: Assumption;
  score: number;
  factors: {
    importance: number;
    uncertainty: number;
    stageRelevance: number;
    testability: number;
  };
  reasoning: string;
}

export function rankAssumptions(memory: StartupMemory): RankedAssumption[] {
  const stage = memory.startup.stage;
  const open = memory.assumptions.filter(isOpen);

  const ranked = open.map((assumption) => {
    const importance = IMPORTANCE_WEIGHT[assumption.importance];
    const computed = computeAssumptionConfidence(assumption, memory.evidence);
    const uncertainty = 1 - computed.confidence.value;

    const relevantStages = CATEGORY_STAGE_RELEVANCE[assumption.category];
    const stageRelevance = relevantStages.includes(stage)
      ? 1
      : relevantStages.some((s) => s === "VALIDATION") && stage === "RESEARCH"
        ? 0.6
        : 0.35;

    const test = testability(assumption);
    const score = importance * uncertainty * stageRelevance * test;

    return {
      assumption,
      score,
      factors: { importance, uncertainty, stageRelevance, testability: test },
      reasoning: explainRanking(assumption, importance, uncertainty, stageRelevance, test),
    };
  });

  return ranked.sort((a, b) => b.score - a.score);
}

function explainRanking(
  assumption: Assumption,
  importance: number,
  uncertainty: number,
  stageRelevance: number,
  test: number
): string {
  const parts: string[] = [];

  parts.push(
    assumption.importance === "CRITICAL"
      ? "If this is wrong, the whole direction is wrong."
      : assumption.importance === "HIGH"
        ? "Getting this wrong would cost significant time."
        : "Moderately important."
  );

  parts.push(
    uncertainty >= 0.95
      ? "Nothing has been recorded about it yet."
      : uncertainty >= 0.6
        ? "The evidence so far is thin."
        : "There is some evidence, but not enough to close it."
  );

  if (stageRelevance < 1) {
    parts.push("It is not the natural question for this stage, which lowers its priority.");
  }

  if (test < 0.6) {
    parts.push("It is also expensive to test right now.");
  } else if (test === 1) {
    parts.push("It can be tested quickly.");
  }

  return parts.join(" ");
}

export interface NextActionCandidate {
  ranked: RankedAssumption | null;
  alternatives: { title: string; score: number; whyNot: string }[];
  /** Set when there is nothing to rank — the reason no action can be produced. */
  blockedReason: string | null;
}

export function selectNextAssumption(memory: StartupMemory): NextActionCandidate {
  const ranked = rankAssumptions(memory);

  if (ranked.length === 0) {
    return {
      ranked: null,
      alternatives: [],
      blockedReason:
        memory.assumptions.length === 0
          ? "No assumptions have been identified yet."
          : "Every recorded assumption has been resolved.",
    };
  }

  const [winner, ...rest] = ranked;

  const alternatives = rest.slice(0, 3).map((r) => ({
    title: r.assumption.statement,
    score: Math.round(r.score * 100),
    whyNot:
      r.factors.importance < winner.factors.importance
        ? "Less damaging if it turns out to be wrong."
        : r.factors.uncertainty < winner.factors.uncertainty
          ? "We already know more about this one."
          : r.factors.stageRelevance < winner.factors.stageRelevance
            ? "Belongs to a later stage."
            : "Harder to test right now.",
  }));

  return { ranked: winner, alternatives, blockedReason: null };
}
