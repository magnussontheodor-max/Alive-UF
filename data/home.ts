import type { ScoreKey, Source } from "./types";

export type NextStep = {
  id: string;
  steg: string;
  rubrik: string;
  underrubrik: string;
  varfor: string[];
  underlag: { rubrik: string; rader: string[]; kalla: Source };
  /** Poängen stiger med så här mycket när steget markeras klart. */
  okning: number;
  delar: { nyckel: ScoreKey; delta: number }[];
  /** Raden som läggs till i Spåret när steget markeras klart. */
  spar: string;
  /** Sista steget i demons kedja. */
  sist?: boolean;
};

export const nextSteps: NextStep[] = [
  {
    id: "n1",
    steg: "Steg 05 · Samtalen",
    rubrik: "Ring de två som inte svarade.",
    underrubrik: "Fråga specifikt vad de betalar för sin nuvarande lösning.",
    varfor: [
      "3 av 4 svarande angav ett pris och alla tre landade kring 900 kr. Ditt pris är 2 000 kr.",
      "Nordiska Bokslutsbyrån och Redovisningshuset i Borås är de två största i underlaget som inte svarat. De är också de enda som skulle kunna bära din nivå.",
    ],
    underlag: {
      rubrik: "Det här bygger på",
      rader: [
        "Nordiska Bokslutsbyrån AB · Kungsbacka · 16 anställda · 7,2 Mkr · utskick 4 sep, påminnelse 8 sep",
        "Redovisningshuset i Borås AB · Borås · 13 anställda · 6,3 Mkr · utskick 4 sep, påminnelse 8 sep",
        "Prissvar: 800, 900 och 1 000 kr · median 900 kr · ditt pris 2 000 kr",
      ],
      kalla: { origin: "allabolag och 4 svar", date: "14 september" },
    },
    okning: 5,
    delar: [
      { nyckel: "betalningsvilja", delta: 3 },
      { nyckel: "problem", delta: 2 },
    ],
    spar: "Du ringde Nordiska Bokslutsbyrån och Redovisningshuset i Borås. Båda uppgav sin nuvarande systemkostnad.",
  },
  {
    id: "n2",
    steg: "Steg 05 · Samtalen",
    rubrik: "Skicka uppföljning till de fyra som bekräftade problemet.",
    underrubrik: "Fråga rakt ut om 900 kr i månaden hade ändrat svaret.",
    varfor: [
      "Du har nu två prisuppgifter till från samtalen. Båda ligger under 1 200 kr.",
      "Fler svar av samma sort höjer ingenting. Det som saknas är ett ja eller nej på en nivå du faktiskt kan sätta.",
    ],
    underlag: {
      rubrik: "Det här bygger på",
      rader: [
        "Kjell Byström · Hisingens Redovisning · 1 000 kr",
        "Anders Rydell · Ekonomibyrån Lindhagen · 900 kr",
        "Marie Dahlgren · Byråkonsult Väst · 800 kr",
        "Sofia Ekwall · Bokslut & Balans i Väst · ingen siffra angiven",
      ],
      kalla: { origin: "4 svar", date: "6–13 september" },
    },
    okning: 4,
    delar: [
      { nyckel: "betalningsvilja", delta: 2 },
      { nyckel: "problem", delta: 2 },
    ],
    spar: "Uppföljning skickad till fyra svarande med frågan om 900 kr. Två svarade ja samma dag.",
  },
  {
    id: "n3",
    steg: "Steg 04 · Kunden",
    rubrik: "Snäva kundprofilen till 10–20 anställda.",
    underrubrik: "Ta bort de 197 byråerna under 11 anställda ur listan.",
    varfor: [
      "Alla som angav ett pris har 11, 14 eller 19 anställda. Båda som avvisade har färre än 9.",
      "Att fortsätta mejla den mindre halvan är att köpa fler nej för samma pengar.",
    ],
    underlag: {
      rubrik: "Det här bygger på",
      rader: [
        "115 av 312 företag har 11–20 anställda · medianomsättning 5,9 Mkr",
        "197 av 312 har 5–10 anställda · medianomsättning 3,2 Mkr",
        "Avvisade svar: 6 och 8 anställda",
      ],
      kalla: { origin: "allabolag, 312 bolag", date: "14 september" },
    },
    okning: 3,
    delar: [
      { nyckel: "marknad", delta: 2 },
      { nyckel: "konkurrens", delta: 1 },
    ],
    spar: "Kundprofilen snävad till 11–20 anställda. 115 företag kvar i urvalet, 68 okontaktade.",
  },
  {
    id: "n4",
    steg: "Steg 06 · Domen",
    rubrik: "Kör domen igen med det nya underlaget.",
    underrubrik: "Du är två poäng från taket i den här fasen. Resten kräver att du bygger.",
    varfor: [
      "Du har gjort allt som går att göra före steg 06. Åtta prisuppgifter, en snävare profil och ett bekräftat problem.",
      "Taket i fasen Pröva är 66. Poängen därefter sitter i Produkt, Traktion och Genomförbarhet — och de låses bara upp av att något byggs och säljs.",
    ],
    underlag: {
      rubrik: "Det här bygger på",
      rader: [
        "Fastak per fas: Upptäck 18 · Pröva 66 · Lansera 86 · Växa 100",
        "Låsta delar: Produkt 12 p, Traktion 14 p, Genomförbarhet 8 p",
      ],
      kalla: { origin: "Poängen", date: "14 september" },
    },
    okning: 0,
    delar: [],
    spar: "Domen kördes om på åtta prisuppgifter.",
    sist: true,
  },
];

export type TrailEntry = {
  id: string;
  text: string;
  tid: string;
  typ: "svar" | "register" | "poang" | "verktyg";
};

export const trail: TrailEntry[] = [
  { id: "t1", text: "Kjell Byström på Hisingens Redovisning svarade. Sjätte svaret, och det första från en byrå över 15 anställda.", tid: "I går 16:42", typ: "svar" },
  { id: "t2", text: "Två nya redovisningsbyråer registrerades i Västra Götaland. Båda inom din kundprofil.", tid: "I går 06:00", typ: "register" },
  { id: "t3", text: "Din poäng steg med 6 efter Kjells svar. Problem +4, Betalningsvilja +2.", tid: "I går 16:44", typ: "poang" },
];

export const greeting = {
  hälsning: "Söndag 14 september",
  läge: "Steg 05 av 12 · Pröva",
};
