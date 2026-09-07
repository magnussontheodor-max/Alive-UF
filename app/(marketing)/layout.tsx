import Nav from "@/components/brand/Nav";
import SparkMark from "@/components/brand/SparkMark";

// The brand surface reads no founder state, so unlike the application it is
// statically prerendered.

export default function BrandLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="brand flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">{children}</main>

      <footer style={{ borderTop: "1px solid var(--rule)" }}>
        <div className="b-shell flex flex-col gap-5 py-10 sm:flex-row sm:items-center sm:justify-between">
          <SparkMark />
          <p className="b-label" style={{ letterSpacing: "0.12em" }}>
            Spark UF · Sverige · Lanseras snart
          </p>
        </div>
      </footer>
    </div>
  );
}
