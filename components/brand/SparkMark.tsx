/** The wordmark. The ember dot is the only place the accent appears in the nav. */
export default function SparkMark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-[0.3em] ${className}`}>
      <span
        className="text-[0.95rem] font-medium tracking-[0.2em]"
        style={{ color: "var(--ink)" }}
      >
        SPARK
      </span>
      <span
        aria-hidden="true"
        className="h-[5px] w-[5px] rounded-full"
        style={{ background: "var(--ember)" }}
      />
    </span>
  );
}
