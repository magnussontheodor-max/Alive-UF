"use client";

import { track } from "@/lib/analytics";

/** The hero call to action, which scrolls to the form and reports the click. */
export default function HeroCta({
  children,
  variant = "primary",
  href = "#tidig-tillgang",
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  href?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[14.5px] font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2";
  const styles =
    variant === "primary"
      ? "bg-ink-950 text-paper hover:bg-ink-800 hover:-translate-y-px shadow-[0_1px_2px_rgba(16,18,27,0.10)] hover:shadow-[0_10px_24px_-10px_rgba(16,18,27,0.5)]"
      : "border border-ink-200 bg-white text-ink-800 hover:border-ink-300 hover:bg-ink-50";

  return (
    <a href={href} onClick={() => track({ name: "hero_cta_click" })} className={`${base} ${styles}`}>
      {children}
    </a>
  );
}
