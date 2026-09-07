"use client";

import { useState } from "react";

// The journey, as an editorial index rather than a feature grid.
//
// Desktop: a numbered rail across the page, with one explanation below that
// changes as you move along it. Mobile: the same seven stages stacked, each
// opening in place. One explanation is visible at rest in both.

const STAGES = [
  {
    id: "start",
    label: "Start",
    body: "Berätta om dig själv, dina mål och din situation. Spark börjar med dig, inte med en idé.",
  },
  {
    id: "ideas",
    label: "Idéer",
    body: "Få möjligheter som passar just dig, inte slumpmässiga startup-idéer hämtade någon annanstans ifrån.",
  },
  {
    id: "opportunity",
    label: "Möjlighet",
    body: "Jämför och utvärdera vilka möjligheter som faktiskt är värda att gå vidare med.",
  },
  {
    id: "research",
    label: "Research",
    body: "Förstå kunderna, konkurrenterna, marknaden och riskerna innan du lägger tid på fel sak.",
  },
  {
    id: "validation",
    label: "Validering",
    body: "Testa de antaganden som skulle få idén att falla. Det billigaste sättet att ha fel är tidigt.",
  },
  {
    id: "product",
    label: "Produkt",
    body: "Gör om det du lärt dig till en fokuserad MVP, liten nog att faktiskt bli klar.",
  },
  {
    id: "build",
    label: "Bygg",
    body: "Ta steget från specifikation till en riktig digital produkt.",
  },
];

export default function Journey() {
  const [active, setActive] = useState(0);
  const current = STAGES[active];

  return (
    <div>
      {/* Desktop rail */}
      <div className="hidden md:block">
        <ol
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${STAGES.length}, minmax(0, 1fr))`,
            borderTop: "1px solid var(--rule)",
          }}
        >
          {STAGES.map((stage, i) => {
            const on = i === active;
            return (
              <li key={stage.id} style={{ borderRight: i < STAGES.length - 1 ? "1px solid var(--rule-soft)" : undefined }}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={on}
                  className="group relative block w-full px-3 pb-6 pt-5 text-left"
                >
                  {/* the moving mark: the only accent in this section */}
                  <span
                    aria-hidden="true"
                    className="absolute left-0 right-0 top-0 h-px origin-left transition-transform duration-500"
                    style={{
                      background: "var(--ember)",
                      transform: on ? "scaleX(1)" : "scaleX(0)",
                      transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)",
                    }}
                  />
                  <span className="b-num block">{String(i + 1).padStart(2, "0")}</span>
                  <span
                    className="b-nav-link mt-3 block transition-colors duration-300"
                    style={{ color: on ? "var(--ink)" : "var(--ink-faint)" }}
                  >
                    {stage.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="grid grid-cols-12 gap-8 pt-10">
          <p className="b-label col-span-3">Steg {String(active + 1).padStart(2, "0")}</p>
          <p key={current.id} className="b-statement col-span-9 max-w-[26ch] animate-[fadeIn_.45s_ease-out]">
            {current.body}
          </p>
        </div>
      </div>

      {/* Mobile: the same seven, stacked */}
      <ol className="md:hidden" style={{ borderTop: "1px solid var(--rule)" }}>
        {STAGES.map((stage, i) => {
          const on = i === active;
          return (
            <li key={stage.id} style={{ borderBottom: "1px solid var(--rule-soft)" }}>
              <button
                type="button"
                onClick={() => setActive(on ? -1 : i)}
                aria-expanded={on}
                className="flex w-full items-baseline gap-4 py-5 text-left"
              >
                <span className="b-num shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <span
                  className="b-nav-link flex-1"
                  style={{ color: on ? "var(--ink)" : "var(--ink-soft)" }}
                >
                  {stage.label}
                </span>
                <span
                  aria-hidden="true"
                  className="shrink-0 transition-transform duration-300"
                  style={{
                    color: on ? "var(--ember)" : "var(--ink-faint)",
                    transform: on ? "rotate(45deg)" : "none",
                  }}
                >
                  +
                </span>
              </button>
              <div
                className="grid transition-all duration-400 ease-out"
                style={{ gridTemplateRows: on ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <p className="b-body pb-6 pl-10 pr-2">{stage.body}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
