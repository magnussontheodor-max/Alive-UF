import type { Metadata } from "next";
import InlineWaitlist from "@/components/brand/InlineWaitlist";
import Nav from "@/components/brand/Nav";
import PageView from "@/components/brand/PageView";
import Rise from "@/components/brand/Rise";
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

      {/* Two faint layers behind everything: a slow drift of green light,
          and grain. */}
      <div className="b-bg" aria-hidden="true">
        <div className="b-bg-glow" />
        <div className="b-bg-grain" />
      </div>

      <div className="relative z-[1]">
        <Nav />

        {/* ── The opening ────────────────────────────────────────────────
            Eyebrow, headline, one line, one field — all on the same left
            edge, with no more black above the headline than it needs.    */}
        <section id="anmalan" className="b-hero scroll-mt-4">
          <div className="b-shell">
            <Rise as="p" className="b-label b-eyebrow">
              Lanseras hösten 2026
            </Rise>

            <Rise delay={1}>
              <h1 className="b-display mt-6">Din AI-medgrundare.</h1>
            </Rise>

            <Rise delay={2}>
              <p className="b-subline mt-8 sm:mt-10">
                Från första idén till något människor faktiskt vill ha. Spark gör jobbet med dig
                — research, validering, produkt.
              </p>
            </Rise>

            <Rise delay={3} className="mt-10 max-w-[38rem] sm:mt-12">
              <InlineWaitlist source="hero" />
            </Rise>
          </div>
        </section>

        {/* ── What makes Spark different ─────────────────────────────────
            One claim, one line under it, and nothing else in the section. */}
        <section id="om" className="b-section scroll-mt-4">
          <div className="b-shell">
            <Rise>
              <h2 className="b-h2 max-w-[18ch]">Varje gång du loggar in vet Spark var du är.</h2>
            </Rise>
            <Rise delay={1}>
              <p className="b-subline mt-8 sm:mt-9">
                Ingen kontext att förklara om. Inget att komma ihåg. Bara nästa steg.
              </p>
            </Rise>
          </div>
        </section>

        {/* ── The whole journey, in one pass ─────────────────────────────  */}
        <section id="steg" className="b-section scroll-mt-4">
          <div className="b-shell">
            <Rise>
              <h2 className="b-h2">Hela resan, ett steg i taget.</h2>
            </Rise>
            <Rise delay={1} className="mt-10 sm:mt-16">
              <Steps />
            </Rise>
          </div>
        </section>
      </div>
    </>
  );
}
