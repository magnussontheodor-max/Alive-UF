import type { StepStatus } from "./types";

export type Step = {
  nr: string;
  namn: string;
  fas: string;
  status: StepStatus;
  maxPoang: number;
  fickPoang?: number;
  kort: string;
  /** Vad som gjordes — visas för avklarade och pågående steg. */
  gjordes?: string[];
  /** Vad som kom ut. */
  resultat?: { etikett: string; varde: string }[];
  /** Vad som krävs för att låsa upp. */
  kravs?: string;
  lank?: string;
  lankText?: string;
  datum?: string;
};

export const phases = [
  { namn: "Upptäck", steg: "01–02", tak: 18 },
  { namn: "Pröva", steg: "03–06", tak: 66 },
  { namn: "Lansera", steg: "07–10", tak: 86 },
  { namn: "Växa", steg: "11–12", tak: 100 },
];

export const steps: Step[] = [
  {
    nr: "01",
    namn: "Om dig",
    fas: "Upptäck",
    status: "klar",
    maxPoang: 10,
    fickPoang: 9,
    datum: "2 september",
    kort: "Samtal som bygger profilen. Bakgrund, kompetens, nätverk, resurser, riskaptit.",
    gjordes: [
      "Fyrtio minuters samtal om din bakgrund, inte om idén",
      "17 kontakter i branschen kartlagda och sorterade efter storlek på byrån",
      "Tid och kapital fastställt: 15 timmar i veckan, 40 000 kronor",
    ],
    resultat: [
      { etikett: "Profil", varde: "6 block, 19 fastställda uppgifter" },
      { etikett: "Passform", varde: "9 av 10 poäng" },
      { etikett: "Största risken", varde: "Du kan inte koda och har ingen teknisk partner" },
    ],
    lank: "/profilen",
    lankText: "Öppna profilen",
  },
  {
    nr: "02",
    namn: "Möjligheter",
    fas: "Upptäck",
    status: "klar",
    maxPoang: 2,
    fickPoang: 2,
    datum: "3 september",
    kort: "Idéer grundade i profilen, korsade med var registret visar luckor.",
    gjordes: [
      "Fyra riktningar tagna ur profilen och Hjärnan, inte ur en tom prompt",
      "Varje riktning testad mot SNI-fördelning och digitaliseringsgrad i SCB:s företagsdatabas",
      "Två riktningar förkastade: klientportal (för trångt) och lönetjänst (du kan det inte)",
    ],
    resultat: [
      { etikett: "Vald riktning", varde: "Bokslutsberedning för byråer med 5–20 anställda" },
      { etikett: "Kom ifrån", varde: "Sju anteckningar i Hjärnan om samma sak" },
      { etikett: "Förkastat", varde: "3 av 4 riktningar" },
    ],
    lank: "/hjarnan",
    lankText: "Se anteckningarna som ledde hit",
  },
  {
    nr: "03",
    namn: "Marknaden",
    fas: "Pröva",
    status: "klar",
    maxPoang: 14,
    fickPoang: 10,
    datum: "4 september",
    kort: "Riktiga siffror ur registret. Antal företag, storleksfördelning, omsättning, tillväxt, vem som redan finns där.",
    gjordes: [
      "312 bolag hämtade ur Bolagsverket på SNI 69201 och storleksintervall",
      "Omsättning och tillväxt matchad mot senast inlämnade årsredovisning för samtliga",
      "Fyra systemleverantörer kartlagda med prisnivå och täckning",
    ],
    resultat: [
      { etikett: "Segment", varde: "312 företag, medianomsättning 4,2 Mkr" },
      { etikett: "Tillväxt", varde: "18 % växte mer än 10 %" },
      { etikett: "Luckan", varde: "Ingen leverantör säljer bokslutsberedning separat" },
    ],
    lank: "/marknaden",
    lankText: "Öppna registerunderlaget",
  },
  {
    nr: "04",
    namn: "Kunden",
    fas: "Pröva",
    status: "klar",
    maxPoang: 4,
    fickPoang: 4,
    datum: "4 september",
    kort: "Kundprofil definierad ur registret. Resultatet är en lista på namngivna företag, inte en påhittad persona.",
    gjordes: [
      "Profil satt: SNI 69201, 5–20 anställda, omsättning 2,5–9 Mkr, hela Sverige",
      "312 träffar rangordnade efter omsättning per anställd och tillväxt",
      "47 valda för första utskicket, viktat mot Västsverige där ditt nätverk finns",
    ],
    resultat: [
      { etikett: "Träffar", varde: "312 namngivna företag med kontaktuppgifter" },
      { etikett: "Första urvalet", varde: "47 företag" },
      { etikett: "Kvar", varde: "265 okontaktade" },
    ],
    lank: "/marknaden",
    lankText: "Se kundlistan",
  },
  {
    nr: "05",
    namn: "Samtalen",
    fas: "Pröva",
    status: "pågår",
    maxPoang: 36,
    fickPoang: 27,
    datum: "pågår sedan 4 september",
    kort: "Spark bygger kontaktlistan, skriver mejlen och skickar från din egen adress. Följer öppningar, svar och påminnelser.",
    gjordes: [
      "47 mejl skickade från din adress via Gmail, 4 september",
      "Påminnelse skickad efter fyra dagar till 31 som inte öppnat",
      "6 svar inkomna, samtliga lästa och nedbrutna i antaganden och prisangivelser",
    ],
    resultat: [
      { etikett: "Svarsfrekvens", varde: "12,8 % mot 11 % som är normalt i branschen" },
      { etikett: "Bekräftar problemet", varde: "4 av 6" },
      { etikett: "Angav ett pris", varde: "3 av 4 · median 900 kr" },
    ],
    lank: "/valideringen",
    lankText: "Öppna bevisen",
  },
  {
    nr: "06",
    namn: "Domen",
    fas: "Pröva",
    status: "pågår",
    maxPoang: 0,
    kort: "Kör, förfina eller pivotera. Baserat på faktiska svar, med citat och siffror.",
    gjordes: [
      "Tre antaganden prövade mot de sex svaren",
      "Preliminär dom satt: FÖRFINA",
      "Domen låses som slutgiltig först vid 10 svar",
    ],
    resultat: [
      { etikett: "Preliminär dom", varde: "Förfina — problemet håller, priset gör det inte" },
      { etikett: "Ger poäng", varde: "Inga. Domen avgör om de 27 du har står kvar" },
    ],
    lank: "/valideringen",
    lankText: "Läs domen",
  },
  {
    nr: "07",
    namn: "Affärsfallet och priset",
    fas: "Lansera",
    status: "låst",
    maxPoang: 2,
    kort: "Kalkyl med moms, arbetsgivaravgifter, F-skatt och kostnadsgolv. Prisförslag med spann och motivering.",
    kravs:
      "Låses upp när domen i steg 06 är satt på 10 svar. Just nu skulle kalkylen bygga på 2 000 kronor, och tre av fyra kunder har redan sagt att det är fel nivå.",
  },
  {
    nr: "08",
    namn: "Omfånget",
    fas: "Lansera",
    status: "låst",
    maxPoang: 4,
    kort: "MVP-innehåll genererat ur bevisen, inte ur idén. Bygg bara det de som svarade faktiskt bad om.",
    kravs:
      "Låses upp när steg 07 är klart. Två av dina svarande har bett om olika saker — K2 automatiskt och K3 automatiskt. Vilken det blir avgörs av priset, inte tvärtom.",
  },
  {
    nr: "09",
    namn: "Det formella",
    fas: "Lansera",
    status: "låst",
    maxPoang: 2,
    kort: "Enskild firma eller aktiebolag, registrering hos Bolagsverket, F-skatt, momsregistrering, bokföringskrav.",
    kravs:
      "Låses upp när steg 08 är klart. Du behöver inget bolag förrän du har något att fakturera — och du kan det här bättre än de flesta.",
  },
  {
    nr: "10",
    namn: "Live",
    fas: "Lansera",
    status: "låst",
    maxPoang: 8,
    kort: "Landningssida på egen domän med e-postinsamling och GDPR-text. Eller MVP:n själv, byggd och deployad.",
    kravs:
      "Låses upp när steg 08 är klart. Det här är steget där dina 40 000 kronor tar slut om omfånget inte är satt först.",
  },
  {
    nr: "11",
    namn: "Första kunderna",
    fas: "Växa",
    status: "låst",
    maxPoang: 14,
    kort: "30-dagarsplan mot svenska kanaler. Branschforum, Nyföretagarcentrum, lokala nätverk, branschmässor.",
    kravs:
      "Låses upp när något är live. Det här är steget som ger flest poäng av alla efter samtalen — för att det är det enda som bevisar att någon faktiskt använder det.",
  },
  {
    nr: "12",
    namn: "Kapital",
    fas: "Växa",
    status: "låst",
    maxPoang: 4,
    kort: "Almi, Vinnova, Tillväxtverket, regionala medel, banklån, bootstrapping.",
    kravs:
      "Låses upp när du har första kunderna. Almi Väst har ett mikrolån som passar din profil, men de vill se betalande kunder först — inte en plan.",
  },
];

export const stepsMaxTotal = steps.reduce((s, x) => s + x.maxPoang, 0); // 100
export const stepsEarned = steps.reduce((s, x) => s + (x.fickPoang ?? 0), 0); // 52
