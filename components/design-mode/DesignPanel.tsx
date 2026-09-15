"use client";

import { useState } from "react";
import {
  ChevronLeft, ChevronRight, Copy, Layers, Palette, PanelRight, Redo2,
  RotateCcw, Ruler, Save, Trash2, Type as TypeIcon, Undo2, X,
} from "lucide-react";
import { useDesign, type Bredd } from "./store";
import { Knapp, P } from "./bits";
import { ColorTab } from "./tabs/ColorTab";
import { TypeTab } from "./tabs/TypeTab";
import { LayoutTab } from "./tabs/LayoutTab";
import { SectionsTab } from "./tabs/SectionsTab";
import { ExportTab } from "./tabs/ExportTab";

const FLIKAR = [
  { id: "farg", namn: "Färg", ikon: Palette },
  { id: "typ", namn: "Typsnitt", ikon: TypeIcon },
  { id: "layout", namn: "Layout", ikon: Ruler },
  { id: "sektioner", namn: "Sektioner", ikon: Layers },
  { id: "export", namn: "Export", ikon: Copy },
] as const;

const BREDDER: { v: Bredd; t: string }[] = [
  { v: 390, t: "390" },
  { v: 768, t: "768" },
  { v: 1280, t: "1280" },
  { v: "full", t: "Full" },
];

export function DesignPanel() {
  const {
    aktiv, vaxla, panelSida, vaxlaSida, angra, gorOm, kanAngra, kanGoraOm, aterstall,
    teman, aktivtTema, valjTema, nyttTema, sparaTema, dupliceraTema, taBortTema,
    bredd, sattBredd, jamfor,
  } = useDesign();
  const [flik, setFlik] = useState<(typeof FLIKAR)[number]["id"]>("farg");
  const [ihopfalld, setIhopfalld] = useState(false);

  if (!aktiv) return null;

  const bredd_px = ihopfalld ? 44 : 320;

  return (
    <aside
      aria-label="Designläge"
      style={{
        position: "fixed", top: 0, bottom: 0,
        [panelSida]: 0,
        width: bredd_px,
        zIndex: 9999,
        display: "flex", flexDirection: "column",
        background: P.yta,
        borderLeft: panelSida === "right" ? `1px solid ${P.kant}` : undefined,
        borderRight: panelSida === "left" ? `1px solid ${P.kant}` : undefined,
        boxShadow: "0 0 40px rgba(0,0,0,.4)",
        color: P.text,
        fontFamily: "ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        fontSize: 12,
        transition: "width .18s ease",
      }}
    >
      {ihopfalld ? (
        <button
          type="button"
          onClick={() => setIhopfalld(false)}
          title="Fäll ut designläget"
          style={{ padding: "12px 0", color: P.text2, background: "none", border: 0, cursor: "pointer" }}
        >
          <PanelRight size={16} />
        </button>
      ) : (
        <>
          {/* huvud */}
          <div style={{ padding: "10px 12px", borderBottom: `1px solid ${P.kant}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
              <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".01em" }}>Designläge</span>
              {jamfor ? (
                <span style={{ fontSize: 10, color: P.accent, padding: "1px 6px", borderRadius: 999, background: "rgba(91,157,217,.15)" }}>
                  visar utgångsläget
                </span>
              ) : null}
              <span style={{ marginLeft: "auto", display: "flex", gap: 2 }}>
                <IkonKnapp titel="Ångra · Cmd Z" onClick={angra} disabled={!kanAngra}><Undo2 size={13} /></IkonKnapp>
                <IkonKnapp titel="Gör om · Shift Cmd Z" onClick={gorOm} disabled={!kanGoraOm}><Redo2 size={13} /></IkonKnapp>
                <IkonKnapp titel="Flytta panelen" onClick={vaxlaSida}>
                  {panelSida === "right" ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
                </IkonKnapp>
                <IkonKnapp titel="Fäll ihop" onClick={() => setIhopfalld(true)}><PanelRight size={13} /></IkonKnapp>
                <IkonKnapp titel="Stäng · Cmd D" onClick={vaxla}><X size={13} /></IkonKnapp>
              </span>
            </div>

            <div style={{ display: "flex", gap: 5 }}>
              <select
                value={aktivtTema}
                onChange={(e) => valjTema(e.target.value)}
                aria-label="Tema"
                style={{
                  flex: 1, minWidth: 0, padding: "5px 7px", borderRadius: 5, border: `1px solid ${P.kant}`,
                  background: P.yta2, color: P.text, fontSize: 11.5, fontFamily: "inherit", outline: "none",
                }}
              >
                {teman.map((t) => (
                  <option key={t.id} value={t.id}>{t.namn}</option>
                ))}
              </select>
              <IkonKnapp titel="Spara i temat" onClick={sparaTema}><Save size={13} /></IkonKnapp>
              <IkonKnapp titel="Duplicera" onClick={dupliceraTema}><Copy size={13} /></IkonKnapp>
              <IkonKnapp titel="Ta bort" onClick={taBortTema} disabled={teman.length <= 1}><Trash2 size={13} /></IkonKnapp>
            </div>
            <div style={{ display: "flex", gap: 5, marginTop: 5 }}>
              <Knapp full onClick={() => nyttTema(window.prompt("Namn på temat?") ?? "")}>Nytt tema</Knapp>
              <Knapp full onClick={aterstall} titel="Tillbaka till utgångsläget">
                <RotateCcw size={12} />Återställ
              </Knapp>
            </div>
          </div>

          {/* flikar */}
          <div style={{ display: "flex", borderBottom: `1px solid ${P.kant}` }}>
            {FLIKAR.map((f) => {
              const I = f.ikon;
              const pa = flik === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFlik(f.id)}
                  title={f.namn}
                  style={{
                    flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                    padding: "8px 2px", background: pa ? P.yta2 : "transparent",
                    color: pa ? P.text : P.text3, border: 0,
                    borderBottom: `2px solid ${pa ? P.accent : "transparent"}`,
                    cursor: "pointer", fontFamily: "inherit", fontSize: 9.5,
                  }}
                >
                  <I size={14} />
                  {f.namn}
                </button>
              );
            })}
          </div>

          {/* innehåll */}
          <div style={{ flex: 1, overflowY: "auto", padding: "14px 12px" }}>
            {flik === "farg" ? <ColorTab /> : null}
            {flik === "typ" ? <TypeTab /> : null}
            {flik === "layout" ? <LayoutTab /> : null}
            {flik === "sektioner" ? <SectionsTab /> : null}
            {flik === "export" ? <ExportTab /> : null}
          </div>

          {/* fot */}
          <div style={{ borderTop: `1px solid ${P.kant}`, padding: "9px 12px" }}>
            <div style={{ display: "flex", gap: 4, marginBottom: 7 }}>
              {BREDDER.map((b) => (
                <button
                  key={String(b.v)}
                  type="button"
                  onClick={() => sattBredd(b.v)}
                  style={{
                    flex: 1, padding: "5px 0", borderRadius: 4, fontSize: 10.5,
                    border: `1px solid ${bredd === b.v ? P.accent : P.kant}`,
                    background: bredd === b.v ? "rgba(91,157,217,.16)" : "transparent",
                    color: bredd === b.v ? P.text : P.text2, cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  {b.t}
                </button>
              ))}
            </div>
            <p style={{ margin: 0, fontSize: 10, lineHeight: 1.55, color: P.text3 }}>
              Håll <b style={{ color: P.text2 }}>mellanslag</b> för utgångsläget ·
              {" "}<b style={{ color: P.text2 }}>Cmd D</b> stänger
            </p>
          </div>
        </>
      )}
    </aside>
  );
}

function IkonKnapp({
  children, onClick, titel, disabled,
}: { children: React.ReactNode; onClick?: () => void; titel: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={titel}
      aria-label={titel}
      disabled={disabled}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 24, height: 24, borderRadius: 4, border: `1px solid ${P.kant}`,
        background: P.yta2, color: disabled ? P.text3 : P.text2,
        opacity: disabled ? 0.45 : 1, cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {children}
    </button>
  );
}
