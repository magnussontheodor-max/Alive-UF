import { Assumption } from "../assumption";
import { Evidence, evidenceWeight } from "../evidence";
import { Confidence, ConfidenceLevel, confidence } from "../primitives";

// ---------------------------------------------------------------------------
// Confidence computation
//
// Confidence is derived from evidence weight, never asserted by an agent. The
// output is coarse (four levels) because the underlying data does not justify
// anything finer, and it always carries a sentence explaining itself.
//
// Contradicting evidence counts against at 1.5x — being wrong is more
// informative than being right, and the system should lose confidence faster
// than it gains it.
// ---------------------------------------------------------------------------

const CONTRADICTION_MULTIPLIER = 1.5;

export interface ConfidenceComputation {
  confidence: Confidence;
  supportWeight: number;
  contradictWeight: number;
  detail: string;
}

export function computeAssumptionConfidence(
  assumption: Assumption,
  allEvidence: Evidence[]
): ConfidenceComputation {
  const supporting = allEvidence.filter((e) => e.supports.includes(assumption.id));
  const contradicting = allEvidence.filter((e) =>
    e.contradicts.includes(assumption.id)
  );

  const supportWeight = supporting.reduce((s, e) => s + evidenceWeight(e), 0);
  const contradictWeight =
    contradicting.reduce((s, e) => s + evidenceWeight(e), 0) * CONTRADICTION_MULTIPLIER;

  const net = supportWeight - contradictWeight;
  const basis = [...supporting, ...contradicting].map((e) => e.id);

  if (basis.length === 0) {
    return {
      confidence: confidence("NONE", "No evidence has been recorded for or against this yet."),
      supportWeight: 0,
      contradictWeight: 0,
      detail: "No evidence recorded.",
    };
  }

  let level: ConfidenceLevel;
  let explanation: string;

  const sourceKinds = new Set(supporting.map((e) => e.sourceType));
  const independentSources = sourceKinds.size;

  if (net <= 0) {
    level = "NONE";
    explanation =
      contradicting.length > 0
        ? `Contradicted by ${contradicting.length} piece${contradicting.length === 1 ? "" : "s"} of evidence.`
        : "The evidence recorded so far does not support this.";
  } else if (net < 0.8 || supporting.length < 2) {
    level = "LOW";
    explanation = `Rests on ${supporting.length} piece${supporting.length === 1 ? "" : "s"} of evidence — not enough to rely on.`;
  } else if (net < 2 || independentSources < 2) {
    level = "MODERATE";
    explanation = `Supported by ${supporting.length} pieces of evidence${independentSources < 2 ? ", though all from the same kind of source" : ""}.`;
  } else {
    level = "HIGH";
    explanation = `Supported by ${supporting.length} pieces of evidence across ${independentSources} different source types.`;
  }

  if (contradicting.length > 0 && level !== "NONE") {
    explanation += ` ${contradicting.length} piece${contradicting.length === 1 ? "" : "s"} of evidence points the other way.`;
  }

  return {
    confidence: confidence(level, explanation, basis),
    supportWeight,
    contradictWeight,
    detail: `support ${supportWeight.toFixed(2)} vs contradiction ${contradictWeight.toFixed(2)}`,
  };
}

/**
 * Overall startup confidence. Deliberately conservative: it is capped by the
 * least-supported critical assumption, because a startup is only as validated
 * as its weakest load-bearing belief.
 */
export interface StartupConfidence {
  level: ConfidenceLevel;
  explanation: string;
  /** The assumption currently holding confidence down. */
  limitedBy: string | null;
  testedShare: number;
}

export function computeStartupConfidence(
  assumptions: Assumption[],
  evidence: Evidence[]
): StartupConfidence {
  if (assumptions.length === 0) {
    return {
      level: "NONE",
      explanation: "No assumptions have been identified yet, so there is nothing to be confident about.",
      limitedBy: null,
      testedShare: 0,
    };
  }

  const critical = assumptions.filter(
    (a) => a.importance === "CRITICAL" || a.importance === "HIGH"
  );
  const pool = critical.length > 0 ? critical : assumptions;

  const scored = pool.map((a) => ({
    assumption: a,
    computed: computeAssumptionConfidence(a, evidence),
  }));

  const weakest = scored.reduce((min, s) =>
    s.computed.confidence.value < min.computed.confidence.value ? s : min
  );

  const tested = pool.filter((a) => a.status !== "UNTESTED").length;
  const testedShare = tested / pool.length;

  const rejected = pool.filter((a) => a.status === "REJECTED");
  if (rejected.length > 0) {
    return {
      level: "NONE",
      explanation: `${rejected.length} load-bearing assumption${rejected.length === 1 ? " has" : "s have"} been rejected. The current direction needs to change before confidence means anything.`,
      limitedBy: rejected[0].statement,
      testedShare,
    };
  }

  return {
    level: weakest.computed.confidence.level,
    explanation: `Limited by the least-supported important assumption. ${tested} of ${pool.length} important assumptions have been tested.`,
    limitedBy: weakest.assumption.statement,
    testedShare,
  };
}
