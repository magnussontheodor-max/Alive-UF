import Link from "next/link";
import { STAGES, stageStatus } from "@/lib/stages";
import { StageId } from "@/lib/types";
import { IconCheck } from "./icons";

const hrefFor: Record<StageId, string> = {
  founder: "/settings",
  opportunity: "/idea",
  research: "/research",
  validation: "/validation",
  product: "/product",
  build: "/build",
  legal: "/legal",
  launch: "/launch",
};

export default function StageProgress({ currentStage }: { currentStage: StageId }) {
  return (
    <div className="w-full overflow-x-auto">
      <ol className="flex items-center min-w-max">
        {STAGES.map((stage, i) => {
          const status = stageStatus(stage.id, currentStage);
          const isLast = i === STAGES.length - 1;
          return (
            <li key={stage.id} className="flex items-center">
              <Link
                href={hrefFor[stage.id]}
                className="group flex flex-col items-center gap-2 px-1"
                title={stage.description}
              >
                <span
                  className={[
                    "w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium border transition-colors",
                    status === "done"
                      ? "bg-ink-950 border-ink-950 text-paper"
                      : status === "current"
                      ? "bg-accent-500 border-accent-500 text-white shadow-[0_0_0_4px_rgba(91,103,232,0.15)]"
                      : "bg-white border-ink-200 text-ink-400 group-hover:border-ink-300",
                  ].join(" ")}
                >
                  {status === "done" ? <IconCheck className="w-3.5 h-3.5" /> : i + 1}
                </span>
                <span
                  className={[
                    "text-[11.5px] whitespace-nowrap",
                    status === "current"
                      ? "text-ink-950 font-medium"
                      : status === "done"
                      ? "text-ink-600"
                      : "text-ink-400",
                  ].join(" ")}
                >
                  {stage.shortLabel}
                </span>
              </Link>
              {!isLast && (
                <div
                  className={[
                    "h-px w-8 md:w-12 mb-5",
                    stageStatus(STAGES[i + 1].id, currentStage) !== "upcoming" || status === "done"
                      ? "bg-ink-300"
                      : "bg-ink-150",
                  ].join(" ")}
                  style={{
                    backgroundColor: status === "done" ? "#A4A9BD" : "#E6E8EF",
                  }}
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
