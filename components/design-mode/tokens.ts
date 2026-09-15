import type { TokenDef } from "./types";

export const FARG_TOKENS: TokenDef[] = [
  { namn: "--page", etikett: "Sidbakgrund", kind: "color" },
  { namn: "--panel", etikett: "Panelyta", kind: "color" },
  { namn: "--panel-2", etikett: "Sidomeny", kind: "color" },
  { namn: "--surface-raised", etikett: "Upphöjd yta", kind: "color" },
  { namn: "--slab", etikett: "Accent", kind: "color" },
  { namn: "--slab-hover", etikett: "Accent, hover", kind: "color" },
  { namn: "--slab-ink", etikett: "Text på accent", kind: "color" },
  { namn: "--bone", etikett: "Rubriker", kind: "color" },
  { namn: "--body", etikett: "Brödtext", kind: "color" },
  { namn: "--dim", etikett: "Metadata", kind: "color" },
  { namn: "--line", etikett: "Avdelare", kind: "color" },
  { namn: "--line-soft", etikett: "Svag avdelare", kind: "color" },
  { namn: "--ok", etikett: "Positiv", kind: "color" },
  { namn: "--warn", etikett: "Varning", kind: "color" },
  { namn: "--bad", etikett: "Negativ", kind: "color" },
];

export const TYPO_TOKENS: TokenDef[] = [
  { namn: "--scale", etikett: "Storlek", kind: "number", min: 0.8, max: 1.4, step: 0.01, suffix: "×" },
  { namn: "--track-head", etikett: "Spärr, rubriker", kind: "number", min: -0.05, max: 0.1, step: 0.005, suffix: "em" },
  { namn: "--track-label", etikett: "Spärr, etiketter", kind: "number", min: 0, max: 0.3, step: 0.005, suffix: "em" },
  { namn: "--track-body", etikett: "Spärr, brödtext", kind: "number", min: -0.02, max: 0.08, step: 0.005, suffix: "em" },
  { namn: "--lh-body", etikett: "Radhöjd, brödtext", kind: "number", min: 1.2, max: 2, step: 0.01, suffix: "" },
  { namn: "--lh-head", etikett: "Radhöjd, rubriker", kind: "number", min: 0.95, max: 1.5, step: 0.01, suffix: "" },
];

export const LAYOUT_TOKENS: TokenDef[] = [
  { namn: "--space", etikett: "Avstånd", kind: "number", min: 0.6, max: 1.6, step: 0.01, suffix: "×" },
  { namn: "--radius", etikett: "Hörnradie", kind: "length", min: 0, max: 24, step: 1, suffix: "px" },
  { namn: "--border-width", etikett: "Linjetjocklek", kind: "length", min: 0, max: 4, step: 0.5, suffix: "px" },
  { namn: "--maxw", etikett: "Innehållets bredd", kind: "length", min: 720, max: 1600, step: 20, suffix: "px" },
];

/** Utgångsläget. Speglar app/tokens.css och används av Återställ och jämförelsen. */
export const UTGANG: Record<string, string> = {
  "--page": "#262B31",
  "--panel": "#2B3138",
  "--panel-2": "#232830",
  "--surface-raised": "#2F353D",
  "--slab": "#8098AC",
  "--slab-hover": "#8FA6B8",
  "--slab-ink": "#16222E",
  "--bone": "#F0F2F3",
  "--body": "#A9B4AE",
  "--dim": "#6B757D",
  "--line": "#343A41",
  "--line-soft": "#2E343A",
  "--ok": "#6FCF97",
  "--warn": "#E8C468",
  "--bad": "#E88068",
  "--font-display": "Chakra Petch",
  "--font-body": "Chakra Petch",
  "--scale": "1",
  "--track-head": "-0.01em",
  "--track-label": "0.12em",
  "--track-body": "0.02em",
  "--lh-body": "1.6",
  "--lh-head": "1.15",
  "--case-body": "none",
  "--radius": "3px",
  "--space": "1",
  "--border-width": "1px",
  "--maxw": "1120px",
};

export const ALLA_TOKENS = [...FARG_TOKENS, ...TYPO_TOKENS, ...LAYOUT_TOKENS];

/** Reglagen arbetar i tal; tokens lagras med enhet. */
export function tillTal(varde: string): number {
  return parseFloat(String(varde).replace(/[^\d.-]/g, "")) || 0;
}
export function franTal(tal: number, suffix?: string): string {
  const avrundat = Math.round(tal * 1000) / 1000;
  return suffix === "×" || suffix === "" ? String(avrundat) : `${avrundat}${suffix ?? ""}`;
}
