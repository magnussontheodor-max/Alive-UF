import React, { useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import { allQuestions } from '../data/questions';
import { QuizSession } from '../components/QuizSession';

/**
 * Spaced repetition-läge: visar bara frågor vars SM-2-kort är "due" (dvs.
 * aldrig besvarade tidigare, eller vars repetitionsintervall har gått ut).
 *
 * Kön "fryses" när sidan öppnas (istället för att räknas om varje gång ett
 * svar registreras) – annars skulle just besvarade frågor försvinna ur
 * listan mitt i sessionen och rendera om den slumpade ordningen.
 */
export function Review() {
  const { getDueQuestions } = useProgress();
  const [dueQuestions] = useState(() => getDueQuestions(allQuestions));

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Repetition</h1>
        <p className="mt-1 text-slate-600">
          Frågor du missat tidigare (eller aldrig sett) dyker upp här enligt ett
          spaced repetition-schema, så att du repeterar i rätt tid för att fastna i minnet.
        </p>
      </div>
      <QuizSession
        questions={dueQuestions}
        mode="review"
        title="Repetition"
        emptyMessage="Inget att repetera just nu – bra jobbat! Kom tillbaka senare eller öva fritt under 'Öva'."
      />
    </div>
  );
}
