"use client";

import { useId, useRef, useState } from "react";
import { joinWaitlistAction } from "@/app/(marketing)/actions";
import { readUtm, track } from "@/lib/analytics";

// The page's only action, inside the green block. Field and button share one
// fill and one radius; only the text colour separates them.

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
      <div role="status" className="b-signup">
        <p className="b-done-label">Du står på listan</p>
        <p className="b-done-note mt-3">
          {state === "already"
            ? "Adressen fanns redan på listan. Vi hör av oss när Spark öppnar."
            : "Vi hör av oss när Spark öppnar. Inget nyhetsbrev under tiden."}
        </p>
      </div>
    );
  }

  const sending = state === "sending";

  return (
    <form onSubmit={onSubmit} noValidate className="b-signup">
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
        />
        <button type="submit" disabled={sending}>
          {sending ? "Skickar" : "Få tidig tillgång"}
        </button>
      </div>
      {error && (
        <p id={`${id}-fel`} className="b-msg mt-3">
          {error}
        </p>
      )}
      {state === "error" && (
        <p role="alert" className="b-msg mt-3">
          Anmälan kunde inte sparas just nu. Försök igen om en stund.
        </p>
      )}
    </form>
  );
}
