/** The wordmark: one of the four places green appears on the page. */
export default function SparkMark({ className = "" }: { className?: string }) {
  return <span className={`b-mark ${className}`}>Spark.</span>;
}
