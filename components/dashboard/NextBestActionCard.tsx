import Link from "next/link";
import { Task } from "@/lib/types";
import { agentHref } from "@/lib/routes";
import { getAgent } from "@/lib/orchestrator";
import { IconSpark, IconArrowUpRight } from "../icons";

export default function NextBestActionCard({ task }: { task: Task }) {
  const agent = getAgent(task.agent);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-ink-100 bg-ink-950 text-paper shadow-panel">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, white 0, transparent 45%), radial-gradient(circle at 85% 85%, white 0, transparent 40%)",
        }}
      />
      <div className="relative px-6 py-6 md:px-8 md:py-7">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-ink-300 font-medium mb-4">
          <IconSpark className="w-3.5 h-3.5 text-accent-300" />
          Next best action
        </div>

        <h2 className="text-[22px] md:text-[26px] font-semibold tracking-tight leading-snug max-w-2xl">
          {task.title}
        </h2>

        <p className="mt-3 text-[13.5px] text-ink-300 leading-relaxed max-w-xl">{task.rationale}</p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href={agentHref[task.agent]}
            className="inline-flex items-center gap-1.5 rounded-full bg-white text-ink-950 px-4.5 py-2.5 text-[13.5px] font-medium hover:bg-ink-100 transition-colors"
            style={{ paddingLeft: "1.15rem", paddingRight: "1.15rem" }}
          >
            {task.ctaLabel}
            <IconArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          <span className="text-[12px] text-ink-400">
            Assigned to <span className="text-ink-200">{agent.name}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
