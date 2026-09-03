import PageShell from "@/components/PageShell";
import OrientationBar from "@/components/OrientationBar";
import Badge from "@/components/Badge";
import { legalChecklist, startupName } from "@/lib/mock-data";
import { IconArrowUpRight, IconCheck } from "@/components/icons";

const statusMeta = {
  done: { label: "Done", tone: "good" as const },
  pending: { label: "To do", tone: "neutral" as const },
  review: { label: "Review with a professional", tone: "warn" as const },
};

export default function LegalPage() {
  const done = legalChecklist.filter((i) => i.status === "done").length;

  return (
    <PageShell>
      <OrientationBar
        where={<>You&rsquo;re in <span className="font-medium text-ink-950">Legal</span> — getting the Swedish business fundamentals in place.</>}
        accomplished={<>{done} of {legalChecklist.length} checklist items complete.</>}
        blocking={<>Privacy policy, terms and cookie notice still need drafting.</>}
        next={<>Work through the remaining checklist items below.</>}
      />

      <div className="rounded-2xl border border-accent-100 bg-accent-50 px-5 py-4 flex items-start gap-3">
        <span className="text-accent-600 text-[15px] leading-none mt-0.5">ⓘ</span>
        <p className="text-[12.5px] text-accent-800 leading-relaxed">
          This checklist is generated guidance based on {startupName}&rsquo;s stage and structure — it is not legal
          advice. Review anything consequential with a licensed professional before you sign contracts or take on
          customers.
        </p>
      </div>

      <div className="card p-6 md:p-7">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h3 className="text-[14.5px] font-semibold text-ink-950">Your Swedish launch checklist</h3>
          <Badge tone="accent">Generated for {startupName}</Badge>
        </div>

        <ul className="divide-y divide-ink-100">
          {legalChecklist.map((item) => {
            const meta = statusMeta[item.status];
            return (
              <li key={item.id} className="py-4 flex items-start gap-3.5">
                <span
                  className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                    item.status === "done"
                      ? "bg-good-500"
                      : item.status === "review"
                      ? "border-2 border-warn-500"
                      : "border border-ink-200"
                  }`}
                >
                  {item.status === "done" && <IconCheck className="w-3 h-3 text-white" />}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[13.5px] font-medium text-ink-900">{item.label}</p>
                    <Badge tone={meta.tone}>{meta.label}</Badge>
                  </div>
                  <p className="text-[12.5px] text-ink-500 mt-1 leading-relaxed max-w-xl">{item.detail}</p>
                  {item.link && (
                    <a
                      href={item.link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[12px] font-medium text-accent-600 hover:text-accent-700 mt-1.5"
                    >
                      {item.link.label}
                      <IconArrowUpRight className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </PageShell>
  );
}
