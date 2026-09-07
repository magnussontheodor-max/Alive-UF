// ---------------------------------------------------------------------------
// Email provider
//
// Every send in the codebase goes through sendEmail(). Nothing that calls it
// knows which service is behind it. Moving to Amazon SES later means adding
// one file next to brevo.ts and changing EMAIL_PROVIDER — no calling code is
// touched, and no import needs to be found and rewritten.
// ---------------------------------------------------------------------------

export interface EmailAttachment {
  /** Filename as the recipient will see it. */
  name: string;
  /** Raw content; the provider handles the base64 encoding. */
  content: string;
}

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text: string;
  attachments?: EmailAttachment[];
}

export interface EmailProvider {
  readonly name: string;
  send(message: EmailMessage): Promise<void>;
}

/**
 * Thrown when the provider refuses because the account's daily allowance is
 * spent. The queue treats this differently from a real failure: the message
 * is not a failure, it is simply not today's.
 */
export class QuotaExceededError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "QuotaExceededError";
  }
}

let override: EmailProvider | null = null;

/** Test seam. Pass null to restore the configured provider. */
export function setEmailProvider(provider: EmailProvider | null): void {
  override = provider;
}

export async function getEmailProvider(): Promise<EmailProvider> {
  if (override) return override;

  const { emailProviderName, isEmailConfigured } = await import("@/lib/env");

  // A local checkout with no keys still runs the whole flow; the message is
  // printed instead of sent, so nothing silently pretends to have delivered.
  if (!isEmailConfigured()) {
    const { consoleProvider } = await import("./console");
    return consoleProvider;
  }

  switch (emailProviderName()) {
    case "brevo": {
      const { brevoProvider } = await import("./brevo");
      return brevoProvider;
    }
    default:
      throw new Error(
        `Okänd EMAIL_PROVIDER: ${emailProviderName()}. Giltiga värden: brevo.`
      );
  }
}

export async function sendEmail(message: EmailMessage): Promise<void> {
  const provider = await getEmailProvider();
  await provider.send(message);
}
