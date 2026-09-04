import Link from "next/link";
import { AGENT_LABEL, Task } from "@/domain";
import { IconArrowUpRight, IconSpark } from "./icons";

// ---------------------------------------------------------------------------
// The Next Best Action.
//
// The single most prominent thing in the product. It always carries: what to
// do, why it matters, what success looks like, and how long it should take —
// because "do customer interviews" with none of that is exactly the useless
// advice this product exists to replace.
// ---------------------------------------------------------------------------

export default function NextStepCard({ task }: { task: Task | null }) {
  if (!task) {
    return (
      <div className="rounded-2xl border border-ink-100 bg-white p-8 text-center">
        <p className="text-[15px] font-semibold text-ink-950">No next step yet</p>
        <p className="mx-auto mt-2 max-w-md text-[13px] text-ink-500">
          Spark works out your next action from what it knows. Add something about yourself
          and it will have something to work with.
        </p>
        <Link
          href="/founder"
          className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-ink-950 px-5 py-2.5 text-[13.5px] font-medium text-paper hover:bg-ink-800"
        >
          Start the founder conversation
        </Link>
      </div>
    );
  }

  const hours = task.estimatedMinutes / 60;
  const timeLabel =
    task.estimatedMinutes < 60
      ? `${task.estimatedMinutes} min`
      : `${hours % 1 === 0 ? hours : hours.toFixed(1)} h`;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-ink-100 bg-ink-950 text-paper shadow-panel">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 18%, white 0, transparent 45%), radial-gradient(circle at 88% 88%, white 0, transparent 40%)",
        }}
      />
      <div className="relative px-6 py-6 md:px-8 md:py-7">
        <div className="mb-4 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-ink-300">
          <IconSpark className="h-3.5 w-3.5 text-accent-300" />
          Your next step
        </div>

        <h2 className="max-w-2xl text-[22px] font-semibold leading-snug tracking-tight md:text-[25px]">
          {task.title}
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-ink-400">
              Why this matters
            </p>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-200">{task.why}</p>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-ink-400">
              What you should learn
            </p>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-200">
              {task.expectedOutcome}
            </p>
          </div>
        </div>

        {task.founderAction && (
          <div className="mt-5 rounded-xl border border-ink-700 bg-ink-900/60 px-4 py-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-ink-400">
              What you do
            </p>
            <p className="mt-1 text-[13.5px] leading-relaxed text-ink-100">
              {task.founderAction}
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
          <Link
            href="/task"
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-[13.5px] font-medium text-ink-950 transition-colors hover:bg-ink-100"
          >
            Start this step
            <IconArrowUpRight className="h-3.5 w-3.5" />
          </Link>
          <span className="text-[12px] text-ink-400">About {timeLabel}</span>
          <span className="text-[12px] text-ink-400">
            {AGENT_LABEL[task.agent]}
          </span>
        </div>
      </div>
    </div>
  );
}
