import type { DesignState, Theme } from "./types";
import { UTGANG } from "./tokens";

const tomma = { order: {}, hidden: [], variants: {} };

function tema(id: string, namn: string, over: Record<string, string>): Theme {
  return {
    id,
    namn,
    inbyggt: true,
    state: { tokens: { ...UTGANG, ...over }, nav: "left", sections: { ...tomma } },
  };
}

/** Tre utgångspunkter: den blågrå, en grön och en ljus. */
export const INBYGGDA_TEMAN: Theme[] = [
  tema("blagra", "Blågrå", {}),
  tema("gron", "Grön", {
    "--page": "#1E2622",
    "--panel": "#242D28",
    "--panel-2": "#1B231F",
    "--surface-raised": "#2A342E",
    "--slab": "#8FB79A",
    "--slab-hover": "#9FC4A9",
    "--slab-ink": "#121C16",
    "--bone": "#EFF3EF",
    "--body": "#A8B6AC",
    "--dim": "#6C7B70",
    "--line": "#313C35",
    "--line-soft": "#2A332D",
    "--ok": "#7FD3A0",
    "--warn": "#DCC06B",
    "--bad": "#DD8570",
  }),
  tema("ljus", "Ljus", {
    "--page": "#F4F6F8",
    "--panel": "#FFFFFF",
    "--panel-2": "#EFF2F5",
    "--surface-raised": "#FFFFFF",
    "--slab": "#1D4F7C",
    "--slab-hover": "#17415F",
    "--slab-ink": "#FFFFFF",
    "--bone": "#0E2033",
    "--body": "#44576A",
    "--dim": "#7C8B9A",
    "--line": "#DCE3E9",
    "--line-soft": "#E9EDF1",
    "--ok": "#0F8A5F",
    "--warn": "#94670A",
    "--bad": "#BC4438",
    "--radius": "8px",
  }),
];

/** Snabbpaletter — byter bara färgtokens, lämnar typografi och form. */
export type Palett = { namn: string; tokens: Record<string, string> };

export const PALETTER: Palett[] = [
  { namn: "Blågrå", tokens: INBYGGDA_TEMAN[0].state.tokens },
  { namn: "Grön", tokens: INBYGGDA_TEMAN[1].state.tokens },
  { namn: "Ljus", tokens: INBYGGDA_TEMAN[2].state.tokens },
  {
    namn: "Kol",
    tokens: {
      ...UTGANG,
      "--page": "#151719",
      "--panel": "#1C1F22",
      "--panel-2": "#121416",
      "--surface-raised": "#23272B",
      "--slab": "#D8C9A3",
      "--slab-hover": "#E3D6B5",
      "--slab-ink": "#1A1712",
      "--bone": "#F2F1EE",
      "--body": "#A9A69E",
      "--dim": "#6E6B64",
      "--line": "#2A2D31",
      "--line-soft": "#222528",
    },
  },
];

export const START_STATE: DesignState = {
  tokens: { ...UTGANG },
  nav: "left",
  sections: { order: {}, hidden: [], variants: {} },
};
