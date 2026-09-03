"use client";

import { useState } from "react";
import { ResearchFinding } from "@/lib/types";
import Badge from "../Badge";
import { IconFlask, IconLayers, IconScale, IconSearch, IconSpark } from "../icons";

const categories: { key: ResearchFinding["category"] | "All"; label: string }[] = [
  { key: "All", label: "All" },
  { key: "Market", label: "Market" },
  { key: "Competitors", label: "Competitors" },
  { key: "Customers", label: "Customers" },
  { key: "Trends", label: "Trends" },
  { key: "Risks", label: "Risks" },
];

const confidenceTone = { high: "good", medium: "warn", low: "neutral" } as const;

export default function ResearchBoard({ findings }: { findings: ResearchFinding[] }) {
  const [active, setActive] = useState<(typeof categories)[number]["key"]>("All");
  const shown = active === "All" ? findings : findings.filter((f) => f.category === active);

  return (
    <div className="card p-6 md:p-7">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <IconSearch className="w-4 h-4 text-ink-400" />
          <h3 className="text-[14.5px] font-semibold text-ink-950">Research Agent findings</h3>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setActive(c.key)}
              className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors border ${
                active === c.key
                  ? "bg-ink-950 border-ink-950 text-paper"
                  : "bg-white border-ink-200 text-ink-500 hover:border-ink-300"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {shown.map((f) => (
          <div key={f.id} className="rounded-xl border border-ink-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <Badge tone="neutral">{f.category}</Badge>
              <Badge tone={confidenceTone[f.confidence]}>{f.confidence} confidence</Badge>
            </div>
            <p className="text-[13px] font-medium text-ink-900 leading-snug mb-1">{f.title}</p>
            <p className="text-[12px] text-ink-500 leading-relaxed">{f.detail}</p>
          </div>
        ))}
      </div>

      <p className="mt-5 text-[11.5px] text-ink-400">
        Demo data for prototype purposes — a production Research Agent would cite live sources.
      </p>
    </div>
  );
}
