"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";
import {
  BarChart3,
  Brain,
  CircleUser,
  Compass,
  Gauge,
  Home,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import { useDemo } from "./DemoState";
import { CountUp } from "./ui";
import { currentCap, levelFor } from "@/data/score";
import { founder } from "@/data/founder";

const nav = [
  { href: "/", namn: "Hem", ikon: Home },
  { href: "/medgrundaren", namn: "Medgrundaren", ikon: MessageSquare },
  { href: "/resan", namn: "Resan", ikon: Compass },
  { href: "/poangen", namn: "Poängen", ikon: Gauge },
  { href: "/marknaden", namn: "Marknaden", ikon: BarChart3 },
  { href: "/valideringen", namn: "Valideringen", ikon: ShieldCheck },
  { href: "/hjarnan", namn: "Hjärnan", ikon: Brain },
  { href: "/profilen", namn: "Profilen", ikon: CircleUser },
];

function ScoreHeader() {
  const { total, previous, sinceLast } = useDemo();
  const niva = levelFor(total);
  const andel = (total / 100) * 100;
  const tonKlass =
    niva.farg === "ok" ? "text-ok" : niva.farg === "warn" ? "text-warn" : "text-bad";
  const barKlass =
    niva.farg === "ok" ? "bg-ok" : niva.farg === "warn" ? "bg-warn" : "bg-bad";

  return (
    <Link
      href="/poangen"
      className="group flex items-center gap-4 border border-line rounded-[var(--radius)] px-3.5 py-2 transition-colors duration-200 hover:border-slab/50"
    >
      <div className="flex items-baseline gap-1">
        <CountUp
          from={previous}
          to={total}
          className={`text-[length:var(--fs-22)] font-bold leading-none tabular-nums ${tonKlass}`}
        />
        <span className="text-[length:var(--fs-11)] leading-none text-dim">/ 100</span>
      </div>
      <div className="hidden w-[196px] sm:block">
        <div className="relative h-[3px] w-full bg-linesoft">
          <div
            className={`h-full ${barKlass} transition-[width] duration-[900ms] ease-out`}
            style={{ width: `${andel}%` }}
          />
          <span
            className="absolute top-[-3px] h-[9px] w-px bg-dim"
            style={{ left: `${currentCap}%` }}
            title={`Taket i den här fasen är ${currentCap}`}
          />
        </div>
        <div className="mt-2 flex items-center justify-between gap-2 text-[length:var(--fs-9)] label-caps tracking-[var(--track-label-tight)] text-dim">
          <span className="truncate">{niva.namn}</span>
          <span className="shrink-0 text-ok">+{sinceLast}</span>
        </div>
      </div>
    </Link>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div data-shell="root" className="flex min-h-screen bg-page">
      {/* Vänsterkolumn */}
      <aside data-shell="sidebar" className="sticky top-0 hidden h-screen w-[218px] shrink-0 flex-col border-r border-line bg-[var(--panel-2)] lg:flex">
        <div className="border-b border-line px-5 py-5">
          <div className="text-[length:var(--fs-19)] font-bold tracking-[var(--track-wordmark)] text-bone uppercase">
            Spark
          </div>
          <div className="mt-1.5 text-[length:var(--fs-10)] leading-relaxed text-dim">
            AI-medgrundare
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-3">
          {nav.map((n) => {
            const aktiv =
              n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
            const Ikon = n.ikon;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`relative flex items-center gap-3 px-5 py-2.5 text-[length:var(--fs-12)] label-caps tracking-[var(--track-label-tight)] transition-colors duration-200 ${
                  aktiv
                    ? "text-bone bg-panel/70"
                    : "text-dim hover:text-body hover:bg-panel/35"
                }`}
              >
                {aktiv ? (
                  <span className="absolute left-0 top-0 h-full w-[2px] bg-slab" />
                ) : null}
                <Ikon size={14} strokeWidth={2} className="shrink-0" />
                {n.namn}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-line px-5 py-4">
          <div className="text-[length:var(--fs-11-5)] font-semibold text-bone">{founder.namn}</div>
          <div className="mt-1 text-[length:var(--fs-10)] leading-relaxed text-dim">
            {founder.ort} · {founder.idéKort}
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Sidhuvud — poängen syns på varje sida */}
        <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-line bg-page/95 px-5 py-3 backdrop-blur-sm lg:px-9">
          <div className="min-w-0">
            <div className="text-[length:var(--fs-15)] font-bold tracking-[var(--track-label-wide)] text-bone uppercase lg:hidden">
              Spark
            </div>
            <div className="hidden text-[length:var(--fs-11)] leading-tight text-dim lg:block">
              <span className="text-body">{founder.namn}</span> · steg 05 av 12 ·
              fasen Pröva
            </div>
          </div>
          <ScoreHeader />
        </header>

        {/* Mobilnavigation */}
        <nav className="flex gap-1 overflow-x-auto border-b border-line px-3 py-2 lg:hidden">
          {nav.map((n) => {
            const aktiv =
              n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`shrink-0 rounded-[var(--radius)] px-2.5 py-1.5 text-[length:var(--fs-10)] label-caps tracking-[var(--track-label-tight)] transition-colors ${
                  aktiv ? "bg-slab text-slabink" : "text-dim"
                }`}
              >
                {n.namn}
              </Link>
            );
          })}
        </nav>

        <main key={pathname} className="fade min-w-0 flex-1 px-5 py-7 lg:px-9 lg:py-9">
          <div className="mx-auto w-full max-w-[var(--maxw)]">{children}</div>
        </main>
      </div>
    </div>
  );
}
