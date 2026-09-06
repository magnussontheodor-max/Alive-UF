import PageShell from "@/components/PageShell";
import Badge from "@/components/Badge";
import { Empty, Section } from "@/components/Primitives";
import { getCurrentStartup } from "@/lib/current";
import { getRepositories } from "@/data";
import { AGENT_LABEL, RUN_STATUS_LABEL } from "@/domain";
import { REASONING_MODE_EXPLANATION, reasoningMode } from "@/ai";

// ---------------------------------------------------------------------------
// Agent activity
//
// What ran, what it changed, what it cost. Summaries only — the product does
// not expose raw chain-of-thought, and pretending to would be dishonest about
// what these traces actually are.
// ---------------------------------------------------------------------------

export default async function ActivityPage() {
  const startup = await getCurrentStartup();
  if (!startup) {
    return (
      <PageShell>
        <Empty>Create a startup first.</Empty>
      </PageShell>
    );
  }

  const runs = await getRepositories().agentRuns.listByStartup(startup.id, 50);
  const mode = reasoningMode();
  const totalCost = runs.reduce((sum, run) => sum + run.estimatedCostSek, 0);

  return (
    <PageShell>
      <div className="rounded-2xl border border-ink-100 bg-ink-50/60 px-6 py-5">
        <p className="text-[13px] leading-relaxed text-ink-700">
          {REASONING_MODE_EXPLANATION[mode]}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Agent runs" value={String(runs.length)} />
        <Stat
          label="Estimated cost"
          value={mode === "live" ? `${totalCost.toFixed(2)} SEK` : "0 SEK"}
          note={mode === "live" ? "Estimated from token counts, not billed." : "No model calls made."}
        />
        <Stat
          label="Failed or rejected"
          value={String(runs.filter((r) => r.status !== "SUCCESS" && r.status !== "RUNNING").length)}
          note="Output that did not pass the grounding rules is counted here."
        />
      </div>

      <Section title="Runs" subtitle="Newest first.">
        {runs.length === 0 ? (
          <Empty>No agents have run yet.</Empty>
        ) : (
          <ul className="space-y-3">
            {runs.map((run) => (
              <li key={run.id} className="rounded-xl border border-ink-100 p-4">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge tone="accent">{AGENT_LABEL[run.agent]}</Badge>
                  <Badge
                    tone={
                      run.status === "SUCCESS"
                        ? "good"
                        : run.status === "RUNNING"
                          ? "neutral"
                          : "warn"
                    }
                  >
                    {RUN_STATUS_LABEL[run.status]}
                  </Badge>
                  <span className="text-[11px] text-ink-400">
                    {new Date(run.startedAt).toLocaleString("sv-SE")}
                  </span>
                </div>

                <p className="text-[13px] leading-relaxed text-ink-900">
                  {run.outputSummary || run.inputSummary}
                </p>

                {run.error && (
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-warn-600">
                    {run.error}
                  </p>
                )}

                {run.stateChanges.length > 0 && (
                  <ul className="mt-2.5 space-y-1">
                    {run.stateChanges.map((change, i) => (
                      <li key={i} className="text-[12px] text-ink-500">
                        · {change}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-x-4 border-t border-ink-100 pt-2.5 text-[11.5px] text-ink-400">
                  <span>{run.provider === "anthropic" ? run.model : "Built-in rules"}</span>
                  <span>{run.durationMs} ms</span>
                  {run.inputTokens > 0 && (
                    <span>
                      {run.inputTokens} in / {run.outputTokens} out
                    </span>
                  )}
                  {run.estimatedCostSek > 0 && (
                    <span>~{run.estimatedCostSek.toFixed(3)} SEK</span>
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

function Stat({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="card p-5">
      <p className="text-[11px] font-medium uppercase tracking-wide text-ink-400">{label}</p>
      <p className="mt-1.5 text-[22px] font-semibold tabular-nums text-ink-950">{value}</p>
      {note && <p className="mt-1 text-[11.5px] leading-relaxed text-ink-400">{note}</p>}
    </div>
  );
}
