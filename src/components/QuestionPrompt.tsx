import React from 'react';
import type { Question } from '../types/question';
import { MathText } from './MathText';

function TableView({ table }: { table: NonNullable<Question['table']> }) {
  const [header, ...rows] = table.rows;
  return (
    <div className="mb-4 overflow-x-auto rounded-lg border border-slate-200">
      {table.caption && (
        <div className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600">
          {table.caption}
        </div>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-100">
            {header.map((cell, i) => (
              <th key={i} className="px-3 py-2 text-left font-semibold text-slate-700">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
              {row.map((cell, ci) => (
                <td key={ci} className="px-3 py-2 text-slate-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Visar frågans "innehåll" (tabell/bild/prompt/ev. I & II eller utsagor) utan svarsalternativ. */
export function QuestionPrompt({ question }: { question: Question }) {
  return (
    <div>
      {question.table && <TableView table={question.table} />}
      {question.imageUrl && (
        <img
          src={question.imageUrl}
          alt="Diagram/karta till frågan"
          className="mb-4 max-h-80 w-full rounded-lg border border-slate-200 object-contain"
        />
      )}
      <div className="mb-4 text-lg font-medium leading-relaxed text-slate-900">
        <MathText text={question.prompt} />
      </div>

      {question.subTest === 'XYZ' && (
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">I</div>
            <MathText text={question.quantityI} />
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">II</div>
            <MathText text={question.quantityII} />
          </div>
        </div>
      )}

      {question.subTest === 'NOG' && (
        <div className="mb-4 space-y-2">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <span className="mr-2 font-semibold text-slate-500">(1)</span>
            <MathText text={question.statement1} />
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <span className="mr-2 font-semibold text-slate-500">(2)</span>
            <MathText text={question.statement2} />
          </div>
        </div>
      )}
    </div>
  );
}
