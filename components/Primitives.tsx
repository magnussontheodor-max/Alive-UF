import {
  CONFIDENCE_LABEL,
  Claim,
  Confidence,
  EPISTEMIC_EXPLANATION,
  EPISTEMIC_LABEL,
  EpistemicStatus,
} from "@/domain";
import Badge from "./Badge";

// ---------------------------------------------------------------------------
// Shared display primitives for the concepts that make this product what it is.
//
// The rule these enforce visually: a confidence is never shown without its
// explanation, and a claim is never shown without its epistemic status.
// ---------------------------------------------------------------------------

export function Section({
  title,
  subtitle,
  action,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`card p-6 ${className}`}>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[14.5px] font-semibold text-ink-950">{title}</h3>
          {subtitle && <p className="mt-1 text-[12px] leading-relaxed text-ink-500">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

const CONFIDENCE_TONE = {
  NONE: "neutral",
  LOW: "warn",
  MODERATE: "warn",
  HIGH: "good",
} as const;

export function ConfidenceDisplay({
  confidence,
  compact = false,
}: {
  confidence: Confidence;
  compact?: boolean;
}) {
  return (
    <div className={compact ? "flex items-center gap-2" : "space-y-1.5"}>
      <Badge tone={CONFIDENCE_TONE[confidence.level]}>
        {CONFIDENCE_LABEL[confidence.level]}
      </Badge>
      <p className={`text-[11.5px] leading-relaxed text-ink-500 ${compact ? "" : ""}`}>
        {confidence.explanation}
      </p>
    </div>
  );
}

const EPISTEMIC_TONE = {
  FACT: "good",
  INFERENCE: "accent",
  HYPOTHESIS: "warn",
} as const;

export function EpistemicBadge({ status }: { status: EpistemicStatus }) {
  return (
    <span title={EPISTEMIC_EXPLANATION[status]}>
      <Badge tone={EPISTEMIC_TONE[status]}>{EPISTEMIC_LABEL[status]}</Badge>
    </span>
  );
}

export function ClaimList({ claims }: { claims: Claim[] }) {
  if (claims.length === 0) {
    return <Empty>Nothing recorded here yet.</Empty>;
  }

  return (
    <ul className="space-y-2.5">
      {claims.map((claim) => (
        <li key={claim.id} className="flex items-start gap-3">
          <span className="mt-0.5 shrink-0">
            <EpistemicBadge status={claim.status} />
          </span>
          <p className="text-[13px] leading-relaxed text-ink-800">{claim.statement}</p>
        </li>
      ))}
    </ul>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-xl border border-dashed border-ink-200 px-4 py-6 text-center text-[12.5px] text-ink-400">
      {children}
    </p>
  );
}

export function KeyValue({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-4 py-2.5">
      <dt className="text-[12px] font-medium text-ink-400">{label}</dt>
      <dd className="col-span-2 text-[13.5px] leading-relaxed text-ink-800">{children}</dd>
    </div>
  );
}

/** Used wherever the founder should know a stage is not really built yet. */
export function NotBuiltNotice({
  stage,
  arrivesIn,
}: {
  stage: string;
  arrivesIn: string;
}) {
  return (
    <div className="card p-8 text-center">
      <p className="text-[15px] font-semibold text-ink-950">{stage} is not built yet</p>
      <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-ink-500">
        This version of Spark UF implements the founder, opportunity, research, validation
        and product stages. {arrivesIn}
      </p>
      <p className="mx-auto mt-3 max-w-md text-[12px] leading-relaxed text-ink-400">
        Rather than show a screen that looks finished and does nothing, this one says so.
      </p>
    </div>
  );
}

export function SubmitButton({
  children,
  variant = "primary",
  name,
  value,
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  name?: string;
  value?: string;
}) {
  const base =
    "inline-flex items-center gap-1.5 rounded-full px-4.5 py-2.5 text-[13.5px] font-medium transition-colors disabled:opacity-50";
  const styles =
    variant === "primary"
      ? "bg-ink-950 text-paper hover:bg-ink-800"
      : "border border-ink-200 bg-white text-ink-700 hover:border-ink-300";
  return (
    <button
      type="submit"
      name={name}
      value={value}
      className={`${base} ${styles}`}
      style={{ paddingLeft: "1.15rem", paddingRight: "1.15rem" }}
    >
      {children}
    </button>
  );
}
