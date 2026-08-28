import type { Question } from '../types/question';
import { XYZ_ANSWER_LABELS, NOG_ANSWER_LABELS } from '../types/question';

export interface AnswerOption {
  key: string;
  label: string;
}

/** Normaliserar de olika frågetypernas svarsalternativ till en gemensam form. */
export function getOptionsForQuestion(question: Question): AnswerOption[] {
  switch (question.subTest) {
    case 'XYZ':
      return (Object.keys(XYZ_ANSWER_LABELS) as (keyof typeof XYZ_ANSWER_LABELS)[]).map(
        (key) => ({ key, label: XYZ_ANSWER_LABELS[key] }),
      );
    case 'NOG':
      return (Object.keys(NOG_ANSWER_LABELS) as (keyof typeof NOG_ANSWER_LABELS)[]).map(
        (key) => ({ key, label: NOG_ANSWER_LABELS[key] }),
      );
    case 'KVA':
    case 'DTK':
      return question.options.map((label, i) => ({
        key: String.fromCharCode(65 + i),
        label,
      }));
    default:
      return [];
  }
}

export function getCorrectKey(question: Question): string {
  if (question.subTest === 'XYZ' || question.subTest === 'NOG') {
    return question.correctAnswer;
  }
  return String.fromCharCode(65 + question.correctIndex);
}
