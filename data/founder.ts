import type { Source } from "./types";

export const founder = {
  namn: "Elin Öberg",
  alder: 26,
  ort: "Göteborg",
  idé: "Ett AI-verktyg som automatiserar bokslutsförberedelser för små svenska redovisningsbyråer",
  idéKort: "Bokslutsberedning för små redovisningsbyråer",
  startade: "2 september 2026",
};


export type ProfileBlock = {
  rubrik: string;
  rader: { etikett: string; text: string; kalla?: Source }[];
};

export const profile: ProfileBlock[] = [
  {
    rubrik: "Bakgrund",
    rader: [
      {
        etikett: "Yrke",
        text: "Fyra år som redovisningskonsult på Väståkers Redovisning AB i Göteborg, en byrå med 34 anställda. Ansvarat för cirka 40 bokslut per år, mest K2 och en växande andel K3.",
        kalla: { origin: "Samtal, steg 01", date: "2 september" },
      },
      {
        etikett: "Utbildning",
        text: "Ekonomprogrammet, Handelshögskolan i Göteborg. Inriktning redovisning.",
        kalla: { origin: "Samtal, steg 01", date: "2 september" },
      },
      {
        etikett: "Vid sidan av",
        text: "Byggt två små verktyg med AI på fritiden. Det ena läser SIE-filer och hittar konton utan motpart.",
        kalla: { origin: "Hjärnan, anteckning 3 maj", date: "3 maj" },
      },
    ],
  },
  {
    rubrik: "Det du kan",
    rader: [
      { etikett: "Bokslut", text: "K2 och K3 i praktiken, inte i teorin. Har gjort ungefär 160 stycken." },
      { etikett: "Excel", text: "Expertnivå. Bygger modeller andra på byrån använder." },
      { etikett: "SIE och kontoplaner", text: "Kan formatet, kan avvikelserna, kan varför byråer gör olika." },
      { etikett: "Branschspråket", text: "Du skriver mejl som en byråägare svarar på. Det syns i svarsfrekvensen: 12,8 % mot 11 % som är normalt i branschen." },
    ],
  },
  {
    rubrik: "Det du inte kan",
    rader: [
      { etikett: "Kod", text: "Ingen programmeringsbakgrund. Prototyp med AI-verktyg går, produkt gör det inte. Detta är den enskilt största risken i projektet." },
      { etikett: "Försäljning uppåt", text: "Har aldrig sålt till någon över 20 anställda. Hela ditt nätverk ligger i småbyråsegmentet." },
      { etikett: "Rekrytering", text: "Har aldrig anställt eller tagit in delägare." },
    ],
  },
  {
    rubrik: "Nätverk",
    rader: [
      {
        etikett: "I branschen",
        text: "17 namngivna kontakter, varav 6 på byråer som ligger inom målgruppen 5–20 anställda.",
        kalla: { origin: "Profilen", date: "2 september" },
      },
      { etikett: "Tidigare kollegor", text: "Utspridda på fyra byråer i Västsverige efter fyra års rörlighet i branschen." },
      { etikett: "Tekniskt", text: "Ingen. Du känner ingen som kan bygga det här med dig." },
    ],
  },
  {
    rubrik: "Tid och pengar",
    rader: [
      { etikett: "Tid", text: "15 timmar i veckan vid sidan av heltid. Kvällar och söndagar." },
      { etikett: "Kapital", text: "40 000 kronor sparade. Inga lån, inga externa pengar, ingen delägare." },
      { etikett: "Uthållighet", text: "Med 15 timmar i veckan tar steg 05 till 10 ungefär fem månader. Det är den tidplan Spark räknar med." },
    ],
  },
  {
    rubrik: "Riskaptit",
    rader: [
      { etikett: "Gränsen", text: "Du säger upp dig inte förrän det finns betalande kunder. Du kan lägga de 40 000 men inte mer." },
      { etikett: "Vad det betyder", text: "Bygget måste rymmas inom 40 000 kronor eller göras av någon annan. Det avgör omfånget i steg 08 och är inte en detalj — det är en ram." },
    ],
  },
];

/** Kopplingen mellan profilen och idén — poängen med steg 01. */
export const profileToIdea = {
  fran: "Fyra år som redovisningskonsult, 160 bokslut, expert på SIE-filer",
  via: "Sju anteckningar i Hjärnan om samma sak: säsongen, det manuella arbetet, att underlaget är identiskt mellan byråer",
  till: "Bokslutsberedning som eget verktyg för byråer med 5–20 anställda",
  motivering:
    "Idén kom inte ur en tom ruta. Den kom ur att du har gjort arbetet 160 gånger och vet exakt vilken del av det som är identiskt varje gång. Det är också därför Passform ligger på 9 av 10 — det finns knappt någon i Sverige som kan beskriva problemet bättre än du.",
};
