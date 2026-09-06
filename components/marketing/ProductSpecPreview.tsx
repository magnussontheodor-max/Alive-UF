import { ScreenFrame, StatusTag } from "./Primitives";
import { MVP_SPEC, SPARK_STARTUP } from "./spark-startup";

// ---------------------------------------------------------------------------
// The MVP specification Spark holds for itself.
//
// The rule the product enforces, shown as design: a feature is in scope only
// if something learned justifies it. Everything else has a column of its own.
// ---------------------------------------------------------------------------

export default function ProductSpecPreview() {
  return (
    <ScreenFrame
      label={`${SPARK_STARTUP.name} · MVP-specifikation`}
      meta={<StatusTag>Utkast</StatusTag>}
    >
      <div className="p-4 sm:p-5">
        <dl className="space-y-3 border-b border-ink-100 pb-4">
          <Row label="Primär användare">{MVP_SPEC.primaryUser}</Row>
          <Row label="Kärnproblem">{MVP_SPEC.coreProblem}</Row>
          <Row label="Önskat utfall">{MVP_SPEC.coreOutcome}</Row>
        </dl>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <div className="mb-2.5 flex items-center gap-2">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-good-500 text-[9px] text-white">
                ✓
              </span>
              <p className="text-[9px] font-semibold uppercase tracking-[0.11em] text-ink-500">
                Måste finnas
              </p>
            </div>
            <ul className="space-y-1.5">
              {MVP_SPEC.mustHave.map((item) => (
                <li key={item} className="text-[12.5px] leading-relaxed text-ink-800">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="mb-2.5 flex items-center gap-2">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-ink-200 text-[9px] text-ink-500">
                ✕
              </span>
              <p className="text-[9px] font-semibold uppercase tracking-[0.11em] text-ink-500">
                Inte nu
              </p>
            </div>
            <ul className="space-y-1.5">
              {MVP_SPEC.notNow.map((item) => (
                <li key={item} className="text-[12.5px] leading-relaxed text-ink-400">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-4 border-t border-ink-100 pt-3 text-[11.5px] leading-relaxed text-ink-500">
          Spark tar inte in en funktion i scope utan att den pekar tillbaka på något ni faktiskt
          lärt er. Det är så en MVP förblir liten.
        </p>
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
