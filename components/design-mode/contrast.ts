/** WCAG-kontrast. Hindrar oss från att designa något snyggt och oläsbart. */

function tillRgb(farg: string): [number, number, number] | null {
  const h = farg.trim().replace("#", "");
  if (/^[0-9a-f]{3}$/i.test(h)) {
    return [
      parseInt(h[0] + h[0], 16),
      parseInt(h[1] + h[1], 16),
      parseInt(h[2] + h[2], 16),
    ];
  }
  if (/^[0-9a-f]{6}$/i.test(h)) {
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16),
    ];
  }
  const m = farg.match(/rgba?\(([^)]+)\)/);
  if (m) {
    const d = m[1].split(",").map((x) => parseFloat(x));
    if (d.length >= 3) return [d[0], d[1], d[2]];
  }
  return null;
}

function luminans(rgb: [number, number, number]): number {
  const [r, g, b] = rgb.map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function kontrast(a: string, b: string): number | null {
  const ra = tillRgb(a);
  const rb = tillRgb(b);
  if (!ra || !rb) return null;
  const la = luminans(ra);
  const lb = luminans(rb);
  const ljus = Math.max(la, lb);
  const mork = Math.min(la, lb);
  return (ljus + 0.05) / (mork + 0.05);
}

export type KontrastPar = {
  etikett: string;
  fram: string;
  bak: string;
  krav: number;
};

export const KONTRASTPAR: KontrastPar[] = [
  { etikett: "Brödtext mot sidbakgrund", fram: "--body", bak: "--page", krav: 4.5 },
  { etikett: "Brödtext mot panelyta", fram: "--body", bak: "--panel", krav: 4.5 },
  { etikett: "Rubrik mot sidbakgrund", fram: "--bone", bak: "--page", krav: 4.5 },
  { etikett: "Metadata mot panelyta", fram: "--dim", bak: "--panel", krav: 4.5 },
  { etikett: "Text på accentfärg", fram: "--slab-ink", bak: "--slab", krav: 4.5 },
  { etikett: "Accent mot sidbakgrund", fram: "--slab", bak: "--page", krav: 3 },
];
