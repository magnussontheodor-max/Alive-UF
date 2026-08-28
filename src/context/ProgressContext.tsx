import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ProgressData, AnswerMode, CardState } from '../types/progress';
import type { Question, SubTest } from '../types/question';
import { loadProgress, saveProgress, resetProgress } from '../lib/storage';
import { scheduleNext, isDue } from '../lib/spacedRepetition';

interface ProgressContextValue {
  data: ProgressData;
  recordAttempt: (question: Question, correct: boolean, mode: AnswerMode) => void;
  getCardState: (questionId: string) => CardState | undefined;
  getDueQuestions: (questions: Question[]) => Question[];
  dueCount: (questions: Question[]) => number;
  resetAll: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<ProgressData>(() => loadProgress());

  const persist = useCallback((next: ProgressData) => {
    setData(next);
    saveProgress(next);
  }, []);

  const recordAttempt = useCallback(
    (question: Question, correct: boolean, mode: AnswerMode) => {
      setData((prev) => {
        const now = new Date();
        const nextCard = scheduleNext(prev.cards[question.id], question.id, correct, now);
        const next: ProgressData = {
          ...prev,
          cards: { ...prev.cards, [question.id]: nextCard },
          attempts: [
            ...prev.attempts,
            {
              questionId: question.id,
              subTest: question.subTest,
              correct,
              timestamp: now.toISOString(),
              mode,
              tags: question.tags,
            },
          ],
        };
        saveProgress(next);
        return next;
      });
    },
    [],
  );

  const getCardState = useCallback((questionId: string) => data.cards[questionId], [data]);

  const getDueQuestions = useCallback(
    (questions: Question[]) => questions.filter((q) => isDue(data.cards[q.id])),
    [data],
  );

  const dueCount = useCallback(
    (questions: Question[]) => getDueQuestions(questions).length,
    [getDueQuestions],
  );

  const resetAll = useCallback(() => {
    resetProgress();
    setData(loadProgress());
  }, []);

  const value = useMemo<ProgressContextValue>(
    () => ({ data, recordAttempt, getCardState, getDueQuestions, dueCount, resetAll }),
    [data, recordAttempt, getCardState, getDueQuestions, dueCount, resetAll],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress måste användas inom en <ProgressProvider>');
  return ctx;
}

/** Hjälpfunktion: filtrera frågor per delprov. */
export function bySubTest(questions: Question[], subTest: SubTest): Question[] {
  return questions.filter((q) => q.subTest === subTest);
}
