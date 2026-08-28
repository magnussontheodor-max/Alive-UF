import React from 'react';
import { Link } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { allQuestions, questionsBySubTest } from '../data/questions';
import { SUB_TEST_LABELS, SUB_TEST_SHORT_DESCRIPTIONS, type SubTest } from '../types/question';
import { overallAccuracy, computeSubTestStats } from '../lib/statsEngine';

const SUB_TESTS: SubTest[] = ['XYZ', 'KVA', 'NOG', 'DTK'];

export function Home() {
  const { data, dueCount } = useProgress();
  const accuracy = overallAccuracy(data.attempts);
  const subTestStats = computeSubTestStats(data.attempts);
  const totalDue = dueCount(allQuestions);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold text-slate-900">Hej! 👋</h1>
        <p className="mt-1 text-slate-600">
          Öva på den kvantitativa delen av Högskoleprovet: XYZ, KVA, NOG och DTK.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Besvarade frågor" value={String(data.attempts.length)} />
        <StatCard
          label="Träffsäkerhet totalt"
          value={data.attempts.length ? `${Math.round(accuracy * 100)} %` : '–'}
        />
        <StatCard
          label="Att repetera nu"
          value={String(totalDue)}
          accent={totalDue > 0}
          action={
            totalDue > 0 ? (
              <Link to="/repetition" className="text-sm font-medium text-brand-600 hover:underline">
                Repetera →
              </Link>
            ) : undefined
          }
        />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Delprov</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {SUB_TESTS.map((st) => {
            const stats = subTestStats.find((s) => s.subTest === st);
            const count = questionsBySubTest[st].length;
            return (
              <Link
                key={st}
                to={`/ova/${st.toLowerCase()}`}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand-300 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">{SUB_TEST_LABELS[st]}</h3>
                  <span className="text-xs text-slate-400">{count} frågor</span>
                </div>
                <p className="mt-1 text-sm text-slate-600">{SUB_TEST_SHORT_DESCRIPTIONS[st]}</p>
                {stats && stats.attempts > 0 && (
                  <p className="mt-2 text-xs font-medium text-slate-500">
                    {Math.round(stats.accuracy * 100)} % rätt på {stats.attempts} försök
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="rounded-xl border border-brand-100 bg-brand-50 p-4">
        <h2 className="font-semibold text-brand-900">Redo för en provkänsla?</h2>
        <p className="mt-1 text-sm text-brand-800">
          Kör en tidsbegränsad provsimulering som efterliknar ett riktigt provpass.
        </p>
        <Link
          to="/prov"
          className="mt-3 inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Starta provsimulering
        </Link>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
  action,
}: {
  label: string;
  value: string;
  accent?: boolean;
  action?: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-xl border p-4 shadow-sm ${
        accent ? 'border-brand-300 bg-brand-50' : 'border-slate-200 bg-white'
      }`}
    >
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-bold text-slate-900">{value}</div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
