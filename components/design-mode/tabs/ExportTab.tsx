"use client";

import { useRef, useState } from "react";
import { Check, Copy, Download, Upload } from "lucide-react";
import { useDesign } from "../store";
import { ALLA_TOKENS } from "../tokens";
import { Grupp, Knapp, P } from "../bits";
import type { DesignState } from "../types";

function tillCss(state: DesignState): string {
  const ordning = [
    "--page", "--panel", "--panel-2", "--surface-raised",
    "--slab", "--slab-hover", "--slab-ink",
    "--bone", "--body", "--dim", "--line", "--line-soft",
    "--ok", "--warn", "--bad",
    "--font-display", "--font-body", "--scale",
    "--track-head", "--track-label", "--track-body",
    "--lh-body", "--lh-head", "--case-body",
    "--radius", "--space", "--border-width", "--maxw",
  ];
  const rader = ordning
    .filter((k) => state.tokens[k] !== undefined)
    .map((k) => {
      const v = state.tokens[k];
      const citerat = k.startsWith("--font-") ? `"${v}"` : v;
      return `  ${k}: ${citerat};`;
    });
  return `:root {\n${rader.join("\n")}\n}\n`;
}

export function ExportTab() {
  const { state, satt, sattTokens } = useDesign();
  const [kopierat, setKopierat] = useState(false);
  const [fel, setFel] = useState<string | null>(null);
  const fil = useRef<HTMLInputElement>(null);

  const css = tillCss(state);

  const kopiera = async () => {
    try {
      await navigator.clipboard.writeText(css);
      setKopierat(true);
      window.setTimeout(() => setKopierat(false), 1600);
    } catch {
      setFel("Kunde inte nå urklippet. Markera texten nedan och kopiera manuellt.");
    }
  };

  const laddaNer = () => {
    const blob = new Blob([JSON.stringify({ version: 1, state }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "spark-tema.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importera = (f: File) => {
    setFel(null);
    const l = new FileReader();
    l.onload = () => {
      try {
        const data = JSON.parse(String(l.result));
        const s: DesignState | undefined = data.state ?? data;
        if (!s || typeof s.tokens !== "object") throw new Error("saknar tokens");
        satt({
          tokens: { ...state.tokens, ...s.tokens },
          nav: s.nav ?? state.nav,
          sections: s.sections ?? state.sections,
        });
        sattTokens(s.tokens);
      } catch {
        setFel("Filen gick inte att läsa. Den ska vara JSON från Ladda ner tema.");
      }
    };
    l.readAsText(f);
  };

  return (
    <>
      <Grupp titel="Exportera">
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <Knapp full variant="primar" onClick={kopiera}>
            {kopierat ? <Check size={13} /> : <Copy size={13} />}
            {kopierat ? "Kopierat" : "Kopiera CSS"}
          </Knapp>
          <Knapp full onClick={laddaNer}>
            <Download size={13} />Ladda ner JSON
          </Knapp>
          <Knapp full onClick={() => fil.current?.click()}>
            <Upload size={13} />Importera JSON
          </Knapp>
          <input
            ref={fil}
            type="file"
            accept="application/json,.json"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) importera(f);
              e.target.value = "";
            }}
            style={{ display: "none" }}
          />
        </div>
        {fel ? (
          <p style={{ margin: "8px 0 0", fontSize: 10.5, lineHeight: 1.5, color: P.bad }}>{fel}</p>
        ) : null}
      </Grupp>

      <Grupp titel={`:root — ${ALLA_TOKENS.length + 5} tokens`}>
        <pre
          style={{
            margin: 0, padding: "10px 11px", borderRadius: 5, border: `1px solid ${P.kant}`,
            background: "#0F1216", color: "#A8B8C8", fontSize: 10.5, lineHeight: 1.65,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            maxHeight: 260, overflow: "auto", whiteSpace: "pre", userSelect: "all",
          }}
        >
          {css}
        </pre>
        <p style={{ margin: "8px 0 0", fontSize: 10.5, lineHeight: 1.5, color: P.text3 }}>
          Klistra in blocket i <code>app/tokens.css</code> för att göra temat till
          prototypens nya utgångsläge.
        </p>
      </Grupp>
    </>
  );
}
