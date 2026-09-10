import { supabaseAdmin } from "@/lib/supabase/admin";
import { emailDailyQuota, isDatabaseConfigured } from "@/lib/env";
import { nextQuotaWindow } from "@/lib/time";
import { QuotaExceededError, sendEmail, type EmailMessage } from "./provider";

// ---------------------------------------------------------------------------
// The outbound queue
//
// Two rules drive this file:
//
//   A signup must never fail because email failed. The row is already saved by
//   the time anything here runs, and every function below swallows its own
//   errors after logging them.
//
//   A message that could not be sent must not disappear. Everything is written
//   to email_queue first and only marked sent afterwards, so the free tier's
//   300/day ceiling defers mail to tomorrow instead of losing it.
// ---------------------------------------------------------------------------

const MAX_ATTEMPTS = 5;

export interface QueuedEmail {
  id: string;
  to_email: string;
  subject: string;
  html: string;
  text_body: string;
  attempts: number;
}

/** Writes the message to the queue. Returns its id, or null if it could not
 *  even be queued — which is logged, never thrown at the caller. */
export async function enqueueEmail(message: EmailMessage): Promise<string | null> {
  if (!isDatabaseConfigured()) return null;

  try {
    const { data, error } = await supabaseAdmin()
      .from("email_queue")
      .insert({
        to_email: message.to,
        subject: message.subject,
        html: message.html,
        text_body: message.text,
      })
      .select("id")
      .single();

    if (error) {
      console.error("[email-queue] kunde inte köa", error.message);
      return null;
    }
    return data.id as string;
  } catch (error) {
    console.error("[email-queue] oväntat fel vid köning", error);
    return null;
  }
}

async function markSent(id: string): Promise<void> {
  await supabaseAdmin()
    .from("email_queue")
    .update({ status: "sent", sent_at: new Date().toISOString() })
    .eq("id", id);
}

async function markFailure(id: string, previousAttempts: number, error: unknown): Promise<void> {
  const attempts = previousAttempts + 1;
  const quota = error instanceof QuotaExceededError;
  const message = error instanceof Error ? error.message : String(error);

  // Hitting the daily ceiling is not this message's fault, so it does not
  // count as an attempt — it is simply scheduled after the counter resets.
  await supabaseAdmin()
    .from("email_queue")
    .update({
      attempts: quota ? previousAttempts : attempts,
      last_error: message.slice(0, 500),
      status: !quota && attempts >= MAX_ATTEMPTS ? "failed" : "pending",
      send_after: quota ? nextQuotaWindow().toISOString() : new Date().toISOString(),
    })
    .eq("id", id);
}

/**
 * Tries to deliver one queued message immediately, so the common case is a
 * confirmation that arrives while the visitor is still on the page. A failure
 * here is not an error for the caller: the row stays pending and the daily
 * drain picks it up.
 */
export async function tryDeliverNow(id: string | null, message: EmailMessage): Promise<boolean> {
  if (!id) {
    // Nothing was queued (no database). Attempt anyway so a local run still
    // exercises the provider, and report honestly whether it worked.
    try {
      await sendEmail(message);
      return true;
    } catch (error) {
      console.error("[email-queue] direktutskick misslyckades", error);
      return false;
    }
  }

  try {
    await sendEmail(message);
    await markSent(id);
    return true;
  } catch (error) {
    console.error("[email-queue] direktutskick misslyckades, ligger kvar i kön", error);
    await markFailure(id, 0, error).catch(() => {});
    return false;
  }
}

export interface DrainResult {
  attempted: number;
  sent: number;
  deferred: number;
  failed: number;
}

/**
 * Sends what is waiting, up to the day's remaining allowance. Stops at the
 * first quota refusal: once the provider says the day is spent, every further
 * attempt in this run would be refused too.
 */
export async function drainEmailQueue(limit = emailDailyQuota()): Promise<DrainResult> {
  const result: DrainResult = { attempted: 0, sent: 0, deferred: 0, failed: 0 };
  if (!isDatabaseConfigured()) return result;

  const { data, error } = await supabaseAdmin()
    .from("email_queue")
    .select("id, to_email, subject, html, text_body, attempts")
    .eq("status", "pending")
    .lte("send_after", new Date().toISOString())
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("[email-queue] kunde inte läsa kön", error.message);
    return result;
  }

  for (const row of (data ?? []) as QueuedEmail[]) {
    result.attempted += 1;
    try {
      await sendEmail({
        to: row.to_email,
        subject: row.subject,
        html: row.html,
        text: row.text_body,
      });
      await markSent(row.id);
      result.sent += 1;
    } catch (error) {
      await markFailure(row.id, row.attempts, error);
      if (error instanceof QuotaExceededError) {
        result.deferred += 1;
        console.warn("[email-queue] dygnskvoten är slut, resten skickas i morgon");
        break;
      }
      result.failed += 1;
      console.error(`[email-queue] misslyckades för ${row.id}`, error);
    }
  }

  return result;
}
