import type { Source } from "./types";

export type Chip = Source;

export type Block =
  | { typ: "text"; text: string }
  | { typ: "punkter"; punkter: string[] }
  | { typ: "citat"; text: string; av: string }
  | { typ: "verktyg"; rubrik: string; rader: string[]; lank?: string; lankText?: string };

export type CofounderReply = {
  id: string;
  block: Block[];
  chips: Chip[];
  /** Nya förslagsfrågor efter det här svaret. */
  foljdfragor?: string[];
};

export const opening: CofounderReply = {
  id: "start",
  block: [
    {
      typ: "text",
      text: "Kjell Byström på Hisingens Redovisning svarade i går kväll. Det är ditt sjätte svar och det första från en byrå med över 15 anställda.",
    },
    {
      typ: "text",
      text: "Det ändrar bilden — men inte åt det håll du hoppas. Han bekräftar problemet lika tydligt som de andra tre. Och han landar på tusen kronor i månaden, inte 2 000.",
    },
  ],
  chips: [{ origin: "6 svar", date: "5–13 september" }],
};

export const prompts: string[] = [
  "Vad ändrar Kjells svar?",
  "Kan jag ta 2 000 kr i månaden?",
  "Ska jag börja bygga nu?",
  "Vilka ska jag kontakta härnäst?",
];

export type Exchange = {
  id: string;
  fraga: string;
  nyckelord: string[];
  svar: CofounderReply;
};

export const exchanges: Exchange[] = [
  {
    id: "e1",
    fraga: "Vad ändrar Kjells svar?",
    nyckelord: ["kjell", "senaste", "svaret", "ändrar", "nytt"],
    svar: {
      id: "s-e1",
      block: [
        {
          typ: "text",
          text: "Kjell driver den största byrån som svarat. 19 anställda, 8,4 miljoner i omsättning. Han är den enda i underlaget som är stor nog att din prisnivå ens skulle kunna vara rimlig.",
        },
        {
          typ: "citat",
          text: "Vi skulle kunna lägga tusen i månaden per konsult om det sparar en vecka per klient. Mer än så får jag inte igenom hos min kompanjon.",
          av: "Kjell Byström, Hisingens Redovisning AB, 13 september",
        },
        {
          typ: "text",
          text: "Det betyder att prisinvändningen inte kommer från att byråerna är för små. Den kommer från att de inte betraktar bokslutsberedning som ett eget system värt en egen budget. Det är ett annat problem, och det löses inte genom att gå uppåt i segment.",
        },
      ],
      chips: [
        { origin: "6 svar", date: "5–13 september" },
        { origin: "allabolag", date: "14 september" },
      ],
      foljdfragor: ["Kan jag ta 2 000 kr i månaden?", "Vilka ska jag kontakta härnäst?"],
    },
  },
  {
    id: "e2",
    fraga: "Kan jag ta 2 000 kr i månaden?",
    nyckelord: ["pris", "2000", "2 000", "betala", "kosta", "kronor", "dyrt", "prissättning", "900"],
    svar: {
      id: "s-e2",
      block: [
        { typ: "text", text: "Nej. Inte med det underlag du har." },
        {
          typ: "text",
          text: "Tre av fyra som angav en siffra landade på 800, 900 och 1 000 kronor. Median 900. Ditt pris är 2 000. Det är ingen förhandlingsmarginal, det är en faktor 2,2.",
        },
        {
          typ: "text",
          text: "Du kommer att säga att de inte förstår värdet än. Det kan stämma. Men du har inte ett enda svar som stöder 2 000 kronor, och du har tre som säger emot. Bygger du en kalkyl på 2 000 nu väljer du bort det du faktiskt vet till förmån för det du hoppas.",
        },
        {
          typ: "punkter",
          punkter: [
            "Halvera omfånget: bygg bara K2-beredningen och ta 900 kronor. Går inom dina 40 000.",
            "Byt målgrupp: byråer med 21–50 anställda. 186 företag — och du har noll kontakter där.",
          ],
        },
        {
          typ: "text",
          text: "Registret säger att den första vägen är kortare för just dig. Ditt nätverk ligger i småbyråsegmentet, och svarsfrekvensen på 12,8 % är hela din fördel i det här läget.",
        },
      ],
      chips: [
        { origin: "4 svar", date: "6–13 september" },
        { origin: "Bolagsverket", date: "14 september" },
      ],
      foljdfragor: ["Ska jag börja bygga nu?", "Vilka ska jag kontakta härnäst?"],
    },
  },
  {
    id: "e3",
    fraga: "Ska jag börja bygga nu?",
    nyckelord: ["bygga", "bygg", "mvp", "koda", "utveckla", "produkt", "prototyp"],
    svar: {
      id: "s-e3",
      block: [
        {
          typ: "text",
          text: "Nej. Och jag vet varför du frågar: 24 av dina 48 möjliga poäng härifrån sitter i Produkt och Traktion, och de ser ut att bara vänta på att du sätter igång.",
        },
        {
          typ: "text",
          text: "Men du har sex svar och en motsagd prishypotes. Börjar du bygga nu bygger du mot 2 000 kronor i månaden, och tre av fyra kunder har redan sagt att det är fel nivå. Det är det dyraste misstaget i hela resan, och det är precis det steg 06 finns för att hindra.",
        },
        {
          typ: "text",
          text: "Det finns också en sak till som du inte kan lösa med arbete: du kan inte koda och har ingen teknisk partner. Med 40 000 kronor räcker det till en K2-beredning köpt av någon annan, inte till båda regelverken. Omfånget måste alltså sättas av priset, inte tvärtom.",
        },
        { typ: "text", text: "Gör om prisfrågan först. Det tar tre dagar. Bygget tar tre månader." },
      ],
      chips: [
        { origin: "Poängen", date: "14 september" },
        { origin: "Profilen", date: "2 september" },
      ],
      foljdfragor: ["Vilka ska jag kontakta härnäst?", "Hur ser marknaden ut?"],
    },
  },
  {
    id: "e4",
    fraga: "Vilka ska jag kontakta härnäst?",
    nyckelord: ["kontakta", "ringa", "härnäst", "vem", "vilka", "nästa", "lista"],
    svar: {
      id: "s-e4",
      block: [
        {
          typ: "text",
          text: "De två största som inte svarat. Nordiska Bokslutsbyrån i Kungsbacka, 16 anställda och 7,2 miljoner. Redovisningshuset i Borås, 13 anställda och 6,3 miljoner.",
        },
        {
          typ: "text",
          text: "Båda ligger över mediansstorleken i segmentet och båda är de enda i underlaget som skulle kunna bära 2 000 kronor. Att de inte svarat är inget nej — det är 47 utskick och 12,8 % svarsfrekvens. Mejl räcker inte längre, ring.",
        },
        {
          typ: "text",
          text: "Jag har lagt upp samtalen med tre frågor vardera. Den viktigaste är den tredje: vad betalar ni i dag för allt systemstöd tillsammans? Det är den siffran som avgör om 900 eller 2 000 är rätt.",
        },
        {
          typ: "verktyg",
          rubrik: "Verktyg startat · Samtalslista",
          rader: [
            "2 företag · 3 frågor vardera · nummer hämtade ur registret",
            "Underlag: omsättning, anställda, nuvarande leverantör",
            "Lagt till i Spåret och som nästa steg på hemvyn",
          ],
          lank: "/",
          lankText: "Öppna nästa steg",
        },
      ],
      chips: [
        { origin: "allabolag", date: "14 september" },
        { origin: "Steg 05", date: "13 september" },
      ],
      foljdfragor: ["Hur ser marknaden ut?", "Vad gör konkurrenterna?"],
    },
  },
  {
    id: "e5",
    fraga: "Hur ser marknaden ut?",
    nyckelord: ["marknad", "hur många", "register", "segment", "storlek", "bolagsverket"],
    svar: {
      id: "s-e5",
      block: [
        {
          typ: "text",
          text: "312 redovisningsbyråer i Sverige har 5–20 anställda. Medianomsättning 4,2 miljoner. 18 % växte mer än 10 % förra räkenskapsåret.",
        },
        {
          typ: "text",
          text: "47 av dem har du kontaktat. 265 är orörda. Marknaden är inte din flaskhals och har aldrig varit det — den delen av poängen ligger redan på 10 av 12.",
        },
        {
          typ: "text",
          text: "Det som drar ner är att segmentet är stabilt, inte växande. Du tar andelar från någon annan, du rider ingen våg. Det gör priset viktigare, inte mindre viktigt.",
        },
      ],
      chips: [
        { origin: "Bolagsverket och allabolag", date: "14 september" },
        { origin: "allabolag, bokslut 2025", date: "14 september" },
      ],
      foljdfragor: ["Vad gör konkurrenterna?", "Kan jag ta 2 000 kr i månaden?"],
    },
  },
  {
    id: "e6",
    fraga: "Vad gör konkurrenterna?",
    nyckelord: ["konkurrent", "kontea", "balansera", "leverantör", "andra", "system"],
    svar: {
      id: "s-e6",
      block: [
        {
          typ: "text",
          text: "Fyra leverantörer täcker bokföringsflödet i segmentet. Ingen av dem säljer bokslutsberedning som ett eget steg. Det är luckan, och den är verklig.",
        },
        {
          typ: "text",
          text: "Men två av sex svarande nämnde sina befintliga system spontant, båda som ett hinder. Luckan finns i produkterna — inte nödvändigtvis i huvudet på kunden.",
        },
        {
          typ: "citat",
          text: "Om det hade legat inuti det vi redan har vore det en annan diskussion.",
          av: "Petra Lindqvist, Siffra & Sammanhang AB, 5 september",
        },
        {
          typ: "text",
          text: "Och Kontea tog in 40 miljoner i förra veckan för att automatisera återkommande moment. Din lucka har ett bäst före-datum.",
        },
      ],
      chips: [
        { origin: "SNI 62010 och 6 svar", date: "12 september" },
        { origin: "Breakit", date: "12 september" },
      ],
      foljdfragor: ["Ska jag börja bygga nu?", "Vilka ska jag kontakta härnäst?"],
    },
  },
];

export const fallback: CofounderReply = {
  id: "fallback",
  block: [
    {
      typ: "text",
      text: "Jag kan svara på det, men det för oss bort från det som avgör just nu.",
    },
    {
      typ: "text",
      text: "Du har en motsagd prishypotes och två obesvarade samtal. Allt annat kan vänta tills prisfrågan är avgjord — och den avgörs inte av fler mejl, utan av två telefonsamtal.",
    },
    { typ: "text", text: "Vill du att jag lägger upp samtalen?" },
  ],
  chips: [{ origin: "Steg 05", date: "13 september" }],
  foljdfragor: ["Vilka ska jag kontakta härnäst?", "Kan jag ta 2 000 kr i månaden?"],
};
