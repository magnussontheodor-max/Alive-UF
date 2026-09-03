"use client";

import { useState } from "react";
import Badge from "../Badge";
import { IconCheck, IconFlask, IconSpark } from "../icons";
import { experimentSuccessCriteria } from "@/lib/mock-data";

const hypothesis =
  "Swedish B2B sales teams have a painful enough lead qualification problem to pay for an automated solution.";

const evidenceStats = [
  { label: "Customer interviews", value: "7 / 10" },
  { label: "Problem confirmed", value: "Yes" },
  { label: "Willingness to pay", value: "Partial" },
];

export default function ValidationBoard() {
  const [confidence, setConfidence] = useState(72);
  const [completed, setCompleted] = useState(false);
  const [running, setRunning] = useState(false);

  function completeExperiment() {
    setRunning(true);
    setTimeout(() => {
      setRunning(false);
      setCompleted(true);
      setConfidence(86);
    }, 1200);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 space-y-6">
        <div className="card p-6 md:p-7">
          <p className="text-[11px] uppercase tracking-wide text-ink-400 font-medium mb-2">Current hypothesis</p>
          <h3 className="text-[16.5px] font-semibold text-ink-950 leading-snug max-w-xl">{hypothesis}</h3>
        </div>

        <div className="card p-6 md:p-7">
          <p className="text-[11px] uppercase tracking-wide text-ink-400 font-medium mb-4">Evidence</p>
          <div className="grid grid-cols-3 gap-4">
            {evidenceStats.map((s) => (
              <div key={s.label} className="rounded-xl bg-ink-50/70 border border-ink-100 px-3.5 py-3">
                <p className="text-[16px] font-semibold text-ink-950 leading-tight">{s.value}</p>
                <p className="text-[11.5px] text-ink-500 mt-1 leading-snug">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6 md:p-7">
          <div className="flex items-center gap-2 mb-2">
            <IconFlask className="w-4 h-4 text-ink-400" />
            <p className="text-[11px] uppercase tracking-wide text-ink-400 font-medium">Experiment</p>
          </div>
          <p className="text-[14px] text-ink-900 leading-relaxed mb-4 max-w-xl">
            Interview 5 additional sales managers and test willingness to pay at{" "}
            <span className="font-medium">999 SEK/month</span>.
          </p>

          <p className="text-[12px] font-medium text-ink-500 mb-2">Success criteria</p>
          <ul className="space-y-2 mb-6">
            {experimentSuccessCriteria.map((c) => (
              <li key={c} className="flex items-center gap-2.5 text-[13px] text-ink-700">
                <span
                  className={`w-[18px] h-[18px] rounded-full flex items-center justify-center border shrink-0 ${
                    completed ? "bg-good-500 border-good-500 text-white" : "border-ink-200"
                  }`}
                >
                  {completed && <IconCheck className="w-2.5 h-2.5" />}
                </span>
                {c}
              </li>
            ))}
          </ul>

          {!completed ? (
            <button
              onClick={completeExperiment}
              disabled={running}
              className="inline-flex items-center gap-2 rounded-full bg-ink-950 text-paper px-5 py-2.5 text-[13.5px] font-medium hover:bg-ink-800 transition-colors disabled:opacity-60"
            >
              {running ? (
                <>
                  <IconSpark className="w-4 h-4 text-accent-300 animate-pulseSoft" />
                  Running experiment…
                </>
              ) : (
                "Complete experiment"
              )}
            </button>
          ) : (
            <div className="rounded-xl border border-good-100 bg-good-50 px-4 py-3.5">
              <p className="text-[13px] font-medium text-good-600 mb-1">Experiment complete — hypothesis strengthened.</p>
              <p className="text-[12.5px] text-ink-600">
                Confidence rose to 86%. The Orchestrator has queued <span className="font-medium">&ldquo;Draft MVP spec including CRM integration&rdquo;</span> as your next task.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <div className="card p-6 md:p-7 flex flex-col items-center text-center">
          <p className="text-[11px] uppercase tracking-wide text-ink-400 font-medium mb-5 self-start">
            Current confidence
          </p>
          <ConfidenceRing value={confidence} />
          <p className="text-[12px] text-ink-500 mt-5 leading-relaxed">
            {completed
              ? "Strong enough to move toward product scoping, with pricing still to confirm."
              : "Enough to keep going, not enough to build yet. Pricing is the open question."}
          </p>
        </div>

        <div className="card p-6">
          <p className="text-[11px] uppercase tracking-wide text-ink-400 font-medium mb-3">Why this matters</p>
          <p className="text-[13px] text-ink-700 leading-relaxed">
            Startup OS won&rsquo;t recommend moving into Product until confidence clears a reasonable bar. Building
            before the risk is retired is the single most common way first-time founders waste months.
          </p>
        </div>
      </div>
    </div>
  );
}

function ConfidenceRing({ value }: { value: number }) {
  const size = 148;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#E6E8EF" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="#5B67E8"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[26px] font-semibold text-ink-950 leading-none">{value}%</span>
        <span className="text-[11px] text-ink-400 mt-1">confidence</span>
      </div>
    </div>
  );
}
