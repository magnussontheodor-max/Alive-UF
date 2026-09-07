import SparkMark from "@/components/brand/SparkMark";

// The brand surface reads no founder state, so unlike the application it is
// statically prerendered.

export default function BrandLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="brand flex min-h-screen flex-col">
      <div className="flex-1">{children}</div>

      <footer className="b-footer">
        <div className="b-inner">
          <div>
            <p className="b-foot-line">
              Byggt i Stockholm av ett team som själva startar för första gången.
            </p>
            <SparkMark className="b-foot-mark mt-3.5" />
          </div>
          <p className="b-foot-date">Lanseras hösten 2026</p>
        </div>
      </footer>
    </div>
  );
}
