// ---------------------------------------------------------------------------
// Time
//
// Everything is stored in UTC (timestamptz). Every human-facing rendering —
// the admin table, the CSV export, log lines — goes through here and is
// converted to Europe/Stockholm explicitly.
//
// This is deliberately not left to the runtime's default zone. Vercel runs in
// UTC and a laptop does not, so an implicit conversion means the numbers we
// read during launch week differ depending on where they are read, by one or
// two hours depending on the season.
// ---------------------------------------------------------------------------

export const TIMEZONE = "Europe/Stockholm";

function parse(value: Date | string): Date {
  return value instanceof Date ? value : new Date(value);
}

/** "2026-09-07 18:01" in Stockholm time. Sortable, unambiguous, no seconds. */
export function formatStockholm(value: Date | string): string {
  const date = parse(value);
  if (Number.isNaN(date.getTime())) return "";

  const parts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}`;
}

/** Date only, for grouping and for the backup filename. */
export function formatStockholmDate(value: Date | string): string {
  return formatStockholm(value).slice(0, 10);
}

/** The UTC instant N days before now, for "signups in the last 7 days". */
export function daysAgo(days: number): Date {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

/**
 * The next instant the provider's daily counter will have reset, expressed in
 * UTC. Brevo's quota rolls over at midnight UTC, so a message deferred because
 * the quota is spent is scheduled for the start of the next UTC day.
 */
export function nextQuotaWindow(from: Date = new Date()): Date {
  const next = new Date(from);
  next.setUTCHours(24, 0, 0, 0);
  return next;
}
