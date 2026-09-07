import type { Metadata } from "next";
import InlineWaitlist from "@/components/brand/InlineWaitlist";
import Journey from "@/components/brand/Journey";
import Nav from "@/components/brand/Nav";
import PageView from "@/components/brand/PageView";
import Rise from "@/components/brand/Rise";
import Waitlist from "@/components/brand/Waitlist";

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

      {/* ── The opening frame ────────────────────────────────────────────
          One centred moment that owns the viewport: the mark, the claim, one
          line, one field. Depth comes from grain and a soft green light, never
          from imagery. No countdown — there is no launch date to count to.   */}
      <section className="b-invert b-fold">
        <Nav />

        <div className="b-shell flex flex-1 flex-col items-center justify-center py-20 text-center sm:py-24">
          <Rise>
            <p className="b-label" style={{ color: "var(--accent)" }}>
              Lanseras snart i Sverige
            </p>
          </Rise>

          <Rise delay={1}>
            <h1 className="b-display mt-7 max-w-[20ch]">
              Din <span className="whitespace-nowrap">AI-medgrundare</span> för att starta
              företag.
            </h1>
          </Rise>

          <Rise delay={2}>
            <p className="b-lead mx-auto mt-7 max-w-[50ch]">
              Från första idén till något människor faktiskt vill ha. Spark hjälper dig hitta
              idéer, utvärdera möjligheter, undersöka marknaden och validera det viktigaste.
            </p>
          </Rise>

          <Rise delay={3} className="mt-10 flex w-full flex-col items-center">
            <InlineWaitlist source="hero" />
            <p className="b-label mt-5">Bli en av de första att testa</p>
          </Rise>
        </div>

        <div className="b-shell pb-9">
          <div className="flex justify-center pt-8" style={{ borderTop: "1px solid var(--rule)" }}>
            <a
              href="#sa-fungerar-det"
              className="b-label b-cue flex items-center gap-2.5"
              style={{ color: "var(--ink-faint)" }}
            >
              Så fungerar det
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── The journey ──────────────────────────────────────────────────
          The site's centrepiece: an index of the whole product.            */}
      <section id="sa-fungerar-det" className="b-section scroll-mt-8">
        <div className="b-shell">
          <Rise className="mb-14 flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="b-h2 max-w-[21ch]">Hela resan, ett steg i taget.</h2>
            <p className="b-label" style={{ color: "var(--accent)" }}>Sju steg</p>
          </Rise>
          <Rise delay={1}>
            <Journey />
          </Rise>
        </div>
      </section>

      {/* ── What Spark actually does ─────────────────────────────────────
          Exists to remove ambiguity. The most important copy on the page.  */}
      <section className="b-section" style={{ borderTop: "1px solid var(--rule)" }}>
        <div className="b-shell">
          <Rise>
            <p className="b-label mb-12" style={{ color: "var(--accent)" }}>
              Så vad gör Spark egentligen?
            </p>
          </Rise>

          <Rise delay={1}>
            <p className="b-h2 max-w-[26ch]">
              Du kommer med ambitionen.
              <br />
              <span style={{ color: "var(--ink-faint)" }}>
                Spark hjälper dig ta reda på vad som behöver hända härnäst.
              </span>
            </p>
          </Rise>

          <Rise delay={2} className="mt-16 grid gap-10 md:grid-cols-12">
            <p className="b-lead md:col-span-6 md:col-start-1">
              Har du ingen idé hjälper Spark dig hitta möjligheter som passar dig — utifrån vad du
              kan, vad du är intresserad av, hur mycket tid du har och vad du faktiskt har
              möjlighet att göra.
            </p>
            <p className="b-lead md:col-span-6">
              Har du redan en idé hjälper Spark dig undersöka om den håller. När du lär dig något
              nytt kommer det tillbaka in i samma startupkontext — så att nästa steg bygger på det
              du redan vet.
            </p>
          </Rise>
        </div>
      </section>

      {/* ── The difference, without a dashboard ──────────────────────────  */}
      <section className="b-section" style={{ borderTop: "1px solid var(--rule)" }}>
        <div className="b-shell">
          <Rise>
            <h2 className="b-h2 mb-16 max-w-[18ch]">
              Skillnaden mot att bara fråga en AI.
            </h2>
          </Rise>

          <div className="grid gap-14 md:grid-cols-2 md:gap-20">
            {/* Ordinary AI: a pile of answers */}
            <Rise delay={1}>
              <p className="b-label">Vanlig AI</p>
              <p
                className="b-nav-link mt-6 text-[1.2rem]"
                style={{ color: "var(--ink-soft)" }}
              >
                &rdquo;Vad borde jag göra med min startup?&rdquo;
              </p>
              <ul className="mt-8">
                {[
                  "Gör en marknadsanalys.",
                  "Prata med kunder.",
                  "Skapa en hemsida.",
                  "Gör en affärsplan.",
                  "Starta sociala medier.",
                ].map((item, i) => (
                  <li
                    key={item}
                    className="b-nav-link py-2.5"
                    style={{
                      // Each suggestion a little fainter: the pile blurs together.
                      // Floored so the last one is still comfortably readable.
                      color: "var(--ink-soft)",
                      opacity: 1 - i * 0.09,
                      borderBottom: "1px solid var(--rule-soft)",
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <p className="b-body mt-6 max-w-[34ch] text-[0.875rem]">
                Alltihop är rimligt. Inget av det vet var du står, eller vilket av dem som spelar
                roll just nu.
              </p>
            </Rise>

            {/* Spark: context, reasoning, one action */}
            <Rise delay={2}>
              <div className="flex items-baseline gap-3">
                <p className="b-label" style={{ color: "var(--accent)" }}>
                  Spark
                </p>
                <span
                  aria-hidden="true"
                  className="h-[5px] w-[5px] rounded-full"
                  style={{ background: "var(--ember)" }}
                />
              </div>

              <dl className="mt-6">
                {[
                  ["Var är vi?", "Validering"],
                  ["Vad vet vi?", "Tidiga signaler på att problemet känns igen"],
                  ["Vad vet vi inte?", "Om någon är beredd att betala"],
                  ["Största risken?", "Att efterfrågan inte finns"],
                ].map(([term, value]) => (
                  <div
                    key={term}
                    className="grid grid-cols-12 gap-4 py-3.5"
                    style={{ borderBottom: "1px solid var(--rule-soft)" }}
                  >
                    <dt className="b-label col-span-5 sm:col-span-4">{term}</dt>
                    <dd className="b-nav-link col-span-7 sm:col-span-8">{value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8">
                <p className="b-label">Vad ska vi göra nu?</p>
                <p className="b-statement mt-4 max-w-[20ch]">Prata med 5 potentiella kunder.</p>
                <p className="b-body mt-4 max-w-[36ch]">
                  Vi saknar fortfarande tillräckligt med bevis på att problemet är viktigt nog.
                </p>
              </div>

              <p className="b-num mt-10 block max-w-[40ch] leading-relaxed">
                Illustrerande exempel, inte insamlade kunddata.
              </p>
            </Rise>
          </div>
        </div>
      </section>

      {/* ── Startup memory: kept small and conceptual ────────────────────  */}
      <section className="b-section" style={{ borderTop: "1px solid var(--rule)" }}>
        <div className="b-shell grid gap-12 md:grid-cols-12">
          <Rise className="md:col-span-5">
            <h2 className="b-h2 max-w-[12ch]">Spark kommer ihåg.</h2>
            <p className="b-lead mt-6 max-w-[38ch]">
              Varje insikt, antagande, beslut och resultat bygger vidare på samma bild av din
              startup.
            </p>
          </Rise>

          <Rise delay={1} className="md:col-span-6 md:col-start-7">
            <ul style={{ borderTop: "1px solid var(--rule)" }}>
              {[
                "Vad vi vet",
                "Vad vi tror",
                "Vad vi inte vet",
                "Vad vi testar",
                "Vad vi beslutat",
              ].map((item, i) => (
                <li
                  key={item}
                  className="flex items-baseline gap-6 py-5"
                  style={{ borderBottom: "1px solid var(--rule-soft)" }}
                >
                  <span className="b-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="b-nav-link">{item}</span>
                </li>
              ))}
            </ul>
          </Rise>
        </div>
      </section>

      {/* ── The long-term vision ─────────────────────────────────────────  */}
      <section id="om-spark" className="b-section scroll-mt-20" style={{ borderTop: "1px solid var(--rule)" }}>
        <div className="b-shell">
          <Rise>
            <h2 className="b-h2 max-w-[14ch]">
              {/* Kept whole: broken at the hyphen it reads as a typo. */}
              Målet är inte fler <span className="whitespace-nowrap">AI-svar</span>.
            </h2>
            <p className="b-lead mt-8 max-w-[52ch]">
              Målet är att göra det enklare för en person att gå från &rdquo;jag vill starta
              något&rdquo; till &rdquo;jag har byggt något som människor faktiskt vill ha&rdquo;.
            </p>
          </Rise>

          <Rise delay={1} className="mt-20">
            <ol className="grid gap-px md:grid-cols-5" style={{ background: "var(--rule-soft)" }}>
              {["Idé", "Validerad möjlighet", "MVP", "Produkt", "Företag"].map((step, i) => (
                <li
                  key={step}
                  className="flex items-baseline gap-4 py-7 md:flex-col md:gap-6"
                  style={{ background: "var(--paper)", paddingInline: "clamp(0px,1.4vw,20px)" }}
                >
                  <span className="b-num">{String(i + 1).padStart(2, "0")}</span>
                  <span
                    className="b-nav-link"
                    style={{ color: i === 4 ? "var(--ink)" : "var(--ink-soft)" }}
                  >
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </Rise>
        </div>
      </section>

      {/* ── Waitlist ─────────────────────────────────────────────────────  */}
      <section id="tidig-tillgang" className="b-invert b-section scroll-mt-8">
        <div className="b-shell grid gap-14 md:grid-cols-12">
          <Rise className="md:col-span-5">
            <h2 className="b-h2 max-w-[12ch]">Var med från början.</h2>
            <p className="b-lead mt-6 max-w-[36ch]">
              Spark lanseras snart i Sverige. Bli en av de första att testa.
            </p>
          </Rise>

          <Rise delay={1} className="md:col-span-6 md:col-start-7">
            <Waitlist source="landing" />
          </Rise>
        </div>
      </section>
    </>
  );
}
