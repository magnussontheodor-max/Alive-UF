import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { getCurrentStartup } from "@/lib/current";
import { backendMode } from "@/data";
import { reasoningMode } from "@/ai";
import { getStage } from "@/domain";

// Every page in this group reads the signed-in founder's own startup, so
// nothing here may be statically prerendered — a cached page would serve one
// founder's memory to everyone. The marketing group is deliberately outside
// this boundary so the landing page stays static.
export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const startup = await getCurrentStartup();

  return (
    <div className="flex min-h-screen">
      <Sidebar
        startupName={startup?.name ?? null}
        stage={startup ? getStage(startup.stage).label : null}
        isDemo={startup?.isDemo ?? false}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar mode={backendMode()} reasoning={reasoningMode()} />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
