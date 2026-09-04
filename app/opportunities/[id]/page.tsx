import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import Badge from "@/components/Badge";
import {
  ClaimList,
  ConfidenceDisplay,
  Empty,
  KeyValue,
  Section,
  SubmitButton,
} from "@/components/Primitives";
import { getCurrentMemory } from "@/lib/current";
import {
  APPROVAL_LABEL,
  CATEGORY_LABEL,
  OPPORTUNITY_STATUS_LABEL,
  STATUS_LABEL,
} from "@/domain";
import { discardOpportunityAction, selectOpportunityAction } from "../../actions";

export default async function OpportunityDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const memory = await getCurrentMemory();
  const opportunity = memory?.opportunities.find((o) => o.id === params.id);
  if (!memory || !opportunity) notFound();

  const assumptions = memory.assumptions.filter(
    (a) => a.opportunityId === opportunity.id
  );
  const isSelected = opportunity.status === "SELECTED";

  return (
    <PageShell>
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge tone={isSelected ? "good" : "neutral"}>
            {OPPORTUNITY_STATUS_LABEL[opportunity.status]}
          </Badge>
          <Badge tone="accent">{APPROVAL_LABEL[opportunity.approval]}</Badge>
        </div>
        <h2 className="max-w-2xl text-[22px] font-semibold leading-snug tracking-tight text-ink-950">
          {opportunity.problem}
        </h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Section title="The opportunity">
            <dl className="divide-y divide-ink-100">
              <KeyValue label="Problem">{opportunity.problem}</KeyValue>
              <KeyValue label="Who has it">{opportunity.customer}</KeyValue>
              <KeyValue label="Where you saw it">{opportunity.context}</KeyValue>
              <KeyValue label="Your fit">
                {opportunity.founderFit.statement}
                <div className="mt-1.5">
                  <Badge
                    tone={
                      opportunity.founderFit.strength === "STRONG"
                        ? "good"
                        : opportunity.founderFit.strength === "MODERATE"
                          ? "accent"
                          : "neutral"
                    }
                  >
                    {opportunity.founderFit.strength.toLowerCase()} fit
                  </Badge>
                </div>
              </KeyValue>
              <KeyValue label="Proposed solution">
                {opportunity.proposedSolution ?? (
                  <span className="text-ink-400">
                    None yet — deliberately. What to build is decided after the problem is
                    confirmed, not before.
                  </span>
                )}
              </KeyValue>
            </dl>
          </Section>

          <Section
            title="What we know, and what we're guessing"
            subtitle="Each statement is marked. Nothing here is presented as more certain than it is."
          >
            <ClaimList claims={opportunity.claims} />
          </Section>

          <Section
            title="What must be true"
            subtitle="These become the assumptions Spark tracks and tests."
          >
            {assumptions.length === 0 ? (
              <ul className="space-y-2">
                {opportunity.keyUnknowns.map((unknown, i) => (
                  <li key={i} className="text-[13px] leading-relaxed text-ink-700">
                    {unknown}
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="space-y-3">
                {assumptions.map((assumption) => (
                  <li key={assumption.id} className="rounded-xl border border-ink-100 p-4">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Badge tone="neutral">{CATEGORY_LABEL[assumption.category]}</Badge>
                      <Badge
                        tone={assumption.importance === "CRITICAL" ? "warn" : "neutral"}
                      >
                        {assumption.importance.toLowerCase()}
                      </Badge>
                      <Badge tone="neutral">{STATUS_LABEL[assumption.status]}</Badge>
                    </div>
                    <p className="text-[13.5px] leading-relaxed text-ink-900">
                      {assumption.statement}
                    </p>
                    <p className="mt-1.5 text-[12px] leading-relaxed text-ink-500">
                      {assumption.importanceReason}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section title="Risks" subtitle="Each one comes with how you could check it.">
            <ul className="space-y-3">
              {opportunity.risks.map((risk) => (
                <li key={risk.id} className="rounded-xl border border-ink-100 p-4">
                  <Badge
                    tone={risk.severity === "HIGH" ? "warn" : "neutral"}
                    className="mb-2"
                  >
                    {risk.severity.toLowerCase()}
                  </Badge>
                  <p className="text-[13px] leading-relaxed text-ink-800">{risk.statement}</p>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-ink-500">
                    <span className="font-medium">How to check: </span>
                    {risk.howToCheck}
                  </p>
                </li>
              ))}
            </ul>
          </Section>
        </div>

        <div className="space-y-6">
          <Section
            title="Score"
            subtitle="Shown with its parts, because a single number would tell you nothing useful."
          >
            <div className="mb-4 flex items-baseline gap-2">
              <span className="text-[28px] font-semibold text-ink-950">
                {opportunity.score.total}
              </span>
              <span className="text-[12px] text-ink-400">/ 100</span>
            </div>

            <ul className="space-y-3">
              {opportunity.score.components.map((component) => (
                <li key={component.key}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[12.5px] font-medium text-ink-800">
                      {component.label}
                    </span>
                    <span className="text-[12.5px] tabular-nums text-ink-600">
                      {component.value}
                    </span>
                  </div>
                  <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-ink-100">
                    <div
                      className={component.grounded ? "h-full bg-ink-950" : "h-full bg-ink-300"}
                      style={{ width: `${component.value}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-[11.5px] leading-relaxed text-ink-500">
                    {component.reasoning}
                  </p>
                  {!component.grounded && (
                    <p className="mt-1 text-[11px] text-warn-600">
                      Not backed by evidence — this part is inference.
                    </p>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-5 border-t border-ink-100 pt-3">
              <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-ink-400">
                What this score does not tell you
              </p>
              <ul className="space-y-1.5">
                {opportunity.score.limitations.map((limitation, i) => (
                  <li key={i} className="text-[11.5px] leading-relaxed text-ink-500">
                    {limitation}
                  </li>
                ))}
              </ul>
            </div>
          </Section>

          <Section title="Confidence">
            <ConfidenceDisplay confidence={opportunity.confidence} />
          </Section>

          {!isSelected && (
            <Section
              title="Your decision"
              subtitle="Spark suggests. Choosing is yours, and it gets recorded as your decision."
            >
              <form action={selectOpportunityAction} className="space-y-3">
                <input type="hidden" name="opportunityId" value={opportunity.id} />
                <label className="block text-[12.5px] font-medium text-ink-700">
                  Why this one?
                  <textarea
                    name="reason"
                    rows={3}
                    placeholder="Your reasoning, in your own words. You will want this in six weeks."
                    className="mt-2 w-full resize-y rounded-xl border border-ink-100 px-4 py-2.5 text-[13px] outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100"
                  />
                </label>
                <SubmitButton>Pursue this opportunity</SubmitButton>
              </form>

              <form
                action={discardOpportunityAction}
                className="mt-4 border-t border-ink-100 pt-4"
              >
                <input type="hidden" name="opportunityId" value={opportunity.id} />
                <input
                  name="reason"
                  placeholder="Why are you ruling it out?"
                  className="mb-3 w-full rounded-xl border border-ink-100 px-4 py-2 text-[12.5px] outline-none focus:border-accent-400"
                />
                <SubmitButton variant="secondary">Discard</SubmitButton>
              </form>
            </Section>
          )}

          {isSelected && (
            <Section title="Selected">
              <p className="text-[13px] leading-relaxed text-ink-700">
                This is what Spark is now working on. Everything on the dashboard relates to
                testing whether it holds up.
              </p>
            </Section>
          )}
        </div>
      </div>
    </PageShell>
  );
}
