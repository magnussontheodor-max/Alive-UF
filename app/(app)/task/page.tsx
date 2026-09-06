import Link from "next/link";
import PageShell from "@/components/PageShell";
import Badge from "@/components/Badge";
import { Empty, Section, SubmitButton } from "@/components/Primitives";
import { getCurrentMemory } from "@/lib/current";
import { AGENT_LABEL, evaluateGate, openTask } from "@/domain";
import {
  advanceStageAction,
  completeTaskAction,
  runOrchestratorAction,
  skipTaskAction,
} from "../actions";

// ---------------------------------------------------------------------------
// The Next Best Action workflow.
//
// Where the founder actually does the work and records what happened. Recording
// the outcome is what closes the loop: the orchestrator re-reads memory and
// produces the next action from what was learned.
// ---------------------------------------------------------------------------

export default async function TaskPage() {
  const memory = await getCurrentMemory();
  if (!memory) {
    return (
      <PageShell>
        <Empty>Create a startup first.</Empty>
      </PageShell>
    );
  }

  const task = openTask(memory);
  const gate = evaluateGate(memory);
  const history = memory.tasks.filter((t) => t.status === "COMPLETE" || t.status === "SKIPPED");

  if (!task) {
    return (
      <PageShell>
        <Section
          title="No open step"
          subtitle="Spark works out the next action from what it knows. Ask it to look again."
        >
          <form action={runOrchestratorAction}>
            <SubmitButton>Work out my next step</SubmitButton>
          </form>
        </Section>
        {gate.canAdvance && gate.to && (
          <Section
            title={`Ready to move to ${gate.to.toLowerCase()}`}
            subtitle={gate.summary}
          >
            <form action={advanceStageAction}>
              <SubmitButton>Move to {gate.to.toLowerCase()}</SubmitButton>
            </form>
          </Section>
        )}
        <TaskHistory history={history} />
      </PageShell>
    );
  }

  const assumption = memory.assumptions.find((a) => a.id === task.assumptionId);

  return (
    <PageShell>
      <div className="card p-6 md:p-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge tone="accent">{AGENT_LABEL[task.agent]}</Badge>
          <Badge tone="neutral">
            {task.estimatedMinutes < 60
              ? `${task.estimatedMinutes} min`
              : `${(task.estimatedMinutes / 60).toFixed(1)} h`}
          </Badge>
          {task.actor === "FOUNDER" && <Badge tone="neutral">You do this</Badge>}
        </div>

        <h2 className="max-w-2xl text-[22px] font-semibold leading-snug tracking-tight text-ink-950">
          {task.title}
        </h2>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Field label="Why this matters">{task.why}</Field>
          <Field label="What you should learn">{task.expectedOutcome}</Field>
        </div>

        {task.founderAction && (
          <div className="mt-6 rounded-xl border border-ink-100 bg-ink-50/60 px-5 py-4">
            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-ink-400">
              What to do
            </p>
            <p className="text-[14px] leading-relaxed text-ink-900">{task.founderAction}</p>
          </div>
        )}

        {task.successCriteria.length > 0 && (
          <div className="mt-6">
            <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-ink-400">
              Done when
            </p>
            <ul className="space-y-1.5">
              {task.successCriteria.map((criterion, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[13px] text-ink-700">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-ink-300" />
                  {criterion}
                </li>
              ))}
            </ul>
          </div>
        )}

        {assumption && (
          <div className="mt-6 border-t border-ink-100 pt-5">
            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-ink-400">
              The assumption this settles
            </p>
            <p className="text-[13.5px] leading-relaxed text-ink-800">{assumption.statement}</p>
            <Link
              href="/assumptions"
              className="mt-2 inline-block text-[12.5px] font-medium text-accent-600 hover:text-accent-700"
            >
              See all assumptions
            </Link>
          </div>
        )}
      </div>

      {task.priority.alternatives.length > 0 && (
        <Section
          title="Why this and not something else"
          subtitle={task.priority.reasoning}
        >
          <ul className="space-y-2.5">
            {task.priority.alternatives.map((alternative, i) => (
              <li
                key={i}
                className="flex items-start justify-between gap-4 border-b border-ink-100 pb-2.5 last:border-0 last:pb-0"
              >
                <p className="text-[13px] leading-relaxed text-ink-700">{alternative.title}</p>
                <p className="shrink-0 text-[11.5px] text-ink-400">{alternative.whyNot}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Section
          title="Record what happened"
          subtitle="This is what moves the startup forward. Spark re-reads everything and works out the next step from it."
        >
          <form action={completeTaskAction} className="space-y-3">
            <input type="hidden" name="taskId" value={task.id} />
            <textarea
              name="note"
              rows={4}
              placeholder="What did you find? Include anything that surprised you or contradicted what you expected."
              className="w-full resize-y rounded-xl border border-ink-100 px-4 py-2.5 text-[13px] outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100"
            />
            <SubmitButton>Mark done</SubmitButton>
          </form>
          <p className="mt-3 text-[11.5px] leading-relaxed text-ink-400">
            If you learned something specific, record it on the{" "}
            <Link href="/evidence" className="text-accent-600 hover:text-accent-700">
              evidence page
            </Link>{" "}
            too — that is what changes the confidence figures.
          </p>
        </Section>

        <Section
          title="Not the right step?"
          subtitle="Skipping is fine, but say why. Spark will pick something else and remember you passed on this."
        >
          <form action={skipTaskAction} className="space-y-3">
            <input type="hidden" name="taskId" value={task.id} />
            <textarea
              name="reason"
              rows={4}
              placeholder="e.g. I cannot reach these people this week"
              className="w-full resize-y rounded-xl border border-ink-100 px-4 py-2.5 text-[13px] outline-none focus:border-accent-400"
            />
            <SubmitButton variant="secondary">Skip this step</SubmitButton>
          </form>
        </Section>
      </div>

      <TaskHistory history={history} />
    </PageShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-ink-400">
        {label}
      </p>
      <p className="text-[13.5px] leading-relaxed text-ink-800">{children}</p>
    </div>
  );
}

function TaskHistory({ history }: { history: { id: string; title: string; status: string; outcomeNote: string | null; completedAt: string | null }[] }) {
  if (history.length === 0) return null;

  return (
    <Section title="What you have done" subtitle="The record of steps taken.">
      <ul className="space-y-3">
        {history.slice(0, 10).map((item) => (
          <li key={item.id} className="border-b border-ink-100 pb-3 last:border-0 last:pb-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={item.status === "COMPLETE" ? "good" : "neutral"}>
                {item.status === "COMPLETE" ? "Done" : "Skipped"}
              </Badge>
              <p className="text-[13px] font-medium text-ink-900">{item.title}</p>
            </div>
            {item.outcomeNote && (
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-600">
                {item.outcomeNote}
              </p>
            )}
          </li>
        ))}
      </ul>
    </Section>
  );
}
