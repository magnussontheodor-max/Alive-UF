"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconGrid,
  IconCompany,
  IconBulb,
  IconSearch,
  IconFlask,
  IconLayers,
  IconHammer,
  IconScale,
  IconRocket,
  IconSettings,
} from "./icons";
import { startupName } from "@/lib/mock-data";

const navItems = [
  { href: "/", label: "Dashboard", icon: IconGrid },
  { href: "/my-startup", label: "My Startup", icon: IconCompany },
  { href: "/idea", label: "Idea", icon: IconBulb },
  { href: "/research", label: "Research", icon: IconSearch },
  { href: "/validation", label: "Validation", icon: IconFlask },
  { href: "/product", label: "Product", icon: IconLayers },
  { href: "/build", label: "Build", icon: IconHammer },
  { href: "/legal", label: "Legal", icon: IconScale },
  { href: "/launch", label: "Launch", icon: IconRocket },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-[248px] shrink-0 flex-col border-r border-ink-100 bg-white">
      <div className="h-16 flex items-center gap-2.5 px-5 border-b border-ink-100">
        <div className="w-7 h-7 rounded-lg bg-ink-950 flex items-center justify-center">
          <span className="text-paper text-[13px] font-semibold tracking-tight">S</span>
        </div>
        <span className="text-[14.5px] font-semibold text-ink-950 tracking-tight">Startup OS</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`group flex items-center gap-2.5 rounded-lg px-3 py-[7px] text-[13.5px] transition-colors ${
                    active
                      ? "bg-accent-50 text-accent-800 font-medium"
                      : "text-ink-600 hover:bg-ink-50 hover:text-ink-900"
                  }`}
                >
                  <Icon
                    className={`w-[17px] h-[17px] shrink-0 ${
                      active ? "text-accent-600" : "text-ink-400 group-hover:text-ink-600"
                    }`}
                  />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 border-t border-ink-100 pt-3">
          <Link
            href="/settings"
            className={`group flex items-center gap-2.5 rounded-lg px-3 py-[7px] text-[13.5px] transition-colors ${
              pathname.startsWith("/settings")
                ? "bg-accent-50 text-accent-800 font-medium"
                : "text-ink-600 hover:bg-ink-50 hover:text-ink-900"
            }`}
          >
            <IconSettings
              className={`w-[17px] h-[17px] shrink-0 ${
                pathname.startsWith("/settings") ? "text-accent-600" : "text-ink-400 group-hover:text-ink-600"
              }`}
            />
            Settings
          </Link>
        </div>
      </nav>

      <div className="px-3 pb-4">
        <div className="rounded-xl border border-ink-100 bg-ink-50/60 px-3 py-3">
          <p className="text-[10.5px] uppercase tracking-wide text-ink-400 font-medium">Current startup</p>
          <p className="text-[13.5px] font-semibold text-ink-900 mt-1">{startupName}</p>
          <p className="text-[12px] text-ink-500 mt-0.5">Stage: Validation</p>
        </div>
      </div>
    </aside>
  );
}
