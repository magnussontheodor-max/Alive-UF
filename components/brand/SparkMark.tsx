/** The wordmark: the squarish techno register of the reference, in green. */
export default function SparkMark({ className = "" }: { className?: string }) {
  return (
    <span className={`b-techno inline-flex items-baseline gap-[0.35em] ${className}`}>
      <span
        className="text-[0.95rem] font-semibold tracking-[0.26em]"
        style={{ color: "var(--accent)" }}
      >
        SPARK
      </span>
      <span
        aria-hidden="true"
        className="h-[5px] w-[5px] rounded-full"
        style={{ background: "var(--accent)" }}
      />
    </span>
  );
}
