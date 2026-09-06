import Link from "next/link";
import PageShell from "@/components/PageShell";
import Badge from "@/components/Badge";
import { Empty, Section, SubmitButton } from "@/components/Primitives";
import { getCurrentMemory } from "@/lib/current";
import { APPROVAL_LABEL, OPPORTUNITY_STATUS_LABEL, groundedFraction } from "@/domain";
import { runOrchestratorAction } from "../actions";

export default async function OpportunitiesPage() {
  const memory = await getCurrentMemory();
  if (!memory) {
    return (
      <PageShell>
        <Empty>Create a startup first.</Empty>
      </PageShell>
    );
  }

  const active = memory.opportunities.filter((o) => o.status !== "DISCARDED");

  return (
    <PageShell>
      <div className="rounded-2xl border border-ink-100 bg-ink-50/60 px-6 py-5">
        <p className="text-[13px] leading-relaxed text-ink-700">
          Every opportunity here starts from a problem you personally witnessed. Spark cannot
          produce one any other way — if you have not recorded an observed problem, it will
          say so rather than invent something plausible.
        </p>
      </div>

      {active.length === 0 ? (
        <Section
          title="No opportunities yet"
          subtitle="They are built from the problems you recorded in your founder profile."
        >
          <form action={runOrchestratorAction}>
            <SubmitButton>Build opportunities from what I described</SubmitButton>
          </form>
        </Section>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {active.map((opportunity) => {
            const grounded = Math.round(groundedFraction(opportunity.score) * 100);
            return (
              <Link
                key={opportunity.id}
                href={`/opportunities/${opportunity.id}`}
                className="card flex flex-col p-5 transition-colors hover:border-ink-200"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <Badge
                    tone={opportunity.status === "SELECTED" ? "good" : "neutral"}
                  >
                    {OPPORTUNITY_STATUS_LABEL[opportunity.status]}
                  </Badge>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-ink-950">
                    <span className="text-[11px] font-semibold text-ink-950">
                      {opportunity.score.total}
                    </span>
                  </div>
                </div>

                <h3 className="mb-2 text-[14.5px] font-semibold leading-snug text-ink-950">
                  {opportunity.title}
                </h3>

                <div className="flex-1 space-y-2.5 text-[12.5px] leading-relaxed text-ink-600">
                  <p>
                    <span className="font-medium text-ink-400">Problem — </span>
                    {opportunity.problem}
                  </p>
                  <p>
                    <span className="font-medium text-ink-400">Who — </span>
                    {opportunity.customer}
                  </p>
                </div>

                <div className="mt-4 border-t border-ink-100 pt-3">
                  <p className="text-[11.5px] text-ink-400">
                    {grounded}% of this score rests on evidence. The rest is inference from
                    what you told us.
                  </p>
                  <p className="mt-1.5 text-[11.5px] text-ink-500">
                    {APPROVAL_LABEL[opportunity.approval]}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {memory.opportunities.some((o) => o.status === "DISCARDED") && (
        <Section title="Discarded" subtitle="Kept on record so you do not revisit them by accident.">
          <ul className="space-y-2">
            {memory.opportunities
              .filter((o) => o.status === "DISCARDED")
              .map((o) => (
                <li key={o.id} className="text-[13px] text-ink-500">
                  {o.title}
                </li>
              ))}
          </ul>
        </Section>
      )}
    </PageShell>
  );
}
