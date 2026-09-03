import PageShell from "@/components/PageShell";
import StageProgress from "@/components/StageProgress";
import OrientationBar from "@/components/OrientationBar";
import StartupSnapshotCard from "@/components/dashboard/StartupSnapshotCard";
import MemoryFeed from "@/components/dashboard/MemoryFeed";
import Badge from "@/components/Badge";
import { agents, founder, startupMemory, startupName } from "@/lib/mock-data";
import { getStage } from "@/lib/stages";

const riskTone = { high: "warn", medium: "neutral", low: "good" } as const;

export default function MyStartupPage() {
  const stage = getStage(startupMemory.snapshot.currentStage);

  return (
    <PageShell>
      <div>
        <h2 className="text-[19px] font-semibold text-ink-950 tracking-tight mb-1">{startupName}</h2>
        <p className="text-[13px] text-ink-500 mb-6">
          The single, persistent understanding Startup OS has of your company. Every agent reads from this and
          writes back to it.
        </p>
        <StageProgress currentStage={startupMemory.snapshot.currentStage} />
      </div>

      <OrientationBar
        where={<>Viewing the shared memory behind every stage of {startupName}.</>}
        accomplished={<>Startup memory has {startupMemory.events.length} recorded updates since founding.</>}
        blocking={<>{startupMemory.assumptions.filter((a) => a.status !== "validated").length} assumptions still need evidence.</>}
        next={<>Keep talking to your AI co-founder — every conversation updates this page.</>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <StartupSnapshotCard snapshot={startupMemory.snapshot} />

          <div className="card p-6">
            <h3 className="text-[14.5px] font-semibold text-ink-950 mb-1">Founder</h3>
            <p className="text-[12px] text-ink-500 mb-5">Startup OS tailors recommendations to who you are.</p>
            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
              <Field label="Name" value={founder.name} />
              <Field label="Location" value={founder.location} />
              <Field label="Skills" value={founder.skills.join(", ")} />
              <Field label="Interests" value={founder.interests.join(", ")} />
              <Field label="Time available" value={`${founder.hoursPerWeek} hrs / week`} />
              <Field label="Budget" value={`${founder.budgetSek.toLocaleString("sv-SE")} SEK`} />
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-[14.5px] font-semibold text-ink-950 mb-1">Assumptions being tracked</h3>
            <p className="text-[12px] text-ink-500 mb-5">
              The Orchestrator ranks these by risk to decide what the Validation Agent should test next.
            </p>
            <ul className="space-y-3">
              {startupMemory.assumptions.map((a) => (
                <li key={a.id} className="flex items-start justify-between gap-4 rounded-xl border border-ink-100 px-4 py-3">
                  <p className="text-[13px] text-ink-800 leading-snug">{a.statement}</p>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <Badge tone={riskTone[a.risk]}>{a.risk} risk</Badge>
                    <span className="text-[11px] text-ink-400 capitalize">{a.status}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <MemoryFeed events={startupMemory.events} limit={10} />

          <div className="card p-6">
            <h3 className="text-[14.5px] font-semibold text-ink-950 mb-1">Agents on this startup</h3>
            <p className="text-[12px] text-ink-500 mb-4">
              You never choose an agent directly — the Orchestrator selects one based on what {startupName} needs.
            </p>
            <ul className="space-y-2.5">
              {agents
                .filter((a) => a.id !== "orchestrator")
                .map((a) => (
                  <li key={a.id} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-ink-300 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-[12.5px] font-medium text-ink-900">{a.name}</p>
                      <p className="text-[11.5px] text-ink-500">{a.role}</p>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-ink-400 font-medium mb-0.5">{label}</p>
      <p className="text-[13px] text-ink-800">{value}</p>
    </div>
  );
}
