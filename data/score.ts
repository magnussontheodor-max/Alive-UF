import type { ScoreKey, Source } from "./types";

export type ScoreLine = {
  rubrik: string;
  poang: number;
  max: number;
  rader: string[];
  kalla: Source;
};

export type ScorePart = {
  nyckel: ScoreKey;
  namn: string;
  max: number;
  poang: number;
  fraga: string;
  last?: { text: string; steg: string };
  rader: ScoreLine[];
  slutsats?: string;
};

export const scoreParts: ScorePart[] = [
  {
    nyckel: "marknad",
    namn: "Marknad",
    max: 12,
    poang: 10,
    fraga: "Finns tillräckligt många köpare?",
    rader: [
      {
        rubrik: "Segmentets storlek",
        poang: 6,
        max: 6,
        rader: [
          "312 företag i Sverige med 5–20 anställda inom SNI 69201",
          "Över tröskeln för ett nischverktyg med prenumeration",
        ],
        kalla: { origin: "Bolagsverket", date: "14 september" },
      },
      {
        rubrik: "Köpkraft i segmentet",
        poang: 3,
        max: 4,
        rader: [
          "Medianomsättning 4,2 Mkr",
          "197 av 312 har färre än 11 anställda — den delen har tunnare systembudget",
        ],
        kalla: { origin: "allabolag, 312 bolag", date: "14 september" },
      },
      {
        rubrik: "Tillväxt",
        poang: 1,
        max: 2,
        rader: [
          "18 % växte mer än 10 % förra räkenskapsåret",
          "Segmentet är stabilt, inte växande. Du tar andelar, du rider inte en våg",
        ],
        kalla: { origin: "allabolag, bokslut 2025", date: "14 september" },
      },
    ],
  },
  {
    nyckel: "konkurrens",
    namn: "Konkurrens",
    max: 8,
    poang: 6,
    fraga: "Hur trångt är det, finns en lucka?",
    rader: [
      {
        rubrik: "Luckan",
        poang: 2,
        max: 2,
        rader: [
          "Ingen av de fyra systemleverantörerna säljer bokslutsberedning som eget steg",
          "2 av 6 svarande nämnde spontant att den delen saknas i deras nuvarande stöd",
        ],
        kalla: { origin: "SNI 62010 och 6 svar", date: "12 september" },
      },
      {
        rubrik: "Antal aktörer",
        poang: 3,
        max: 4,
        rader: [
          "4 leverantörer täcker bokföringsflödet i segmentet",
          "Ingen av dem har över 30 % av marknaden — men alla fyra har redan integration mot klientregistren",
        ],
        kalla: { origin: "allabolag, omsättningsandelar", date: "12 september" },
      },
      {
        rubrik: "Inträdeströskel",
        poang: 1,
        max: 2,
        rader: [
          "Tröskeln är inte funktionen, den är integrationen mot befintliga system",
          "Petra Lindqvist avvisade idén just på den punkten",
        ],
        kalla: { origin: "1 svar", date: "5 september" },
      },
    ],
  },
  {
    nyckel: "passform",
    namn: "Passform",
    max: 10,
    poang: 9,
    fraga: "Kan just du bygga och sälja det här?",
    rader: [
      {
        rubrik: "Branschkunskap",
        poang: 5,
        max: 5,
        rader: [
          "Fyra år som redovisningskonsult, cirka 160 bokslut",
          "Du har gjort exakt det arbete du vill automatisera",
        ],
        kalla: { origin: "Profilen", date: "2 september" },
      },
      {
        rubrik: "Nätverk i segmentet",
        poang: 3,
        max: 3,
        rader: [
          "17 kontakter i branschen, varav 6 inom målgruppen",
          "Svarsfrekvens 12,8 % mot 11 % som är normalt — språket fungerar",
        ],
        kalla: { origin: "Profilen och steg 05", date: "13 september" },
      },
      {
        rubrik: "Teknisk förmåga",
        poang: 1,
        max: 2,
        rader: [
          "Du kan inte koda. Två AI-byggen på fritiden räcker till prototyp, inte till produkt",
          "Ingen teknisk partner i nätverket. Detta är en strukturell lucka, inte en kunskapslucka",
        ],
        kalla: { origin: "Profilen", date: "2 september" },
      },
    ],
  },
  {
    nyckel: "problem",
    namn: "Problem",
    max: 18,
    poang: 14,
    fraga: "Säger riktiga kunder att problemet är verkligt?",
    rader: [
      {
        rubrik: "Bekräftelse från kunder",
        poang: 9,
        max: 11,
        rader: [
          "4 av 6 svarande angav bokslutsberedning som största tidstjuven",
          "2 avvisade. Båda under 9 anställda, båda med annan klientmix",
        ],
        kalla: { origin: "6 svar", date: "5–13 september" },
      },
      {
        rubrik: "Problemets omfattning",
        poang: 4,
        max: 5,
        rader: [
          "De som bekräftade beskriver 60-timmarsveckor under februari och mars",
          "Två angav att 80 % av arbetet är samma manuella moment",
        ],
        kalla: { origin: "4 svar", date: "6–13 september" },
      },
      {
        rubrik: "Bredd i underlaget",
        poang: 1,
        max: 2,
        rader: [
          "6 svar är i underkant. Vid 10 blir mönstret hållbart",
          "Alla sex ligger i Västsverige. Underlaget är geografiskt skevt",
        ],
        kalla: { origin: "47 utskick, 6 svar", date: "4–13 september" },
      },
    ],
    slutsats: "Problemet står. Det som saknas är volym och spridning, inte bekräftelse.",
  },
  {
    nyckel: "betalningsvilja",
    namn: "Betalningsvilja",
    max: 18,
    poang: 13,
    fraga: "Vill de betala, och tål de ditt pris?",
    rader: [
      {
        rubrik: "Prissvar från kunder",
        poang: 9,
        max: 11,
        rader: [
          "3 av 4 svarande angav ett pris",
          "Median 900 kr/mån · ditt pris 2 000 kr",
        ],
        kalla: { origin: "4 svar", date: "6–13 september" },
      },
      {
        rubrik: "Köpkraft i segmentet",
        poang: 4,
        max: 7,
        rader: [
          "Medianomsättning 4,2 Mkr",
          "En byrå i det spannet lägger 30–60 tkr om året på system totalt",
        ],
        kalla: { origin: "allabolag, 312 bolag", date: "14 september" },
      },
    ],
    slutsats: "Problemet är inte viljan. Det är nivån. Gå uppåt i segment eller halvera omfånget.",
  },
  {
    nyckel: "produkt",
    namn: "Produkt",
    max: 12,
    poang: 0,
    fraga: "Bygger du det bevisen stöder, och är det byggt?",
    last: { text: "Låses upp när du gjort steg 08 — Omfånget", steg: "08" },
    rader: [],
  },
  {
    nyckel: "traktion",
    namn: "Traktion",
    max: 14,
    poang: 0,
    fraga: "Använder och betalar någon på riktigt?",
    last: { text: "Låses upp när du gjort steg 10 — Live", steg: "10" },
    rader: [],
  },
  {
    nyckel: "genomforbarhet",
    namn: "Genomförbarhet",
    max: 8,
    poang: 0,
    fraga: "Räcker tid, pengar, kompetens? Är det formella klart?",
    last: { text: "Låses upp när du gjort steg 09 — Det formella", steg: "09" },
    rader: [],
  },
];

export const scoreTotal = scoreParts.reduce((s, p) => s + p.poang, 0); // 52

export const phaseCaps = [
  { fas: "Upptäck", steg: "01–02", tak: 18, text: "Du har en idé och en profil. Inget är prövat." },
  { fas: "Pröva, före samtal", steg: "03–04", tak: 30, text: "Du vet hur marknaden ser ut. Ingen har sagt något." },
  { fas: "Pröva, efter samtal", steg: "05–06", tak: 66, text: "Riktiga kunder har svarat. Nu vet du något." },
  { fas: "Lansera", steg: "07–10", tak: 86, text: "Du har byggt det bevisen stöder och det är live." },
  { fas: "Växa", steg: "11–12", tak: 100, text: "Någon använder och betalar." },
];

export const currentCap = 66;
export const currentCapLabel = "Taket i den här fasen är 66. Resten kräver att du bygger.";

export type Level = { min: number; max: number; namn: string; farg: string; sager: string };

export const levels: Level[] = [
  { min: 1, max: 29, namn: "Oprövat", farg: "bad", sager: "Du vet för lite än. Här är nästa steg." },
  { min: 30, max: 49, namn: "Underbyggt men obevisat", farg: "warn", sager: "Marknaden finns. Nu måste du prata med folk." },
  { min: 50, max: 69, namn: "Efterfrågan bekräftad", farg: "warn", sager: "Du har belägg. Bygg det minsta som testar resten." },
  { min: 70, max: 84, namn: "Byggt och lanserat", farg: "ok", sager: "Det finns. Nu ska någon börja använda det." },
  { min: 85, max: 100, namn: "Bevisad affär", farg: "ok", sager: "Kör. Du har det de flesta saknar efter ett år." },
];

export function levelFor(poang: number): Level {
  return levels.find((l) => poang >= l.min && poang <= l.max) ?? levels[0];
}

export type Lucka = "underlag" | "motsagelse" | "strukturell";

export type Suggestion = {
  id: string;
  okning: number;
  rubrik: string;
  tid: string;
  minuter: number;
  lucka: Lucka;
  motivering: string[];
  register?: string;
  knapp: string;
};

export const suggestions: Suggestion[] = [
  {
    id: "s1",
    okning: 14,
    rubrik: "Skicka till 40 fler byråer",
    tid: "~20 min",
    minuter: 20,
    lucka: "underlag",
    motivering: [
      "Du har 6 svar. Vid 12 blir underlaget användbart i stället för antydande.",
      "Lägg till bemanningsvinkeln i mejlet — fyra av fem byråer uppger att de inte hittar konsulter.",
    ],
    register: "Registret: 312 matchar, 265 okontaktade",
    knapp: "Kör steg 05 igen",
  },
  {
    id: "s2",
    okning: 8,
    rubrik: "Testa 900 kr i stället för 2 000",
    tid: "~15 min",
    minuter: 15,
    lucka: "motsagelse",
    motivering: [
      "3 av 4 svarande angav omkring 900 kr. Fler svar av samma sort ändrar inte det.",
      "Fråga samma fyra om de skulle köpa där. Ett ja från dem är värt mer än tjugo nya svar.",
    ],
    knapp: "Skicka uppföljning",
  },
  {
    id: "s3",
    okning: 6,
    rubrik: "Snäva segmentet till 10–20 anställda",
    tid: "~15 min",
    minuter: 15,
    lucka: "motsagelse",
    motivering: [
      "De tre som angav ett pris har 11, 14 och 19 anställda.",
      "Båda som avvisade har färre än 9 anställda och en annan klientmix.",
    ],
    register: "Registret: 115 av 312 matchar den snävare profilen",
    knapp: "Uppdatera kundprofilen",
  },
];

export const structuralGap = {
  rubrik: "Strukturell lucka",
  text: "Du kan inte bygga det här själv och har ingen teknisk partner. Det löses inte av fler kundsamtal.",
  atgarder: [
    "Hitta en teknisk medgrundare — 0 kandidater i ditt nätverk i dag",
    "Snäva omfånget till något som går att bygga utan kod",
    "Köp bygget. Med 40 000 kr räcker det till en K2-beredning, inte till båda regelverken",
  ],
  kalla: { origin: "Profilen", date: "2 september" } satisfies Source,
};

export const gapLabels: Record<Lucka, { namn: string; text: string }> = {
  underlag: { namn: "Otillräckligt underlag", text: "Gör mer av samma. Åtgärden är volym." },
  motsagelse: { namn: "Motsägande underlag", text: "Ändra något. Mer data av samma sort hjälper inte." },
  strukturell: { namn: "Strukturell lucka", text: "Arbete löser det inte. Något måste bli annorlunda." },
};
