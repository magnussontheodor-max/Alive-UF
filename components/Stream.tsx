"use client";

import { useEffect, useState } from "react";

/**
 * Skriver fram text tecken för tecken. Strömningen är det som gör att
 * medgrundaren känns levande i stället för som en attrapp — momentan text
 * avslöjar prototypen direkt.
 *
 * Texten härleds ur antalet visade tecken, så ett inaktivt block (redan
 * färdigskrivet, eller en besökare som valt reducerad rörelse) renderas
 * fullständigt utan att något tillstånd behöver sättas i en effekt.
 */
export function useTypewriter(
  text: string,
  { hastighet = 11, aktiv = true }: { hastighet?: number; aktiv?: boolean } = {},
) {
  const [reducerad] = useState(
    () =>
      typeof window !== "undefined" &&
      Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches),
  );
  const [antal, setAntal] = useState(0);

  const skriver = aktiv && !reducerad && text.length > 0;

  useEffect(() => {
    if (!skriver) return;

    let i = 0;
    let timer = 0;

    const tick = () => {
      // Två tecken i taget — jämnare än ett per bildruta, och snabbt nog
      // att ett långt svar hinner klart innan uppmärksamheten gör det.
      i = Math.min(text.length, i + 2);
      setAntal(i);
      if (i >= text.length) return;
      const tecken = text[i - 1];
      const paus =
        tecken === "." || tecken === "?" || tecken === "!"
          ? hastighet * 9
          : hastighet;
      timer = window.setTimeout(tick, paus);
    };

    timer = window.setTimeout(tick, 90);
    return () => window.clearTimeout(timer);
  }, [skriver, text, hastighet]);

  return {
    visat: skriver ? text.slice(0, antal) : text,
    klar: !skriver || antal >= text.length,
  };
}
