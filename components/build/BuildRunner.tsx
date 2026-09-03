"use client";

import { useEffect, useRef, useState } from "react";
import { initialBuildSteps } from "@/lib/mock-data";
import { BuildStep } from "@/lib/types";
import { IconCheck, IconHammer, IconSpark } from "../icons";

const agentForStep: Record<string, string> = {
  b_1: "Product Architect Agent",
  b_2: "Build Agent → schema generation",
  b_3: "Build Agent → auth scaffolding",
  b_4: "Build Agent → application code",
  b_5: "Build Agent → AI integration",
  b_6: "Build Agent → automated tests",
  b_7: "Build Agent → deployment pipeline",
};

const STEP_DURATION = 900;

export default function BuildRunner() {
  const [steps, setSteps] = useState<BuildStep[]>(initialBuildSteps);
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function start() {
    setSteps(initialBuildSteps.map((s) => ({ ...s })));
    setPhase("running");

    initialBuildSteps.forEach((step, i) => {
      const startAt = i * STEP_DURATION;
      const doneAt = startAt + STEP_DURATION;

      timers.current.push(
        setTimeout(() => {
          setSteps((prev) => prev.map((s) => (s.id === step.id ? { ...s, status: "in-progress" } : s)));
        }, startAt)
      );
      timers.current.push(
        setTimeout(() => {
          setSteps((prev) => prev.map((s) => (s.id === step.id ? { ...s, status: "done" } : s)));
          if (i === initialBuildSteps.length - 1) setPhase("done");
        }, doneAt)
      );
    });
  }

  return (
    <div className="card p-6 md:p-8">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <IconHammer className="w-[18px] h-[18px] text-ink-400" />
          <div>
            <h3 className="text-[14.5px] font-semibold text-ink-950">Build Agent</h3>
            <p className="text-[12px] text-ink-500">
              Orchestrates AI coding agents to build, test and deploy your MVP.
            </p>
          </div>
        </div>

        {phase === "idle" && (
          <button
            onClick={start}
            className="inline-flex items-center gap-2 rounded-full bg-ink-950 text-paper px-5 py-2.5 text-[13.5px] font-medium hover:bg-ink-800 transition-colors"
          >
            <IconSpark className="w-4 h-4 text-accent-300" />
            Build my MVP
          </button>
        )}
      </div>

      {phase !== "idle" && (
        <ul className="space-y-0">
          {steps.map((step, i) => (
            <li key={step.id} className="flex items-center gap-3.5 py-2.5">
              <StatusDot status={step.status} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-[13.5px] ${
                      step.status === "pending" ? "text-ink-400" : "text-ink-900 font-medium"
                    }`}
                  >
                    {step.label}
                  </span>
                  <StatusLabel status={step.status} />
                </div>
                {step.status === "in-progress" && (
                  <p className="text-[11.5px] text-ink-400 mt-0.5">{agentForStep[step.id]}</p>
                )}
              </div>
              {i < steps.length - 1 && <span className="hidden" />}
            </li>
          ))}
        </ul>
      )}

      {phase === "done" && (
        <div className="mt-6 pt-6 border-t border-ink-100 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-[15px] font-semibold text-ink-950">Your MVP is ready.</p>
            <p className="text-[12.5px] text-ink-500 mt-0.5">
              Deployed to a preview environment. Startup OS orchestrated every step above — no model or tool
              choices required from you.
            </p>
          </div>
          <div className="flex gap-2.5 shrink-0">
            <button className="rounded-full border border-ink-200 text-ink-700 px-4.5 py-2.5 text-[13px] font-medium hover:border-ink-300 transition-colors">
              Review
            </button>
            <button className="rounded-full bg-ink-950 text-paper px-4.5 py-2.5 text-[13px] font-medium hover:bg-ink-800 transition-colors">
              Open MVP
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusDot({ status }: { status: BuildStep["status"] }) {
  if (status === "done") {
    return (
      <span className="w-6 h-6 rounded-full bg-good-500 flex items-center justify-center shrink-0">
        <IconCheck className="w-3.5 h-3.5 text-white" />
      </span>
    );
  }
  if (status === "in-progress") {
    return (
      <span className="w-6 h-6 rounded-full border-2 border-accent-400 flex items-center justify-center shrink-0">
        <span className="w-2 h-2 rounded-full bg-accent-500 animate-pulseSoft" />
      </span>
    );
  }
  return <span className="w-6 h-6 rounded-full border border-ink-200 shrink-0" />;
}

function StatusLabel({ status }: { status: BuildStep["status"] }) {
  if (status === "done") return <span className="text-[11px] text-good-600 font-medium">Done</span>;
  if (status === "in-progress")
    return <span className="text-[11px] text-accent-600 font-medium">In progress</span>;
  return <span className="text-[11px] text-ink-300">Pending</span>;
}
