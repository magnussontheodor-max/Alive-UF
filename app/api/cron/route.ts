import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { adminEmail, cronSecret, isDatabaseConfigured } from "@/lib/env";
import { drainEmailQueue } from "@/lib/email/queue";
import { sendEmail } from "@/lib/email/provider";
import { backupEmail } from "@/lib/email/templates";
import { displayEmail, listSignups } from "@/lib/signups";
import { toCsv } from "@/lib/csv";
import { formatStockholm, formatStockholmDate } from "@/lib/time";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Draining the queue can take a while; the default 10s is not enough.
export const maxDuration = 60;

// ---------------------------------------------------------------------------
// GET /api/cron
//
// Vercel's free plan allows exactly one cron job, so this route is the whole
// scheduler: three jobs run in order, and each is isolated so a failure in one
// does not stop the next.
//
//   1. Keepalive — a free-tier Supabase project pauses after 7 days of
//      inactivity, which would take the signup form down after one quiet week.
//   2. Drain the queue — anything deferred by yesterday's 300/day ceiling.
//   3. Backup — the whole table as CSV, mailed to the admin address.
//
// Protected by a shared secret in a header. Vercel Cron sends its own
// Authorization: Bearer header, which is accepted too.
// ---------------------------------------------------------------------------

function authorised(request: Request): boolean {
  let expected: string;
  try {
    expected = cronSecret();
  } catch {
    // No secret configured means the route stays shut rather than open.
    return false;
  }

  const header =
    request.headers.get("x-cron-secret") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    "";

  const a = Buffer.from(header);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

async function keepalive(): Promise<string> {
  if (!isDatabaseConfigured()) return "hoppade över (ingen databas)";
  const { error } = await supabaseAdmin()
    .from("signups")
    .select("id", { count: "exact", head: true });
  if (error) throw new Error(error.message);
  return "ok";
}

async function backup(): Promise<string> {
  const rows = await listSignups(10_000);
  const label = formatStockholmDate(new Date());

  const csv = toCsv(
    ["id", "email", "idé", "källa", "bekräftad", "avregistrerad", "skapad (Europe/Stockholm)"],
    rows.map((row) => [
      row.id,
      displayEmail(row.email),
      row.idea ?? "",
      row.source ?? "",
      row.confirmed ? "ja" : "nej",
      row.unsubscribed ? "ja" : "nej",
      formatStockholm(row.created_at),
    ])
  );

  const message = backupEmail(rows.length, label);
  await sendEmail({
    to: adminEmail(),
    subject: message.subject,
    html: message.html,
    text: message.text,
    attachments: [{ name: `spark-signups-${label}.csv`, content: csv }],
  });

  return `${rows.length} rader`;
}

export async function GET(request: Request) {
  if (!authorised(request)) {
    return NextResponse.json({ status: "forbidden" }, { status: 401 });
  }

  const startedAt = new Date();
  const results: Record<string, unknown> = {};

  // Each job is caught on its own. A backup that fails must not stop the
  // keepalive that stops the database being suspended.
  for (const [name, job] of [
    ["keepalive", keepalive],
    ["email_queue", async () => drainEmailQueue()],
    ["backup", backup],
  ] as const) {
    try {
      results[name] = await job();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[cron] ${name} misslyckades: ${message}`);
      results[name] = { error: message };
    }
  }

  console.info(`[cron] kördes ${formatStockholm(startedAt)} (Europe/Stockholm)`, results);

  return NextResponse.json({
    status: "ok",
    ranAt: formatStockholm(startedAt),
    timezone: "Europe/Stockholm",
    results,
  });
}
