import { LLMProvider } from "./provider";
import { AnthropicProvider } from "./anthropic";

export * from "./provider";
export * from "./cost";

// ---------------------------------------------------------------------------
// Provider selection
//
// A live provider exists only when an API key is configured. When it is not,
// `getProvider()` returns null and agents fall back to their deterministic
// reasoning path — which produces the same structured AgentResult, so nothing
// downstream branches on this.
//
// The mode is surfaced in the UI rather than hidden, because a founder should
// know whether a recommendation came from a model or from rules.
// ---------------------------------------------------------------------------

let cached: LLMProvider | null | undefined;

export function getProvider(): LLMProvider | null {
  if (cached !== undefined) return cached;

  const key = process.env.ANTHROPIC_API_KEY;
  cached = key ? new AnthropicProvider(key) : null;
  return cached;
}

export type ReasoningMode = "live" | "deterministic";

export function reasoningMode(): ReasoningMode {
  return getProvider() ? "live" : "deterministic";
}

export const REASONING_MODE_LABEL: Record<ReasoningMode, string> = {
  live: "Live model",
  deterministic: "Offline reasoning",
};

export const REASONING_MODE_EXPLANATION: Record<ReasoningMode, string> = {
  live: "Agents are reasoning with a language model. Output is still checked against the grounding rules before it is saved.",
  deterministic:
    "No model is connected, so agents use built-in rules over what you have entered. They will not invent facts, and will say when they cannot conclude anything.",
};
