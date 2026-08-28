import React from 'react';
import { MathText } from './MathText';
import type { AnswerOption } from '../lib/questionOptions';

interface AnswerOptionsProps {
  options: AnswerOption[];
  selectedKey: string | null;
  correctKey?: string;
  /** Om true visas rätt/fel-färgning (facit). */
  revealed: boolean;
  disabled?: boolean;
  onSelect: (key: string) => void;
}

export function AnswerOptions({
  options,
  selectedKey,
  correctKey,
  revealed,
  disabled,
  onSelect,
}: AnswerOptionsProps) {
  return (
    <div className="space-y-2" role="radiogroup">
      {options.map((opt) => {
        const isSelected = selectedKey === opt.key;
        const isCorrect = revealed && correctKey === opt.key;
        const isWrongSelected = revealed && isSelected && correctKey !== opt.key;

        let stateClass = 'border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50/40';
        if (isCorrect) {
          stateClass = 'border-emerald-500 bg-emerald-50';
        } else if (isWrongSelected) {
          stateClass = 'border-red-400 bg-red-50';
        } else if (revealed && isSelected) {
          stateClass = 'border-brand-400 bg-brand-50';
        } else if (!revealed && isSelected) {
          stateClass = 'border-brand-500 bg-brand-50 ring-1 ring-brand-300';
        }

        return (
          <button
            key={opt.key}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={disabled}
            onClick={() => onSelect(opt.key)}
            className={`w-full rounded-lg border px-4 py-3 text-left transition disabled:cursor-default ${stateClass}`}
          >
            <span className="mr-2 font-semibold text-slate-500">{opt.key}.</span>
            <MathText text={opt.label} />
            {isCorrect && <span className="ml-2 text-emerald-600">✓</span>}
            {isWrongSelected && <span className="ml-2 text-red-500">✗</span>}
          </button>
        );
      })}
    </div>
  );
}
