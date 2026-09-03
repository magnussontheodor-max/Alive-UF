"use client";

import { usePathname } from "next/navigation";
import { founder } from "@/lib/mock-data";

const titles: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Dashboard", subtitle: "Your startup at a glance" },
  "/my-startup": { title: "My Startup", subtitle: "The persistent understanding Startup OS has of your company" },
  "/idea": { title: "Idea", subtitle: "Find a business worth building" },
  "/research": { title: "Research", subtitle: "Market, competitors, customers, trends and risks" },
  "/validation": { title: "Validation", subtitle: "Test your riskiest assumption before you build" },
  "/product": { title: "Product", subtitle: "From validated idea to MVP specification" },
  "/build": { title: "Build", subtitle: "Startup OS orchestrates AI coding agents to build your MVP" },
  "/legal": { title: "Legal", subtitle: "Your Swedish launch checklist, generated for this startup" },
  "/launch": { title: "Launch", subtitle: "Ready to go live" },
  "/settings": { title: "Settings", subtitle: "Founder profile and preferences" },
};

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function TopBar() {
  const pathname = usePathname();
  const match = titles[pathname] ?? titles["/"];

  return (
    <header className="h-16 border-b border-ink-100 bg-paper/80 backdrop-blur-sm sticky top-0 z-20 flex items-center justify-between px-6 md:px-8">
      <div className="min-w-0">
        <h1 className="text-[15px] font-semibold text-ink-950 leading-tight truncate">{match.title}</h1>
        <p className="text-[12px] text-ink-500 leading-tight truncate">{match.subtitle}</p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden sm:flex items-center gap-2 text-[12px] text-ink-500">
          <span className="w-1.5 h-1.5 rounded-full bg-good-500" />
          Startup memory synced
        </div>
        <div className="w-8 h-8 rounded-full bg-ink-900 text-paper text-[11.5px] font-medium flex items-center justify-center">
          {initials(founder.name)}
        </div>
      </div>
    </header>
  );
}
