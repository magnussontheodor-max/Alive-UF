import type { Metadata } from "next";
import EvidencePreview from "@/components/marketing/EvidencePreview";
import HeroCta from "@/components/marketing/HeroCta";
import JourneySection from "@/components/marketing/JourneySection";
import PageView from "@/components/marketing/PageView";
import ProductSpecPreview from "@/components/marketing/ProductSpecPreview";
import Reveal from "@/components/marketing/Reveal";
import SparkDashboardPreview from "@/components/marketing/SparkDashboardPreview";
import StartupMemoryPreview from "@/components/marketing/StartupMemoryPreview";
import WaitlistForm from "@/components/marketing/WaitlistForm";
import { Container, SectionHeader, StatusTag } from "@/components/marketing/Primitives";

export const metadata: Metadata = {
  // absolute, so the root layout's "%s · Spark" template does not append a
  // second "Spark" to a title that already starts with it.
  title: { absolute: "Spark — Din AI-medgrundare för att starta företag" },
  description:
    "Spark hjälper dig från idé till validerad möjlighet och första digitala produkt — steg för steg.",
  alternates: { canonical: "/" },
};

export default function LandingPage() {
  return (
    <>
      <PageView path="/" />

      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                             */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden pb-16 pt-14 sm:pb-24 sm:pt-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[520px]"
          style={{
            background:
              "radial-gradient(58% 46% at 50% 0%, rgba(91,103,232,0.07), transparent 72%)",
          }}
        />
        <Container className="relative">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14">
            <div>
              <Reveal>
                <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-ink-150 bg-white px-3 py-1.5 text-[12px] text-ink-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
                  Lanseras snart i Sverige
                </p>
              </Reveal>

              <Reveal delay={1}>
                <h1 className="mk-h1 text-ink-950">
                  {/* The compound must not break at its hyphen: split over two lines
                      it reads as a typo. The text stays plain for copy and search. */}
                  Din <span className="whitespace-nowrap">AI-medgrundare</span> för att starta
                  företag.
                </h1>
              </Reveal>

              <Reveal delay={2}>
                <p className="mk-lead mt-6">
                  Från idé till ett riktigt digitalt företag. Spark hjälper dig att hitta rätt
                  möjlighet, validera idén och bygga din första digitala produkt — steg för steg.
                </p>
              </Reveal>

              <Reveal delay={3}>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <HeroCta>Få tidig tillgång</HeroCta>
                  <HeroCta variant="secondary" href="#resan">
                    Se hur det fungerar
                  </HeroCta>
                </div>
                <p className="mt-4 text-[12.5px] text-ink-400">
                  Förnamn och e-post. Inget mer än så.
                </p>
              </Reveal>
            </div>

            <Reveal delay={2} className="min-w-0">
              <div className="mk-plinth p-2.5 sm:p-3.5">
                <SparkDashboardPreview />
              </div>
              <p className="mt-3 text-center text-[11.5px] leading-relaxed text-ink-400">
                Det här är Sparks egen startup i Spark, i det läge den faktiskt är i just nu.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      <Container>
        <div className="mk-rule" />
      </Container>

      {/* ---------------------------------------------------------------- */}
      {/* The problem                                                      */}
      {/* ---------------------------------------------------------------- */}
      <section className="mk-section">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <SectionHeader
                eyebrow="Problemet"
                title="Att starta företag är inte svårt för att information saknas."
                lead="Det finns redan verktyg för research, AI, hemsidor, kod, marknadsföring och affärsplaner. Ändå fastnar de flesta på samma två frågor."
              />
              <div className="mt-8 space-y-3">
                <QuestionCard>Vad ska jag göra nu?</QuestionCard>
                <QuestionCard>Och varför är det just det som är viktigast?</QuestionCard>
              </div>
            </Reveal>

            <Reveal delay={1}>
              <div className="rounded-2xl border border-ink-100 bg-white p-6 sm:p-7">
                <p className="mk-eyebrow mb-5">Utan sammanhang</p>
                <ul className="space-y-2.5">
                  {[
                    "AI-chatt",
                    "Affärsplansmall",
                    "Hemsidebyggare",
                    "Kurs i entreprenörskap",
                    "Marknadsföringsverktyg",
                    "Kodgenerator",
                  ].map((tool) => (
                    <li
                      key={tool}
                      className="flex items-center justify-between rounded-xl border border-dashed border-ink-200 px-4 py-3"
                    >
                      <span className="text-[13px] text-ink-500">{tool}</span>
                      <span className="text-[11px] text-ink-300">vet inget om din startup</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 border-t border-ink-100 pt-5 text-[13px] leading-relaxed text-ink-600">
                  Varje verktyg börjar om från noll. Ingen av dem minns vad du redan har lärt dig,
                  och ingen av dem kan säga vad som är viktigast härnäst.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* What Spark does — the journey                                    */}
      {/* ---------------------------------------------------------------- */}
      <section id="resan" className="mk-section scroll-mt-20 bg-white">
        <Container>
          <Reveal>
            <SectionHeader
              eyebrow="Produkten"
              title="Spark håller ihop hela resan."
              lead="Ett sammanhang genom sex steg, där varje steg vet vad de föregående kom fram till."
            />
          </Reveal>
          <Reveal delay={1} className="mt-10">
            <JourneySection />
          </Reveal>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Startup Memory                                                   */}
      {/* ---------------------------------------------------------------- */}
      <section className="mk-section">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-16">
            <Reveal className="lg:sticky lg:top-28 lg:self-start">
              <SectionHeader
                eyebrow="Startup Memory"
                title="Spark kommer ihåg vad ni lär er."
                lead="Varje beslut, antagande och insikt bygger vidare på samma startupkontext. Det är inte en chatthistorik — det är strukturerad kunskap om just ditt företag."
              />
              <dl className="mt-8 space-y-5">
                <Point term="Vad vi vet">
                  Fakta med underlag. Ingenting räknas som fakta utan något bakom sig.
                </Point>
                <Point term="Vad vi tror">
                  Slutsatser och hypoteser, tydligt märkta som just det.
                </Point>
                <Point term="Vad vi behöver lära oss">
                  De frågor som fortfarande är öppna, och hur de kan besvaras.
                </Point>
                <Point term="Antaganden och beslut">
                  Vad som måste vara sant, och vad ni valde att göra åt saken.
                </Point>
              </dl>
            </Reveal>

            <Reveal delay={1} className="min-w-0">
              <div className="mk-plinth p-2.5 sm:p-3.5">
                <StartupMemoryPreview />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Evidence over AI slop                                            */}
      {/* ---------------------------------------------------------------- */}
      <section className="mk-section bg-white">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal className="order-2 min-w-0 lg:order-1">
              <div className="mk-plinth p-2.5 sm:p-3.5">
                <EvidencePreview />
              </div>
            </Reveal>

            <Reveal delay={1} className="order-1 lg:order-2">
              <SectionHeader
                eyebrow="Evidens"
                title="Inte mer AI-svar för sakens skull."
                lead="Spark skiljer på vad ni vet, vad ni tror och vad ni fortfarande måste ta reda på. Tilltro räknas fram ur underlaget — den kan inte påstås."
              />
              <ul className="mt-8 space-y-3">
                {[
                  "Siffror utan källa sparas inte. Alls.",
                  "Generiska råd som «prata med dina kunder» slängs innan de når dig.",
                  "Ett påstående utan underlag blir en hypotes, synligt.",
                  "Utan evidens är tilltron noll — och Spark säger det rakt ut.",
                ].map((rule) => (
                  <li key={rule} className="flex items-start gap-3">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />
                    <span className="text-[14px] leading-relaxed text-ink-700">{rule}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 rounded-xl border border-ink-100 bg-ink-50/60 px-4 py-3.5 text-[13px] leading-relaxed text-ink-600">
                Det här är regler i koden, inte instruktioner till en modell. En AI som låter
                säker när den inte vet är farligare än ingen AI alls.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Building Spark with Spark                                        */}
      {/* ---------------------------------------------------------------- */}
      <section className="mk-section">
        <Container>
          <Reveal>
            <SectionHeader
              align="center"
              eyebrow="Vår första användare"
              title="Vi bygger Spark med Spark."
              lead="Spark UF är inte bara produkten vi bygger. Det är också vår första användare — och den enda startup som finns i systemet i dag."
            />
          </Reveal>

          <Reveal delay={1} className="mt-12">
            <div className="mx-auto max-w-3xl rounded-2xl border border-ink-100 bg-white p-6 sm:p-10">
              <ol className="relative space-y-0">
                {LOOP.map((step, i) => (
                  <li key={step.label} className="relative flex gap-5 pb-6 last:pb-0">
                    {i < LOOP.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="mk-dotted absolute left-[13px] top-7 h-[calc(100%-1.25rem)] w-px"
                      />
                    )}
                    <span
                      className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold ${
                        step.highlight
                          ? "border-accent-500 bg-accent-500 text-white"
                          : "border-ink-200 bg-white text-ink-400"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[14px] font-medium text-ink-950">{step.label}</p>
                        {step.tag && <StatusTag tone="accent">{step.tag}</StatusTag>}
                      </div>
                      <p className="mt-1 text-[13px] leading-relaxed text-ink-500">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-2 flex items-start gap-5">
                <span
                  aria-hidden="true"
                  className="relative flex h-7 w-7 shrink-0 items-center justify-center"
                >
                  <svg viewBox="0 0 28 28" fill="none" className="h-7 w-7 text-ink-300">
                    <path
                      d="M14 25V10a5 5 0 0 1 5-5h4"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeDasharray="3 3"
                      strokeLinecap="round"
                    />
                    <path
                      d="M20 2.2 23.4 5 20 7.8"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <p className="pt-1 text-[13px] leading-relaxed text-ink-500">
                  Och så börjar varvet om — tillbaka till steg 1, med mer evidens än förra gången.
                </p>
              </div>

              <p className="mt-8 border-t border-ink-100 pt-6 text-center text-[13.5px] leading-relaxed text-ink-600">
                Varje gång Spark hjälper oss fatta ett bättre beslut lär vi oss hur Spark ska
                fungera för nästa grundare.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Product spec                                                     */}
      {/* ---------------------------------------------------------------- */}
      <section className="mk-section bg-white">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-16">
            <Reveal className="lg:sticky lg:top-28 lg:self-start">
              <SectionHeader
                eyebrow="Från validering till produkt"
                title="En MVP som förblir liten."
                lead="När ni vet tillräckligt blir lärdomarna en specifikation. Varje funktion i scope pekar tillbaka på något ni faktiskt validerat — resten hamnar under «inte nu»."
              />
              <p className="mt-6 text-[13.5px] leading-relaxed text-ink-500">
                Specifikationen nedan är Sparks egen. Den är ett utkast, inte en färdig produkt,
                och listan till höger är lika viktig som den till vänster.
              </p>
            </Reveal>

            <Reveal delay={1} className="min-w-0">
              <div className="mk-plinth p-2.5 sm:p-3.5">
                <ProductSpecPreview />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Who it is for + Sweden                                           */}
      {/* ---------------------------------------------------------------- */}
      <section className="mk-section">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <SectionHeader
                eyebrow="För vem"
                title="För dig som har en idé — men inte vet vad nästa steg är."
              />
              <ul className="mt-8 space-y-2.5">
                {[
                  "Förstagångsentreprenörer",
                  "Studenter med en idé",
                  "Unga grundare",
                  "Du som vill starta något digitalt",
                  "Du som drunknar i verktyg och information",
                ].map((who) => (
                  <li
                    key={who}
                    className="rounded-xl border border-ink-100 bg-white px-4 py-3 text-[14px] text-ink-700"
                  >
                    {who}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={1}>
              <SectionHeader
                eyebrow="Sverige först"
                title="Byggt för nästa generation svenska entreprenörer."
                lead="Spark börjar i Sverige, med svenska grundare och den svenska vägen från idé till företag i fokus."
              />
              <div className="mt-8 rounded-2xl border border-ink-100 bg-white p-6">
                <p className="text-[13.5px] leading-relaxed text-ink-600">
                  Spark startade som ett UF-företag. Vi bygger det som ett riktigt produktbolag —
                  med samma krav på hederlighet i vad systemet påstår som vi skulle ställa på en
                  medgrundare av kött och blod.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Final CTA                                                        */}
      {/* ---------------------------------------------------------------- */}
      <section id="tidig-tillgang" className="scroll-mt-20 border-t border-ink-100 bg-white">
        <Container className="py-20 sm:py-28">
          <Reveal>
            <div className="mx-auto max-w-xl text-center">
              <h2 className="mk-h2 text-ink-950">Bygg ditt företag med Spark.</h2>
              <p className="mk-lead mx-auto mt-4">
                Bli en av de första att testa Spark när vi lanserar.
              </p>
            </div>
          </Reveal>

          <Reveal delay={1} className="mx-auto mt-10 max-w-md">
            <div className="rounded-2xl border border-ink-100 bg-paper p-5 sm:p-6">
              <WaitlistForm source="landing-final" />
            </div>
          </Reveal>

          <Reveal delay={2}>
            <p className="mx-auto mt-8 max-w-md text-center text-[12.5px] leading-relaxed text-ink-400">
              Spark är inte lanserat än. Väntelistan är vårt eget nästa steg — och det första
              riktiga testet av om det här behövs.
            </p>
          </Reveal>
        </Container>
      </section>
    </>
  );
}

const LOOP = [
  {
    label: "Spark UF",
    body: "Startupen i systemet är vår egen.",
    highlight: true,
    tag: "Vår startup",
  },
  { label: "Grundarkontext", body: "Vilka vi är, vad vi sett och vilka vi kan nå." },
  { label: "Möjlighet", body: "Problemet vi valde, och varför just det." },
  { label: "Research", body: "Det vi kunde ta reda på utan att bygga något." },
  {
    label: "Validering",
    body: "Där vi står nu: räcker intresset för att bygga vidare?",
    highlight: true,
    tag: "Här är vi",
  },
  { label: "Produkt", body: "Specifikationen som följer av det vi lärt oss." },
  { label: "Bygg", body: "Den första versionen — den ni ser i den här produkten." },
  {
    label: "Lärdom",
    body: "Vad som fungerade, och vad som inte gjorde det.",
  },
  {
    label: "Spark blir bättre",
    body: "Nästa grundare får en produkt som redan gjort misstaget.",
    highlight: true,
  },
];

function QuestionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-ink-100 bg-white px-5 py-4">
      <p className="text-[16px] font-medium leading-snug text-ink-950">{children}</p>
    </div>
  );
}

function Point({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[13.5px] font-medium text-ink-950">{term}</dt>
      <dd className="mt-1 text-[13.5px] leading-relaxed text-ink-500">{children}</dd>
    </div>
  );
}
