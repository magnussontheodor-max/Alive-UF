"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";
import { JOURNEY } from "./spark-startup";
import { StatusTag } from "./Primitives";

// ---------------------------------------------------------------------------
// The journey, as six stages the reader can open.
//
// Each stage says honestly whether it is built, partly built, or planned —
// the same thing the application says on its own screens.
// ---------------------------------------------------------------------------

const STATE_LABEL = {
  built: { label: "Byggt", tone: "good" as const },
  partial: { label: "Delvis byggt", tone: "warn" as const },
  planned: { label: "Påbörjat", tone: "neutral" as const },
};

export default function JourneySection() {
  const [active, setActive] = useState(JOURNEY[0].id);
  const current = JOURNEY.find((s) => s.id === active) ?? JOURNEY[0];

  function select(id: string) {
    setActive(id);
    track({ name: "journey_stage_clicked", stage: id });
  }

  return (
    <div>
      {/* Stage rail — a tablist on desktop, a scrollable row on mobile */}
      <div
        role="tablist"
        aria-label="Sparks resa"
        className="-mx-5 flex gap-1.5 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {JOURNEY.map((stage, i) => {
          const selected = stage.id === active;
          return (
            <button
              key={stage.id}
              role="tab"
              id={`stage-tab-${stage.id}`}
              aria-selected={selected}
              aria-controls={`stage-panel-${stage.id}`}
              onClick={() => select(stage.id)}
              className={`group flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-[13px] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 ${
                selected
                  ? "border-ink-950 bg-ink-950 text-paper"
                  : "border-ink-200 bg-white text-ink-600 hover:border-ink-300 hover:text-ink-900"
              }`}
            >
              <span
                className={`text-[10px] font-semibold tabular-nums ${
                  selected ? "text-accent-300" : "text-ink-300"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              {stage.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`stage-panel-${current.id}`}
        aria-labelledby={`stage-tab-${current.id}`}
        className="mt-6 rounded-2xl border border-ink-100 bg-white p-6 sm:p-8"
      >
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <StatusTag tone={STATE_LABEL[current.state].tone}>
            {STATE_LABEL[current.state].label}
          </StatusTag>
        </div>
        <h3 className="text-[19px] font-semibold leading-snug tracking-[-0.015em] text-ink-950">
          {current.question}
        </h3>
        <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-ink-600">{current.body}</p>
      </div>
    </div>
  );
}
