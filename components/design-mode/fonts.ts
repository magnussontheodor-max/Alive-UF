/** Typsnitt hämtas från Google Fonts först när de väljs. */

export type FontVal = { namn: string; gf: string | null; vikter: string };

export const FONTER: FontVal[] = [
  { namn: "Chakra Petch", gf: "Chakra+Petch:wght@400;500;600;700", vikter: "500 600 700" },
  { namn: "Inter", gf: "Inter:wght@400;500;600;700", vikter: "400 500 600 700" },
  { namn: "Space Grotesk", gf: "Space+Grotesk:wght@400;500;600;700", vikter: "400 500 700" },
  { namn: "IBM Plex Sans", gf: "IBM+Plex+Sans:wght@400;500;600;700", vikter: "400 500 600" },
  { namn: "Archivo", gf: "Archivo:wght@400;500;600;700", vikter: "400 500 700" },
  { namn: "Schibsted Grotesk", gf: "Schibsted+Grotesk:wght@400;500;600;700", vikter: "400 500 700" },
  { namn: "Anton", gf: "Anton", vikter: "400" },
  { namn: "Bebas Neue", gf: "Bebas+Neue", vikter: "400" },
  { namn: "Familjen Grotesk", gf: "Familjen+Grotesk:wght@400;500;600;700", vikter: "400 500 700" },
  { namn: "Instrument Sans", gf: "Instrument+Sans:wght@400;500;600;700", vikter: "400 500 700" },
  { namn: "Manrope", gf: "Manrope:wght@400;500;600;700", vikter: "400 500 700" },
  { namn: "Castoro", gf: "Castoro:ital@0;1", vikter: "400" },
  { namn: "JetBrains Mono", gf: "JetBrains+Mono:wght@400;500;700", vikter: "400 500 700" },
  { namn: "IBM Plex Mono", gf: "IBM+Plex+Mono:wght@400;500;600", vikter: "400 500 600" },
  { namn: "system-ui", gf: null, vikter: "400 500 600 700" },
];

const laddade = new Set<string>();

export function laddaFont(namn: string) {
  const f = FONTER.find((x) => x.namn === namn);
  if (!f || !f.gf || laddade.has(namn) || typeof document === "undefined") return;
  laddade.add(namn);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.dataset.designFont = namn;
  link.href = `https://fonts.googleapis.com/css2?family=${f.gf}&display=swap`;
  document.head.appendChild(link);
}

/** Alla valda typsnitt måste finnas när ett tema läses in. */
export function laddaAllaFran(tokens: Record<string, string>) {
  [tokens["--font-display"], tokens["--font-body"]].forEach((n) => n && laddaFont(n));
}
