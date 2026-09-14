"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Database } from "lucide-react";
import type { Source } from "@/data/types";

/* ——— Källchip: varje siffra i Spark bär sin källa ——— */
export function SourceChip({
  kalla,
  ton = "dim",
}: {
  kalla: Source;
  ton?: "dim" | "slab";
}) {
  return (
    <span
      title={kalla.detail}
      className={`inline-flex max-w-full items-start gap-1.5 border px-1.5 py-[3px] text-[10px] leading-[1.35] rounded-[3px] ${
        ton === "slab"
          ? "border-slab/40 text-slab"
          : "border-line text-dim"
      }`}
    >
      <Database size={9} strokeWidth={2.2} className="mt-[2px] shrink-0 opacity-70" />
      <span className="min-w-0 tracking-[0.06em]">
        {kalla.origin} · {kalla.date}
      </span>
    </span>
  );
}

export function ChipRow({ kallor }: { kallor: Source[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {kallor.map((k, i) => (
        <SourceChip key={i} kalla={k} />
      ))}
    </div>
  );
}

/* ——— Uppräknande tal ——— */
export function CountUp({
  from,
  to,
  duration = 900,
  className,
}: {
  from: number;
  to: number;
  duration?: number;
  className?: string;
}) {
  const [val, setVal] = useState(to);
  const prevTo = useRef(to);

  useEffect(() => {
    if (prevTo.current === to) {
      setVal(to);
      return;
    }
    const start = from;
    const startTid = performance.now();
    let raf = 0;
    const tick = (nu: number) => {
      const p = Math.min(1, (nu - startTid) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(start + (to - start) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
      else prevTo.current = to;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [from, to, duration]);

  return <span className={className}>{val}</span>;
}

/* ——— Rubriker ——— */
export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="eyebrow">{children}</div>;
}

export function PageTitle({
  eyebrow,
  titel,
  ingress,
}: {
  eyebrow: string;
  titel: string;
  ingress?: string;
}) {
  return (
    <header className="mb-7">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="mt-2.5 text-[26px] font-bold leading-[1.1] tracking-[0.02em] text-bone uppercase">
        {titel}
      </h1>
      {ingress ? (
        <p className="mt-3 max-w-[64ch] text-[13.5px] leading-[1.65] text-body">
          {ingress}
        </p>
      ) : null}
    </header>
  );
}

/* ——— Panel ——— */
export function Panel({
  children,
  className = "",
  as = "section",
}: {
  children: ReactNode;
  className?: string;
  as?: "section" | "div" | "article";
}) {
  const Tag = as;
  return (
    <Tag
      className={`border border-line bg-panel/55 rounded-[3px] ${className}`}
    >
      {children}
    </Tag>
  );
}

export function PanelHead({
  titel,
  hoger,
}: {
  titel: string;
  hoger?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-linesoft px-4 py-2.5">
      <h2 className="label-caps text-[10px] tracking-[0.14em] text-dim">
        {titel}
      </h2>
      {hoger}
    </div>
  );
}

/* ——— Stapel ——— */
export function Bar({
  andel,
  ton = "slab",
  hojd = 4,
}: {
  andel: number;
  ton?: "slab" | "ok" | "warn" | "bad" | "dim";
  hojd?: number;
}) {
  const farg = {
    slab: "bg-slab",
    ok: "bg-ok",
    warn: "bg-warn",
    bad: "bg-bad",
    dim: "bg-dim",
  }[ton];
  return (
    <div
      className="w-full bg-linesoft overflow-hidden rounded-[1px]"
      style={{ height: hojd }}
    >
      <div
        className={`h-full ${farg} transition-[width] duration-700 ease-out`}
        style={{ width: `${Math.max(0, Math.min(100, andel))}%` }}
      />
    </div>
  );
}

/* ——— Knappar ——— */
export function Knapp({
  children,
  onClick,
  variant = "primar",
  disabled,
  className = "",
  title,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primar" | "sekundar" | "tyst";
  disabled?: boolean;
  className?: string;
  title?: string;
}) {
  const bas =
    "inline-flex items-center justify-center gap-2 rounded-[3px] px-3.5 py-2 text-[11px] label-caps tracking-[0.12em] transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed";
  const stil = {
    primar: "bg-slab text-slabink hover:bg-[#8FA6B8]",
    sekundar: "border border-line text-body hover:border-slab/60 hover:text-bone",
    tyst: "text-dim hover:text-body",
  }[variant];
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`${bas} ${stil} ${className}`}
    >
      {children}
    </button>
  );
}

/* ——— Statusmärke ——— */
export function Marke({
  children,
  ton = "dim",
}: {
  children: ReactNode;
  ton?: "ok" | "warn" | "bad" | "dim" | "slab";
}) {
  const stil = {
    ok: "border-ok/45 text-ok",
    warn: "border-warn/45 text-warn",
    bad: "border-bad/45 text-bad",
    dim: "border-line text-dim",
    slab: "border-slab/45 text-slab",
  }[ton];
  return (
    <span
      className={`inline-flex items-center gap-1.5 border ${stil} rounded-[3px] px-2 py-[3px] text-[9.5px] label-caps tracking-[0.13em] whitespace-nowrap`}
    >
      {children}
    </span>
  );
}
