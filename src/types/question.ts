/**
 * Domänmodell för frågor i den kvantitativa delen av Högskoleprovet.
 *
 * Fyra delprovstyper stöds:
 *  - XYZ: Kvantitativa jämförelser (jämför storleken på två uttryck I och II)
 *  - KVA: Kvantitativa resonemang (klassiskt flervalsproblem, 4 alternativ)
 *  - NOG: Kvantitativa resonemang, tillräcklig information (data sufficiency)
 *  - DTK: Diagram, tabeller och kartor (tolkning av data, ofta med tabell/bild)
 *
 * Se CONTENT.md i projektets rot för instruktioner om hur du lägger till
 * egna frågor.
 */

export type SubTest = 'XYZ' | 'KVA' | 'NOG' | 'DTK';

export const SUB_TEST_LABELS: Record<SubTest, string> = {
  XYZ: 'XYZ – Kvantitativa jämförelser',
  KVA: 'KVA – Kvantitativa resonemang',
  NOG: 'NOG – Tillräcklig information',
  DTK: 'DTK – Diagram, tabeller, kartor',
};

export const SUB_TEST_SHORT_DESCRIPTIONS: Record<SubTest, string> = {
  XYZ: 'Jämför storleken på två uttryck, I och II.',
  KVA: 'Klassiska matteproblem med fyra svarsalternativ.',
  NOG: 'Avgör om påståenden ger tillräcklig information för att besvara frågan.',
  DTK: 'Läs av och tolka diagram, tabeller och kartor.',
};

/** Gemensamma fält för alla frågetyper. */
interface QuestionBase {
  /** Unikt, stabilt id – ändra inte i efterhand (SRS-historik knyts till detta). */
  id: string;
  subTest: SubTest;
  /** Frågetext. Stöder inline-matte med $...$ och blockmatte med $$...$$. */
  prompt: string;
  /** Förklaring som visas efter att frågan besvarats. Stöder samma mattesyntax. */
  explanation: string;
  /** Fri taggning, t.ex. ["algebra", "procent"] – används för statistik per område. */
  tags?: string[];
  /** Ungefärlig svårighetsgrad, 1 (lätt) – 3 (svår). */
  difficulty?: 1 | 2 | 3;
  /** Valfri tabell (rader av celler) att rendera ovanför frågan, t.ex. för DTK. */
  table?: { caption?: string; rows: string[][] };
  /** Valfri bild-URL (diagram/karta) att visa ovanför frågan. */
  imageUrl?: string;
}

/** XYZ: jämför två storheter I och II. */
export interface XYZQuestion extends QuestionBase {
  subTest: 'XYZ';
  quantityI: string;
  quantityII: string;
  /**
   * A: I är större än II
   * B: II är större än I
   * C: I och II är lika stora
   * D: Informationen är otillräcklig för att avgöra storleksförhållandet
   */
  correctAnswer: 'A' | 'B' | 'C' | 'D';
}

/** KVA: klassiskt flervalsproblem med fyra alternativ. */
export interface KVAQuestion extends QuestionBase {
  subTest: 'KVA';
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
}

/** NOG: tillräcklig information – två utsagor, avgör vad som krävs. */
export interface NOGQuestion extends QuestionBase {
  subTest: 'NOG';
  statement1: string;
  statement2: string;
  /**
   * A: (1) är tillräcklig men inte (2)
   * B: (2) är tillräcklig men inte (1)
   * C: (1) och (2) tillsammans är tillräckliga, men ingen är det var för sig
   * D: (1) och (2) är var för sig tillräckliga
   * E: (1) och (2) är inte tillräckliga ens tillsammans
   */
  correctAnswer: 'A' | 'B' | 'C' | 'D' | 'E';
}

/** DTK: flervalsfråga kopplad till diagram/tabell/karta. */
export interface DTKQuestion extends QuestionBase {
  subTest: 'DTK';
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
}

export type Question = XYZQuestion | KVAQuestion | NOGQuestion | DTKQuestion;

export const XYZ_ANSWER_LABELS: Record<XYZQuestion['correctAnswer'], string> = {
  A: 'I är större än II',
  B: 'II är större än I',
  C: 'I och II är lika stora',
  D: 'Informationen är otillräcklig',
};

export const NOG_ANSWER_LABELS: Record<NOGQuestion['correctAnswer'], string> = {
  A: '(1) är tillräcklig, men inte (2)',
  B: '(2) är tillräcklig, men inte (1)',
  C: '(1) och (2) tillsammans räcker, men ingen räcker var för sig',
  D: '(1) och (2) räcker var för sig',
  E: '(1) och (2) räcker inte ens tillsammans',
};
