import PageShell from "@/components/PageShell";
import Badge from "@/components/Badge";
import {
  Empty,
  EpistemicBadge,
  Section,
  SubmitButton,
} from "@/components/Primitives";
import { getCurrentMemory } from "@/lib/current";
import { SOURCE_TYPE_LABEL, evidenceWeight, isOpen } from "@/domain";
import { addEvidenceAction } from "../actions";

export default async function EvidencePage() {
  const memory = await getCurrentMemory();
  if (!memory) {
    return (
      <PageShell>
        <Empty>Create a startup first.</Empty>
      </PageShell>
    );
  }

  const evidence = [...memory.evidence].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
  const openAssumptions = memory.assumptions.filter(isOpen);

  return (
    <PageShell>
      <div className="rounded-2xl border border-ink-100 bg-ink-50/60 px-6 py-5">
        <p className="text-[13px] leading-relaxed text-ink-700">
          Not all evidence counts the same. A customer telling you they would pay and a
          competitor&rsquo;s marketing page are both recorded here, but they carry different
          weight in every confidence figure Spark shows you.
        </p>
      </div>

      <Section
        title="Record what you found"
        subtitle="After a conversation, a search, or an experiment — write it down while it is fresh."
      >
        <form action={addEvidenceAction} className="grid gap-4 md:grid-cols-2">
          <label className="md:col-span-2">
            <span className="mb-2 block text-[12.5px] font-medium text-ink-700">
              What did you learn?
            </span>
            <input
              name="claim"
              required
              placeholder="e.g. Two of three sales managers said they spend over an hour a day on this"
              className="w-full rounded-xl border border-ink-100 px-4 py-2.5 text-[13px] outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100"
            />
          </label>

          <label>
            <span className="mb-2 block text-[12.5px] font-medium text-ink-700">
              Where did it come from?
            </span>
            <input
              name="source"
              placeholder="A person's role, a URL, a document"
              className="w-full rounded-xl border border-ink-100 px-4 py-2.5 text-[13px] outline-none focus:border-accent-400"
            />
          </label>

          <label>
            <span className="mb-2 block text-[12.5px] font-medium text-ink-700">
              Kind of source
            </span>
            <select
              name="sourceType"
              className="w-full rounded-xl border border-ink-100 px-4 py-2.5 text-[13px] outline-none focus:border-accent-400"
            >
              {Object.entries(SOURCE_TYPE_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-2 block text-[12.5px] font-medium text-ink-700">
              Is this observed or interpreted?
            </span>
            <select
              name="epistemicStatus"
              className="w-full rounded-xl border border-ink-100 px-4 py-2.5 text-[13px] outline-none focus:border-accent-400"
            >
              <option value="FACT">Something that happened or was said</option>
              <option value="INFERENCE">My conclusion from what I saw</option>
              <option value="HYPOTHESIS">A belief I have not checked</option>
            </select>
          </label>

          <label>
            <span className="mb-2 block text-[12.5px] font-medium text-ink-700">
              Which assumption does it bear on?
            </span>
            <select
              name="assumptionId"
              className="w-full rounded-xl border border-ink-100 px-4 py-2.5 text-[13px] outline-none focus:border-accent-400"
            >
              <option value="">Not linked to one</option>
              {openAssumptions.map((assumption) => (
                <option key={assumption.id} value={assumption.id}>
                  {assumption.statement.slice(0, 70)}
                </option>
              ))}
            </select>
          </label>

          <label className="md:col-span-2">
            <span className="mb-2 block text-[12.5px] font-medium text-ink-700">
              Does it support or contradict it?
            </span>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-[13px] text-ink-700">
                <input type="radio" name="direction" value="supports" defaultChecked />
                Supports
              </label>
              <label className="flex items-center gap-2 text-[13px] text-ink-700">
                <input type="radio" name="direction" value="contradicts" />
                Contradicts
              </label>
            </div>
          </label>

          <label className="md:col-span-2">
            <span className="mb-2 block text-[12.5px] font-medium text-ink-700">
              Detail, quotes, numbers
            </span>
            <textarea
              name="detail"
              rows={3}
              placeholder="Exact wording is worth keeping — you will paraphrase it charitably later otherwise."
              className="w-full resize-y rounded-xl border border-ink-100 px-4 py-2.5 text-[13px] outline-none focus:border-accent-400"
            />
          </label>

          <div className="md:col-span-2">
            <SubmitButton>Record evidence</SubmitButton>
          </div>
        </form>
      </Section>

      <Section title={`Evidence log (${evidence.length})`}>
        {evidence.length === 0 ? (
          <Empty>Nothing recorded yet.</Empty>
        ) : (
          <ul className="space-y-3">
            {evidence.map((item) => (
              <li key={item.id} className="rounded-xl border border-ink-100 p-4">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <EpistemicBadge status={item.epistemicStatus} />
                  <Badge tone="neutral">{SOURCE_TYPE_LABEL[item.sourceType]}</Badge>
                  <Badge
                    tone={item.reliability === "HIGH" ? "good" : item.reliability === "LOW" ? "warn" : "neutral"}
                  >
                    {item.reliability.toLowerCase()} reliability
                  </Badge>
                  {item.recordedBy === "AGENT" && <Badge tone="accent">From agent</Badge>}
                </div>

                <p className="text-[13.5px] leading-relaxed text-ink-900">{item.claim}</p>
                {item.detail && (
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-500">
                    {item.detail}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-ink-100 pt-2.5 text-[11.5px] text-ink-400">
                  <span>Source: {item.source}</span>
                  <span>Weight: {(evidenceWeight(item) * 100).toFixed(0)}%</span>
                  {item.supports.length > 0 && (
                    <span className="text-good-600">
                      Supports {item.supports.length} assumption
                      {item.supports.length === 1 ? "" : "s"}
                    </span>
                  )}
                  {item.contradicts.length > 0 && (
                    <span className="text-warn-600">
                      Contradicts {item.contradicts.length}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </PageShell>
  );
}
