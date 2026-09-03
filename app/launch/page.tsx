import PageShell from "@/components/PageShell";
import OrientationBar from "@/components/OrientationBar";
import Badge from "@/components/Badge";
import { launchReadiness, launchReadinessPercent, startupName } from "@/lib/mock-data";
import { IconCheck, IconRocket } from "@/components/icons";

export default function LaunchPage() {
  return (
    <PageShell>
      <OrientationBar
        where={<>You&rsquo;re approaching <span className="font-medium text-ink-950">Launch</span> — the final stretch before {startupName} goes live.</>}
        accomplished={<>Website, MVP, payments, analytics and marketing plan are ready.</>}
        blocking={<>Legal checklist at 80% and customer acquisition not yet started.</>}
        next={<>Finish the legal checklist, then define your customer acquisition plan.</>}
      />

      <div className="rounded-2xl border border-ink-100 bg-white p-6 md:p-8">
        <div className="flex items-center justify-between flex-wrap gap-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-ink-950 flex items-center justify-center">
              <IconRocket className="w-5 h-5 text-accent-300" />
            </div>
            <div>
              <h3 className="text-[16px] font-semibold text-ink-950">Ready to launch</h3>
              <p className="text-[12.5px] text-ink-500">{startupName} · Sweden</p>
            </div>
          </div>
          <ReadinessDial percent={launchReadinessPercent} />
        </div>

        <ul className="grid sm:grid-cols-2 gap-3">
          {launchReadiness.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-ink-100 px-4 py-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <StatusIcon status={item.status} />
                <span className="text-[13.5px] text-ink-800 truncate">{item.label}</span>
              </div>
              {item.status === "in-progress" && item.percent ? (
                <Badge tone="warn">{item.percent}%</Badge>
              ) : (
                <Badge tone={item.status === "done" ? "good" : "neutral"}>
                  {item.status === "done" ? "Ready" : "Not started"}
                </Badge>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-ink-100 bg-ink-50/60 px-6 py-5">
        <p className="text-[13px] text-ink-600 leading-relaxed">
          Launch is the point where Startup OS hands more control back to you — the Orchestrator keeps tracking
          post-launch signals (early usage, churn, feedback) and will keep suggesting next actions from here.
        </p>
      </div>
    </PageShell>
  );
}

function ReadinessDial({ percent }: { percent: number }) {
  const size = 96;
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;

  return (
    <div className="flex items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} stroke="#E6E8EF" strokeWidth={stroke} fill="none" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="#2F9E5C"
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={c}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[18px] font-semibold text-ink-950">{percent}%</span>
        </div>
      </div>
      <div>
        <p className="text-[12px] text-ink-400 font-medium">Launch readiness</p>
        <p className="text-[13px] text-ink-700">Almost there</p>
      </div>
    </div>
  );
}

function StatusIcon({ status }: { status: "done" | "in-progress" | "pending" }) {
  if (status === "done") {
    return (
      <span className="w-6 h-6 rounded-full bg-good-500 flex items-center justify-center shrink-0">
        <IconCheck className="w-3.5 h-3.5 text-white" />
      </span>
    );
  }
  if (status === "in-progress") {
    return <span className="w-6 h-6 rounded-full border-2 border-warn-500 shrink-0" />;
  }
  return <span className="w-6 h-6 rounded-full border border-ink-200 shrink-0" />;
}
