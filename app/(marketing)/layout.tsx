import Link from "next/link";
import { SparkGlyph } from "@/components/marketing/Primitives";

// The marketing group deliberately sits outside the application's dynamic
// boundary: no founder state is read here, so the page renders statically.

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="sticky top-0 z-30 border-b border-ink-100/70 bg-paper/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Spark, till startsidan">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink-950">
              <SparkGlyph className="h-3.5 w-3.5 text-accent-300" />
            </span>
            <span className="text-[15px] font-semibold tracking-[-0.01em] text-ink-950">Spark</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/dashboard"
              className="hidden text-[13.5px] text-ink-500 transition-colors hover:text-ink-900 sm:block"
            >
              Se produkten
            </Link>
            <a
              href="#tidig-tillgang"
              className="rounded-full bg-ink-950 px-4 py-2 text-[13px] font-medium text-paper transition-colors hover:bg-ink-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2"
            >
              Få tidig tillgång
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-ink-100 py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-ink-950">
              <SparkGlyph className="h-3 w-3 text-accent-300" />
            </span>
            <span className="text-[13px] text-ink-500">
              Spark · Byggt i Sverige · Lanseras snart
            </span>
          </div>
          <Link
            href="/dashboard"
            className="text-[13px] text-ink-500 transition-colors hover:text-ink-900"
          >
            Se produkten
          </Link>
        </div>
      </footer>
    </div>
  );
}
