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
              {/* The line breaks after "Din": the hyphenated word stays whole. */}
              <h1 className="b-display mt-5 max-w-[14ch]">
                Din <span className="b-nb">AI-medgrundare.</span>
              </h1>
            </Rise>

            <Rise delay={2}>
              <p className="b-subline mt-5 sm:mt-7">
                Från första idén till något människor faktiskt vill ha. Spark gör jobbet med dig
                — research, validering, produkt.
              </p>
            </Rise>

            <Rise delay={3} className="mt-7 sm:mt-10">
              <InlineWaitlist source="hero" />
            </Rise>
          </div>
        </section>

        {/* ── The whole journey, in one pass ─────────────────────────────  */}
        <section id="steg" className="b-section scroll-mt-4">
          <div className="b-shell">
            <Rise>
              <h2 className="b-h2">Hela resan, ett steg i taget.</h2>
            </Rise>
            <Rise delay={1} className="mt-7 sm:mt-10">
              <Steps />
            </Rise>
          </div>
        </section>

        {/* ── What makes Spark different ─────────────────────────────────
            It lands after the seven steps: the reader has just seen how much
            there is to carry, which is what makes this the answer. */}
        <section id="om" className="b-section scroll-mt-4">
          <div className="b-shell">
            <Rise>
              <h2 className="b-h2 max-w-[20ch]">Spark minns allt.</h2>
            </Rise>
            <Rise delay={1}>
              <p className="b-subline mt-5">
                Du behöver inte förklara vem du är, vad du bygger eller vad du gjorde förra
                veckan. Öppna Spark, så vet du vad du ska göra.
              </p>
            </Rise>
          </div>
        </section>
      </div>
    </>
  );
}
