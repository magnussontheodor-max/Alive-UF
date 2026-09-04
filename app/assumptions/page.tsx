import PageShell from "@/components/PageShell";
import Badge from "@/components/Badge";
import {
  ConfidenceDisplay,
  Empty,
  Section,
  SubmitButton,
} from "@/components/Primitives";
import { getCurrentMemory } from "@/lib/current";
import {
  CATEGORY_LABEL,
  METHOD_LABEL,
  STATUS_LABEL,
  evidenceFor,
  rankAssumptions,
} from "@/domain";
import { addAssumptionAction, updateAssumptionStatusAction } from "../actions";

const STATUS_TONE = {
  UNTESTED: "neutral",
  TESTING: "accent",
  SUPPORTED: "good",
  PARTIALLY_SUPPORTED: "warn",
  REJECTED: "warn",
} as const;

export default async function AssumptionsPage() {
  const memory = await getCurrentMemory();
  if (!memory) {
    return (
      <PageShell>
        <Empty>Create a startup first.</Empty>
      </PageShell>
    );
  }

  const ranked = rankAssumptions(memory);
  const rankedIds = new Set(ranked.map((r) => r.assumption.id));
  const resolved = memory.assumptions.filter((a) => !rankedIds.has(a.id));

  return (
    <PageShell>
      <div className="rounded-2xl border border-ink-100 bg-ink-50/60 px-6 py-5">
        <p className="text-[13px] leading-relaxed text-ink-700">
          Open assumptions are ranked by how much damage being wrong would do, how little we
          know, and how cheaply each could be tested right now. The top one drives your next
          step.
        </p>
      </div>

      <Section
        title={`Open assumptions (${ranked.length})`}
        subtitle="In priority order."
      >
        {ranked.length === 0 ? (
          <Empty>No open assumptions.</Empty>
        ) : (
          <ul className="space-y-4">
            {ranked.map(({ assumption, reasoning }, index) => {
              const evidence = evidenceFor(memory, assumption.id);
              return (
                <li key={assumption.id} className="rounded-xl border border-ink-100 p-5">
                  <div className="mb-2.5 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-medium tabular-nums text-ink-400">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <Badge tone="neutral">{CATEGORY_LABEL[assumption.category]}</Badge>
                    <Badge
                      tone={
                        assumption.importance === "CRITICAL" || assumption.importance === "HIGH"
                          ? "warn"
                          : "neutral"
                      }
                    >
                      {assumption.importance.toLowerCase()}
                    </Badge>
                    <Badge tone={STATUS_TONE[assumption.status]}>
                      {STATUS_LABEL[assumption.status]}
                    </Badge>
                  </div>

                  <p className="text-[14px] leading-relaxed text-ink-950">
                    {assumption.statement}
                  </p>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-ink-500">
                    {assumption.importanceReason}
                  </p>

                  <div className="mt-4 grid gap-4 border-t border-ink-100 pt-4 md:grid-cols-2">
                    <div>
                      <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-ink-400">
                        Confidence
                      </p>
                      <ConfidenceDisplay confidence={assumption.confidence} />
                    </div>
                    <div>
                      <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-ink-400">
                        Evidence
                      </p>
                      <p className="text-[12.5px] text-ink-700">
                        {evidence.supporting.length} for, {evidence.contradicting.length}{" "}
                        against
                      </p>
                      <p className="mt-1 text-[11.5px] text-ink-500">
                        How to test: {METHOD_LABEL[assumption.validationMethod]}
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 text-[11.5px] leading-relaxed text-ink-400">
                    Why it ranks here: {reasoning}
                  </p>

                  <form
                    action={updateAssumptionStatusAction}
                    className="mt-4 flex flex-wrap items-center gap-2 border-t border-ink-100 pt-4"
                  >
                    <input type="hidden" name="assumptionId" value={assumption.id} />
                    <span className="mr-1 text-[12px] text-ink-500">Mark as:</span>
                    {(["TESTING", "SUPPORTED", "PARTIALLY_SUPPORTED", "REJECTED"] as const).map(
                      (status) => (
                        <button
                          key={status}
                          type="submit"
                          name="status"
                          value={status}
                          className="rounded-full border border-ink-200 px-3 py-1 text-[11.5px] text-ink-600 transition-colors hover:border-ink-300 hover:text-ink-900"
                        >
                          {STATUS_LABEL[status]}
                        </button>
                      )
                    )}
                  </form>
                </li>
              );
            })}
          </ul>
        )}
      </Section>

      {resolved.length > 0 && (
        <Section title="Resolved" subtitle="Settled one way or the other.">
          <ul className="space-y-2.5">
            {resolved.map((assumption) => (
              <li
                key={assumption.id}
                className="flex items-start justify-between gap-4 border-b border-ink-100 pb-2.5 last:border-0"
              >
                <p className="text-[13px] leading-relaxed text-ink-700">
                  {assumption.statement}
                </p>
                <Badge tone={STATUS_TONE[assumption.status]}>
                  {STATUS_LABEL[assumption.status]}
                </Badge>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section
        title="Add an assumption"
        subtitle="Something you are relying on that Spark has not spotted. Write it so it could be proven wrong."
      >
        <form action={addAssumptionAction} className="grid gap-4 md:grid-cols-2">
          <label className="md:col-span-2">
            <span className="mb-2 block text-[12.5px] font-medium text-ink-700">
              The assumption
            </span>
            <input
              name="statement"
              required
              placeholder="e.g. Sales managers will trust a score they did not calculate themselves"
              className="w-full rounded-xl border border-ink-100 px-4 py-2.5 text-[13px] outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100"
            />
          </label>

          <label>
            <span className="mb-2 block text-[12.5px] font-medium text-ink-700">Category</span>
            <select
              name="category"
              className="w-full rounded-xl border border-ink-100 px-4 py-2.5 text-[13px] outline-none focus:border-accent-400"
            >
              {Object.entries(CATEGORY_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-2 block text-[12.5px] font-medium text-ink-700">
              How bad if wrong?
            </span>
            <select
              name="importance"
              className="w-full rounded-xl border border-ink-100 px-4 py-2.5 text-[13px] outline-none focus:border-accent-400"
            >
              <option value="CRITICAL">Critical — the whole direction fails</option>
              <option value="HIGH">High — months wasted</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </label>

          <label className="md:col-span-2">
            <span className="mb-2 block text-[12.5px] font-medium text-ink-700">
              Why does it matter that much?
            </span>
            <input
              name="importanceReason"
              placeholder="What breaks if this is false"
              className="w-full rounded-xl border border-ink-100 px-4 py-2.5 text-[13px] outline-none focus:border-accent-400"
            />
          </label>

          <label>
            <span className="mb-2 block text-[12.5px] font-medium text-ink-700">
              How could it be tested?
            </span>
            <select
              name="validationMethod"
              className="w-full rounded-xl border border-ink-100 px-4 py-2.5 text-[13px] outline-none focus:border-accent-400"
            >
              {Object.entries(METHOD_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-end">
            <SubmitButton>Add assumption</SubmitButton>
          </div>
        </form>
      </Section>
    </PageShell>
  );
}
