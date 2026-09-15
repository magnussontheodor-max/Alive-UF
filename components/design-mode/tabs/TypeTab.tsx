"use client";

import { useDesign } from "../store";
import { TYPO_TOKENS, franTal, tillTal } from "../tokens";
import { FONTER, laddaFont } from "../fonts";
import { Grupp, Rad, Reglage, Valj, Vaxel } from "../bits";

export function TypeTab() {
  const { state, sattToken } = useDesign();
  const val = FONTER.map((f) => ({ v: f.namn, t: f.namn }));

  const valjFont = (token: string) => (v: string) => {
    laddaFont(v);
    sattToken(token, v);
  };

  return (
    <>
      <Grupp titel="Typsnitt">
        <Rad etikett="Rubriker" htmlFor="dm-font-display">
          <Valj id="dm-font-display" varde={state.tokens["--font-display"]} val={val} onChange={valjFont("--font-display")} />
        </Rad>
        <Rad etikett="Brödtext" htmlFor="dm-font-body">
          <Valj id="dm-font-body" varde={state.tokens["--font-body"]} val={val} onChange={valjFont("--font-body")} />
        </Rad>
        <div style={{ marginTop: 10, padding: "10px 12px", borderRadius: 5, border: "1px solid #2E353D", background: "#1C2126" }}>
          <div style={{ fontFamily: `"${state.tokens["--font-display"]}", sans-serif`, fontSize: 19, color: "#E8ECEF", lineHeight: 1.2 }}>
            Bevisgrad, inte idékvalitet
          </div>
          <div style={{ fontFamily: `"${state.tokens["--font-body"]}", sans-serif`, fontSize: 12, color: "#9AA6B2", marginTop: 6, lineHeight: 1.55 }}>
            312 redovisningsbyråer med 5–20 anställda. Medianomsättning 4,2 Mkr.
          </div>
        </div>
      </Grupp>

      <Grupp titel="Storlek och spärr">
        {TYPO_TOKENS.map((t) => {
          const tal = tillTal(state.tokens[t.namn]);
          return (
            <Rad key={t.namn} etikett={t.etikett} hoger={`${tal}${t.suffix ?? ""}`} htmlFor={`dm${t.namn}`}>
              <Reglage
                id={`dm${t.namn}`}
                varde={tal}
                min={t.min!}
                max={t.max!}
                step={t.step!}
                onChange={(v) => sattToken(t.namn, franTal(v, t.suffix), true)}
              />
            </Rad>
          );
        })}
      </Grupp>

      <Grupp titel="Skiftläge">
        <Vaxel
          etikett="Versaler i brödtext"
          pa={state.tokens["--case-body"] === "uppercase"}
          onChange={(v) => sattToken("--case-body", v ? "uppercase" : "none")}
        />
      </Grupp>
    </>
  );
}
