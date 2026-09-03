import {
  Agent,
  Assumption,
  BuildStep,
  ChatMessage,
  Founder,
  LaunchReadinessItem,
  LegalItem,
  MemoryEvent,
  MvpFeature,
  Opportunity,
  ResearchFinding,
  StartupMemory,
  Task,
} from "./types";

// ---------------------------------------------------------------------------
// Founder
// ---------------------------------------------------------------------------

export const founder: Founder = {
  id: "f_1",
  name: "Elin Karlsson",
  email: "elin@example.com",
  location: "Stockholm, Sweden",
  skills: ["B2B sales", "Product management", "Basic SQL"],
  interests: ["AI / automation", "B2B software", "Sales tooling"],
  hoursPerWeek: 25,
  budgetSek: 45000,
  preference: "B2B",
  productTypePreference: ["SaaS", "AI product"],
};

// ---------------------------------------------------------------------------
// Startup Memory — LeadFlow AI
// ---------------------------------------------------------------------------

export const startupName = "LeadFlow AI";

export const startupMemory: StartupMemory = {
  snapshot: {
    customer: "Small Swedish B2B companies with 2-15 person sales teams",
    problem: "Sales teams spend too much time manually qualifying inbound leads.",
    solution: "AI-powered lead qualification that scores and explains lead quality automatically.",
    businessModel: "B2B SaaS, monthly subscription",
    targetMarket: "Sweden initially, Nordics next",
    currentStage: "validation",
  },
  assumptions: [
    {
      id: "a_1",
      statement:
        "Swedish B2B sales teams have a painful enough lead qualification problem to pay for an automated solution.",
      risk: "high",
      status: "partially validated",
    },
    {
      id: "a_2",
      statement: "Teams will trust an AI score enough to act on it without re-checking every lead.",
      risk: "medium",
      status: "untested",
    },
    {
      id: "a_3",
      statement: "999 SEK/month is an acceptable price point for a 2-15 person sales team.",
      risk: "high",
      status: "testing",
    },
    {
      id: "a_4",
      statement: "CRM integration is required before teams will adopt, not a nice-to-have.",
      risk: "medium",
      status: "untested",
    },
  ],
  events: [
    {
      id: "e_1",
      timestamp: "2026-08-14T09:12:00Z",
      source: "founder",
      summary: "Startup profile created from opportunity \"AI Lead Qualification\".",
    },
    {
      id: "e_2",
      timestamp: "2026-08-19T13:40:00Z",
      source: "agent",
      summary: "Research Agent completed market & competitor scan.",
      detail: "5 direct/adjacent competitors identified. No dominant player in the Swedish SMB segment.",
    },
    {
      id: "e_3",
      timestamp: "2026-08-27T10:05:00Z",
      source: "founder",
      summary: "Logged 7 customer interviews. Problem confirmed by 6/7, willingness to pay partial.",
    },
    {
      id: "e_4",
      timestamp: "2026-09-01T15:22:00Z",
      source: "founder",
      summary: "Two interviewees said they'd pay if the product integrates with their CRM.",
      detail: "CRM integration added as a potential MVP requirement.",
    },
    {
      id: "e_5",
      timestamp: "2026-09-01T15:23:00Z",
      source: "orchestrator",
      summary: "Startup memory updated. Highest-risk assumption re-ranked to pricing.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Agents
// ---------------------------------------------------------------------------

export const agents: Agent[] = [
  { id: "orchestrator", name: "Orchestrator", role: "Decides what should happen next" },
  { id: "idea", name: "Idea Agent", role: "Generates and scores business opportunities" },
  { id: "research", name: "Research Agent", role: "Gathers market, competitor and customer evidence" },
  { id: "validation", name: "Validation Agent", role: "Designs experiments and tracks confidence" },
  { id: "product-architect", name: "Product Architect Agent", role: "Turns validated ideas into an MVP spec" },
  { id: "build", name: "Build Agent", role: "Orchestrates AI coding agents to build the MVP" },
  { id: "legal", name: "Legal Agent", role: "Generates a Swedish company setup checklist" },
];

// ---------------------------------------------------------------------------
// Next best action (drives the Dashboard + Orchestrator explanation)
// ---------------------------------------------------------------------------

export const nextTask: Task = {
  id: "t_1",
  stage: "validation",
  title: "Interview 3 potential customers",
  rationale:
    "Your biggest remaining assumption is whether Swedish B2B sales teams are willing to pay for automated lead qualification.",
  agent: "validation",
  status: "next",
  ctaLabel: "Start task",
};

export const upcomingTasks: Task[] = [
  {
    id: "t_2",
    stage: "validation",
    title: "Test pricing at 999 SEK/month with 5 more customers",
    rationale: "Pricing is now the highest-risk assumption after this week's interviews.",
    agent: "validation",
    status: "queued",
    ctaLabel: "Start task",
  },
  {
    id: "t_3",
    stage: "product",
    title: "Draft MVP spec including CRM integration",
    rationale: "Two interviewees said CRM integration is a condition for paying.",
    agent: "product-architect",
    status: "queued",
    ctaLabel: "Start task",
  },
];

// ---------------------------------------------------------------------------
// Opportunity stage
// ---------------------------------------------------------------------------

export const opportunities: Opportunity[] = [
  {
    id: "o_1",
    rank: 1,
    title: "AI Lead Qualification",
    score: 87,
    targetCustomer: "Small Swedish B2B companies with 2-15 person sales teams",
    problem: "Sales teams waste hours manually qualifying leads that go nowhere.",
    whyItFits: "Matches your B2B sales background and interest in AI/automation tooling.",
    mvpComplexity: "Medium",
  },
  {
    id: "o_2",
    rank: 2,
    title: "AI Admin Assistant for Consultants",
    score: 81,
    targetCustomer: "Independent Swedish management consultants",
    problem: "Solo consultants lose billable hours to scheduling, invoicing and follow-ups.",
    whyItFits: "Low technical complexity, plays to your product management experience.",
    mvpComplexity: "Low",
  },
  {
    id: "o_3",
    rank: 3,
    title: "Booking Software for Independent Clinics",
    score: 74,
    targetCustomer: "Independent physiotherapy and dental clinics",
    problem: "Clinics rely on phone bookings and no-shows cost them revenue.",
    whyItFits: "Large addressable market, but more competition and a longer sales cycle.",
    mvpComplexity: "High",
  },
];

// ---------------------------------------------------------------------------
// Research stage
// ---------------------------------------------------------------------------

export const researchFindings: ResearchFinding[] = [
  {
    id: "r_1",
    category: "Market",
    title: "~45,000 SMBs in Sweden run an active outbound or inbound sales motion",
    detail:
      "Estimated from Swedish company registry segments with 2-50 employees and a listed sales function. Demo estimate, not a licensed market report.",
    confidence: "medium",
  },
  {
    id: "r_2",
    category: "Market",
    title: "B2B SaaS spend per SMB is rising, but tool fatigue is a real objection",
    detail: "Several interviewees mentioned already juggling 4-6 sales tools.",
    confidence: "medium",
  },
  {
    id: "r_3",
    category: "Competitors",
    title: "No dominant lead-qualification specialist in the Swedish SMB segment",
    detail: "Existing players (e.g. large CRM suites) treat scoring as a minor add-on feature, not the core product.",
    confidence: "high",
  },
  {
    id: "r_4",
    category: "Competitors",
    title: "5 adjacent tools identified, mostly targeting enterprise",
    detail: "Enterprise-focused competitors are priced and positioned far above the SMB segment LeadFlow AI targets.",
    confidence: "high",
  },
  {
    id: "r_5",
    category: "Customers",
    title: "Sales managers are the primary buyer, reps are the primary user",
    detail: "Interviews suggest the manager evaluates and buys; reps need to trust the score day-to-day.",
    confidence: "medium",
  },
  {
    id: "r_6",
    category: "Customers",
    title: "CRM integration keeps surfacing as a hard requirement",
    detail: "3 of 7 interviewees would not adopt a tool that lives outside their CRM.",
    confidence: "high",
  },
  {
    id: "r_7",
    category: "Trends",
    title: "AI-assisted sales tooling adoption is accelerating in the Nordics",
    detail: "General direction is favorable; timing risk is low.",
    confidence: "medium",
  },
  {
    id: "r_8",
    category: "Risks",
    title: "Buyers may expect the CRM vendor to ship this feature natively",
    detail: "Needs to be tested directly rather than assumed.",
    confidence: "low",
  },
  {
    id: "r_9",
    category: "Risks",
    title: "Data privacy questions will come up when handling lead data",
    detail: "Swedish/EU customers will expect a clear GDPR answer early in the sales conversation.",
    confidence: "medium",
  },
];

export const researchUnknowns: string[] = [
  "How much time does a typical sales team actually spend qualifying leads per week?",
  "Would teams trust an AI-generated score without manually re-checking it?",
  "Is CRM integration a launch requirement, or can it be a fast-follow?",
];

// ---------------------------------------------------------------------------
// Validation stage
// ---------------------------------------------------------------------------

export const validationAssumptions: Assumption[] = startupMemory.assumptions;

export const experimentSuccessCriteria = [
  "3+ confirm the problem",
  "2+ agree to a trial",
  "1+ agrees to pay",
];

// ---------------------------------------------------------------------------
// Product stage
// ---------------------------------------------------------------------------

export const coreWorkflow: string[] = [
  "Upload or connect leads",
  "AI evaluates lead quality",
  "Lead receives a score",
  "Salesperson sees the reasoning",
  "Salesperson takes action",
];

export const mvpFeatures: MvpFeature[] = [
  { label: "Authentication", included: true },
  { label: "Lead upload", included: true },
  { label: "AI qualification", included: true },
  { label: "Lead dashboard", included: true },
  { label: "Basic analytics", included: true },
];

export const notBuildingYet: MvpFeature[] = [
  { label: "Mobile app", included: false },
  { label: "Social features", included: false },
  { label: "Advanced CRM integrations", included: false },
  { label: "Enterprise permissions", included: false },
];

// ---------------------------------------------------------------------------
// Build stage
// ---------------------------------------------------------------------------

export const initialBuildSteps: BuildStep[] = [
  { id: "b_1", label: "Product specification", status: "pending" },
  { id: "b_2", label: "Database", status: "pending" },
  { id: "b_3", label: "Authentication", status: "pending" },
  { id: "b_4", label: "Core application", status: "pending" },
  { id: "b_5", label: "AI integration", status: "pending" },
  { id: "b_6", label: "Testing", status: "pending" },
  { id: "b_7", label: "Deployment", status: "pending" },
];

// ---------------------------------------------------------------------------
// Legal stage
// ---------------------------------------------------------------------------

export const legalChecklist: LegalItem[] = [
  {
    id: "l_1",
    label: "Determine company structure",
    detail: "Based on your solo founding and moderate risk, a Swedish Aktiebolag (AB) fits best.",
    status: "done",
  },
  {
    id: "l_2",
    label: "Business registration",
    detail: "Register the AB with Bolagsverket. Minimum share capital: 25,000 SEK.",
    status: "done",
    link: { label: "Bolagsverket — Start a business", href: "https://bolagsverket.se" },
  },
  {
    id: "l_3",
    label: "Tax registration",
    detail: "Register for F-skatt and employer registration with Skatteverket.",
    status: "done",
    link: { label: "Skatteverket — F-tax", href: "https://skatteverket.se" },
  },
  {
    id: "l_4",
    label: "VAT considerations",
    detail: "SaaS sold to Swedish businesses is standard-rated (25%). EU sales may need MOSS/OSS registration.",
    status: "done",
  },
  {
    id: "l_5",
    label: "Privacy / GDPR considerations",
    detail: "You'll process lead data on behalf of customers — a DPA template and a public privacy policy are recommended before launch.",
    status: "pending",
  },
  {
    id: "l_6",
    label: "Terms & conditions",
    detail: "SaaS terms covering subscriptions, data handling and liability limits.",
    status: "pending",
  },
  {
    id: "l_7",
    label: "Cookie considerations",
    detail: "Marketing site and app will need a cookie banner compliant with Swedish implementation of the ePrivacy directive.",
    status: "pending",
  },
  {
    id: "l_8",
    label: "Review with a professional where appropriate",
    detail: "Recommended before signing your first paid customer contract.",
    status: "review",
  },
];

// ---------------------------------------------------------------------------
// Launch stage
// ---------------------------------------------------------------------------

export const launchReadiness: LaunchReadinessItem[] = [
  { id: "la_1", label: "Website", status: "done" },
  { id: "la_2", label: "MVP", status: "done" },
  { id: "la_3", label: "Payments", status: "done" },
  { id: "la_4", label: "Analytics", status: "done" },
  { id: "la_5", label: "Legal checklist", status: "in-progress", percent: 80 },
  { id: "la_6", label: "Marketing plan", status: "done" },
  { id: "la_7", label: "Customer acquisition", status: "pending" },
];

export const launchReadinessPercent = 82;

// ---------------------------------------------------------------------------
// AI Co-founder chat (mocked conversation)
// ---------------------------------------------------------------------------

export const initialChat: ChatMessage[] = [
  {
    id: "c_1",
    role: "cofounder",
    text: "Welcome back. You're in Validation — 7 of 10 planned customer interviews are logged. What's new?",
  },
];

export const scriptedFounderMessage =
  "I spoke to three potential customers. Two said they would pay, but they want the product to integrate with their CRM.";

export const scriptedCofounderReply: ChatMessage = {
  id: "c_reply",
  role: "cofounder",
  text: "That's useful validation. I've updated your startup profile and added CRM integration as a potential MVP requirement. Your next highest-risk assumption is now pricing.",
  memoryUpdate: "Startup memory updated",
  nextAction: "Test pricing with 5 more customers",
};
