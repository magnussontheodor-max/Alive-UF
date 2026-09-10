import type { Metadata } from "next";
import Link from "next/link";
import SparkMark from "@/components/brand/SparkMark";

export const metadata: Metadata = {
  title: { absolute: "Avregistrerad · Spark" },
  robots: { index: false, follow: false },
};

/** Where /api/unsubscribe lands. The link is single-use in practice but
 *  idempotent in effect: clicking it twice says the same thing. */
export default function UnsubscribedPage({
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

        <h1 className="b-legal-h1">{failed ? "Länken gick inte att använda" : "Du är avregistrerad"}</h1>

        {failed ? (
          <p>
            Länken är ogiltig eller har ändrats på vägen. Mejla oss så tar vi bort dig för
            hand — adressen står i{" "}
            <Link href="/integritetspolicy" className="b-underline">
              integritetspolicyn
            </Link>
            .
          </p>
        ) : (
          <p>
            Vi hör inte av oss igen. Din adress ligger kvar hos oss bara för att vi ska
            veta att du inte vill bli kontaktad. Vill du att vi raderar den helt finns
            länken för det i bekräftelsemejlet.
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
