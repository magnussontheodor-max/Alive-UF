import React from 'react';
import { Link } from 'react-router-dom';
import { questionsBySubTest } from '../data/questions';
import { SUB_TEST_LABELS, SUB_TEST_SHORT_DESCRIPTIONS, type SubTest } from '../types/question';

const SUB_TESTS: SubTest[] = ['XYZ', 'KVA', 'NOG', 'DTK'];

export function PracticeIndex() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Öva</h1>
      <p className="text-slate-600">Välj vilket delprov du vill träna på.</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {SUB_TESTS.map((st) => (
          <Link
            key={st}
            to={`/ova/${st.toLowerCase()}`}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand-300 hover:shadow-md"
          >
            <h3 className="font-semibold text-slate-900">{SUB_TEST_LABELS[st]}</h3>
            <p className="mt-1 text-sm text-slate-600">{SUB_TEST_SHORT_DESCRIPTIONS[st]}</p>
            <p className="mt-2 text-xs text-slate-400">{questionsBySubTest[st].length} frågor</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
