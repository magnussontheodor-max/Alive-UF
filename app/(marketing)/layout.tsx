import SparkMark from "@/components/brand/SparkMark";

// The brand surface reads no founder state, so unlike the application it is
// statically prerendered.

export default function BrandLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="brand flex min-h-screen flex-col">
      <main className="relative z-[1] flex-1">{children}</main>

      <footer
        className="relative z-[1]"
        style={{ borderTop: "1px solid var(--rule)" }}
      >
        <div className="b-shell py-12 sm:py-16">
          <p className="b-body">
            Byggt i Stockholm av ett team som själva startar för första gången.
          </p>

          <div
            className="mt-10 flex flex-wrap items-baseline justify-between gap-6 pt-7"
            style={{ borderTop: "1px solid var(--rule-soft)" }}
          >
            <SparkMark />
            <p className="b-label">Lanseras hösten 2026</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
