"use client";

import { useId, useRef, useState } from "react";
import { joinWaitlistAction, type WaitlistResult } from "@/app/(marketing)/actions";
import { readUtm, track } from "@/lib/analytics";

// ---------------------------------------------------------------------------
// Waitlist form
//
// First name and email, and nothing else. Every extra field is a reason not to
// sign up, and none of the others would be used before launch anyway.
//
// The result is never faked: if the write fails the reader is told, and being
// already on the list is reported as the good news it is rather than an error.
// ---------------------------------------------------------------------------

type State =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "done"; already: boolean }
  | { kind: "error"; message: string };

export default function WaitlistForm({
  source,
  size = "default",
}: {
  source: string;
  size?: "default" | "compact";
}) {
  const [state, setState] = useState<State>({ kind: "idle" });
  const [fieldErrors, setFieldErrors] = useState<{ firstName?: string; email?: string }>({});
  const startedRef = useRef(false);
  const nameId = useId();
  const emailId = useId();

  function noteStart() {
    if (startedRef.current) return;
    startedRef.current = true;
    track({ name: "waitlist_form_started", source });
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const firstName = String(form.get("firstName") ?? "");
    const email = String(form.get("email") ?? "");

    setState({ kind: "submitting" });
    setFieldErrors({});

    let result: WaitlistResult;
    try {
      result = await joinWaitlistAction({ firstName, email, source, ...readUtm() });
    } catch {
      setState({
        kind: "error",
        message: "Anmälan gick inte fram. Kontrollera din uppkoppling och försök igen.",
      });
      track({ name: "waitlist_submitted", source, outcome: "failed" });
      return;
    }

    if (result.status === "invalid") {
      setFieldErrors(result.fieldErrors);
      setState({ kind: "idle" });
      return;
    }
    if (result.status === "failed") {
      setState({
        kind: "error",
        message: "Anmälan kunde inte sparas just nu. Försök igen om en stund.",
      });
      track({ name: "waitlist_submitted", source, outcome: "failed" });
      return;
    }

    const already = result.status === "already_on_list";
    setState({ kind: "done", already });
    track({ name: "waitlist_submitted", source, outcome: already ? "already_on_list" : "added" });
  }

  if (state.kind === "done") {
    return (
      <div
        role="status"
        className="rounded-2xl border border-good-100 bg-good-50 px-5 py-5 text-center"
      >
        <p className="text-[16px] font-semibold text-ink-950">
          {state.already ? "Du är redan med. 🚀" : "Du är med. 🚀"}
        </p>
        <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-ink-600">
          {state.already
            ? "Den här adressen står redan på listan. Vi hör av oss innan lanseringen."
            : "Vi hör av oss när Spark öppnar. Inga nyhetsbrev under tiden."}
        </p>
      </div>
    );
  }

  const submitting = state.kind === "submitting";
  const compact = size === "compact";

  return (
    <form onSubmit={onSubmit} noValidate className="w-full">
      <div className={compact ? "flex flex-col gap-2.5 sm:flex-row" : "grid gap-3 sm:grid-cols-2"}>
        <Field
          id={nameId}
          name="firstName"
          label="Förnamn"
          autoComplete="given-name"
          placeholder="Förnamn"
          error={fieldErrors.firstName}
          disabled={submitting}
          onInput={noteStart}
          hideLabel={compact}
        />
        <Field
          id={emailId}
          name="email"
          type="email"
          label="E-post"
          autoComplete="email"
          inputMode="email"
          placeholder="din@epost.se"
          error={fieldErrors.email}
          disabled={submitting}
          onInput={noteStart}
          hideLabel={compact}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className={`mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink-950 px-6 py-3 text-[14.5px] font-medium text-paper transition-all duration-200 hover:bg-ink-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 disabled:opacity-60 ${
          compact ? "sm:w-auto" : ""
        }`}
      >
        {submitting && (
          <span
            aria-hidden="true"
            className="h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] border-paper/30 border-t-paper"
          />
        )}
        {submitting ? "Skickar…" : "Gå med i väntelistan"}
      </button>

      {state.kind === "error" && (
        <p role="alert" className="mt-3 text-[12.5px] leading-relaxed text-warn-600">
          {state.message}
        </p>
      )}

      <p className="mt-3 text-[11.5px] leading-relaxed text-ink-400">
        Vi använder din adress för att höra av oss om Spark. Inget annat.
      </p>
    </form>
  );
}

function Field({
  id,
  name,
  label,
  error,
  hideLabel,
  ...props
}: {
  id: string;
  name: string;
  label: string;
  error?: string;
  hideLabel?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const errorId = `${id}-error`;
  return (
    <div className="min-w-0 flex-1">
      <label
        htmlFor={id}
        className={hideLabel ? "sr-only" : "mb-1.5 block text-[12px] font-medium text-ink-600"}
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`w-full rounded-xl border bg-white px-4 py-3 text-[14px] text-ink-900 outline-none transition-shadow placeholder:text-ink-300 focus:border-accent-400 focus:ring-2 focus:ring-accent-100 disabled:opacity-60 ${
          error ? "border-warn-500" : "border-ink-200"
        }`}
        {...props}
      />
      {error && (
        <p id={errorId} className="mt-1.5 text-[11.5px] text-warn-600">
          {error}
        </p>
      )}
    </div>
  );
}
