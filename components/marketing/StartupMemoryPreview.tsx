import { EpistemicTag, ScreenFrame, StatusTag } from "./Primitives";
import {
  ASSUMPTIONS,
  DECISION,
  SPARK_STARTUP,
  WHAT_WE_BELIEVE,
  WHAT_WE_KNOW,
  WHAT_WE_NEED_TO_LEARN,
} from "./spark-startup";

// ---------------------------------------------------------------------------
// Startup Memory, holding Spark's own state.
//
// The point this screen has to make visually: this is structured state, not a
// chat log. Every claim carries its epistemic status, every assumption its
// test status, and the decision carries its reason.
// ---------------------------------------------------------------------------

const ASSUMPTION_STATUS = {
  UNTESTED: { label: "Otestad", tone: "neutral" as const },
  TESTING: { label: "Testas nu", tone: "accent" as const },
  PARTIALLY_SUPPORTED: { label: "Delvis stöd", tone: "warn" as const },
  SUPPORTED: { label: "Har stöd", tone: "good" as const },
  REJECTED: { label: "Motbevisad", tone: "warn" as const },
};

export default function StartupMemoryPreview() {
  return (
    <ScreenFrame
      label={`${SPARK_STARTUP.name} · Startup Memory`}
      meta={<StatusTag>Delad kontext</StatusTag>}
    >
      <div className="divide-y divide-ink-100">
        <Block title="Vad vi vet" hint="Fakta med underlag.">
          <ul className="space-y-2.5">
            {WHAT_WE_KNOW.map((claim) => (
              <li key={claim.statement} className="flex items-start gap-2.5">
                <EpistemicTag status={claim.status} />
                <div className="min-w-0">
                  <p className="text-[12.5px] leading-relaxed text-ink-800">{claim.statement}</p>
                  {claim.basis && (
                    <p className="mt-0.5 text-[11px] text-ink-400">Underlag: {claim.basis}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Vad vi tror" hint="Slutsatser och hypoteser. Hålls löst.">
          <ul className="space-y-2.5">
            {WHAT_WE_BELIEVE.map((claim) => (
              <li key={claim.statement} className="flex items-start gap-2.5">
                <EpistemicTag status={claim.status} />
                <p className="text-[12.5px] leading-relaxed text-ink-800">{claim.statement}</p>
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Vad vi behöver lära oss" hint="Öppna frågor, och hur de kan besvaras.">
          <ul className="space-y-2.5">
            {WHAT_WE_NEED_TO_LEARN.map((item) => (
              <li key={item.question} className="rounded-lg border border-ink-100 px-3 py-2.5">
                <p className="text-[12.5px] font-medium leading-relaxed text-ink-900">
                  {item.question}
                </p>
                <p className="mt-1 text-[11.5px] leading-relaxed text-ink-500">{item.how}</p>
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Antaganden" hint="Rankade efter vad det skulle kosta att ha fel.">
          <ul className="space-y-2">
            {ASSUMPTIONS.map((assumption) => {
              const status = ASSUMPTION_STATUS[assumption.status];
              return (
                <li key={assumption.statement} className="rounded-lg border border-ink-100 px-3 py-2.5">
                  <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                    <StatusTag tone={status.tone}>{status.label}</StatusTag>
                    <StatusTag>{assumption.category}</StatusTag>
                    {assumption.importance === "CRITICAL" && (
                      <StatusTag tone="warn">Kritisk</StatusTag>
                    )}
                  </div>
                  <p className="text-[12.5px] leading-relaxed text-ink-800">
                    {assumption.statement}
                  </p>
                  <p className="mt-1 text-[11.5px] leading-relaxed text-ink-500">
                    {assumption.note}
                  </p>
                </li>
              );
            })}
          </ul>
        </Block>

        <Block title="Beslut" hint="Med skäl och underlag, så det går att ompröva.">
          <div className="rounded-lg border border-ink-100 px-3 py-2.5">
            <div className="mb-1.5">
              <StatusTag tone="accent">{DECISION.by}</StatusTag>
            </div>
            <p className="text-[12.5px] font-medium leading-relaxed text-ink-900">
              {DECISION.decision}
            </p>
            <p className="mt-1 text-[11.5px] leading-relaxed text-ink-500">{DECISION.reason}</p>
            <p className="mt-1.5 text-[11px] text-ink-400">Underlag: {DECISION.basis}</p>
          </div>
        </Block>
      </div>
    </ScreenFrame>
  );
}

function Block({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <section className="p-4 sm:p-5">
      <div className="mb-3">
        <p className="text-[9px] font-semibold uppercase tracking-[0.11em] text-ink-400">
          {title}
        </p>
        <p className="mt-1 text-[11.5px] text-ink-500">{hint}</p>
      </div>
      {children}
    </section>
  );
}
