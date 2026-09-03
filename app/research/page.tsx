import Link from "next/link";
import PageShell from "@/components/PageShell";
import OrientationBar from "@/components/OrientationBar";
import ResearchBoard from "@/components/research/ResearchBoard";
import Badge from "@/components/Badge";
import { researchFindings, researchUnknowns, startupMemory } from "@/lib/mock-data";
import { IconArrowUpRight, IconCheck } from "@/components/icons";

const workflow = ["Research", "Evidence", "Unknowns", "Assumptions to validate"];

export default function ResearchPage() {
  return (
    <PageShell>
      <OrientationBar
        where={<>You&rsquo;re in <span className="font-medium text-ink-950">Research</span> — building the evidence base for LeadFlow AI.</>}
        accomplished={<>Market, competitor and customer scans complete. {researchFindings.length} findings logged.</>}
        blocking={<>{researchUnknowns.length} open unknowns before assumptions can be tested with confidence.</>}
        next={<>Move into Validation and test the highest-risk assumption directly with customers.</>}
      />

      {/* Workflow strip */}
      <div className="flex items-center gap-2 flex-wrap">
        {workflow.map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <span
              className={`rounded-full px-3.5 py-1.5 text-[12px] font-medium ${
                i < 2 ? "bg-ink-950 text-paper" : "bg-ink-50 text-ink-500 border border-ink-150"
              }`}
            >
              {step}
            </span>
            {i < workflow.length - 1 && <span className="text-ink-300 text-[13px]">→</span>}
          </div>
        ))}
      </div>

      <ResearchBoard findings={researchFindings} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-[14.5px] font-semibold text-ink-950 mb-1">Open unknowns</h3>
          <p className="text-[12px] text-ink-500 mb-4">
            Questions research alone can&rsquo;t answer — these need direct customer contact.
          </p>
          <ul className="space-y-2.5">
            {researchUnknowns.map((u, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[13px] text-ink-700 leading-snug">
                <span className="w-5 h-5 rounded-full border border-ink-200 text-[10px] text-ink-400 flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {u}
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-[14.5px] font-semibold text-ink-950">Assumptions to validate</h3>
            <Badge tone="accent">{startupMemory.assumptions.length}</Badge>
          </div>
          <p className="text-[12px] text-ink-500 mb-4">
            Research narrows these down. Validation tests them for real.
          </p>
          <ul className="space-y-2.5 mb-5">
            {startupMemory.assumptions.slice(0, 3).map((a) => (
              <li key={a.id} className="text-[13px] text-ink-700 leading-snug flex items-start gap-2.5">
                <IconCheck className="w-3.5 h-3.5 text-ink-300 mt-0.5 shrink-0" />
                {a.statement}
              </li>
            ))}
          </ul>
          <Link
            href="/validation"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-accent-600 hover:text-accent-700"
          >
            Go to Validation
            <IconArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
