"use client";

import { useEffect, useState } from "react";

// The countdown the references all carry. It runs on a real configured date
// and renders nothing without one — a fabricated "35 days left" would be the
// one dishonest thing on the page.
//
// Set NEXT_PUBLIC_LAUNCH_DATE (e.g. 2026-11-03T09:00:00+01:00) to switch on.

const UNITS = [
  { key: "days", label: "Dagar" },
  { key: "hours", label: "Timmar" },
  { key: "minutes", label: "Minuter" },
  { key: "seconds", label: "Sekunder" },
] as const;

function remaining(target: number) {
  const ms = Math.max(0, target - Date.now());
  const s = Math.floor(ms / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

export default function Countdown({ iso }: { iso?: string }) {
  const target = iso ? Date.parse(iso) : NaN;
  const valid = Number.isFinite(target);
  // Server and first client render must agree, so the clock starts after mount.
  const [now, setNow] = useState<ReturnType<typeof remaining> | null>(null);

  useEffect(() => {
    if (!valid) return;
    setNow(remaining(target));
    const id = setInterval(() => setNow(remaining(target)), 1000);
    return () => clearInterval(id);
  }, [target, valid]);

  if (!valid) return null;

  return (
    <div className="flex flex-wrap items-baseline gap-x-9 gap-y-4 sm:gap-x-14">
      {UNITS.map((unit) => (
        <div key={unit.key} className="flex items-baseline gap-2.5">
          <span
            className="text-[2rem] leading-none tracking-[-0.03em] tabular-nums sm:text-[2.75rem]"
            style={{ color: "var(--ink)" }}
          >
            {now ? String(now[unit.key]).padStart(2, "0") : "––"}
          </span>
          <span className="b-label">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}
