/** The wordmark: the page's own face, tracked out, in the accent. */
export default function SparkMark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`text-[0.9rem] font-bold uppercase tracking-[0.22em] ${className}`}
      style={{ color: "var(--accent)" }}
    >
      Spark.
    </span>
  );
}
