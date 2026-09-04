import { Assumption } from "../assumption";
import { profileGaps } from "../founder";
import { StartupMemory, selectedOpportunity } from "../memory";
import { StageId, STAGE_ORDER, stageIndex } from "../startup";

// ---------------------------------------------------------------------------
// Stage gates
//
// Deterministic. The AI never decides that a startup has progressed — it can
// only produce content that these rules then admit or refuse. That separation
// is what stops the system from cheerfully advancing a founder who has learned
// nothing.
//
// Each gate returns the specific unmet requirements, which the UI shows
// verbatim so "why am I still here" always has an answer.
// ---------------------------------------------------------------------------

export interface GateRequirement {
  id: string;
  label: string;
  met: boolean;
  detail: string;
}

export interface GateResult {
  from: StageId;
  to: StageId | null;
  canAdvance: boolean;
  requirements: GateRequirement[];
  /** One sentence explaining the current blocker, or confirming readiness. */
  summary: string;
}

function req(id: string, label: string, met: boolean, detail: string): GateRequirement {
  return { id, label, met, detail };
}

function importantAssumptions(assumptions: Assumption[]): Assumption[] {
  return assumptions.filter(
    (a) => a.importance === "CRITICAL" || a.importance === "HIGH"
  );
}

export function evaluateGate(memory: StartupMemory): GateResult {
  const stage = memory.startup.stage;
  const next = nextStage(stage);
  const requirements = requirementsFor(stage, memory);
  const canAdvance = next !== null && requirements.every((r) => r.met);

  const unmet = requirements.filter((r) => !r.met);
  const summary = canAdvance
    ? `Everything needed to move to ${next} is in place.`
    : unmet.length === 0
      ? "This is the last stage implemented in this version."
      : unmet[0].detail;

  return { from: stage, to: next, canAdvance, requirements, summary };
}

export function nextStage(stage: StageId): StageId | null {
  const i = stageIndex(stage);
  return i >= 0 && i < STAGE_ORDER.length - 1 ? STAGE_ORDER[i + 1] : null;
}

export function requirementsFor(
  stage: StageId,
  memory: StartupMemory
): GateRequirement[] {
  switch (stage) {
    case "FOUNDER":
      return founderGate(memory);
    case "OPPORTUNITY":
      return opportunityGate(memory);
    case "RESEARCH":
      return researchGate(memory);
    case "VALIDATION":
      return validationGate(memory);
    case "PRODUCT":
      return productGate(memory);
    default:
      return [];
  }
}

// --- FOUNDER → OPPORTUNITY -------------------------------------------------
// We refuse to generate opportunities until we know enough about the founder
// that the output would be about *them*, not about startups in general.

function founderGate(memory: StartupMemory): GateRequirement[] {
  const profile = memory.founderProfile;
  if (!profile) {
    return [
      req(
        "profile",
        "Founder profile started",
        false,
        "We know nothing about you yet. Start the founder conversation."
      ),
    ];
  }

  const gaps = profileGaps(profile);
  const gapIds = new Set(gaps.map((g) => g.field));

  return [
    req(
      "domain",
      "At least one domain you know first-hand",
      !gapIds.has("domainExposure"),
      "Opportunities have to come from somewhere real. Tell us where you have actual exposure."
    ),
    req(
      "problems",
      "At least one problem you have witnessed",
      !gapIds.has("observedProblems"),
      "We need at least one problem you have personally seen, otherwise anything we suggest is a guess."
    ),
    req(
      "network",
      "People you can reach",
      !gapIds.has("networkAccess"),
      "Tell us who you can actually get hold of. It determines whether validation is cheap or impossible."
    ),
    req(
      "constraints",
      "Your time and budget",
      !gapIds.has("constraints.hoursPerWeek") && !gapIds.has("constraints.budgetSek"),
      "We need your real time and money constraints before recommending anything."
    ),
  ];
}

// --- OPPORTUNITY → RESEARCH ------------------------------------------------

function opportunityGate(memory: StartupMemory): GateRequirement[] {
  const selected = selectedOpportunity(memory);

  return [
    req(
      "generated",
      "Opportunities identified",
      memory.opportunities.length > 0,
      "No opportunities have been identified yet."
    ),
    req(
      "selected",
      "You have chosen one to pursue",
      selected !== null,
      "Choose one opportunity to focus on. Spark can suggest, but this decision is yours."
    ),
    req(
      "approved",
      "Your decision is recorded",
      selected?.approval === "FOUNDER_APPROVED" || selected?.approval === "FOUNDER_EDITED",
      "Confirm your selection so it is recorded as your decision, not a suggestion."
    ),
    req(
      "assumptions",
      "Its key assumptions are written down",
      memory.assumptions.filter((a) => a.opportunityId === selected?.id).length >= 2,
      "The chosen opportunity needs its key unknowns written as testable assumptions."
    ),
  ];
}

// --- RESEARCH → VALIDATION -------------------------------------------------
// Research is done when it has stopped changing our mind, not when it feels
// thorough. The bar: real evidence on the record, and the important
// assumptions identified.

function researchGate(memory: StartupMemory): GateRequirement[] {
  const research = memory.evidence.filter(
    (e) =>
      e.sourceType === "MARKET_RESEARCH" ||
      e.sourceType === "COMPETITOR" ||
      e.sourceType === "PUBLIC_DATA" ||
      e.sourceType === "OFFICIAL_SOURCE"
  );
  const important = importantAssumptions(memory.assumptions);

  return [
    req(
      "evidence",
      "Research evidence recorded",
      research.length >= 3,
      `Only ${research.length} research findings recorded. Desk research is cheap — do it before spending time on interviews.`
    ),
    req(
      "important",
      "The important assumptions are identified",
      important.length >= 1,
      "No high-importance assumptions identified yet. We do not know what would sink this."
    ),
    req(
      "untested",
      "At least one assumption is ready to test",
      important.some((a) => a.validationMethod !== "UNKNOWN"),
      "None of the important assumptions has a test method yet."
    ),
  ];
}

// --- VALIDATION → PRODUCT --------------------------------------------------
// The strictest gate in the product, and the point of the whole system: you do
// not get to build until the beliefs that would sink you have been tested.

function validationGate(memory: StartupMemory): GateRequirement[] {
  const important = importantAssumptions(memory.assumptions);
  const untested = important.filter((a) => a.status === "UNTESTED");
  const rejected = important.filter((a) => a.status === "REJECTED");
  const completedExperiments = memory.experiments.filter(
    (e) => e.status === "COMPLETE"
  );

  const problemAssumptions = important.filter((a) => a.category === "PROBLEM");
  const problemSupported = problemAssumptions.every(
    (a) => a.status === "SUPPORTED" || a.status === "PARTIALLY_SUPPORTED"
  );

  const wtp = important.filter(
    (a) => a.category === "WILLINGNESS_TO_PAY" || a.category === "PRICING"
  );
  const wtpTested = wtp.length === 0 || wtp.some((a) => a.status !== "UNTESTED");

  return [
    req(
      "experiment",
      "At least one experiment completed",
      completedExperiments.length >= 1,
      "No experiment has been completed and recorded yet."
    ),
    req(
      "untested",
      "No untested critical assumptions",
      untested.length === 0,
      untested.length === 1
        ? `Still untested: "${untested[0].statement}"`
        : `${untested.length} important assumptions are still untested.`
    ),
    req(
      "problem",
      "The problem is confirmed to exist",
      problemAssumptions.length > 0 && problemSupported,
      "The problem itself has not been confirmed with people who have it. Everything else depends on this."
    ),
    req(
      "wtp",
      "Willingness to pay has been probed",
      wtpTested,
      "Nobody has been asked to pay yet. Interest is not revenue."
    ),
    req(
      "notrejected",
      "No rejected assumption left unaddressed",
      rejected.length === 0,
      rejected.length > 0
        ? `An important assumption was rejected: "${rejected[0].statement}". Decide whether to pivot before building.`
        : ""
    ),
  ];
}

// --- PRODUCT → BUILD -------------------------------------------------------

function productGate(memory: StartupMemory): GateRequirement[] {
  const spec = memory.productSpec;

  return [
    req(
      "spec",
      "MVP specification exists",
      spec !== null,
      "No MVP specification has been created yet."
    ),
    req(
      "approved",
      "You approved the specification",
      spec?.approval === "FOUNDER_APPROVED" || spec?.approval === "FOUNDER_EDITED",
      "The MVP spec is a proposal until you approve it."
    ),
    req(
      "justified",
      "Every feature traces to something you learned",
      spec !== null &&
        spec.features.length > 0 &&
        spec.features.every((f) => f.justificationStrength !== "UNVALIDATED"),
      "Some features in scope are not justified by anything you validated. Cut them or validate them."
    ),
  ];
}
