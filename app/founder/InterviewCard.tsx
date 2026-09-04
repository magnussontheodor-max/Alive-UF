"use client";

import { useRef } from "react";
import { InterviewQuestion } from "@/agents/interview";
import { IconSpark } from "@/components/icons";

// ---------------------------------------------------------------------------
// One question at a time.
//
// Each question shows why it is being asked. That is not decoration — a
// founder who understands why a question matters gives a much better answer,
// and it keeps the system honest about what it does with the information.
// ---------------------------------------------------------------------------

export default function InterviewCard({
  question,
  action,
}: {
  question: InterviewQuestion;
  action: (formData: FormData) => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={(formData) => {
        action(formData);
        formRef.current?.reset();
      }}
      className="card p-6 md:p-8"
    >
      <input type="hidden" name="questionId" value={question.id} />
      <input type="hidden" name="targetId" value={question.targetId ?? ""} />

      {question.targetLabel && (
        <p className="mb-3 text-[12px] text-ink-400">
          About: <span className="text-ink-600">{question.targetLabel}</span>
        </p>
      )}

      <h3 className="max-w-xl text-[18px] font-semibold leading-snug tracking-tight text-ink-950">
        {question.question}
      </h3>

      <div className="mt-2.5 flex items-start gap-2">
        <IconSpark className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-400" />
        <p className="max-w-xl text-[12.5px] leading-relaxed text-ink-500">{question.why}</p>
      </div>

      {question.helpText && (
        <p className="mt-3 max-w-xl text-[12.5px] leading-relaxed text-ink-400">
          {question.helpText}
        </p>
      )}

      <div className="mt-6 max-w-xl">
        <QuestionInput question={question} />
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          type="submit"
          className="inline-flex items-center rounded-full bg-ink-950 px-5 py-2.5 text-[13.5px] font-medium text-paper transition-colors hover:bg-ink-800"
        >
          Continue
        </button>
        {question.optional && (
          <button
            type="submit"
            name="skip"
            value="true"
            className="text-[12.5px] text-ink-500 underline underline-offset-2 hover:text-ink-800"
          >
            Skip this
          </button>
        )}
      </div>
    </form>
  );
}

function QuestionInput({ question }: { question: InterviewQuestion }) {
  const base =
    "w-full rounded-xl border border-ink-100 px-4 py-2.5 text-[13.5px] outline-none transition-shadow focus:border-accent-400 focus:ring-2 focus:ring-accent-100";

  if (question.kind === "select") {
    return (
      <div className="flex flex-col gap-2">
        {question.options?.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-ink-100 px-4 py-3 transition-colors hover:border-ink-200"
          >
            <input
              type="radio"
              name="answer"
              value={option.value}
              required={!question.optional}
              className="h-4 w-4 accent-[#5B67E8]"
            />
            <span className="text-[13.5px] text-ink-800">{option.label}</span>
          </label>
        ))}
      </div>
    );
  }

  if (question.kind === "list") {
    return (
      <textarea
        name="answer"
        rows={5}
        placeholder={question.placeholder}
        className={`${base} resize-y`}
      />
    );
  }

  if (question.kind === "longtext") {
    return (
      <textarea
        name="answer"
        rows={4}
        placeholder={question.placeholder}
        className={`${base} resize-y`}
      />
    );
  }

  if (question.kind === "number") {
    return (
      <input
        type="number"
        name="answer"
        min={0}
        required={!question.optional}
        placeholder={question.placeholder}
        className={base}
      />
    );
  }

  return (
    <input
      type="text"
      name="answer"
      required={!question.optional}
      placeholder={question.placeholder}
      className={base}
      autoComplete="off"
    />
  );
}
