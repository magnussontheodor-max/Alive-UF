"use client";

import { useEffect } from "react";
import { DesignModeProvider, useDesign } from "./store";
import { DesignPanel } from "./DesignPanel";

/**
 * Designläget i sin helhet. Ligger som syskon till appen, inte runt den —
 * tokens skrivs på :root och sektioner läses ur DOM:en, så ingen del av
 * prototypen renderas om när ett reglage dras.
 *
 * Ta bort designläget genom att radera den här mappen och raden som
 * renderar <DesignMode /> i app/layout.tsx.
 */
export function DesignMode() {
  return (
    <DesignModeProvider>
      <Attribut />
      <DesignPanel />
    </DesignModeProvider>
  );
}

/** Sätter de attribut som globals.css hänger markeringar och breddläge på. */
function Attribut() {
  const { aktiv, hovrad, bredd } = useDesign();

  useEffect(() => {
    const r = document.documentElement;
    if (aktiv) r.dataset.designOn = "1";
    else delete r.dataset.designOn;
    return () => {
      delete r.dataset.designOn;
    };
  }, [aktiv]);

  useEffect(() => {
    const r = document.documentElement;
    if (hovrad) r.dataset.designHover = hovrad;
    else delete r.dataset.designHover;
  }, [hovrad]);

  useEffect(() => {
    const r = document.documentElement;
    if (bredd === "full") {
      delete r.dataset.designVp;
      r.style.removeProperty("--design-vp");
    } else {
      r.dataset.designVp = "1";
      r.style.setProperty("--design-vp", `${bredd}px`);
    }
    return () => {
      delete r.dataset.designVp;
      r.style.removeProperty("--design-vp");
    };
  }, [bredd]);

  return null;
}
