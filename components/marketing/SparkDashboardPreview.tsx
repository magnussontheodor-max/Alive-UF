import { EpistemicTag, ScreenFrame, StatusTag } from "./Primitives";
import { NEXT_ACTION, SPARK_STARTUP, WHAT_WE_KNOW, WHAT_WE_NEED_TO_LEARN } from "./spark-startup";

// ---------------------------------------------------------------------------
// The hero visual: Spark's own dashboard, in the state it is actually in.
//
// This is a presentation variant of the real dashboard rather than the live
// component, because the live one reads a signed-in founder's memory. The
// layout, tokens and vocabulary are the product's.
// ---------------------------------------------------------------------------

const STAGES = ["Founder", "Opportunity", "Research", "Validation", "Product", "Build"];
const CURRENT = 3;

export default function SparkDashboardPreview() {
  return (
    <ScreenFrame
      label={SPARK_STARTUP.name}
      meta={<StatusTag tone="accent">{SPARK_STARTUP.stageLabel}</StatusTag>}
    >
      <div className="p-4 sm:p-5">
        {/* Stage rail */}
        <ol className="mb-5 flex items-center overflow-x-auto pb-1" aria-label="Sparks resa">
          {STAGES.map((stage, i) => (
            <li key={stage} className="flex shrink-0 items-center">
              <div className="flex flex-col items-center gap-1.5">
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full border text-[9.5px] font-semibold ${
                    i < CURRENT
                      ? "border-ink-950 bg-ink-950 text-paper"
                      : i === CURRENT
                        ? "border-accent-500 bg-accent-500 text-white shadow-[0_0_0_3px_rgba(91,103,232,0.16)]"
                        : "border-ink-200 bg-white text-ink-300"
                  }`}
                >
                  {i < CURRENT ? "✓" : i + 1}
                </span>
                <span
                  className={`text-[9.5px] whitespace-nowrap ${
                    i === CURRENT ? "font-semibold text-ink-950" : "text-ink-400"
                  }`}
                >
                  {stage}
                </span>
              </div>
              {i < STAGES.length - 1 && (
                <span
                  className={`mb-4 h-px w-5 sm:w-8 ${i < CURRENT ? "bg-ink-300" : "bg-ink-100"}`}
                />
              )}
            </li>
          ))}
        </ol>

        {/* Next best action */}
        <div className="relative overflow-hidden rounded-xl bg-ink-950 p-4 sm:p-5 text-paper">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 14% 18%, #fff 0, transparent 44%), radial-gradient(circle at 86% 88%, #fff 0, transparent 40%)",
            }}
          />
          <div className="relative">
            <p className="text-[9.5px] font-semibold uppercase tracking-[0.13em] text-accent-300">
              Nästa steg
            </p>
            <p className="mt-2 text-[17px] sm:text-[19px] font-semibold leading-snug tracking-[-0.015em]">
              {NEXT_ACTION.title}
            </p>
            <p className="mt-2.5 max-w-md text-[12.5px] leading-relaxed text-ink-300">
              {NEXT_ACTION.why}
            </p>

            <dl className="mt-4 grid grid-cols-1 gap-3 border-t border-white/10 pt-3.5 sm:grid-cols-3">
              {[
                ["Förväntat utfall", NEXT_ACTION.outcome],
                ["Lyckat om", NEXT_ACTION.success],
                ["Tid", NEXT_ACTION.time],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-[9px] font-semibold uppercase tracking-[0.09em] text-ink-500">
                    {label}
                  </dt>
                  <dd className="mt-1 text-[11.5px] leading-relaxed text-ink-200">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Supporting panels */}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Panel title="Vad vi vet">
            <ul className="space-y-2">
              {WHAT_WE_KNOW.slice(0, 2).map((claim) => (
                <li key={claim.statement} className="flex items-start gap-2">
                  <EpistemicTag status={claim.status} />
                  <span className="text-[11.5px] leading-relaxed text-ink-700">
                    {claim.statement}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Vad vi behöver lära oss">
            <ul className="space-y-2">
              {WHAT_WE_NEED_TO_LEARN.slice(0, 2).map((item) => (
                <li key={item.question} className="flex items-start gap-2">
                  <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-ink-300" />
                  <span className="text-[11.5px] leading-relaxed text-ink-700">
                    {item.question}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        {/* Biggest risk */}
        <div className="mt-3 rounded-xl border border-warn-100 bg-warn-50 px-4 py-3">
          <p className="text-[9px] font-semibold uppercase tracking-[0.11em] text-warn-600">
            Största risken
          </p>
          <p className="mt-1.5 text-[12px] leading-relaxed text-ink-700">
            Att vi bygger vidare innan vi vet om efterfrågan finns. Positiva samtal är en
            signal — ingen har ännu bett om produkten oombedd.
          </p>
        </div>
      </div>
    </ScreenFrame>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-ink-100 p-3.5">
      <p className="mb-2.5 text-[9px] font-semibold uppercase tracking-[0.11em] text-ink-400">
        {title}
      </p>
      {children}
    </div>
  );
}
