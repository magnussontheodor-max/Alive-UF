import type { SubTest } from './question';

/** Tillstånd för spaced repetition (förenklad SM-2) för en enskild fråga. */
export interface CardState {
  questionId: string;
  /** Antal lyckade repetitioner i följd. Nollställs vid fel svar. */
  repetitions: number;
  /** "Lätthetsfaktor" enligt SM-2, styr hur snabbt intervallet växer. */
  easeFactor: number;
  /** Nuvarande intervall i dagar till nästa repetition. */
  intervalDays: number;
  /** ISO-datum när kortet blir aktuellt för repetition igen. */
  dueDate: string;
  lastReviewed?: string;
}

export type AnswerMode = 'practice' | 'exam' | 'review';

/** En enskild besvarad fråga, sparas i historiken för statistik. */
export interface AttemptRecord {
  questionId: string;
  subTest: SubTest;
  correct: boolean;
  /** ISO-tidsstämpel. */
  timestamp: string;
  mode: AnswerMode;
  tags?: string[];
}

export interface ProgressData {
  version: 1;
  cards: Record<string, CardState>;
  attempts: AttemptRecord[];
}

export function createEmptyProgress(): ProgressData {
  return { version: 1, cards: {}, attempts: [] };
}
