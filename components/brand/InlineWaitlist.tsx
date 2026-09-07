"use client";

import { useId, useRef, useState } from "react";
import { joinWaitlistAction } from "@/app/(marketing)/actions";
import { readUtm, track } from "@/lib/analytics";

// The single action in the opening frame: one field beside one button, as in
// the references. The full form lower down asks for a first name as well.

export default function InlineWaitlist({ source = "hero" }: { source?: string }) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "already" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);
  const id = useId();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") ?? "");
    setState("sending");
    setError(null);

    try {
      const result = await joinWaitlistAction({ email, source, ...readUtm() });
      if (result.status === "invalid") {
        setError(result.fieldErrors.email ?? "Kontrollera e-postadressen.");
        setState("idle");
        return;
      }
      if (result.status === "failed") {
        setState("error");
        track({ name: "waitlist_submitted", source, outcome: "failed" });
        return;
      }
      const already = result.status === "already_on_list";
      setState(already ? "already" : "done");
      track({ name: "waitlist_submitted", source, outcome: already ? "already_on_list" : "added" });
    } catch {
      setState("error");
      track({ name: "waitlist_submitted", source, outcome: "failed" });
    }
  }

  if (state === "done" || state === "already") {
    return (
      <p role="status" className="text-[1.05rem]" style={{ color: "var(--ink)" }}>
        Du är med.{" "}
        <span style={{ color: "var(--ink-soft)" }}>
          {state === "already"
            ? "Adressen fanns redan på listan."
            : "Vi hör av oss när Spark öppnar."}
        </span>
      </p>
    );
  }

  const sending = state === "sending";

  return (
    <form onSubmit={onSubmit} noValidate className="w-full max-w-[30rem]">
      <label htmlFor={id} className="sr-only">
        E-postadress
      </label>
      <div
        className="flex items-center gap-3 pb-3"
        style={{ borderBottom: `1px solid ${error ? "var(--ember)" : "var(--rule)"}` }}
      >
        <input
          id={id}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="din@epost.se"
          disabled={sending}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-fel` : undefined}
          onInput={() => {
            if (started.current) return;
            started.current = true;
            track({ name: "waitlist_form_started", source });
          }}
          className="min-w-0 flex-1 bg-transparent text-[1.05rem] outline-none placeholder:text-[var(--ink-faint)] disabled:opacity-50"
          style={{ color: "var(--ink)" }}
        />
        <button type="submit" disabled={sending} className="b-cta b-cta-sm shrink-0">
          {sending ? "Skickar" : "Få tidig tillgång"}
        </button>
      </div>
      {error && (
        <p id={`${id}-fel`} className="mt-2.5 text-[0.8125rem]" style={{ color: "var(--ember)" }}>
          {error}
        </p>
      )}
      {state === "error" && (
        <p role="alert" className="mt-2.5 text-[0.8125rem]" style={{ color: "var(--ember)" }}>
          Anmälan kunde inte sparas just nu. Försök igen om en stund.
        </p>
      )}
    </form>
  );
}
