import { AgentId, StageId } from "./types";

export const stageHref: Record<StageId, string> = {
  founder: "/settings",
  opportunity: "/idea",
  research: "/research",
  validation: "/validation",
  product: "/product",
  build: "/build",
  legal: "/legal",
  launch: "/launch",
};

export const agentHref: Record<AgentId, string> = {
  orchestrator: "/",
  idea: "/idea",
  research: "/research",
  validation: "/validation",
  "product-architect": "/product",
  build: "/build",
  legal: "/legal",
};
