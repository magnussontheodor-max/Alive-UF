import React, { useEffect, useMemo, useRef, useState } from 'react';
import { questionsBySubTest } from '../data/questions';
import { SUB_TEST_LABELS, type Question, type SubTest } from '../types/question';
import { useProgress } from '../context/ProgressContext';
import { shuffle } from '../lib/shuffle';
import { formatSeconds } from '../lib/formatTime';
import { QuestionPrompt } from '../components/QuestionPrompt';
import { AnswerOptions } from '../components/AnswerOptions';
import { MathText } from '../components/MathText';
import { getOptionsForQuestion, getCorrectKey } from '../lib/questionOptions';

const SUB_TESTS: SubTest[] = ['XYZ', 'KVA', 'NOG', 'DTK'];
const SECONDS_PER_QUESTION_DEFAULT = 90;

type Phase = 'setup' | 'running' | 'results';

export function ExamSimulation() {
  const { recordAttempt } = useProgress();
  const [selected, setSelected] = useState<Set<SubTest>>(new Set(SUB_TESTS));
  const [phase, setPhase] = useState<Phase>('setup');
  const [pool, setPool] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [index, setIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const submittedRef = useRef(false);

  const availableCount = SUB_TESTS.filter((s) => selected.has(s)).reduce(
    (sum, s) => sum + questionsBySubTest[s].length,
    0,
  );
  const [minutes, setMinutes] = useState(() =>
    Math.max(2, Math.round((availableCount * SECONDS_PER_QUESTION_DEFAULT) / 60)),
  );

  useEffect(() => {
    if (phase !== 'running') return;
    if (secondsLeft <= 0) {
      handleSubmit();
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, secondsLeft]);

  function toggleSubTest(s: SubTest) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next.size ? next : prev; // minst ett delprov måste vara valt
    });
  }

  function startExam() {
    const chosen = SUB_TESTS.filter((s) => selected.has(s));
    const combined = shuffle(chosen.flatMap((s) => questionsBySubTest[s]));
    if (combined.length === 0) return;
    setPool(combined);
    setAnswers({});
    setIndex(0);
    submittedRef.current = false;
    setSecondsLeft(Math.max(30, minutes * 60));
    setPhase('running');
  }

  function selectAnswer(questionId: string, key: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: key }));
  }

  function handleSubmit() {
    if (submittedRef.current) return;
    submittedRef.current = true;
    for (const q of pool) {
      const chosen = answers[q.id];
      if (!chosen) continue; // obesvarade frågor räknas inte som försök i statistiken
      recordAttempt(q, chosen === getCorrectKey(q), 'exam');
    }
    setPhase('results');
  }

  function restart() {
    setPhase('setup');
  }

  if (phase === 'setup') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Provsimulering</h1>
          <p className="mt-1 text-slate-600">
            Kör ett tidsbegränsat pass för att öva på provkänslan. Facit och förklaringar visas
            först när du lämnat in.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-semibold text-slate-900">Vilka delprov?</h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {SUB_TESTS.map((s) => (
              <label
                key={s}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50"
              >
                <input
                  type="checkbox"
                  checked={selected.has(s)}
                  onChange={() => toggleSubTest(s)}
                  className="h-4 w-4 accent-brand-600"
                />
                <span className="text-sm text-slate-800">
                  {SUB_TEST_LABELS[s]}{' '}
                  <span className="text-slate-400">({questionsBySubTest[s].length} frågor)</span>
                </span>
              </label>
            ))}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700">Tidsgräns (minuter)</label>
            <input
              type="number"
              min={1}
              value={minutes}
              onChange={(e) => setMinutes(Math.max(1, Number(e.target.value) || 1))}
              className="mt-1 w-28 rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
            />
            <p className="mt-1 text-xs text-slate-400">
              Ungefärlig standard: 1,5 min/fråga. Det riktiga provets tider kan skilja sig – justera
              gärna själv.
            </p>
          </div>

          <button
            type="button"
            onClick={startExam}
            disabled={availableCount === 0}
            className="mt-5 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Starta provpass ({availableCount} frågor)
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'running') {
    const question = pool[index];
    const options = getOptionsForQuestion(question);
    const answeredCount = Object.keys(answers).length;

    return (
      <div className="space-y-4">
        <div className="sticky top-0 z-10 -mx-4 flex items-center justify-between border-b border-slate-200 bg-slate-50/95 px-4 py-2 backdrop-blur">
          <span className="text-sm font-medium text-slate-600">
            Fråga {index + 1} av {pool.length} · {answeredCount} besvarade
          </span>
          <span
            className={`rounded-md px-2 py-1 font-mono text-sm font-semibold ${
              secondsLeft <= 30 ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-700'
            }`}
          >
            ⏱ {formatSeconds(secondsLeft)}
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <QuestionPrompt question={question} />
          <AnswerOptions
            options={options}
            selectedKey={answers[question.id] ?? null}
            revealed={false}
            onSelect={(key) => selectAnswer(question.id, key)}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={index === 0}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
            >
              ← Föregående
            </button>
            <button
              type="button"
              onClick={() => setIndex((i) => Math.min(pool.length - 1, i + 1))}
              disabled={index === pool.length - 1}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
            >
              Nästa →
            </button>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Lämna in provet
          </button>
        </div>

        <QuestionNav pool={pool} answers={answers} current={index} onJump={setIndex} />
      </div>
    );
  }

  // phase === 'results'
  const results = pool.map((q) => ({
    question: q,
    chosen: answers[q.id],
    correct: answers[q.id] === getCorrectKey(q),
  }));
  const answeredResults = results.filter((r) => r.chosen);
  const correctCount = answeredResults.filter((r) => r.correct).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Resultat</h1>
        <p className="mt-1 text-slate-600">
          Du fick <strong>{correctCount}</strong> rätt av <strong>{results.length}</strong> frågor (
          {answeredResults.length < results.length
            ? `${results.length - answeredResults.length} obesvarade`
            : 'alla besvarade'}
          ).
        </p>
        <button
          type="button"
          onClick={restart}
          className="mt-3 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Kör ett nytt pass
        </button>
      </div>

      <div className="space-y-4">
        {results.map(({ question, chosen }, i) => {
          const options = getOptionsForQuestion(question);
          const correctKey = getCorrectKey(question);
          return (
            <div key={question.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Fråga {i + 1} · {SUB_TEST_LABELS[question.subTest]}
              </div>
              <QuestionPrompt question={question} />
              <AnswerOptions
                options={options}
                selectedKey={chosen ?? null}
                correctKey={correctKey}
                revealed
                disabled
                onSelect={() => {}}
              />
              <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
                {!chosen && <div className="mb-1 font-semibold text-amber-600">Obesvarad</div>}
                <MathText text={question.explanation} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function QuestionNav({
  pool,
  answers,
  current,
  onJump,
}: {
  pool: Question[];
  answers: Record<string, string>;
  current: number;
  onJump: (i: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {pool.map((q, i) => {
        const answered = Boolean(answers[q.id]);
        const isCurrent = i === current;
        return (
          <button
            key={q.id}
            type="button"
            onClick={() => onJump(i)}
            className={`h-8 w-8 rounded-md text-xs font-semibold transition ${
              isCurrent
                ? 'bg-brand-600 text-white'
                : answered
                  ? 'bg-brand-100 text-brand-700'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {i + 1}
          </button>
        );
      })}
    </div>
  );
}
