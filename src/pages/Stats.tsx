import React, { useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import { SUB_TEST_LABELS } from '../types/question';
import {
  computeSubTestStats,
  computeDailyStats,
  weakestTags,
  overallAccuracy,
} from '../lib/statsEngine';

export function Stats() {
  const { data, resetAll } = useProgress();
  const [confirmingReset, setConfirmingReset] = useState(false);

  const subTestStats = computeSubTestStats(data.attempts);
  const daily = computeDailyStats(data.attempts, 14);
  const weak = weakestTags(data.attempts, 2, 6);
  const accuracy = overallAccuracy(data.attempts);
  const maxDailyAttempts = Math.max(1, ...daily.map((d) => d.attempts));

  if (data.attempts.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Statistik</h1>
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          Du har inte besvarat några frågor än. Börja öva så dyker statistiken upp här.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Statistik</h1>
        <ResetButton
          confirming={confirmingReset}
          onRequestConfirm={() => setConfirmingReset(true)}
          onCancel={() => setConfirmingReset(false)}
          onConfirm={() => {
            resetAll();
            setConfirmingReset(false);
          }}
        />
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm text-slate-500">Totalt antal försök</div>
          <div className="mt-1 text-2xl font-bold text-slate-900">{data.attempts.length}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm text-slate-500">Träffsäkerhet totalt</div>
          <div className="mt-1 text-2xl font-bold text-slate-900">
            {Math.round(accuracy * 100)} %
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm text-slate-500">Unika frågor tränade</div>
          <div className="mt-1 text-2xl font-bold text-slate-900">
            {Object.keys(data.cards).length}
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Per delprov</h2>
        <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          {subTestStats.map((s) => (
            <div key={s.subTest}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-medium text-slate-700">{SUB_TEST_LABELS[s.subTest]}</span>
                <span className="text-slate-500">
                  {s.attempts > 0 ? `${Math.round(s.accuracy * 100)} % (${s.correct}/${s.attempts})` : 'Ej tränat'}
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-brand-500"
                  style={{ width: `${s.attempts > 0 ? s.accuracy * 100 : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Aktivitet, senaste 14 dagarna</h2>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-32 gap-1.5">
            {daily.map((d) => (
              <div key={d.date} className="group relative flex flex-1 flex-col justify-end">
                <div
                  className={`w-full rounded-t ${d.attempts > 0 ? 'bg-brand-500' : 'bg-slate-100'}`}
                  style={{ height: `${Math.max(4, (d.attempts / maxDailyAttempts) * 100)}%` }}
                />
                <div className="pointer-events-none absolute -top-9 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-xs text-white group-hover:block">
                  {d.date.slice(5)}: {d.attempts} frågor
                  {d.attempts > 0 ? `, ${Math.round(d.accuracy * 100)}% rätt` : ''}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-slate-400">
            <span>{daily[0]?.date.slice(5)}</span>
            <span>{daily[daily.length - 1]?.date.slice(5)}</span>
          </div>
        </div>
      </section>

      {weak.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-900">Svagaste områden</h2>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <ul className="divide-y divide-slate-100">
              {weak.map((t) => (
                <li key={t.tag} className="flex items-center justify-between py-2 text-sm">
                  <span className="font-medium text-slate-700">{t.tag}</span>
                  <span className="text-slate-500">
                    {Math.round(t.accuracy * 100)} % rätt ({t.correct}/{t.attempts})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}

function ResetButton({
  confirming,
  onRequestConfirm,
  onCancel,
  onConfirm,
}: {
  confirming: boolean;
  onRequestConfirm: () => void;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!confirming) {
    return (
      <button
        type="button"
        onClick={onRequestConfirm}
        className="text-sm font-medium text-slate-400 hover:text-red-500"
      >
        Nollställ statistik
      </button>
    );
  }
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-slate-600">Säker? Detta går inte att ångra.</span>
      <button
        type="button"
        onClick={onConfirm}
        className="rounded-md bg-red-600 px-3 py-1.5 font-medium text-white hover:bg-red-700"
      >
        Ja, nollställ
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="rounded-md border border-slate-300 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50"
      >
        Avbryt
      </button>
    </div>
  );
}
