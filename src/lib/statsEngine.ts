import type { SubTest } from '../types/question';
import type { AttemptRecord } from '../types/progress';

export interface SubTestStats {
  subTest: SubTest;
  attempts: number;
  correct: number;
  accuracy: number; // 0–1
}

export interface TagStats {
  tag: string;
  attempts: number;
  correct: number;
  accuracy: number;
}

export interface DailyStats {
  date: string; // YYYY-MM-DD
  attempts: number;
  correct: number;
  accuracy: number;
}

const SUB_TESTS: SubTest[] = ['XYZ', 'KVA', 'NOG', 'DTK'];

export function computeSubTestStats(attempts: AttemptRecord[]): SubTestStats[] {
  return SUB_TESTS.map((subTest) => {
    const relevant = attempts.filter((a) => a.subTest === subTest);
    const correct = relevant.filter((a) => a.correct).length;
    return {
      subTest,
      attempts: relevant.length,
      correct,
      accuracy: relevant.length ? correct / relevant.length : 0,
    };
  });
}

export function computeTagStats(attempts: AttemptRecord[]): TagStats[] {
  const map = new Map<string, { attempts: number; correct: number }>();
  for (const a of attempts) {
    for (const tag of a.tags ?? []) {
      const entry = map.get(tag) ?? { attempts: 0, correct: 0 };
      entry.attempts += 1;
      if (a.correct) entry.correct += 1;
      map.set(tag, entry);
    }
  }
  return Array.from(map.entries())
    .map(([tag, { attempts: n, correct }]) => ({
      tag,
      attempts: n,
      correct,
      accuracy: n ? correct / n : 0,
    }))
    .sort((a, b) => a.accuracy - b.accuracy);
}

export function computeDailyStats(attempts: AttemptRecord[], days = 14): DailyStats[] {
  const now = new Date();
  const buckets = new Map<string, { attempts: number; correct: number }>();
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    buckets.set(d.toISOString().slice(0, 10), { attempts: 0, correct: 0 });
  }
  for (const a of attempts) {
    const key = a.timestamp.slice(0, 10);
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.attempts += 1;
      if (a.correct) bucket.correct += 1;
    }
  }
  return Array.from(buckets.entries()).map(([date, { attempts: n, correct }]) => ({
    date,
    attempts: n,
    correct,
    accuracy: n ? correct / n : 0,
  }));
}

export function overallAccuracy(attempts: AttemptRecord[]): number {
  if (!attempts.length) return 0;
  const correct = attempts.filter((a) => a.correct).length;
  return correct / attempts.length;
}

/** De svagaste taggarna (minst `minAttempts` försök) – bra kandidater att repetera. */
export function weakestTags(attempts: AttemptRecord[], minAttempts = 3, limit = 5): TagStats[] {
  return computeTagStats(attempts)
    .filter((t) => t.attempts >= minAttempts)
    .slice(0, limit);
}
