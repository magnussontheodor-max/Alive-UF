import type { AnswerStance, AssumptionStatus, Source } from "./types";

export const outreach = {
  kontaktade: 47,
  svar: 6,
  svarsfrekvens: "12,8 %",
  benchmark: "11 %",
  period: "4–13 september 2026",
  kanal: "Mejl från elin.oberg@vastakers.se via Gmail",
  paminnelse: "Påminnelse skickad efter fyra dagar till 31 av 47",
};

export const outreachSource: Source = {
  origin: "Steg 05, utskick och svar",
  date: "13 september 2026",
};

export type Assumption = {
  id: string;
  text: string;
  status: AssumptionStatus;
  underlag: string;
  kalla: Source;
};

export const assumptions: Assumption[] = [
  {
    id: "a1",
    text: "Bokslutsberedning är det som tar mest tid i en byrå med 5–20 anställda",
    status: "bekräftat",
    underlag:
      "4 av 6 svarande angav bokslutsberedning som den enskilt största tidstjuven. Två beskrev 60 timmars arbetsveckor under februari och mars. De två som sa nej har 6 respektive 8 anställda och gör nästan bara enskilda firmor.",
    kalla: { origin: "6 svar", date: "5–13 september" },
  },
  {
    id: "a2",
    text: "En byrå i segmentet kan betala 2 000 kr per användare och månad",
    status: "motsagt",
    underlag:
      "3 av 4 som bekräftade problemet angav en egen prisnivå. 800, 900 och 1 000 kronor. Median 900. Ingen av de sex nämnde en siffra i närheten av 2 000. Marie Dahlgren jämförde med hela byråns nuvarande systemkostnad.",
    kalla: { origin: "4 svar", date: "6–13 september" },
  },
  {
    id: "a3",
    text: "Byråerna är beredda att lägga till ett system utöver det de har",
    status: "obesvarat",
    underlag:
      "Ingen av de sex tog direkt ställning. Två nämnde befintliga system spontant, båda som ett hinder snarare än ett komplement. Frågan ställdes inte tillräckligt rakt i utskicket — det är ett fel i mejlet, inte i idén.",
    kalla: { origin: "6 svar", date: "5–13 september" },
  },
];

export type Reply = {
  id: string;
  foretag: string;
  person: string;
  roll: string;
  ort: string;
  anstallda: number;
  datum: string;
  stance: AnswerStance;
  citat: string;
  prisangivelse: number | null;
};

export const replies: Reply[] = [
  {
    id: "r1",
    foretag: "Hisingens Redovisning AB",
    person: "Kjell Byström",
    roll: "Delägare",
    ort: "Göteborg",
    anstallda: 19,
    datum: "13 september",
    stance: "delvis",
    citat:
      "Bokslutssäsongen äter tre månader av året hos oss och det mesta av det är flyttande av siffror mellan samma fyra ställen. Tar du bort halva det lyssnar jag. Vi skulle kunna lägga tusen i månaden per konsult om det sparar en vecka per klient. Mer än så får jag inte igenom hos min kompanjon.",
    prisangivelse: 1000,
  },
  {
    id: "r2",
    foretag: "Bokslut & Balans i Väst AB",
    person: "Sofia Ekwall",
    roll: "Byråchef",
    ort: "Alingsås",
    anstallda: 10,
    datum: "12 september",
    stance: "bekräftar",
    citat:
      "Ja, det är där det gör ont. Men jag skulle vilja veta om det klarar både K2 och K3 automatiskt, för det är i K3-klienterna tiden försvinner. Vad det får kosta beror helt på hur mycket det faktiskt tar bort. Hör av dig när du har något att visa.",
    prisangivelse: null,
  },
  {
    id: "r3",
    foretag: "Almedal Ekonomikonsult AB",
    person: "Håkan Nordin",
    roll: "Ägare",
    ort: "Göteborg",
    anstallda: 6,
    datum: "11 september",
    stance: "avvisar",
    citat:
      "Vi är sex personer och gör nästan bara bokslut för enskilda firmor och små AB. Det går på en timme styck. Det du beskriver löser inget problem vi har. Lycka till, men jag är fel person.",
    prisangivelse: null,
  },
  {
    id: "r4",
    foretag: "Byråkonsult Väst AB",
    person: "Marie Dahlgren",
    roll: "Delägare",
    ort: "Göteborg",
    anstallda: 14,
    datum: "8 september",
    stance: "delvis",
    citat:
      "Problemet är verkligt, det ska du veta. Men 2 000 kronor per användare och månad är mer än vi betalar för hela vårt nuvarande systemstöd. 800 kronor hade varit ett samtal. 2 000 är det inte.",
    prisangivelse: 800,
  },
  {
    id: "r5",
    foretag: "Ekonomibyrån Lindhagen AB",
    person: "Anders Rydell",
    roll: "Redovisningschef",
    ort: "Mölndal",
    anstallda: 11,
    datum: "6 september",
    stance: "delvis",
    citat:
      "Vi jobbar 60-timmarsveckor i februari och mars och det är inte hållbart, så du är inne på rätt sak. Kring 900 kronor i månaden vore rimligt för oss. Men jag har hört liknande löften förut och hittills har inget klarat våra kontoplaner.",
    prisangivelse: 900,
  },
  {
    id: "r6",
    foretag: "Siffra & Sammanhang AB",
    person: "Petra Lindqvist",
    roll: "Ägare",
    ort: "Göteborg",
    anstallda: 8,
    datum: "5 september",
    stance: "avvisar",
    citat:
      "Vi har redan Kontea och Balansera. Ett tredje system som ska lära sig våra klienter mitt i säsongen är en risk, inte en besparing. Om det hade legat inuti det vi redan har vore det en annan diskussion.",
    prisangivelse: null,
  },
];

export const priceEvidence = {
  angivnaPriser: [800, 900, 1000],
  median: 900,
  dittPris: 2000,
  faktor: "2,2 gånger",
  kalla: { origin: "4 svar", date: "6–13 september" } satisfies Source,
};

export const verdict = {
  beslut: "FÖRFINA" as const,
  sammanfattning:
    "Problemet är verkligt. 4 av 6 sa att bokslutsberedningen tar mest tid, och de två som sa nej är båda under 9 anställda och gör en annan sorts bokslut.",
  invandning:
    "Priset är det inte. 3 av 4 som angav en siffra landade kring 900 kronor, inte 2 000. Ingen av de sex nämnde något i närheten av din nivå.",
  atgard: "Gå uppåt i segment eller halvera omfånget.",
  detalj:
    "Uppåt betyder byråer med 21–50 anställda — 186 företag enligt Bolagsverket, och en grupp du inte har ett enda kontaktnät i. Halvera omfånget betyder att bygga bara K2-beredningen och ta 900 kronor. Registret säger att den andra vägen är kortare för just dig.",
  kalla: { origin: "6 svar och allabolag", date: "13 september 2026" } satisfies Source,
  spärr:
    "Domen låses som slutgiltig först vid 10 svar. Med 6 är den riktningsgivande, inte avgjord.",
};

export const stanceLabel: Record<AnswerStance, string> = {
  bekräftar: "Bekräftar",
  avvisar: "Avvisar",
  delvis: "Delvis",
};
