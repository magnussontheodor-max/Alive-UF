"use client";

import { useDesign } from "../store";
import { FARG_TOKENS } from "../tokens";
import { KONTRASTPAR, kontrast } from "../contrast";
import { PALETTER } from "../presets";
import { Grupp, Knapp, P } from "../bits";

export function ColorTab() {
  const { state, sattToken, sattTokens } = useDesign();

  return (
    <>
      <Grupp titel="Färdiga paletter">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          {PALETTER.map((p) => (
            <button
              key={p.namn}
              type="button"
              onClick={() => sattTokens(Object.fromEntries(
                FARG_TOKENS.map((t) => [t.namn, p.tokens[t.namn] ?? state.tokens[t.namn]]),
              ))}
              style={{
                display: "flex", alignItems: "center", gap: 7, padding: "7px 9px", borderRadius: 5,
                border: `1px solid ${P.kant}`, background: P.yta2, color: P.text, fontSize: 11.5,
                fontFamily: "inherit", cursor: "pointer",
              }}
            >
              <span style={{ display: "flex", flex: "0 0 auto" }}>
                {["--page", "--slab", "--bone"].map((k) => (
                  <span key={k} style={{
                    width: 9, height: 14, background: p.tokens[k], border: `1px solid ${P.kant}`,
                    marginRight: -1,
                  }} />
                ))}
              </span>
              {p.namn}
            </button>
          ))}
        </div>
      </Grupp>

      <Grupp titel="Färgtokens">
        {FARG_TOKENS.map((t) => {
          const v = state.tokens[t.namn] ?? "#000000";
          return (
            <div key={t.namn} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <input
                type="color"
                value={/^#[0-9a-f]{6}$/i.test(v) ? v : "#000000"}
                onChange={(e) => sattToken(t.namn, e.target.value, true)}
                style={{
                  width: 26, height: 26, flex: "0 0 26px", padding: 0, border: `1px solid ${P.kant}`,
                  borderRadius: 4, background: "none", cursor: "pointer",
                }}
                aria-label={t.etikett}
              />
              <span style={{ flex: 1, minWidth: 0, fontSize: 11.5, color: P.text }}>{t.etikett}</span>
              <input
                value={v}
                onChange={(e) => sattToken(t.namn, e.target.value, true)}
                style={{
                  flex: "0 0 78px", padding: "4px 6px", borderRadius: 4, border: `1px solid ${P.kant}`,
                  background: P.yta2, color: P.text2, fontSize: 10.5,
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", outline: "none",
                }}
                aria-label={`${t.etikett} hexvärde`}
              />
            </div>
          );
        })}
      </Grupp>

      <Grupp titel="Kontrast">
        {KONTRASTPAR.map((par) => {
          const k = kontrast(state.tokens[par.fram], state.tokens[par.bak]);
          const godkand = k !== null && k >= par.krav;
          return (
            <div
              key={par.etikett}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
                padding: "6px 9px", marginBottom: 4, borderRadius: 5,
                background: godkand ? "transparent" : "rgba(224,122,107,.12)",
                border: `1px solid ${godkand ? P.kant : "rgba(224,122,107,.45)"}`,
              }}
            >
              <span style={{ fontSize: 11, color: P.text2, minWidth: 0 }}>{par.etikett}</span>
              <span style={{
                flex: "0 0 auto", fontSize: 11, fontVariantNumeric: "tabular-nums",
                color: godkand ? P.ok : P.bad,
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              }}>
                {k === null ? "—" : `${k.toFixed(2)}:1`}
              </span>
            </div>
          );
        })}
        <p style={{ margin: "8px 0 0", fontSize: 10.5, lineHeight: 1.5, color: P.text3 }}>
          Kravet är 4,5:1 för text och 3:1 för accentfärg mot bakgrund. Röd markering
          betyder att kombinationen inte når dit.
        </p>
      </Grupp>

      <Knapp full onClick={() => sattTokens(Object.fromEntries(
        FARG_TOKENS.map((t) => [t.namn, PALETTER[0].tokens[t.namn]]),
      ))}>
        Återställ bara färgerna
      </Knapp>
    </>
  );
}
