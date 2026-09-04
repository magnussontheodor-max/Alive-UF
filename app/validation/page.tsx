import Link from "next/link";
import PageShell from "@/components/PageShell";
import Badge from "@/components/Badge";
import { Empty, Section } from "@/components/Primitives";
import { getCurrentMemory } from "@/lib/current";
import {
  EXPERIMENT_STATUS_LABEL,
  METHOD_LABEL,
  OUTCOME_LABEL,
  rankAssumptions,
  requirementsFor,
} from "@/domain";

export default async function ValidationPage() {
  const memory = await getCurrentMemory();
  if (!memory) {
    return (
      <PageShell>
        <Empty>Create a startup first.</Empty>
      </PageShell>
    );
  }

  const requirements = requirementsFor("VALIDATION", memory);
  const ranked = rankAssumptions(memory);
  const riskiest = ranked[0];

  return (
    <PageShell>
      <div className="rounded-2xl border border-warn-100 bg-warn-50 px-6 py-5">
        <p className="text-[13px] font-medium text-warn-600">
          The Validation Agent is not built yet
        </p>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-600">
          Designing experiments automatically arrives in the next phase. The assumption
          ranking below is live, and you can record results on the{" "}
          <Link href="/evidence" className="font-medium text-accent-600 hover:text-accent-700">
            evidence page
          </Link>{" "}
          — confidence updates immediately when you do.
        </p>
      </div>

      {riskiest && (
        <Section
          title="Your riskiest assumption right now"
          subtitle="This is what validation exists to settle."
        >
          <p className="text-[15px] leading-relaxed text-ink-950">
            {riskiest.assumption.statement}
          </p>
          <p className="mt-2 text-[12.5px] leading-relaxed text-ink-500">
            {riskiest.reasoning}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-ink-100 pt-3">
            <Badge tone="neutral">
              Suggested method: {METHOD_LABEL[riskiest.assumption.validationMethod]}
            </Badge>
            <Badge tone={riskiest.assumption.importance === "CRITICAL" ? "warn" : "neutral"}>
              {riskiest.assumption.importance.toLowerCase()} importance
            </Badge>
          </div>
        </Section>
      )}

      <Section
        title="What has to be true before you build"
        subtitle="This is the strictest gate in the product, and the reason it exists."
      >
        <ul className="space-y-3">
          {requirements.map((requirement) => (
            <li
              key={requirement.id}
              className="flex items-start gap-3 border-b border-ink-100 pb-3 last:border-0 last:pb-0"
            >
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] ${
                  requirement.met
                    ? "bg-good-500 text-white"
                    : "border border-ink-200 text-ink-300"
                }`}
              >
                {requirement.met ? "✓" : ""}
              </span>
              <div>
                <p className="text-[13.5px] font-medium text-ink-900">{requirement.label}</p>
                {!requirement.met && requirement.detail && (
                  <p className="mt-0.5 text-[12.5px] leading-relaxed text-ink-500">
                    {requirement.detail}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={`Experiments (${memory.experiments.length})`}>
        {memory.experiments.length === 0 ? (
          <Empty>
            No experiments designed yet. Automated experiment design arrives with the
            Validation Agent.
          </Empty>
        ) : (
          <ul className="space-y-3">
            {memory.experiments.map((experiment) => (
              <li key={experiment.id} className="rounded-xl border border-ink-100 p-4">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge tone="neutral">
                    {EXPERIMENT_STATUS_LABEL[experiment.status]}
                  </Badge>
                  <Badge tone="neutral">{METHOD_LABEL[experiment.method]}</Badge>
                  {experiment.result && (
                    <Badge
                      tone={
                        experiment.result.outcome === "SUPPORTED"
                          ? "good"
                          : experiment.result.outcome === "REJECTED"
                            ? "warn"
                            : "neutral"
                      }
                    >
                      {OUTCOME_LABEL[experiment.result.outcome]}
                    </Badge>
                  )}
                </div>
                <p className="text-[13.5px] font-medium text-ink-950">{experiment.title}</p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-ink-600">
                  {experiment.hypothesis}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </PageShell>
  );
}
