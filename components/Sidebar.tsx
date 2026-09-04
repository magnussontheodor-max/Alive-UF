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
  IconScale,
  IconSettings,
  IconSpark,
  IconCheck,
} from "./icons";

const primaryNav = [
  { href: "/", label: "Dashboard", icon: IconGrid },
  { href: "/task", label: "Next step", icon: IconSpark },
];

const workNav = [
  { href: "/founder", label: "Founder", icon: IconCompany },
  { href: "/opportunities", label: "Opportunities", icon: IconBulb },
  { href: "/research", label: "Research", icon: IconSearch },
  { href: "/validation", label: "Validation", icon: IconFlask },
  { href: "/product", label: "Product", icon: IconLayers },
];

const memoryNav = [
  { href: "/memory", label: "Startup memory", icon: IconScale },
  { href: "/assumptions", label: "Assumptions", icon: IconCheck },
  { href: "/evidence", label: "Evidence", icon: IconSearch },
  { href: "/activity", label: "Activity", icon: IconGrid },
];

export default function Sidebar({
  startupName,
  stage,
  isDemo,
}: {
  startupName: string | null;
  stage: string | null;
  isDemo: boolean;
}) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const renderGroup = (
    items: { href: string; label: string; icon: typeof IconGrid }[],
    label?: string
  ) => (
    <div>
      {label && (
        <p className="px-3 pb-1.5 pt-4 text-[10.5px] font-medium uppercase tracking-wide text-ink-400">
          {label}
        </p>
      )}
      <ul className="space-y-0.5">
        {items.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`group flex items-center gap-2.5 rounded-lg px-3 py-[7px] text-[13.5px] transition-colors ${
                  active
                    ? "bg-accent-50 font-medium text-accent-800"
                    : "text-ink-600 hover:bg-ink-50 hover:text-ink-900"
                }`}
              >
                <Icon
                  className={`h-[17px] w-[17px] shrink-0 ${
                    active ? "text-accent-600" : "text-ink-400 group-hover:text-ink-600"
                  }`}
                />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <aside className="hidden w-[236px] shrink-0 flex-col border-r border-ink-100 bg-white md:flex">
      <div className="flex h-16 items-center gap-2.5 border-b border-ink-100 px-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink-950">
          <IconSpark className="h-4 w-4 text-accent-300" />
        </div>
        <span className="text-[14.5px] font-semibold tracking-tight text-ink-950">
          Spark UF
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {renderGroup(primaryNav)}
        {renderGroup(workNav, "Journey")}
        {renderGroup(memoryNav, "What we know")}

        <div className="mt-4 border-t border-ink-100 pt-3">
          <Link
            href="/settings"
            className={`group flex items-center gap-2.5 rounded-lg px-3 py-[7px] text-[13.5px] transition-colors ${
              isActive("/settings")
                ? "bg-accent-50 font-medium text-accent-800"
                : "text-ink-600 hover:bg-ink-50 hover:text-ink-900"
            }`}
          >
            <IconSettings
              className={`h-[17px] w-[17px] shrink-0 ${
                isActive("/settings") ? "text-accent-600" : "text-ink-400"
              }`}
            />
            Settings
          </Link>
        </div>
      </nav>

      {startupName && (
        <div className="px-3 pb-4">
          <div className="rounded-xl border border-ink-100 bg-ink-50/60 px-3 py-3">
            <p className="text-[10.5px] font-medium uppercase tracking-wide text-ink-400">
              Current startup
            </p>
            <p className="mt-1 text-[13.5px] font-semibold leading-snug text-ink-900">
              {startupName}
            </p>
            <p className="mt-0.5 text-[12px] text-ink-500">Stage: {stage}</p>
            {isDemo && (
              <p className="mt-2 inline-flex rounded-full border border-warn-100 bg-warn-50 px-2 py-0.5 text-[10.5px] font-medium text-warn-600">
                Demo data
              </p>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
