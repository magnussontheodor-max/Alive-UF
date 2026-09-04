import PageShell from "@/components/PageShell";
import Badge from "@/components/Badge";
import { ClaimList, Empty, KeyValue, Section } from "@/components/Primitives";
import { getCurrentMemory } from "@/lib/current";
import { buildMemoryView, getStage } from "@/domain";

// ---------------------------------------------------------------------------
// Startup Memory
//
// What the system currently believes, split into what is established, what is
// inferred, and what still has to be learned. Derived from evidence and
// assumptions rather than stored, so it cannot drift out of sync with them.
// ---------------------------------------------------------------------------

export default async function MemoryPage() {
  const memory = await getCurrentMemory();
  if (!memory) {
    return (
      <PageShell>
        <Empty>Create a startup first.</Empty>
      </PageShell>
    );
  }

  const view = buildMemoryView(memory);
  const { startup } = memory;

  return (
    <PageShell>
      <div className="rounded-2xl border border-ink-100 bg-ink-50/60 px-6 py-5">
        <p className="text-[13px] leading-relaxed text-ink-700">
          This is everything Spark believes about your startup, and how sure it is about each
          part. If something here is wrong, it is wrong everywhere — correct it and every
          recommendation changes with it.
        </p>
      </div>

      <Section title="The startup as Spark understands it">
        <dl className="divide-y divide-ink-100">
          <KeyValue label="Stage">
            {getStage(startup.stage).label} — {getStage(startup.stage).question}
          </KeyValue>
          <KeyValue label="Problem">
            {startup.problem ? (
              <>
                {startup.problem.value}
                <div className="mt-1.5">
                  <Badge tone="neutral">from {startup.problem.source.toLowerCase()}</Badge>
                </div>
              </>
            ) : (
              <span className="text-ink-400">Not established yet.</span>
            )}
          </KeyValue>
          <KeyValue label="Customer">
            {startup.targetCustomer?.value ?? (
              <span className="text-ink-400">Not established yet.</span>
            )}
          </KeyValue>
          <KeyValue label="Solution">
            {startup.solution?.value ?? (
              <span className="text-ink-400">
                Not decided. This comes after validation, not before.
              </span>
            )}
          </KeyValue>
          <KeyValue label="Business model">
            {startup.businessModel?.value ?? (
              <span className="text-ink-400">Not decided yet.</span>
            )}
          </KeyValue>
        </dl>
      </Section>

      <div className="grid gap-6 lg:grid-cols-3">
        <Section
          title="What we know"
          subtitle="Established facts, each traceable to evidence."
        >
          <ClaimList claims={view.known} />
        </Section>

        <Section
          title="What we believe"
          subtitle="Inferences and untested hypotheses. Plausible, not proven."
        >
          <ClaimList claims={view.believed} />
        </Section>

        <Section
          title="What we need to learn"
          subtitle="Open questions, in the order they matter."
        >
          {view.needToLearn.length === 0 ? (
            <Empty>Nothing outstanding.</Empty>
          ) : (
            <ul className="space-y-3">
              {view.needToLearn.slice(0, 8).map((question, i) => (
                <li key={i} className="border-b border-ink-100 pb-3 last:border-0 last:pb-0">
                  <p className="text-[13px] leading-relaxed text-ink-800">
                    {question.question}
                  </p>
                  <p className="mt-1 text-[11.5px] leading-relaxed text-ink-500">
                    {question.howToAnswer}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Current risks">
          {view.risks.length === 0 ? (
            <Empty>No risks recorded.</Empty>
          ) : (
            <ul className="space-y-3">
              {view.risks.map((risk, i) => (
                <li key={i} className="rounded-xl border border-ink-100 p-4">
                  <Badge
                    tone={risk.severity === "HIGH" ? "warn" : "neutral"}
                    className="mb-2"
                  >
                    {risk.severity.toLowerCase()}
                  </Badge>
                  <p className="text-[13px] leading-relaxed text-ink-800">{risk.statement}</p>
                  <p className="mt-1 text-[11.5px] text-ink-400">{risk.source}</p>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section
          title="Decisions"
          subtitle="What was decided, why, and what would make you reconsider."
        >
          {view.decisions.length === 0 ? (
            <Empty>No decisions recorded yet.</Empty>
          ) : (
            <ul className="space-y-4">
              {view.decisions.map((decision) => (
                <li key={decision.id} className="rounded-xl border border-ink-100 p-4">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Badge tone={decision.madeBy === "FOUNDER" ? "accent" : "neutral"}>
                      {decision.madeBy === "FOUNDER" ? "Your decision" : "System"}
                    </Badge>
                    <span className="text-[11px] text-ink-400">
                      {new Date(decision.createdAt).toLocaleDateString("sv-SE")}
                    </span>
                  </div>
                  <p className="text-[13.5px] font-medium text-ink-950">{decision.decision}</p>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-ink-600">
                    {decision.reason}
                  </p>
                  {decision.wouldChangeIf && (
                    <p className="mt-2 border-t border-ink-100 pt-2 text-[11.5px] leading-relaxed text-ink-500">
                      <span className="font-medium">Reconsider if: </span>
                      {decision.wouldChangeIf}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>
    </PageShell>
  );
}
