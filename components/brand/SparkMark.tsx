/** The wordmark: the squarish techno register of the reference, in green. */
export default function SparkMark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`b-techno text-[0.9rem] font-semibold tracking-[0.24em] ${className}`}
      style={{ color: "var(--accent)" }}
    >
      Spark.
    </span>
  );
}
