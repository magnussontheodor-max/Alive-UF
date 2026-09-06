import { ScreenFrame, StatusTag } from "./Primitives";
import { RESEARCH_QUESTION } from "./spark-startup";

// ---------------------------------------------------------------------------
// Research and evidence, on Spark's own open question.
//
// Shows the thing the product refuses to fake: a confidence level that carries
// its explanation, and a source that is described for what it is.
// ---------------------------------------------------------------------------

export default function EvidencePreview() {
  return (
    <ScreenFrame
      label="Research · Kundinsikt"
      meta={<StatusTag tone="warn">{RESEARCH_QUESTION.status}</StatusTag>}
    >
      <div className="p-4 sm:p-5">
        <p className="text-[9px] font-semibold uppercase tracking-[0.11em] text-ink-400">Fråga</p>
        <p className="mt-1.5 text-[14.5px] font-semibold leading-snug text-ink-950">
          {RESEARCH_QUESTION.question}
        </p>

        <dl className="mt-4 space-y-3 border-t border-ink-100 pt-4">
          <Row label="Underlag">
            {RESEARCH_QUESTION.evidence}
            <span className="mt-0.5 block text-[11px] text-ink-400">
              {RESEARCH_QUESTION.sourceType}
            </span>
          </Row>

          <Row label="Tilltro">
            <div className="flex items-center gap-2">
              <div className="flex gap-[3px]" aria-hidden="true">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className={`h-1.5 w-6 rounded-full ${i === 0 ? "bg-warn-500" : "bg-ink-100"}`}
                  />
                ))}
              </div>
              <span className="text-[11.5px] font-medium text-warn-600">Låg</span>
            </div>
            <span className="mt-1 block text-[11.5px] leading-relaxed text-ink-500">
              {RESEARCH_QUESTION.confidenceExplanation}
            </span>
          </Row>
        </dl>

        <div className="mt-4 rounded-xl border border-ink-100 bg-ink-50/50 px-3.5 py-3">
          <p className="text-[9px] font-semibold uppercase tracking-[0.11em] text-ink-400">
            Nästa steg
          </p>
          <p className="mt-1.5 text-[12.5px] font-medium text-ink-900">
            {RESEARCH_QUESTION.nextAction}
          </p>
        </div>
      </div>
    </ScreenFrame>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <dt className="text-[11.5px] font-medium text-ink-400">{label}</dt>
      <dd className="col-span-2 text-[12.5px] leading-relaxed text-ink-800">{children}</dd>
    </div>
  );
}
