import Link from "next/link";

// ---------------------------------------------------------------------------
// Marketing primitives
//
// The application's own components stay unchanged; these are presentation
// variants built on the same tokens, sized for a page that is read rather
// than operated.
// ---------------------------------------------------------------------------

export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>{children}</div>;
}

export function SectionHeader({
  eyebrow,
  title,
  lead,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
}) {
  return (
    <header className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && <p className="mk-eyebrow mb-3">{eyebrow}</p>}
      <h2 className="mk-h2 text-ink-950">{title}</h2>
      {lead && <p className={`mk-lead mt-4 ${align === "center" ? "mx-auto" : ""}`}>{lead}</p>}
    </header>
  );
}

export function CtaButton({
  href,
  children,
  variant = "primary",
  onClick,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  onClick?: () => void;
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[14.5px] font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2";
  const styles =
    variant === "primary"
      ? "bg-ink-950 text-paper hover:bg-ink-800 hover:-translate-y-px shadow-[0_1px_2px_rgba(16,18,27,0.10)] hover:shadow-[0_8px_20px_-8px_rgba(16,18,27,0.45)]"
      : "border border-ink-200 bg-white text-ink-800 hover:border-ink-300 hover:bg-ink-50";
  return (
    <Link href={href} onClick={onClick} className={`${base} ${styles} ${className}`}>
      {children}
    </Link>
  );
}

/** The label that keeps every claim on this page honest about its status. */
const EPISTEMIC = {
  FACT: { label: "Fakta", className: "bg-good-50 text-good-600 border-good-100" },
  INFERENCE: { label: "Slutsats", className: "bg-accent-50 text-accent-700 border-accent-100" },
  HYPOTHESIS: { label: "Hypotes", className: "bg-warn-50 text-warn-600 border-warn-100" },
} as const;

export function EpistemicTag({ status }: { status: keyof typeof EPISTEMIC }) {
  const { label, className } = EPISTEMIC[status];
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[10.5px] font-medium ${className}`}
    >
      {label}
    </span>
  );
}

export function StatusTag({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "good" | "warn" | "accent";
}) {
  const tones = {
    neutral: "bg-ink-50 text-ink-500 border-ink-100",
    good: "bg-good-50 text-good-600 border-good-100",
    warn: "bg-warn-50 text-warn-600 border-warn-100",
    accent: "bg-accent-50 text-accent-700 border-accent-100",
  };
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-[0.06em] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

/** Window chrome for a product preview, so it reads as a screen, not a card. */
export function ScreenFrame({
  label,
  meta,
  children,
  className = "",
}: {
  label: string;
  meta?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mk-screen overflow-hidden ${className}`}>
      <div className="flex items-center justify-between gap-3 border-b border-ink-100 bg-ink-50/40 px-4 py-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <SparkGlyph className="h-3.5 w-3.5 shrink-0 text-accent-500" />
          <span className="truncate text-[11.5px] font-medium text-ink-600">{label}</span>
        </div>
        {meta}
      </div>
      {children}
    </div>
  );
}

export function SparkGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path
        d="M10 2.2 11.9 7.4 17.4 8 13.4 11.6 14.6 17 10 14.2 5.4 17 6.6 11.6 2.6 8 8.1 7.4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
