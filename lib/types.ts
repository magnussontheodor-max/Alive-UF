// ---------------------------------------------------------------------------
// Core domain types for Startup OS.
//
// These types describe the conceptual architecture requested for the
// prototype: a Startup owned by a Founder, a persistent StartupMemory that
// every screen reads from, an Orchestrator that decides what happens next,
// a set of specialised Agents that do the work, and Tasks that represent
// the concrete next actions surfaced to the founder.
//
// Everything here is mocked for the prototype, but the shapes are meant to
// survive the transition to a real backend: swap the mock data source for a
// database/API call and the UI layer does not need to change.
// ---------------------------------------------------------------------------

export type StageId =
  | "founder"
  | "opportunity"
  | "research"
  | "validation"
  | "product"
  | "build"
  | "legal"
  | "launch";

export interface Stage {
  id: StageId;
  label: string;
  shortLabel: string;
  description: string;
}

export type StageStatus = "done" | "current" | "upcoming";

// ---------------------------------------------------------------------------
// Founder
// ---------------------------------------------------------------------------

export interface Founder {
  id: string;
  name: string;
  email: string;
  location: string;
  skills: string[];
  interests: string[];
  hoursPerWeek: number;
  budgetSek: number;
  preference: "B2B" | "B2C" | "No preference";
  productTypePreference: string[];
}

// ---------------------------------------------------------------------------
// Startup Memory — the single persistent understanding of the company that
// every agent reads from and writes to.
// ---------------------------------------------------------------------------

export interface StartupSnapshot {
  customer: string;
  problem: string;
  solution: string;
  businessModel: string;
  targetMarket: string;
  currentStage: StageId;
}

export interface MemoryEvent {
  id: string;
  timestamp: string;
  source: "founder" | "orchestrator" | "agent";
  summary: string;
  detail?: string;
}

export interface StartupMemory {
  snapshot: StartupSnapshot;
  assumptions: Assumption[];
  events: MemoryEvent[];
}

export interface Assumption {
  id: string;
  statement: string;
  risk: "low" | "medium" | "high";
  status: "untested" | "testing" | "partially validated" | "validated" | "invalidated";
}

// ---------------------------------------------------------------------------
// Tasks — the concrete next actions the Orchestrator creates.
// ---------------------------------------------------------------------------

export interface Task {
  id: string;
  stage: StageId;
  title: string;
  rationale: string;
  agent: AgentId;
  status: "next" | "queued" | "done";
  ctaLabel: string;
}

// ---------------------------------------------------------------------------
// Agents — specialised capabilities the Orchestrator can call on. The
// founder never picks these directly; the Orchestrator selects them.
// ---------------------------------------------------------------------------

export type AgentId =
  | "idea"
  | "research"
  | "validation"
  | "product-architect"
  | "build"
  | "legal"
  | "orchestrator";

export interface Agent {
  id: AgentId;
  name: string;
  role: string;
}

// ---------------------------------------------------------------------------
// Opportunity (Idea stage output)
// ---------------------------------------------------------------------------

export interface Opportunity {
  id: string;
  rank: number;
  title: string;
  score: number;
  targetCustomer: string;
  problem: string;
  whyItFits: string;
  mvpComplexity: "Low" | "Medium" | "High";
}

// ---------------------------------------------------------------------------
// Research stage
// ---------------------------------------------------------------------------

export interface ResearchFinding {
  id: string;
  category: "Market" | "Competitors" | "Customers" | "Trends" | "Risks";
  title: string;
  detail: string;
  confidence: "low" | "medium" | "high";
}

// ---------------------------------------------------------------------------
// Product stage
// ---------------------------------------------------------------------------

export interface MvpFeature {
  label: string;
  included: boolean;
}

// ---------------------------------------------------------------------------
// Build stage
// ---------------------------------------------------------------------------

export type BuildStepStatus = "done" | "in-progress" | "pending";

export interface BuildStep {
  id: string;
  label: string;
  status: BuildStepStatus;
}

// ---------------------------------------------------------------------------
// Legal stage
// ---------------------------------------------------------------------------

export interface LegalItem {
  id: string;
  label: string;
  detail: string;
  status: "done" | "pending" | "review";
  link?: { label: string; href: string };
}

// ---------------------------------------------------------------------------
// Launch stage
// ---------------------------------------------------------------------------

export interface LaunchReadinessItem {
  id: string;
  label: string;
  status: "done" | "in-progress" | "pending";
  detail?: string;
  percent?: number;
}

// ---------------------------------------------------------------------------
// Co-founder chat
// ---------------------------------------------------------------------------

export interface ChatMessage {
  id: string;
  role: "founder" | "cofounder";
  text: string;
  memoryUpdate?: string;
  nextAction?: string;
}
