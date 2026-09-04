"use client";

import { usePathname } from "next/navigation";

const titles: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Dashboard", subtitle: "Where your startup is, and what to do next" },
  "/task": { title: "Next step", subtitle: "One action at a time" },
  "/founder": { title: "Founder", subtitle: "What you know, who you can reach, what constrains you" },
  "/opportunities": { title: "Opportunities", subtitle: "Problems worth investigating, built from what you have seen" },
  "/research": { title: "Research", subtitle: "Evidence gathered before spending money" },
  "/validation": { title: "Validation", subtitle: "Testing the beliefs that would sink this" },
  "/product": { title: "Product", subtitle: "The smallest thing worth building" },
  "/memory": { title: "Startup memory", subtitle: "Everything Spark currently believes about your startup" },
  "/assumptions": { title: "Assumptions", subtitle: "What must be true, and how sure we are" },
  "/evidence": { title: "Evidence", subtitle: "What we actually know, and where it came from" },
  "/activity": { title: "Activity", subtitle: "What the agents did, and what it cost" },
  "/settings": { title: "Settings", subtitle: "Workspace and connections" },
};

export default function TopBar({
  mode,
  reasoning,
}: {
  mode: "local" | "supabase";
  reasoning: "live" | "deterministic";
}) {
  const pathname = usePathname();
  const key = Object.keys(titles)
    .filter((k) => (k === "/" ? pathname === "/" : pathname.startsWith(k)))
    .sort((a, b) => b.length - a.length)[0];
  const match = titles[key ?? "/"] ?? titles["/"];

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-ink-100 bg-paper/85 px-6 backdrop-blur-sm md:px-8">
      <div className="min-w-0">
        <h1 className="truncate text-[15px] font-semibold leading-tight text-ink-950">
          {match.title}
        </h1>
        <p className="truncate text-[12px] leading-tight text-ink-500">{match.subtitle}</p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <span
          className="hidden items-center gap-1.5 rounded-full border border-ink-150 bg-white px-2.5 py-1 text-[11px] text-ink-500 sm:inline-flex"
          title={
            reasoning === "live"
              ? "A language model is connected. Output still passes the grounding rules."
              : "No model connected. Agents reason with built-in rules over what you entered."
          }
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              reasoning === "live" ? "bg-good-500" : "bg-ink-300"
            }`}
          />
          {reasoning === "live" ? "Model connected" : "Offline reasoning"}
        </span>
        <span
          className="hidden items-center gap-1.5 rounded-full border border-ink-150 bg-white px-2.5 py-1 text-[11px] text-ink-500 lg:inline-flex"
          title={
            mode === "supabase"
              ? "Data is stored in Supabase."
              : "Supabase is not configured, so data is stored locally in this session."
          }
        >
          {mode === "supabase" ? "Supabase" : "Local storage"}
        </span>
      </div>
    </header>
  );
}
