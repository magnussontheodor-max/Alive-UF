import React, { useEffect, useMemo, useState } from 'react';
import type { Question } from '../types/question';
import type { AnswerMode } from '../types/progress';
import { useProgress } from '../context/ProgressContext';
import { QuestionPrompt } from './QuestionPrompt';
import { AnswerOptions } from './AnswerOptions';
import { MathText } from './MathText';
import { getOptionsForQuestion, getCorrectKey } from '../lib/questionOptions';
import { shuffle } from '../lib/shuffle';

interface QuizSessionProps {
  questions: Question[];
  mode: AnswerMode;
  /** Visas ovanför frågan, t.ex. "Fråga 3 av 10". */
  title?: string;
  emptyMessage?: string;
  onFinished?: () => void;
}

/**
 * Delad övningsvy för både fri övning och repetitionsläge: en fråga i
 * taget, direkt facit och förklaring, knapp för nästa fråga.
 */
export function QuizSession({ questions, mode, title, emptyMessage, onFinished }: QuizSessionProps) {
  const { recordAttempt } = useProgress();
  const order = useMemo(() => shuffle(questions), [questions]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    setIndex(0);
    setSelected(null);
    setRevealed(false);
    setSessionStats({ correct: 0, total: 0 });
  }, [order]);

  if (order.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
        {emptyMessage ?? 'Inga frågor tillgängliga just nu.'}
      </div>
    );
  }

  const question = order[index];
  const options = getOptionsForQuestion(question);
  const correctKey = getCorrectKey(question);
  const isLast = index === order.length - 1;

  function handleSelect(key: string) {
    if (revealed) return;
    setSelected(key);
    setRevealed(true);
    const correct = key === correctKey;
    setSessionStats((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
    recordAttempt(question, correct, mode);
  }

  function handleNext() {
    if (isLast) {
      onFinished?.();
      // Starta om med ny slumpad ordning på samma frågeurval.
      setIndex(0);
      setSelected(null);
      setRevealed(false);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setRevealed(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>
          {title ?? 'Fråga'} {index + 1} av {order.length}
        </span>
        {sessionStats.total > 0 && (
          <span>
            {sessionStats.correct}/{sessionStats.total} rätt denna session
          </span>
        )}
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-brand-500 transition-all"
          style={{ width: `${((index + (revealed ? 1 : 0)) / order.length) * 100}%` }}
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <QuestionPrompt question={question} />
        <AnswerOptions
          options={options}
          selectedKey={selected}
          correctKey={correctKey}
          revealed={revealed}
          disabled={revealed}
          onSelect={handleSelect}
        />

        {revealed && (
          <div className="mt-4 rounded-lg bg-slate-50 p-4">
            <div
              className={`mb-1 font-semibold ${
                selected === correctKey ? 'text-emerald-600' : 'text-red-500'
              }`}
            >
              {selected === correctKey ? 'Rätt svar! ✅' : 'Fel svar ❌'}
            </div>
            <div className="text-sm text-slate-700">
              <MathText text={question.explanation} />
            </div>
            <button
              type="button"
              onClick={handleNext}
              className="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              {isLast ? 'Klar – börja om' : 'Nästa fråga →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
