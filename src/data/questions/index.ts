import type { Question, SubTest } from '../../types/question';
import { xyzQuestions } from './xyz';
import { kvaQuestions } from './kva';
import { nogQuestions } from './nog';
import { dtkQuestions } from './dtk';

export const allQuestions: Question[] = [
  ...xyzQuestions,
  ...kvaQuestions,
  ...nogQuestions,
  ...dtkQuestions,
];

export const questionsBySubTest: Record<SubTest, Question[]> = {
  XYZ: xyzQuestions,
  KVA: kvaQuestions,
  NOG: nogQuestions,
  DTK: dtkQuestions,
};

export function getQuestionById(id: string): Question | undefined {
  return allQuestions.find((q) => q.id === id);
}

// Enkel sanity-check i dev-läge: varna om dubbla id:n förekommer, eftersom
// SRS- och statistikdata knyts till question.id.
if (import.meta.env?.DEV) {
  const seen = new Set<string>();
  for (const q of allQuestions) {
    if (seen.has(q.id)) {
      // eslint-disable-next-line no-console
      console.warn(`Dubblett av frågeId upptäckt: "${q.id}". Id:n måste vara unika.`);
    }
    seen.add(q.id);
  }
}
