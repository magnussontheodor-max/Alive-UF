import PageShell from "@/components/PageShell";
import StageProgress from "@/components/StageProgress";
import OrientationBar from "@/components/OrientationBar";
import NextBestActionCard from "@/components/dashboard/NextBestActionCard";
import StartupSnapshotCard from "@/components/dashboard/StartupSnapshotCard";
import MemoryFeed from "@/components/dashboard/MemoryFeed";
import UpNextList from "@/components/dashboard/UpNextList";
import Badge from "@/components/Badge";
import { startupMemory, startupName, upcomingTasks } from "@/lib/mock-data";
import { decideNextAction, highestRiskAssumption } from "@/lib/orchestrator";

export default function DashboardPage() {
  const { task } = decideNextAction();
  const risk = highestRiskAssumption();

  return (
    <PageShell>
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h2 className="text-[19px] font-semibold text-ink-950 tracking-tight">{startupName}</h2>
          <Badge tone="accent">AI-powered lead qualification for Swedish SMBs</Badge>
        </div>
        <p className="text-[13px] text-ink-500 mb-6">
          Founded by Elin Karlsson · Stockholm, Sweden
        </p>
        <StageProgress currentStage={startupMemory.snapshot.currentStage} />
      </div>

      <OrientationBar
        where={<>You&rsquo;re in <span className="font-medium text-ink-950">Validation</span> — testing your core hypothesis before you build.</>}
        accomplished={<>7 of 10 customer interviews logged. Problem confirmed by 6 of 7.</>}
        blocking={<>Willingness to pay is only partially confirmed — pricing is untested.</>}
        next={<>Interview 3 more potential customers to close out the validation round.</>}
      />

      <NextBestActionCard task={task} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StartupSnapshotCard snapshot={startupMemory.snapshot} />
        </div>
        <div className="rounded-2xl border border-ink-100 bg-white p-6">
          <h3 className="text-[14.5px] font-semibold text-ink-950 mb-4">Highest-risk assumption</h3>
          {risk && (
            <>
              <Badge tone="warn" className="mb-3">
                {risk.risk} risk · {risk.status}
              </Badge>
              <p className="text-[13.5px] text-ink-800 leading-relaxed">{risk.statement}</p>
            </>
          )}
          <p className="mt-5 pt-4 border-t border-ink-100 text-[11.5px] text-ink-400 leading-relaxed">
            The Orchestrator re-ranks assumptions every time new evidence comes in, and always points you at the one
            most likely to sink the business.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MemoryFeed events={startupMemory.events} />
        <UpNextList tasks={upcomingTasks} />
      </div>
    </PageShell>
  );
}
