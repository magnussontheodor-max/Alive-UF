import { emailFrom, brevoApiKey } from "@/lib/env";
import { QuotaExceededError, type EmailProvider, type EmailMessage } from "./provider";

// ---------------------------------------------------------------------------
// Brevo
//
// The transactional endpoint, called directly. Their SDK adds a dependency to
// do one POST, and swapping providers is meant to be cheap.
// ---------------------------------------------------------------------------

const ENDPOINT = "https://api.brevo.com/v3/smtp/email";

export const brevoProvider: EmailProvider = {
  name: "brevo",

  async send(message: EmailMessage): Promise<void> {
    const from = emailFrom();

    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "api-key": brevoApiKey(),
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: { email: from.email, name: from.name },
        to: [{ email: message.to }],
        subject: message.subject,
        htmlContent: message.html,
        textContent: message.text,
        ...(message.attachments?.length
          ? {
              attachment: message.attachments.map((file) => ({
                name: file.name,
                content: Buffer.from(file.content, "utf8").toString("base64"),
              })),
            }
          : {}),
      }),
      // Never let a hanging provider hold a serverless function open.
      signal: AbortSignal.timeout(10_000),
    });

    if (response.ok) return;

    const body = await response.text().catch(() => "");

    // 402 is Brevo's "not enough credits"; the daily ceiling on the free tier
    // surfaces as a 429. Both mean "try tomorrow", not "this message is bad".
    if (response.status === 402 || response.status === 429) {
      throw new QuotaExceededError(`Brevo ${response.status}: ${body.slice(0, 300)}`);
    }

    throw new Error(`Brevo ${response.status}: ${body.slice(0, 300)}`);
  },
};
