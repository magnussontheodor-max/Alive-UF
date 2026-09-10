import type { Metadata } from "next";
import Link from "next/link";
import SparkMark from "@/components/brand/SparkMark";

export const metadata: Metadata = {
  title: { absolute: "Raderad · Spark" },
  robots: { index: false, follow: false },
};

/** Where /api/delete-me lands. */
export default function DeletedPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const failed = searchParams.status === "fel";

  return (
    <main className="b-legal">
      <div className="b-inner">
        <Link href="/" aria-label="Spark, till startsidan">
          <SparkMark />
        </Link>

        <h1 className="b-legal-h1">{failed ? "Länken gick inte att använda" : "Allt är raderat"}</h1>

        {failed ? (
          <p>
            Länken är ogiltig eller har ändrats på vägen. Mejla oss så raderar vi för hand
            — adressen står i{" "}
            <Link href="/integritetspolicy" className="b-underline">
              integritetspolicyn
            </Link>
            .
          </p>
        ) : (
          <p>
            Din e-postadress och det du skrev är borttagna ur vår databas, tillsammans med
            eventuella mejl som låg och väntade. Vi har inget kvar om dig.
          </p>
        )}

        <p className="b-legal-back">
          <Link href="/" className="b-underline">
            Tillbaka till startsidan
          </Link>
        </p>
      </div>
    </main>
  );
}
