import { z } from "zod";

// ---------------------------------------------------------------------------
// LLM provider abstraction
//
// The application never imports a vendor SDK. It asks for a capability tier
// ("reasoning", "fast", "research") and gets structured, schema-validated JSON
// back. Swapping Anthropic for another provider means writing one file.
//
// Two rules that matter more than the interface itself:
//
//  1. Every call is schema-validated with zod. A provider that returns prose
//     where the application expected structure is a failed call, not a
//     degraded one.
//  2. Providers declare `grounded`. A provider that cannot cite sources (any
//     current LLM, on its own) never gets to emit a FACT — the grounding rules
//     downstream demote whatever it claims.
// ---------------------------------------------------------------------------

export type ModelRole = "reasoning" | "fast" | "research";

export interface LLMRequest<T> {
  role: ModelRole;
  /** Who is asking. Recorded on the AgentRun. */
  agent: string;
  /** System framing for this agent's mission and boundaries. */
  system: string;
  /** The structured task. */
  prompt: string;
  /** Schema the response must satisfy. */
  schema: z.ZodType<T>;
  /** Name of the shape, used in the prompt to describe what to return. */
  schemaName: string;
  maxTokens?: number;
}

export interface LLMResponse<T> {
  data: T;
  usage: {
    inputTokens: number;
    outputTokens: number;
    estimatedCostSek: number;
  };
  provider: string;
  model: string;
  /** True only if the provider can attribute claims to retrievable sources. */
  grounded: boolean;
}

export interface LLMProvider {
  readonly name: string;
  modelFor(role: ModelRole): string;
  complete<T>(request: LLMRequest<T>): Promise<LLMResponse<T>>;
  /** Whether this provider is a live model or the offline reasoning engine. */
  readonly isLive: boolean;
}

export class ProviderError extends Error {
  constructor(
    message: string,
    readonly provider: string,
    readonly cause?: unknown
  ) {
    super(message);
    this.name = "ProviderError";
  }
}
