import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { questionsBySubTest } from '../data/questions';
import { SUB_TEST_LABELS, type SubTest } from '../types/question';
import { QuizSession } from '../components/QuizSession';

const VALID_SLUGS: Record<string, SubTest> = { xyz: 'XYZ', kva: 'KVA', nog: 'NOG', dtk: 'DTK' };

export function PracticeSession() {
  const { subTest } = useParams<{ subTest: string }>();
  const key = subTest ? VALID_SLUGS[subTest.toLowerCase()] : undefined;

  if (!key) {
    return <Navigate to="/ova" replace />;
  }

  const questions = questionsBySubTest[key];

  return (
    <div className="space-y-4">
      <div>
        <Link to="/ova" className="text-sm text-brand-600 hover:underline">
          ← Alla delprov
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">{SUB_TEST_LABELS[key]}</h1>
      </div>
      <QuizSession
        questions={questions}
        mode="practice"
        title="Fråga"
        emptyMessage="Det finns inga frågor för det här delprovet ännu. Lägg till egna i src/data/questions (se CONTENT.md)."
      />
    </div>
  );
}
