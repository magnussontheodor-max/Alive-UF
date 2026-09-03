import Link from "next/link";
import { Task } from "@/lib/types";
import { agentHref } from "@/lib/routes";
import { getAgent } from "@/lib/orchestrator";
import { IconChevronRight } from "../icons";
import Badge from "../Badge";

export default function UpNextList({ tasks }: { tasks: Task[] }) {
  return (
    <div className="card p-6">
      <h3 className="text-[14.5px] font-semibold text-ink-950 mb-1">Up next</h3>
      <p className="text-[12px] text-ink-500 mb-5">Queued by the Orchestrator once your current task is complete.</p>

      <ul className="space-y-2.5">
        {tasks.map((task) => {
          const agent = getAgent(task.agent);
          return (
            <li key={task.id}>
              <Link
                href={agentHref[task.agent]}
                className="group flex items-center justify-between gap-3 rounded-xl border border-ink-100 px-4 py-3 hover:border-ink-200 hover:bg-ink-50/50 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-ink-900 truncate">{task.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge tone="neutral">{agent.name}</Badge>
                  </div>
                </div>
                <IconChevronRight className="w-4 h-4 text-ink-300 group-hover:text-ink-500 shrink-0" />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
