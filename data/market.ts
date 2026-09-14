import type { ContactStatus, Source } from "./types";

export const marketSource: Source = {
  origin: "Bolagsverket och allabolag",
  date: "14 september 2026",
};

export const segment = {
  namn: "Redovisningsbyråer, 5–20 anställda",
  sni: "SNI 69201 · Redovisning och bokföring",
  geografi: "Hela Sverige",
};

export const marketHeadline = [
  {
    varde: "312",
    enhet: "företag i Sverige",
    beskrivning: "med 5–20 anställda inom SNI 69201",
    kalla: { origin: "Bolagsverket", date: "14 september 2026" },
  },
  {
    varde: "4,2 Mkr",
    enhet: "medianomsättning",
    beskrivning: "senast inlämnade årsredovisning",
    kalla: { origin: "allabolag, 312 bolag", date: "14 september 2026" },
  },
  {
    varde: "18 %",
    enhet: "växte mer än 10 %",
    beskrivning: "56 av 312 bolag, jämfört med föregående räkenskapsår",
    kalla: { origin: "allabolag, bokslut 2025", date: "14 september 2026" },
  },
  {
    varde: "186",
    enhet: "företag i nästa segment",
    beskrivning: "byråer med 21–50 anställda — alternativet om priset ska stå kvar",
    kalla: { origin: "Bolagsverket", date: "14 september 2026" },
  },
] satisfies { varde: string; enhet: string; beskrivning: string; kalla: Source }[];

export const sizeDistribution = [
  { spann: "5–7 anställda", antal: 118, medianOms: "2,9 Mkr" },
  { spann: "8–10 anställda", antal: 79, medianOms: "3,8 Mkr" },
  { spann: "11–14 anställda", antal: 61, medianOms: "5,1 Mkr" },
  { spann: "15–17 anställda", antal: 34, medianOms: "6,4 Mkr" },
  { spann: "18–20 anställda", antal: 20, medianOms: "8,1 Mkr" },
];

export type MarketCompany = {
  namn: string;
  ort: string;
  omsattning: string;
  omsattningTal: number;
  anstallda: number;
  status: ContactStatus;
  notering?: string;
};

export const companies: MarketCompany[] = [
  { namn: "Hisingens Redovisning AB", ort: "Göteborg", omsattning: "8,4 Mkr", omsattningTal: 8.4, anstallda: 19, status: "svarat", notering: "Kjell Byström, 13 sep" },
  { namn: "Nordiska Bokslutsbyrån AB", ort: "Kungsbacka", omsattning: "7,2 Mkr", omsattningTal: 7.2, anstallda: 16, status: "kontaktad", notering: "Utskick 4 sep, påminnelse 8 sep" },
  { namn: "Byråkonsult Väst AB", ort: "Göteborg", omsattning: "6,8 Mkr", omsattningTal: 6.8, anstallda: 14, status: "svarat", notering: "Marie Dahlgren, 8 sep" },
  { namn: "Redovisningshuset i Borås AB", ort: "Borås", omsattning: "6,3 Mkr", omsattningTal: 6.3, anstallda: 13, status: "kontaktad", notering: "Utskick 4 sep, påminnelse 8 sep" },
  { namn: "Trollhättans Redovisningsbyrå AB", ort: "Trollhättan", omsattning: "5,6 Mkr", omsattningTal: 5.6, anstallda: 12, status: "ej-kontaktad" },
  { namn: "Ekonomibyrån Lindhagen AB", ort: "Mölndal", omsattning: "5,1 Mkr", omsattningTal: 5.1, anstallda: 11, status: "svarat", notering: "Anders Rydell, 6 sep" },
  { namn: "Bokslut & Balans i Väst AB", ort: "Alingsås", omsattning: "4,9 Mkr", omsattningTal: 4.9, anstallda: 10, status: "svarat", notering: "Sofia Ekwall, 12 sep" },
  { namn: "Siffra & Sammanhang AB", ort: "Göteborg", omsattning: "3,9 Mkr", omsattningTal: 3.9, anstallda: 8, status: "svarat", notering: "Petra Lindqvist, 5 sep" },
  { namn: "Vänerbygdens Ekonomi AB", ort: "Vänersborg", omsattning: "3,2 Mkr", omsattningTal: 3.2, anstallda: 7, status: "kontaktad", notering: "Utskick 4 sep" },
  { namn: "Almedal Ekonomikonsult AB", ort: "Göteborg", omsattning: "2,8 Mkr", omsattningTal: 2.8, anstallda: 6, status: "svarat", notering: "Håkan Nordin, 11 sep" },
];

export const contactState = {
  totalt: 312,
  kontaktade: 47,
  svar: 6,
  okontaktade: 265,
  svarsfrekvens: "12,8 %",
  benchmark: "11 %",
  benchmarkKalla: {
    origin: "Sparks egen data, 214 körningar",
    date: "14 september 2026",
    detail: "Svarsfrekvens för kallmejl till B2B-tjänsteföretag, 5–50 anställda",
  } satisfies Source,
};

export type Competitor = {
  namn: string;
  beskrivning: string;
  prisniva: string;
  tacker: string;
};

export const competitors: Competitor[] = [
  { namn: "Kontea", beskrivning: "Byråplattform, störst i segmentet", prisniva: "1 190 kr/användare och månad", tacker: "Bokföring, fakturering, klientregister" },
  { namn: "Balansera", beskrivning: "Bokslutsprogram, äldre installerad bas", prisniva: "790 kr/användare och månad", tacker: "Bokslutsdokument, inte beredningen" },
  { namn: "Novisio", beskrivning: "Nykomling, riktar sig mot enmansbyråer", prisniva: "349 kr/månad", tacker: "Bokföring och deklaration" },
  { namn: "Bokfört Byrå", beskrivning: "Bokföringsmotor med byråmodul", prisniva: "Offert, uppskattat 900–1 400 kr", tacker: "Löpande bokföring" },
];

export const competitorSource: Source = {
  origin: "SNI 62010, allabolag och leverantörernas prislistor",
  date: "12 september 2026",
};

export const competitionVerdict =
  "Ingen av de fyra säljer bokslutsberedning som ett eget steg. Luckan finns. Men alla fyra har redan integration mot byråernas klientregister — och det är tröskeln du ska ta dig över, inte funktionen.";
