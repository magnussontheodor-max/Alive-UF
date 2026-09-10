"use client";

import { useId, useRef, useState } from "react";
import { track, readUtm } from "@/lib/analytics";

// ---------------------------------------------------------------------------
// The signup form
//
// Four states, and each one is visible: idle, loading (the button is disabled
// so a double click cannot post twice), success, error. Errors are Swedish
// sentences — the server never returns a stack trace and this never renders
// one.
//
// The email is checked here too, but only to fail fast and kindly. The check
// that counts runs on the server, because this one can be skipped entirely.
// ---------------------------------------------------------------------------

const EMAIL = /^[^@\s]+@[^@\s.]+\.[^@\s]{2,}$/u;
const IDEA_MAX = 500;

type State = "idle" | "loading" | "success" | "error";

export default function SignupForm() {
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [idea, setIdea] = useState("");
  const started = useRef(false);
  const id = useId();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "loading") return;

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();

    if (!EMAIL.test(email)) {
      setState("error");
      setMessage(email ? "Kontrollera e-postadressen." : "Skriv din e-postadress.");
      return;
    }

    setState("loading");
    setMessage(null);

    try {
      const utm = readUtm();
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          idea: String(form.get("idea") ?? "").trim() || undefined,
          source: utm.utmSource ?? undefined,
          // The honeypot. Hidden from people, irresistible to bots.
          company: String(form.get("company") ?? ""),
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | { status: "ok" }
        | { status: "error"; message?: string }
        | null;

      if (response.ok && data?.status === "ok") {
        setState("success");
        track({ name: "signup_completed" });
        return;
      }

      setState("error");
      setMessage(
        (data && "message" in data && data.message) ||
          "Anmälan kunde inte sparas just nu. Försök igen om en stund."
      );
    } catch {
      // A network failure, an offline browser, a blocked request. Never a
      // stack trace, never "TypeError: Failed to fetch".
      setState("error");
      setMessage("Ingen kontakt med servern. Kontrollera uppkopplingen och försök igen.");
    }
  }

  if (state === "success") {
    return (
      <div role="status" className="b-signup">
        <p className="b-done-label">Du står på listan</p>
        <p className="b-done-note mt-3">
          Vi hör av oss när Spark öppnar. Inget nyhetsbrev under tiden. Kolla skräpposten
          om bekräftelsen inte dyker upp.
        </p>
      </div>
    );
  }

  const loading = state === "loading";

  return (
    <form onSubmit={onSubmit} noValidate className="b-signup">
      <label htmlFor={`${id}-email`} className="sr-only">
        E-postadress
      </label>
      <div className="b-signup-row">
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder="Din e-postadress"
          disabled={loading}
          aria-invalid={state === "error" ? true : undefined}
          aria-describedby={message ? `${id}-fel` : undefined}
          onInput={() => {
            if (started.current) return;
            started.current = true;
            track({ name: "signup_form_started" });
          }}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Skickar" : "Få tidig tillgång"}
        </button>
      </div>

      <label htmlFor={`${id}-idea`} className="b-field-label">
        Vad vill du bygga? (frivilligt)
      </label>
      <textarea
        id={`${id}-idea`}
        name="idea"
        rows={3}
        maxLength={IDEA_MAX}
        disabled={loading}
        value={idea}
        onChange={(event) => setIdea(event.target.value.slice(0, IDEA_MAX))}
        className="b-textarea"
        placeholder="En mening räcker"
      />
      <p className="b-counter" aria-hidden="true">
        {idea.length} / {IDEA_MAX}
      </p>

      {/* Honeypot: off-screen rather than display:none, which some bots skip,
          and excluded from tab order and the accessibility tree. */}
      <div aria-hidden="true" className="b-honeypot">
        <label htmlFor={`${id}-company`}>Företag</label>
        <input id={`${id}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {message && (
        <p id={`${id}-fel`} role="alert" className="b-msg mt-3">
          {message}
        </p>
      )}

      <p className="b-microcopy">
        Vi sparar din e-postadress för att höra av oss vid lansering.{" "}
        <a href="/integritetspolicy" className="b-underline">
          Så hanterar vi uppgifterna
        </a>
        .
      </p>
    </form>
  );
}
