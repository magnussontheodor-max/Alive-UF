type Tone = "neutral" | "good" | "warn" | "accent" | "ink";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-ink-50 text-ink-600 border-ink-150",
  good: "bg-good-50 text-good-600 border-good-100",
  warn: "bg-warn-50 text-warn-600 border-warn-100",
  accent: "bg-accent-50 text-accent-700 border-accent-100",
  ink: "bg-ink-950 text-paper border-ink-950",
};

export default function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ${toneClasses[tone]} ${className}`}
      style={tone === "neutral" ? { borderColor: "#E6E8EF" } : undefined}
    >
      {children}
    </span>
  );
}
