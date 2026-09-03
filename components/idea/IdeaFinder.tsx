"use client";

import { useState } from "react";
import { founder, opportunities } from "@/lib/mock-data";
import { Opportunity } from "@/lib/types";
import { IconArrowUpRight, IconSpark } from "../icons";
import Badge from "../Badge";

const productTypes = ["SaaS", "Marketplace", "AI product", "Digital service"];

const complexityTone = { Low: "good", Medium: "warn", High: "neutral" } as const;

export default function IdeaFinder() {
  const [step, setStep] = useState<"form" | "loading" | "results">("form");
  const [goodAt, setGoodAt] = useState(founder.skills.join(", "));
  const [industries, setIndustries] = useState(founder.interests.join(", "));
  const [hours, setHours] = useState(founder.hoursPerWeek);
  const [budget, setBudget] = useState(founder.budgetSek);
  const [preference, setPreference] = useState<typeof founder.preference>(founder.preference);
  const [types, setTypes] = useState<string[]>(founder.productTypePreference);
  const [hasIdea, setHasIdea] = useState<"yes" | "no">("no");
  const [ideaText, setIdeaText] = useState("");

  function toggleType(t: string) {
    setTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  function generate() {
    setStep("loading");
    setTimeout(() => setStep("results"), 1400);
  }

  if (step === "results") {
    return <OpportunityResults onRestart={() => setStep("form")} />;
  }

  if (step === "loading") {
    return (
      <div className="card p-10 flex flex-col items-center justify-center text-center max-w-3xl animate-fadeIn">
        <div className="w-11 h-11 rounded-full bg-ink-950 flex items-center justify-center mb-4">
          <IconSpark className="w-5 h-5 text-accent-300 animate-pulseSoft" />
        </div>
        <p className="text-[14px] font-medium text-ink-900">Idea Agent is scoring opportunities…</p>
        <p className="text-[12.5px] text-ink-500 mt-1.5 max-w-sm">
          Weighing your skills, time, budget and preferences against market size and MVP complexity.
        </p>
      </div>
    );
  }

  return (
    <div className="card p-6 md:p-8 max-w-3xl">
      <h3 className="text-[16px] font-semibold text-ink-950 mb-1">Tell us about you</h3>
      <p className="text-[13px] text-ink-500 mb-7">
        The Idea Agent uses this to generate and score business opportunities that actually fit you.
      </p>

      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <Question label="What are you good at?">
            <input
              value={goodAt}
              onChange={(e) => setGoodAt(e.target.value)}
              className="input"
              placeholder="e.g. B2B sales, design, writing"
            />
          </Question>
          <Question label="What industries interest you?">
            <input
              value={industries}
              onChange={(e) => setIndustries(e.target.value)}
              className="input"
              placeholder="e.g. healthcare, fintech"
            />
          </Question>
          <Question label="How much time can you spend per week?">
            <input
              type="number"
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="input"
              min={1}
              max={80}
            />
          </Question>
          <Question label="How much can you invest?">
            <div className="relative">
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="input pr-14"
                min={0}
                step={1000}
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[12px] text-ink-400">SEK</span>
            </div>
          </Question>
        </div>

        <Question label="Do you prefer B2B or B2C?">
          <div className="flex gap-2">
            {(["B2B", "B2C", "No preference"] as const).map((p) => (
              <Chip key={p} active={preference === p} onClick={() => setPreference(p)}>
                {p}
              </Chip>
            ))}
          </div>
        </Question>

        <Question label="What kind of product do you want to build?">
          <div className="flex flex-wrap gap-2">
            {productTypes.map((t) => (
              <Chip key={t} active={types.includes(t)} onClick={() => toggleType(t)}>
                {t}
              </Chip>
            ))}
          </div>
        </Question>

        <Question label="Do you already have an idea?">
          <div className="flex gap-2 mb-2">
            <Chip active={hasIdea === "no"} onClick={() => setHasIdea("no")}>
              Not yet
            </Chip>
            <Chip active={hasIdea === "yes"} onClick={() => setHasIdea("yes")}>
              Yes, roughly
            </Chip>
          </div>
          {hasIdea === "yes" && (
            <textarea
              value={ideaText}
              onChange={(e) => setIdeaText(e.target.value)}
              className="input min-h-[70px] resize-none"
              placeholder="Describe it in a sentence or two — the Idea Agent will sharpen it."
            />
          )}
        </Question>
      </div>

      <button
        onClick={generate}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink-950 text-paper px-5 py-2.5 text-[13.5px] font-medium hover:bg-ink-800 transition-colors"
      >
        <IconSpark className="w-4 h-4 text-accent-300" />
        Find opportunities

      </button>

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid #e6e8ef;
          padding: 0.6rem 0.9rem;
          font-size: 13px;
          color: #12141b;
          outline: none;
          background: white;
          transition: box-shadow 0.15s, border-color 0.15s;
        }
        .input:focus {
          border-color: #7482fa;
          box-shadow: 0 0 0 3px rgba(91, 103, 232, 0.12);
        }
      `}</style>
    </div>
  );
}

function Question({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[12.5px] font-medium text-ink-700 mb-2">{label}</label>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition-colors ${
        active
          ? "bg-ink-950 border-ink-950 text-paper"
          : "bg-white border-ink-200 text-ink-600 hover:border-ink-300"
      }`}
    >
      {children}
    </button>
  );
}

function OpportunityResults({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-[16px] font-semibold text-ink-950">Three opportunities worth exploring</h3>
        <button onClick={onRestart} className="text-[12.5px] text-ink-500 hover:text-ink-800 underline underline-offset-2">
          Start over
        </button>
      </div>
      <p className="text-[13px] text-ink-500 mb-6">Scored against your skills, time, budget and preferences.</p>

      <div className="grid gap-5 md:grid-cols-3">
        {opportunities.map((o) => (
          <OpportunityCard key={o.id} opportunity={o} />
        ))}
      </div>
    </div>
  );
}

function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  return (
    <div className="card p-5 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-medium text-ink-400">
          {String(opportunity.rank).padStart(2, "0")}
        </span>
        <ScoreRing score={opportunity.score} />
      </div>
      <h4 className="text-[14.5px] font-semibold text-ink-950 leading-snug mb-3">{opportunity.title}</h4>

      <div className="space-y-2.5 text-[12.5px] text-ink-600 leading-relaxed flex-1">
        <p>
          <span className="text-ink-400 font-medium">Target customer — </span>
          {opportunity.targetCustomer}
        </p>
        <p>
          <span className="text-ink-400 font-medium">Problem — </span>
          {opportunity.problem}
        </p>
        <p>
          <span className="text-ink-400 font-medium">Why it fits you — </span>
          {opportunity.whyItFits}
        </p>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-ink-100">
        <Badge tone={complexityTone[opportunity.mvpComplexity]}>{opportunity.mvpComplexity} complexity</Badge>
        <button className="inline-flex items-center gap-1 text-[12.5px] font-medium text-accent-600 hover:text-accent-700">
          Explore opportunity
          <IconArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-9 h-9 rounded-full border-2 border-ink-950 flex items-center justify-center">
        <span className="text-[11px] font-semibold text-ink-950">{score}</span>
      </div>
    </div>
  );
}
