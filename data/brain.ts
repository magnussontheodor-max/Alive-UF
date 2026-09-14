export type BrainNote = {
  id: string;
  datum: string;
  text: string;
  /** Har medgrundaren använt anteckningen i sitt resonemang? */
  anvand?: string;
};

export const brainNotes: BrainNote[] = [
  {
    id: "b1",
    datum: "14 mars",
    text: "Bokslutssäsongen är helvete. Vi jobbar 60 timmar i veckan i tre månader och 80 % är samma manuella arbete. Ingen säger något om det, alla bara accepterar att februari och mars är förlorade.",
    anvand: "Steg 02 · grunden i riktningen",
  },
  {
    id: "b2",
    datum: "2 april",
    text: "Kollade upp vad Kontea faktiskt tar. 1 190 per användare och månad. Ingen på kontoret vet vad vi betalar totalt för system. Det borde vara pinsamt för en redovisningsbyrå.",
    anvand: "Steg 03 · prisankare i konkurrensbilden",
  },
  { id: "b3", datum: "19 april", text: "Boka om tandläkaren. Och däckbyte." },
  {
    id: "b4",
    datum: "3 maj",
    text: "Byggde en GPT som läser SIE-filer och hittar konton som saknar motpart. Tog en kväll. Funkar förvånansvärt bra på våra egna filer, sämre på dem från Novisio.",
    anvand: "Steg 01 · teknisk förmåga i profilen",
  },
  {
    id: "b5",
    datum: "21 maj",
    text: "Lisa på Ekonomibyrån sa att de hellre anställer än köper system. Fråga varför. Är det pengarna eller är det att inget system gör det de behöver?",
    anvand: "Steg 05 · blev fråga 3 i utskicket",
  },
  { id: "b6", datum: "7 juni", text: "Podd-tips från Mattias. Acquired, avsnittet om hur bokföringsprogram blev plattformar. Lyssna på tåget." },
  {
    id: "b7",
    datum: "28 juni",
    text: "Varje byrå gör bokslut på sitt eget sätt men underlaget är identiskt. Samma SIE-fil, samma kontoplan, samma fyra avstämningar. Det är det som är grejen. Det är inte kompetensen som skiljer, det är rutinerna.",
    anvand: "Steg 02 · formuleringen av idén",
  },
];
