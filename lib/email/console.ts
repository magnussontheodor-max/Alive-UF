import type { EmailProvider, EmailMessage } from "./provider";

// ---------------------------------------------------------------------------
// The provider used when no keys are configured.
//
// It prints rather than sends. It deliberately does not resolve silently: a
// local run that appears to deliver mail teaches you the wrong thing about
// what production will do.
// ---------------------------------------------------------------------------

export const consoleProvider: EmailProvider = {
  name: "console",

  async send(message: EmailMessage): Promise<void> {
    console.info(
      `[email:console] Inget mejl skickades — BREVO_API_KEY/EMAIL_FROM saknas.\n` +
        `  till:   ${message.to}\n` +
        `  ämne:   ${message.subject}\n` +
        `  bilagor: ${(message.attachments ?? []).map((f) => f.name).join(", ") || "—"}\n` +
        `  text:\n${message.text.replace(/^/gm, "    ")}`
    );
  },
};
