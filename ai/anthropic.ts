import Anthropic from "@anthropic-ai/sdk";
import { zodToJsonSchema } from "zod-to-json-schema";
import { LLMProvider, LLMRequest, LLMResponse, ModelRole, ProviderError } from "./provider";
import { estimateCostSek } from "./cost";

// ---------------------------------------------------------------------------
// Anthropic provider
//
// Used when ANTHROPIC_API_KEY is present. Responses are constrained with
// structured outputs and then validated again with the caller's zod schema —
// belt and braces, because a malformed agent result would corrupt Startup
// Memory.
//
// Note what this provider does NOT do: it never returns `grounded: true`. A
// language model cannot attest to sources on its own, so everything it
// produces is subject to the grounding rules in domain/rules/grounding.ts,
// which demote unsupported factual claims.
// ---------------------------------------------------------------------------

const MODELS: Record<ModelRole, string> = {
  // Deep reasoning: opportunity generation, validation design, product scoping.
  reasoning: "claude-opus-5",
  // Cheap, high-volume work: summarising, tidying founder input.
  fast: "claude-haiku-4-5",
  // Research synthesis.
  research: "claude-opus-5",
};

export class AnthropicProvider implements LLMProvider {
  readonly name = "anthropic";
  readonly isLive = true;
  private client: Anthropic;

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }

  modelFor(role: ModelRole): string {
    return MODELS[role];
  }

  async complete<T>(request: LLMRequest<T>): Promise<LLMResponse<T>> {
    const model = this.modelFor(request.role);
    const jsonSchema = zodToJsonSchema(request.schema, request.schemaName);

    try {
      const response = await this.client.messages.create({
        model,
        max_tokens: request.maxTokens ?? 16000,
        system: request.system,
        messages: [{ role: "user", content: request.prompt }],
        output_config: {
          format: {
            type: "json_schema",
            schema: jsonSchema as Record<string, unknown>,
          },
        },
      } as Anthropic.MessageCreateParamsNonStreaming);

      if (response.stop_reason === "refusal") {
        throw new ProviderError(
          "The model declined this request.",
          this.name
        );
      }

      const text = response.content
        .filter((block): block is Anthropic.TextBlock => block.type === "text")
        .map((block) => block.text)
        .join("");

      let parsed: unknown;
      try {
        parsed = JSON.parse(text);
      } catch {
        throw new ProviderError("Model returned invalid JSON.", this.name);
      }

      // Second validation pass: the schema is the contract, not a suggestion.
      const result = request.schema.safeParse(parsed);
      if (!result.success) {
        throw new ProviderError(
          `Model output did not match ${request.schemaName}: ${result.error.issues
            .map((i) => `${i.path.join(".")}: ${i.message}`)
            .join("; ")}`,
          this.name
        );
      }

      const inputTokens = response.usage.input_tokens;
      const outputTokens = response.usage.output_tokens;

      return {
        data: result.data,
        usage: {
          inputTokens,
          outputTokens,
          estimatedCostSek: estimateCostSek(model, inputTokens, outputTokens),
        },
        provider: this.name,
        model,
        grounded: false,
      };
    } catch (error) {
      if (error instanceof ProviderError) throw error;
      if (error instanceof Anthropic.APIError) {
        throw new ProviderError(
          `Anthropic API error ${error.status}: ${error.message}`,
          this.name,
          error
        );
      }
      throw new ProviderError(
        error instanceof Error ? error.message : "Unknown provider error",
        this.name,
        error
      );
    }
  }
}
