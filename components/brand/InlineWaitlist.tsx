"use client";

import { useId, useRef, useState } from "react";
import { joinWaitlistAction } from "@/app/(marketing)/actions";
import { readUtm, track } from "@/lib/analytics";

// The only action on the page: one field beside one button, on the same left
// edge as the headline. The confirmation replaces the form rather than
// appearing beside it, so there is no ambiguity about whether it worked.

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
      <div role="status" className="max-w-[44rem]">
        <p className="b-label b-eyebrow">Du står på listan</p>
        <p className="b-body mt-3">
          {state === "already"
            ? "Adressen fanns redan på listan. Vi hör av oss när Spark öppnar."
            : "Vi hör av oss när Spark öppnar. Inget nyhetsbrev under tiden."}
        </p>
        <span
          aria-hidden="true"
          className="mt-6 block h-px w-16 origin-left"
          style={{
            background: "var(--accent)",
            animation: "growLine .7s cubic-bezier(.22,1,.36,1) forwards",
          }}
        />
      </div>
    );
  }

  const sending = state === "sending";

  return (
    <form onSubmit={onSubmit} noValidate>
      <label htmlFor={id} className="sr-only">
        E-postadress
      </label>
      <div className="b-signup-row">
        <input
          id={id}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Din e-postadress"
          disabled={sending}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-fel` : undefined}
          onInput={() => {
            if (started.current) return;
            started.current = true;
            track({ name: "waitlist_form_started", source });
          }}
          className="disabled:opacity-50"
        />
        <button type="submit" disabled={sending} className="b-cta">
          {sending ? "Skickar" : "Få tidig tillgång"}
        </button>
      </div>
      {error && (
        <p id={`${id}-fel`} className="mt-3 text-[0.85rem]" style={{ color: "var(--accent)" }}>
          {error}
        </p>
      )}
      {state === "error" && (
        <p role="alert" className="mt-3 text-[0.85rem]" style={{ color: "var(--accent)" }}>
          Anmälan kunde inte sparas just nu. Försök igen om en stund.
        </p>
      )}
    </form>
  );
}
