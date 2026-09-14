import type { Source } from "./types";

export type PulseSignal = {
  id: string;
  rubrik: string;
  brod: string;
  varfor: string;
  kalla: Source;
  ton: "ok" | "warn" | "bad" | "neutral";
};

export const pulse: PulseSignal[] = [
  {
    id: "p1",
    rubrik: "Två nya redovisningsbyråer registrerade i Västra Götaland",
    brod: "Bokslut Nordväst AB, Stenungsund, 5 anställda. Rydéns Ekonomibyrå AB, Lerum, 6 anställda.",
    varfor:
      "Nystartade byråer väljer systemstöd under sitt första halvår. Båda ligger inom fyra mil från dig och båda faller inom din kundprofil.",
    kalla: { origin: "Bolagsverket, nyregistreringar", date: "13 september" },
    ton: "ok",
  },
  {
    id: "p2",
    rubrik: "Kontea tar in 40 Mkr för att bygga ut sin byråplattform",
    brod: "Pengarna ska enligt bolaget gå till automatisering av återkommande moment i byråernas arbetsflöde.",
    varfor:
      "Den leverantör dina kunder redan har får muskler att bygga precis din funktion. Det bekräftar att segmentet är värt pengar — och att du har tolv månader, inte trettiosex.",
    kalla: { origin: "Breakit", date: "12 september" },
    ton: "bad",
  },
  {
    id: "p3",
    rubrik: "Fyra av fem byråer uppger att de inte hittar redovisningskonsulter",
    brod: "Branschundersökning bland 430 byråer. Bristen är störst i storstadsregionerna.",
    varfor:
      "En byrå som inte får tag i folk löser volymen med system i stället. Det är ditt starkaste säljargument och det finns inte med i ditt nuvarande utskick.",
    kalla: { origin: "Konsulten, branschundersökning", date: "11 september" },
    ton: "ok",
  },
];
