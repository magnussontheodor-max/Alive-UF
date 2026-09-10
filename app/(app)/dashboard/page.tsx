import Link from "next/link";
import PageShell from "@/components/PageShell";
import StageProgress from "@/components/StageProgress";
import NextStepCard from "@/components/NextStepCard";
import Badge from "@/components/Badge";
import {
  ClaimList,
  ConfidenceDisplay,
  Empty,
  Section,
} from "@/components/Primitives";
import { getCurrentMemory } from "@/lib/current";
import {
  CATEGORY_LABEL,
  STATUS_LABEL,
  buildMemoryView,
  computeStartupConfidence,
  evaluateGate,
  getStage,
  openTask,
  rankAssumptions,
  selectedOpportunity,
} from "@/domain";
import { createStartupAction, seedDemoAction } from "../actions";

export default async function DashboardPage() {
  const memory = await getCurrentMemory();

  if (!memory) return <Welcome />;

  const { startup } = memory;
  const stage = getStage(startup.stage);
  const task = openTask(memory);
  const gate = evaluateGate(memory);
  const view = buildMemoryView(memory);
  const startupConfidence = computeStartupConfidence(memory.assumptions, memory.evidence);
  const ranked = rankAssumptions(memory).slice(0, 3);
  const opportunity = selectedOpportunity(memory);

  return (
    <PageShell>
      <div>
        <div className="mb-1 flex flex-wrap items-center gap-2.5">
          <h2 className="text-[19px] font-semibold tracking-tight text-ink-950">
            {startup.name}
          </h2>
          {startup.isDemo && <Badge tone="warn">Demo data</Badge>}
          {opportunity && <Badge tone="accent">{opportunity.title}</Badge>}
        </div>
        <p className="mb-6 text-[13px] text-ink-500">
          {stage.question} · {stage.description}
        </p>
        <StageProgress current={startup.stage} />
      </div>

      <NextStepCard task={task} />

      {/* The four questions, answered at a glance. */}
      <div className="grid gap-px overflow-hidden rounded-2xl border border-ink-100 bg-ink-100 sm:grid-cols-2 lg:grid-cols-4">
        <Panel label="Where am I?">
          <span className="font-medium text-ink-950">{stage.label}</span>
          {" — "}
          {gate.canAdvance ? "ready to move on." : gate.summary}
        </Panel>
        <Panel label="What do we know?">
          {view.known.length === 0
            ? "Nothing has been established as fact yet."
            : `${view.known.length} thing${view.known.length === 1 ? "" : "s"} established, from ${memory.evidence.length} piece${memory.evidence.length === 1 ? "" : "s"} of evidence.`}
        </Panel>
        <Panel label="What's blocking me?">
          {gate.requirements.filter((r) => !r.met)[0]?.detail ?? "Nothing at this stage."}
        </Panel>
        <Panel label="How confident are we?">
          <span className="font-medium text-ink-950">
            {startupConfidence.level === "NONE" ? "Not yet" : startupConfidence.level.toLowerCase()}
          </span>
          {" — "}
          {startupConfidence.explanation}
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Section
            title="What we're testing"
            subtitle="Ranked by how much damage being wrong would do, and how little we currently know."
            action={
              <Link
                href="/assumptions"
                className="text-[12.5px] font-medium text-accent-600 hover:text-accent-700"
              >
                All assumptions
              </Link>
            }
          >
            {ranked.length === 0 ? (
              <Empty>
                No open assumptions. Once you choose an opportunity, Spark writes down what
                would have to be true for it to work.
              </Empty>
            ) : (
              <ul className="space-y-3">
                {ranked.map(({ assumption, reasoning }) => (
                  <li
                    key={assumption.id}
                    className="rounded-xl border border-ink-100 px-4 py-3"
                  >
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Badge tone="neutral">{CATEGORY_LABEL[assumption.category]}</Badge>
                      <Badge
                        tone={
                          assumption.importance === "CRITICAL"
                            ? "warn"
                            : assumption.importance === "HIGH"
                              ? "warn"
                              : "neutral"
                        }
                      >
                        {assumption.importance.toLowerCase()} importance
                      </Badge>
                      <Badge tone="neutral">{STATUS_LABEL[assumption.status]}</Badge>
                    </div>
                    <p className="text-[13.5px] leading-relaxed text-ink-900">
                      {assumption.statement}
                    </p>
                    <p className="mt-1.5 text-[12px] leading-relaxed text-ink-500">
                      {reasoning}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section
            title="What we know"
            subtitle="Only statements that trace back to evidence appear here."
            action={
              <Link
                href="/memory"
                className="text-[12.5px] font-medium text-accent-600 hover:text-accent-700"
              >
                Startup memory
              </Link>
            }
          >
            <ClaimList claims={view.known.slice(0, 5)} />
          </Section>
        </div>

        <div className="space-y-6">
          <Section title="Current risks">
            {view.risks.length === 0 ? (
              <Empty>No risks recorded yet.</Empty>
            ) : (
              <ul className="space-y-3">
                {view.risks.slice(0, 4).map((risk, i) => (
                  <li key={i} className="border-b border-ink-100 pb-3 last:border-0 last:pb-0">
                    <Badge
                      tone={risk.severity === "HIGH" ? "warn" : "neutral"}
                      className="mb-1.5"
                    >
                      {risk.severity.toLowerCase()}
                    </Badge>
                    <p className="text-[12.5px] leading-relaxed text-ink-700">
                      {risk.statement}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section title="Startup confidence">
            <ConfidenceDisplay
              confidence={{
                level: startupConfidence.level,
                value: 0,
                basis: memory.evidence.map((e) => e.id),
                explanation: startupConfidence.explanation,
              }}
            />
            {startupConfidence.limitedBy && (
              <p className="mt-4 border-t border-ink-100 pt-3 text-[11.5px] leading-relaxed text-ink-400">
                Held back by: {startupConfidence.limitedBy}
              </p>
            )}
          </Section>

          <Section title="Recent activity">
            {memory.decisions.length === 0 ? (
              <Empty>No decisions recorded yet.</Empty>
            ) : (
              <ul className="space-y-3">
                {memory.decisions.slice(0, 4).map((decision) => (
                  <li key={decision.id}>
                    <p className="text-[12.5px] font-medium text-ink-900">
                      {decision.decision}
                    </p>
                    <p className="mt-0.5 text-[11.5px] leading-relaxed text-ink-500">
                      {decision.reason}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Section>
        </div>
      </div>
    </PageShell>
  );
}

function Panel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-white px-4 py-3.5">
      <p className="mb-1 text-[10.5px] font-medium uppercase tracking-wide text-ink-400">
        {label}
      </p>
      <p className="text-[13px] leading-snug text-ink-800">{children}</p>
    </div>
  );
}

function Welcome() {
  return (
    <PageShell>
      <div className="mx-auto max-w-xl py-8">
        <h2 className="text-[24px] font-semibold tracking-tight text-ink-950">
          Let&rsquo;s work out what you should build.
        </h2>
        <p className="mt-3 text-[14px] leading-relaxed text-ink-600">
          Spark UF is not an idea generator. It starts from what you have actually seen and
          who you can actually reach, keeps track of what is known versus assumed, and tells
          you the one thing to do next.
        </p>

        <form action={createStartupAction} className="card mt-8 space-y-4 p-6">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-[12.5px] font-medium text-ink-700"
            >
              What should we call this?
            </label>
            <input
              id="name"
              name="name"
              required
              placeholder="A working name — you can change it later"
              className="w-full rounded-xl border border-ink-100 px-4 py-2.5 text-[13px] outline-none transition-shadow focus:border-accent-400 focus:ring-2 focus:ring-accent-100"
            />
            <p className="mt-2 text-[11.5px] text-ink-400">
              You do not need an idea yet. Most people start here without one.
            </p>
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-full bg-ink-950 px-5 py-2.5 text-[13.5px] font-medium text-paper hover:bg-ink-800"
          >
            Start
          </button>
        </form>

        <form action={seedDemoAction} className="mt-6">
          <p className="text-[12.5px] text-ink-500">
            Want to see how it works first?{" "}
            <button
              type="submit"
              className="font-medium text-accent-600 underline underline-offset-2 hover:text-accent-700"
            >
              Load a demo workspace
            </button>
            . It is clearly marked as demo data, and everything in it is produced by the
            real agents.
          </p>
        </form>
      </div>
    </PageShell>
  );
}
