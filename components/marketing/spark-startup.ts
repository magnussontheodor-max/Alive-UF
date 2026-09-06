// ---------------------------------------------------------------------------
// Spark UF, as a startup inside Spark
//
// The landing page shows Spark's own startup state rather than a fictional
// company. This file is the single place that content lives, so it can be
// checked in one read.
//
// The honesty rule the product enforces in code applies to this page too:
// nothing here is presented as a fact unless it actually happened. Anything
// we believe but have not tested is marked HYPOTHESIS, anything pointing in a
// direction without proving it is INFERENCE, and no figure appears anywhere
// that we have not measured. There are no customer counts, no percentages,
// no testimonials, because there is nothing yet to count.
// ---------------------------------------------------------------------------

import { EpistemicStatus } from "@/domain";

export const SPARK_STARTUP = {
  name: "Spark UF",
  stage: "VALIDATION",
  stageLabel: "Validering",
  country: "Sverige",
} as const;

export interface PreviewClaim {
  statement: string;
  status: EpistemicStatus;
  basis?: string;
}

/** What we know — only things that have actually happened. */
export const WHAT_WE_KNOW: PreviewClaim[] = [
  {
    statement: "Vi bygger Spark själva, och använder Spark för att fatta besluten.",
    status: "FACT",
    basis: "Vår egen produktutveckling",
  },
  {
    statement:
      "Lärare vi visat konceptet för har reagerat positivt på idén om en guidad medgrundare.",
    status: "FACT",
    basis: "Tidiga samtal, ej strukturerade intervjuer",
  },
  {
    statement:
      "Vi har inlett samtal med personer i det svenska entreprenörskapsekosystemet.",
    status: "FACT",
    basis: "Pågående samtal",
  },
];

/** What we believe — reasoning from the above, not yet tested. */
export const WHAT_WE_BELIEVE: PreviewClaim[] = [
  {
    statement:
      "Positiv reaktion på konceptet tyder på att problemet känns igen — men igenkänning är inte efterfrågan.",
    status: "INFERENCE",
  },
  {
    statement:
      "Förstagångsgrundare fastnar oftare på «vad gör jag härnäst» än på brist på information.",
    status: "HYPOTHESIS",
  },
  {
    statement: "Grundare kommer tillbaka till Spark flera gånger, inte bara en.",
    status: "HYPOTHESIS",
  },
];

/** What we need to learn — the questions this landing page exists to answer. */
export const WHAT_WE_NEED_TO_LEARN = [
  {
    question: "Hur många vill faktiskt ha tidig tillgång?",
    how: "Väntelistan. Anmälningar är en svagare signal än betalning, men den första riktiga.",
  },
  {
    question: "Vilken del av resan skapar mest värde?",
    how: "Samtal med de första användarna om var de fastnar.",
  },
  {
    question: "Återvänder grundare till Spark, eller testar de en gång?",
    how: "Mäts först när produkten är i händerna på riktiga användare.",
  },
];

export const ASSUMPTIONS = [
  {
    statement:
      "Förstagångsgrundare vill ha en guidad medgrundare, inte fler verktyg att välja mellan.",
    category: "Problem",
    importance: "CRITICAL" as const,
    status: "PARTIALLY_SUPPORTED" as const,
    note: "Tidiga samtal pekar åt rätt håll. Ingen har ännu bett om det själv, oombedd.",
  },
  {
    statement: "Det finns tillräckligt många i Sverige som vill starta digitalt företag.",
    category: "Marknad",
    importance: "HIGH" as const,
    status: "UNTESTED" as const,
    note: "Vi har inte undersökt det här ännu, och gissar inte på en siffra.",
  },
  {
    statement: "Grundare litar tillräckligt på Sparks bedömning för att agera på den.",
    category: "Lösning",
    importance: "CRITICAL" as const,
    status: "UNTESTED" as const,
    note: "Kräver att någon använder Spark på riktigt. Kan inte besvaras innan lansering.",
  },
  {
    statement: "Väntelistan säger något om verklig efterfrågan.",
    category: "Efterfrågan",
    importance: "HIGH" as const,
    status: "TESTING" as const,
    note: "Det är det här experimentet. En anmälan är intresse, inte ett åtagande.",
  },
];

export const DECISION = {
  decision: "Bygg vidare på validering innan vi bygger fler delar av produkten.",
  reason:
    "Founder- och opportunity-stegen fungerar. Att bygga ut resten innan vi vet om någon vill ha det vore att gissa dyrt.",
  basis: "Vår egen användning av Spark + tidiga samtal",
  by: "Grundarbeslut",
};

/** The current next best action — the reason this page exists. */
export const NEXT_ACTION = {
  title: "Få 100 grundare att anmäla sig till tidig tillgång",
  why: "Vi behöver mer evidens på efterfrågan innan vi bygger vidare på fler delar av produkten. Positiva samtal är en signal, men ingen av dem har bett om produkten oombedd.",
  outcome: "Ett tydligt svar på om intresset finns utanför de samtal vi redan haft.",
  success: "100 relevanta anmälningar till tidig tillgång",
  time: "~1 vecka",
  assumption: "Väntelistan säger något om verklig efterfrågan",
} as const;

export const RESEARCH_QUESTION = {
  question: "Är problemet tillräckligt viktigt för att någon ska vilja använda Spark?",
  status: "ATT VALIDERA",
  evidence: "Tidiga samtal med lärare och personer i ekosystemet",
  sourceType: "Samtal, ej strukturerade intervjuer",
  confidence: "LOW" as const,
  confidenceExplanation:
    "Bygger på ett fåtal samtal, alla i vår egen närhet. Ingen oberoende källa.",
  nextAction: "Prata med 5 potentiella användare utanför vårt eget nätverk",
};

export const MVP_SPEC = {
  primaryUser: "Förstagångsentreprenörer",
  coreProblem: "Vet inte vad de ska göra härnäst.",
  coreOutcome: "Ta nästa konkreta steg mot ett validerat företag.",
  mustHave: [
    "Grundarprofil",
    "Startup Memory",
    "Utvärdering av möjligheter",
    "Research",
    "Valideringsexperiment",
    "Nästa steg",
  ],
  notNow: [
    "Investerarmarknadsplats",
    "Socialt nätverk",
    "Avancerad analys",
    "Omfattande samarbetsfunktioner",
  ],
};

export const JOURNEY = [
  {
    id: "FOUNDER",
    label: "Founder",
    question: "Vad har du faktiskt att jobba med?",
    body: "Din erfarenhet, vad du sett på nära håll och vilka du kan nå. Spark föreslår ingenting innan det finns något verkligt att bygga på.",
    state: "built" as const,
  },
  {
    id: "OPPORTUNITY",
    label: "Opportunity",
    question: "Vilket problem är värt att jobba på?",
    body: "Möjligheter byggda av problem du själv sett — inte av en lista med AI-idéer. Har du inte sett problemet finns ingen möjlighet att bygga av.",
    state: "built" as const,
  },
  {
    id: "RESEARCH",
    label: "Research",
    question: "Vad kan vi ta reda på billigt?",
    body: "Specifika frågor med källor. Spark skiljer på fakta, slutsats och hypotes i allt som sparas.",
    state: "partial" as const,
  },
  {
    id: "VALIDATION",
    label: "Validation",
    question: "Stämmer det vi tror?",
    body: "Det minsta experiment som kan visa att du har fel — innan du bygger. Spark säger ifrån när underlaget inte räcker.",
    state: "partial" as const,
  },
  {
    id: "PRODUCT",
    label: "Product",
    question: "Vad är det minsta som är värt att bygga?",
    body: "En MVP där varje funktion pekar tillbaka på något ni faktiskt validerat. Resten står på «inte nu».",
    state: "partial" as const,
  },
  {
    id: "BUILD",
    label: "Build",
    question: "Hur byggs det?",
    body: "Från specifikation till första version. Det här steget är påbörjat, inte klart — och Spark påstår inget annat.",
    state: "planned" as const,
  },
];
