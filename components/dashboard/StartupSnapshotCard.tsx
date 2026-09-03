import { StartupSnapshot } from "@/lib/types";
import { getStage } from "@/lib/stages";
import Badge from "../Badge";

const rows: { key: keyof StartupSnapshot; label: string }[] = [
  { key: "customer", label: "Customer" },
  { key: "problem", label: "Problem" },
  { key: "solution", label: "Solution" },
  { key: "businessModel", label: "Business model" },
  { key: "targetMarket", label: "Target market" },
];

export default function StartupSnapshotCard({ snapshot }: { snapshot: StartupSnapshot }) {
  const stage = getStage(snapshot.currentStage);

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[14.5px] font-semibold text-ink-950">Startup Snapshot</h3>
        <Badge tone="accent">Current stage: {stage.label}</Badge>
      </div>

      <dl className="space-y-4">
        {rows.map((row) => (
          <div key={row.key} className="grid grid-cols-3 gap-4">
            <dt className="text-[12px] text-ink-400 font-medium pt-0.5">{row.label}</dt>
            <dd className="col-span-2 text-[13.5px] text-ink-800 leading-relaxed">{snapshot[row.key]}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-5 pt-4 border-t border-ink-100 text-[11.5px] text-ink-400 leading-relaxed">
        This snapshot is shared across every stage of Startup OS — Research, Validation, Product, Build and Legal
        all read from and write back to the same understanding of your company.
      </p>
    </div>
  );
}
