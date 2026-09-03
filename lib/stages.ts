import { Stage, StageId, StageStatus } from "./types";

export const STAGES: Stage[] = [
  {
    id: "founder",
    label: "Founder",
    shortLabel: "Founder",
    description: "Who you are, what you're good at, and what you want out of this.",
  },
  {
    id: "opportunity",
    label: "Opportunity",
    shortLabel: "Opportunity",
    description: "Finding a business worth building.",
  },
  {
    id: "research",
    label: "Research",
    shortLabel: "Research",
    description: "Understanding the market, competitors and customers.",
  },
  {
    id: "validation",
    label: "Validation",
    shortLabel: "Validation",
    description: "Testing whether the core assumption actually holds.",
  },
  {
    id: "product",
    label: "Product",
    shortLabel: "Product",
    description: "Turning a validated idea into a specific MVP.",
  },
  {
    id: "build",
    label: "Build",
    shortLabel: "Build",
    description: "Orchestrating AI coding agents to build the MVP.",
  },
  {
    id: "legal",
    label: "Legal",
    shortLabel: "Legal",
    description: "Getting the Swedish business fundamentals in place.",
  },
  {
    id: "launch",
    label: "Launch",
    shortLabel: "Launch",
    description: "Going live and acquiring the first customers.",
  },
];

export function stageIndex(id: StageId): number {
  return STAGES.findIndex((s) => s.id === id);
}

export function stageStatus(id: StageId, currentStage: StageId): StageStatus {
  const diff = stageIndex(id) - stageIndex(currentStage);
  if (diff < 0) return "done";
  if (diff === 0) return "current";
  return "upcoming";
}

export function getStage(id: StageId): Stage {
  const stage = STAGES.find((s) => s.id === id);
  if (!stage) throw new Error(`Unknown stage: ${id}`);
  return stage;
}
