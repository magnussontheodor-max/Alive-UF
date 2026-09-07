"use client";

import { useId, useRef, useState } from "react";
import { joinWaitlistAction, type WaitlistResult } from "@/app/(marketing)/actions";
import { readUtm, track } from "@/lib/analytics";

// Two fields, because every additional one is a reason not to sign up.
// The outcome is never faked: a failed write says so, and an address already
// on the list is reported as the good news it is.

type State =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "done"; already: boolean }
  | { kind: "error" };

export default function Waitlist({ source = "landing" }: { source?: string }) {
  const [state, setState] = useState<State>({ kind: "idle" });
  const [errors, setErrors] = useState<{ firstName?: string; email?: string }>({});
  const started = useRef(false);
  const nameId = useId();
  const mailId = useId();

  function noteStart() {
    if (started.current) return;
    started.current = true;
    track({ name: "waitlist_form_started", source });
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setState({ kind: "sending" });
    setErrors({});

    let result: WaitlistResult;
    try {
      result = await joinWaitlistAction({
        firstName: String(data.get("firstName") ?? ""),
        email: String(data.get("email") ?? ""),
        source,
        ...readUtm(),
      });
    } catch {
      setState({ kind: "error" });
      track({ name: "waitlist_submitted", source, outcome: "failed" });
      return;
    }

    if (result.status === "invalid") {
      setErrors(result.fieldErrors);
      setState({ kind: "idle" });
      return;
    }
    if (result.status === "failed") {
      setState({ kind: "error" });
      track({ name: "waitlist_submitted", source, outcome: "failed" });
      return;
    }

    const already = result.status === "already_on_list";
    setState({ kind: "done", already });
    track({ name: "waitlist_submitted", source, outcome: already ? "already_on_list" : "added" });
  }

  if (state.kind === "done") {
    return (
      <div role="status" className="py-2">
        <p className="b-h2" style={{ color: "var(--ink)" }}>
          Du är med.
        </p>
        <p className="b-lead mt-4 max-w-[38ch]">
          {state.already
            ? "Den här adressen fanns redan på listan. Vi hör av oss innan lanseringen."
            : "Vi hör av oss när Spark öppnar. Inget nyhetsbrev under tiden."}
        </p>
        <span
          aria-hidden="true"
          className="mt-8 block h-px w-16 origin-left animate-[growLine_.7s_cubic-bezier(.22,1,.36,1)_forwards]"
          style={{ background: "var(--ember)" }}
        />
      </div>
    );
  }

  const sending = state.kind === "sending";

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
        <Field
          id={nameId}
          name="firstName"
          label="Förnamn"
          autoComplete="given-name"
          disabled={sending}
          error={errors.firstName}
          onInput={noteStart}
        />
        <Field
          id={mailId}
          name="email"
          type="email"
          inputMode="email"
          label="E-post"
          autoComplete="email"
          disabled={sending}
          error={errors.email}
          onInput={noteStart}
        />
      </div>

      <div className="mt-9 flex flex-wrap items-center gap-5">
        <button type="submit" className="b-cta" disabled={sending}>
          {sending && (
            <span
              aria-hidden="true"
              className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent opacity-60"
            />
          )}
          {sending ? "Skickar" : "Få tidig tillgång"}
        </button>
        <p className="b-body text-[0.8125rem]">Förnamn och e-post. Inget mer.</p>
      </div>

      {state.kind === "error" && (
        <p role="alert" className="mt-5 text-[0.875rem]" style={{ color: "var(--ember)" }}>
          Anmälan kunde inte sparas just nu. Försök igen om en stund.
        </p>
      )}
    </form>
  );
}

/** A ruled input rather than a boxed one: the line is the field. */
function Field({
  id,
  label,
  error,
  ...props
}: { id: string; label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const errorId = `${id}-fel`;
  return (
    <div className="min-w-0 flex-1">
      <label htmlFor={id} className="b-label block">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className="mt-3 w-full bg-transparent pb-3 text-[1.125rem] outline-none transition-colors placeholder:text-[var(--ink-faint)] disabled:opacity-50"
        style={{
          borderBottom: `1px solid ${error ? "var(--ember)" : "var(--rule)"}`,
          color: "var(--ink)",
        }}
        onFocus={(e) => (e.currentTarget.style.borderBottomColor = "var(--ink)")}
        onBlur={(e) =>
          (e.currentTarget.style.borderBottomColor = error ? "var(--ember)" : "var(--rule)")
        }
        {...props}
      />
      {error && (
        <p id={errorId} className="mt-2 text-[0.8125rem]" style={{ color: "var(--ember)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
