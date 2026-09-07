import type { Metadata } from "next";
import Countdown from "@/components/brand/Countdown";
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
          A single dark moment that owns the viewport: navigation, the claim,
          one line, one action, and the countdown along the bottom edge.
          Depth comes from grain and a warm falloff, never from imagery.      */}
      <section className="b-invert b-fold">
        <Nav />

        <div className="b-shell flex flex-1 flex-col justify-center py-20 sm:py-24">
          <Rise>
            <p className="b-label">Lanseras snart i Sverige</p>
          </Rise>

          <Rise delay={1}>
            <h1 className="b-display mt-8 max-w-[15ch]">
              Din <span className="whitespace-nowrap">AI-medgrundare</span> för att starta
              företag.
            </h1>
          </Rise>

          <Rise delay={2}>
            <p className="b-statement mt-10 max-w-[26ch]" style={{ color: "var(--ink-soft)" }}>
              Från första idén till något människor faktiskt vill ha.
            </p>
          </Rise>

          <Rise delay={3} className="mt-12 max-w-[34rem]">
            <InlineWaitlist source="hero" />
            <p className="b-body mt-4 text-[0.8125rem]">
              Bli en av de första att testa. Bara din e-post.
            </p>
          </Rise>
        </div>

        {/* bottom edge: the countdown, and the cue to read on */}
        <div className="b-shell pb-9">
          <div
            className="flex flex-wrap items-end justify-between gap-6 pt-8"
            style={{ borderTop: "1px solid var(--rule)" }}
          >
            {/* Not wrapped in a reveal: it sits on the fold's bottom edge,
                where a scroll observer would never fire. */}
            <Countdown iso={process.env.NEXT_PUBLIC_LAUNCH_DATE} />
            <a
              href="#sa-fungerar-det"
              className="b-label b-cue flex items-center gap-2.5 hover:opacity-100"
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
            <p className="b-label">Sju steg</p>
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
            <p className="b-label mb-12">Så vad gör Spark egentligen?</p>
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
                className="mt-6 text-[1.15rem] tracking-[-0.02em]"
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
                    className="py-2.5 text-[0.95rem]"
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
                <p className="b-label" style={{ color: "var(--ink)" }}>
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
                    <dd className="col-span-7 text-[0.95rem] sm:col-span-8">{value}</dd>
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
                Illustrerande exempel — inte insamlade kunddata.
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
                  <span className="text-[1.15rem] tracking-[-0.02em]">{item}</span>
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
                    className="text-[1.05rem] tracking-[-0.02em]"
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
