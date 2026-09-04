import Link from "next/link";
import PageShell from "@/components/PageShell";
import Badge from "@/components/Badge";
import { Empty, EpistemicBadge, Section } from "@/components/Primitives";
import { getCurrentMemory } from "@/lib/current";
import { SOURCE_TYPE_LABEL, evaluateGate, requirementsFor } from "@/domain";

export default async function ResearchPage() {
  const memory = await getCurrentMemory();
  if (!memory) {
    return (
      <PageShell>
        <Empty>Create a startup first.</Empty>
      </PageShell>
    );
  }

  const desk = memory.evidence.filter((e) =>
    ["MARKET_RESEARCH", "COMPETITOR", "PUBLIC_DATA", "OFFICIAL_SOURCE"].includes(
      e.sourceType
    )
  );
  const requirements = requirementsFor("RESEARCH", memory);
  const gate = evaluateGate(memory);

  return (
    <PageShell>
      <div className="rounded-2xl border border-warn-100 bg-warn-50 px-6 py-5">
        <p className="text-[13px] font-medium text-warn-600">
          The Research Agent is not built yet
        </p>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-600">
          Automated research arrives in the next phase. Until then this page tracks research
          you do yourself — record what you find on the{" "}
          <Link href="/evidence" className="font-medium text-accent-600 hover:text-accent-700">
            evidence page
          </Link>{" "}
          and it counts towards the requirements below.
        </p>
      </div>

      <Section
        title="What research has to establish before validation"
        subtitle="Desk research is the cheapest evidence there is. Do it before spending anyone's time."
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
                {!requirement.met && (
                  <p className="mt-0.5 text-[12.5px] leading-relaxed text-ink-500">
                    {requirement.detail}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
        {memory.startup.stage === "RESEARCH" && (
          <p className="mt-4 border-t border-ink-100 pt-3 text-[12px] text-ink-500">
            {gate.summary}
          </p>
        )}
      </Section>

      <Section
        title={`Research findings (${desk.length})`}
        subtitle="Everything from desk research, competitors and public sources."
      >
        {desk.length === 0 ? (
          <Empty>
            Nothing yet. Useful starting questions: who already sells something for this, what
            do they charge, and what do people use instead today?
          </Empty>
        ) : (
          <ul className="space-y-3">
            {desk.map((item) => (
              <li key={item.id} className="rounded-xl border border-ink-100 p-4">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <EpistemicBadge status={item.epistemicStatus} />
                  <Badge tone="neutral">{SOURCE_TYPE_LABEL[item.sourceType]}</Badge>
                </div>
                <p className="text-[13.5px] leading-relaxed text-ink-900">{item.claim}</p>
                <p className="mt-1.5 text-[11.5px] text-ink-400">Source: {item.source}</p>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </PageShell>
  );
}
