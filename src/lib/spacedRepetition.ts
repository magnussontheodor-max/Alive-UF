import type { CardState } from '../types/progress';

const MIN_EASE_FACTOR = 1.3;
const DEFAULT_EASE_FACTOR = 2.5;

/**
 * Förenklad SM-2 (samma familj av algoritm som Anki använder).
 * Vi använder bara två kvalitetsnivåer eftersom appen frågar rätt/fel
 * snarare än en gradering 0–5: rätt svar ≈ kvalitet 5, fel svar ≈ kvalitet 2.
 */
export function scheduleNext(
  previous: CardState | undefined,
  questionId: string,
  correct: boolean,
  now: Date = new Date(),
): CardState {
  const quality = correct ? 5 : 2;
  const prev: CardState = previous ?? {
    questionId,
    repetitions: 0,
    easeFactor: DEFAULT_EASE_FACTOR,
    intervalDays: 0,
    dueDate: now.toISOString(),
  };

  let { repetitions, easeFactor, intervalDays } = prev;

  if (quality < 3) {
    repetitions = 0;
    intervalDays = 1;
  } else {
    if (repetitions === 0) {
      intervalDays = 1;
    } else if (repetitions === 1) {
      intervalDays = 6;
    } else {
      intervalDays = Math.round(intervalDays * easeFactor);
    }
    repetitions += 1;
  }

  const nextEase =
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  easeFactor = Math.max(MIN_EASE_FACTOR, Number(nextEase.toFixed(2)));

  const dueDate = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000);

  return {
    questionId,
    repetitions,
    easeFactor,
    intervalDays,
    dueDate: dueDate.toISOString(),
    lastReviewed: now.toISOString(),
  };
}

export function isDue(card: CardState | undefined, now: Date = new Date()): boolean {
  if (!card) return true; // aldrig repeterad -> alltid aktuell
  return new Date(card.dueDate).getTime() <= now.getTime();
}
