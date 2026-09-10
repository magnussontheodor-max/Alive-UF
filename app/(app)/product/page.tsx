import PageShell from "@/components/PageShell";
import Badge from "@/components/Badge";
import { Empty, Section } from "@/components/Primitives";
import { getCurrentMemory } from "@/lib/current";
import { requirementsFor, unvalidatedFeatures } from "@/domain";

export default async function ProductPage() {
  const memory = await getCurrentMemory();
  if (!memory) {
    return (
      <PageShell>
        <Empty>Create a startup first.</Empty>
      </PageShell>
    );
  }

  const spec = memory.productSpec;
  const requirements = requirementsFor("PRODUCT", memory);

  return (
    <PageShell>
      <div className="rounded-2xl border border-warn-100 bg-warn-50 px-6 py-5">
        <p className="text-[13px] font-medium text-warn-600">
          The Product Agent is not built yet
        </p>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-600">
          Turning validated learning into an MVP specification arrives in the next phase. The
          rule it will enforce is already in the model: a feature cannot be marked in scope
          unless it names the validated assumption it serves.
        </p>
      </div>

      {!spec ? (
        <Section
          title="No specification yet"
          subtitle="It gets built from what validation established — not from a feature wishlist."
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
        </Section>
      ) : (
        <>
          <Section title="MVP specification">
            <p className="text-[15px] leading-relaxed text-ink-950">{spec.valueProposition}</p>
          </Section>

          <Section
            title="In scope"
            subtitle="Every feature names the validated need it serves."
          >
            <ul className="space-y-3">
              {spec.features.map((feature) => (
                <li key={feature.id} className="rounded-xl border border-ink-100 p-4">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Badge
                      tone={
                        feature.justificationStrength === "VALIDATED"
                          ? "good"
                          : feature.justificationStrength === "PARTIAL"
                            ? "warn"
                            : "warn"
                      }
                    >
                      {feature.justificationStrength.toLowerCase()}
                    </Badge>
                    <p className="text-[13.5px] font-medium text-ink-950">{feature.name}</p>
                  </div>
                  <p className="text-[12.5px] leading-relaxed text-ink-600">
                    {feature.justification}
                  </p>
                </li>
              ))}
            </ul>
            {unvalidatedFeatures(spec).length > 0 && (
              <p className="mt-4 rounded-xl border border-warn-100 bg-warn-50 px-4 py-3 text-[12.5px] leading-relaxed text-warn-600">
                {unvalidatedFeatures(spec).length} feature(s) in scope are not justified by
                anything validated. Cut them or validate them first.
              </p>
            )}
          </Section>
        </>
      )}
    </PageShell>
  );
}
