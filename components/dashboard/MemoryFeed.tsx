import { MemoryEvent } from "@/lib/types";

const sourceLabel: Record<MemoryEvent["source"], string> = {
  founder: "You",
  orchestrator: "Orchestrator",
  agent: "Agent",
};

const sourceColor: Record<MemoryEvent["source"], string> = {
  founder: "bg-ink-950",
  orchestrator: "bg-accent-500",
  agent: "bg-good-500",
};

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default function MemoryFeed({ events, limit = 5 }: { events: MemoryEvent[]; limit?: number }) {
  const shown = [...events].reverse().slice(0, limit);

  return (
    <div className="card p-6">
      <h3 className="text-[14.5px] font-semibold text-ink-950 mb-5">Startup memory activity</h3>
      <ul className="space-y-4">
        {shown.map((event, i) => (
          <li key={event.id} className="flex gap-3">
            <div className="flex flex-col items-center pt-1">
              <span className={`w-1.5 h-1.5 rounded-full ${sourceColor[event.source]}`} />
              {i < shown.length - 1 && <span className="w-px flex-1 bg-ink-100 mt-1.5" />}
            </div>
            <div className="pb-4 min-w-0">
              <div className="flex items-center gap-2 text-[11px] text-ink-400 mb-0.5">
                <span className="font-medium text-ink-500">{sourceLabel[event.source]}</span>
                <span>·</span>
                <span>{timeAgo(event.timestamp)}</span>
              </div>
              <p className="text-[13px] text-ink-800 leading-snug">{event.summary}</p>
              {event.detail && <p className="text-[12px] text-ink-500 mt-0.5 leading-snug">{event.detail}</p>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
