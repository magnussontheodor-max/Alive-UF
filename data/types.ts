/** Gemensamma typer för hela demonstrationsunderlaget. */

/** Varje påstående i Spark bär sin källa och sitt hämtningsdatum. */
export type Source = {
  origin: string;
  date: string;
  detail?: string;
};

export type Trend = "upp" | "ner" | "stilla";

export type ContactStatus = "svarat" | "kontaktad" | "ej-kontaktad";

export type AnswerStance = "bekräftar" | "avvisar" | "delvis";

export type AssumptionStatus = "bekräftat" | "motsagt" | "obesvarat";

export type StepStatus = "klar" | "pågår" | "låst";

export type ScoreKey =
  | "marknad"
  | "konkurrens"
  | "passform"
  | "problem"
  | "betalningsvilja"
  | "produkt"
  | "traktion"
  | "genomforbarhet";
