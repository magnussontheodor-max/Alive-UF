import type { Metadata } from "next";
import SignupForm from "@/components/brand/SignupForm";
import Nav from "@/components/brand/Nav";
import PageView from "@/components/brand/PageView";
import Steps from "@/components/brand/Steps";

export const metadata: Metadata = {
  title: { absolute: "Spark — Din AI-medgrundare för att starta företag" },
  description:
    "Spark hjälper dig från idé till validerad möjlighet och första digitala produkt — steg för steg.",
  alternates: { canonical: "/" },
};

export default function BrandPage() {
  return (
    <>
      <PageView path="/" />

      <Nav />

      <main id="top">
        {/* ── The opening: the green runs to both edges of the window ──── */}
        <section id="anmalan" className="b-hero">
          <div className="b-inner">
            <p className="b-eyebrow">Lanseras hösten 2026</p>

            {/* Broken by hand into two lines, as the comp sets it. */}
            <h1 className="b-display mt-[18px]">
              Din AI-
              <br />
              medgrundare.
            </h1>

            <p className="b-subline mt-5">
              Från första idén till något människor faktiskt vill ha. Spark gör jobbet med dig
              — research, validering, produkt.
            </p>

            <div className="mt-[26px]">
              <SignupForm />
            </div>
          </div>
        </section>

        {/* ── The whole journey, in one pass ────────────────────────────── */}
        <section id="steg" className="b-section">
          <div className="b-inner">
            <h2 className="b-h2">Hela resan, ett steg i taget.</h2>
            <Steps />
          </div>
        </section>

        {/* ── What makes Spark different ────────────────────────────────── */}
        <section id="om" className="b-section b-statement">
          <div className="b-inner">
            <h2 className="b-h2">Spark minns allt.</h2>
            <p className="mt-5">
              Du behöver inte förklara vem du är, vad du bygger eller vad du gjorde förra
              veckan. Öppna Spark, så vet du vad du ska göra.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
