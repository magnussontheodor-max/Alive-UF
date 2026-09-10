import { STAGES, StageId, stageIndex } from "@/domain";
import { IconCheck } from "./icons";

const stageHref: Record<StageId, string> = {
  FOUNDER: "/founder",
  OPPORTUNITY: "/opportunities",
  RESEARCH: "/research",
  VALIDATION: "/validation",
  PRODUCT: "/product",
  BUILD: "/product",
  SETUP: "/settings",
  LAUNCH: "/settings",
};

export default function StageProgress({ current }: { current: StageId }) {
  const currentIndex = stageIndex(current);

  return (
    <div className="w-full overflow-x-auto pb-1">
      <ol className="flex min-w-max items-start">
        {STAGES.map((stage, i) => {
          const done = i < currentIndex;
          const active = i === currentIndex;
          const isLast = i === STAGES.length - 1;
          const dimmed = stage.implementation === "PLACEHOLDER";

          return (
            <li key={stage.id} className="flex items-start">
              <a
                href={stageHref[stage.id]}
                className="flex flex-col items-center gap-2 px-1"
                title={`${stage.question}${dimmed ? " (not built in this version)" : ""}`}
              >
                <span
                  className={[
                    "flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-medium transition-colors",
                    done
                      ? "border-ink-950 bg-ink-950 text-paper"
                      : active
                        ? "border-accent-500 bg-accent-500 text-white shadow-[0_0_0_4px_rgba(91,103,232,0.15)]"
                        : dimmed
                          ? "border-dashed border-ink-200 bg-white text-ink-300"
                          : "border-ink-200 bg-white text-ink-400",
                  ].join(" ")}
                >
                  {done ? <IconCheck className="h-3.5 w-3.5" /> : i + 1}
                </span>
                <span
                  className={[
                    "whitespace-nowrap text-[11.5px]",
                    active
                      ? "font-medium text-ink-950"
                      : done
                        ? "text-ink-600"
                        : "text-ink-400",
                  ].join(" ")}
                >
                  {stage.label}
                </span>
              </a>
              {!isLast && (
                <div
                  className="mb-5 mt-3.5 h-px w-7 md:w-10"
                  style={{ backgroundColor: done ? "#A4A9BD" : "#E6E8EF" }}
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
