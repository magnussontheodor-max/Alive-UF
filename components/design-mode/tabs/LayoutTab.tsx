"use client";

import { useDesign } from "../store";
import { LAYOUT_TOKENS, franTal, tillTal } from "../tokens";
import { Grupp, Rad, Reglage, Vaxel, Knapp, P } from "../bits";

export function LayoutTab() {
  const { state, sattToken, satt } = useDesign();
  const linjerPa = tillTal(state.tokens["--border-width"]) > 0;

  return (
    <>
      <Grupp titel="Mått">
        {LAYOUT_TOKENS.map((t) => {
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

      <Grupp titel="Sidomeny">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          {([["left", "Till vänster"], ["top", "Överst"]] as const).map(([v, t]) => (
            <Knapp key={v} variant={state.nav === v ? "primar" : "tyst"} onClick={() => satt({ nav: v })}>
              {t}
            </Knapp>
          ))}
        </div>
      </Grupp>

      <Grupp titel="Täthet">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 8 }}>
          <Knapp
            variant={tillTal(state.tokens["--space"]) <= 0.85 ? "primar" : "tyst"}
            onClick={() => sattToken("--space", "0.8")}
          >
            Kompakt
          </Knapp>
          <Knapp
            variant={tillTal(state.tokens["--space"]) >= 1.15 ? "primar" : "tyst"}
            onClick={() => sattToken("--space", "1.25")}
          >
            Luftigt
          </Knapp>
        </div>
        <Vaxel
          etikett="Linjer"
          pa={linjerPa}
          onChange={(v) => sattToken("--border-width", v ? "1px" : "0px")}
        />
        <p style={{ margin: "4px 0 0", fontSize: 10.5, lineHeight: 1.5, color: P.text3 }}>
          Av läge nollställer linjetjockleken. Avdelarna finns kvar i koden men syns inte.
        </p>
      </Grupp>
    </>
  );
}
