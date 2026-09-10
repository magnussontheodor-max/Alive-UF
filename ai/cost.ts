// ---------------------------------------------------------------------------
// Cost estimation
//
// Prices are USD per million tokens, converted to SEK for display since the
// product is aimed at Swedish founders. These are estimates recorded against
// each AgentRun, not billing data — the UI labels them as such.
// ---------------------------------------------------------------------------

export interface ModelPricing {
  inputPerMillionUsd: number;
  outputPerMillionUsd: number;
}

export const PRICING: Record<string, ModelPricing> = {
  "claude-opus-5": { inputPerMillionUsd: 5, outputPerMillionUsd: 25 },
  "claude-sonnet-5": { inputPerMillionUsd: 2, outputPerMillionUsd: 10 },
  "claude-haiku-4-5": { inputPerMillionUsd: 1, outputPerMillionUsd: 5 },
};

/** Rough conversion for display. Not a live FX rate. */
export const USD_TO_SEK = 10.5;

export function estimateCostSek(
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  const pricing = PRICING[model];
  if (!pricing) return 0;
  const usd =
    (inputTokens / 1_000_000) * pricing.inputPerMillionUsd +
    (outputTokens / 1_000_000) * pricing.outputPerMillionUsd;
  return Number((usd * USD_TO_SEK).toFixed(4));
}

/** Crude token estimate used by the offline provider so run records are populated. */
export function approximateTokens(text: string): number {
  return Math.ceil(text.length / 3.6);
}
