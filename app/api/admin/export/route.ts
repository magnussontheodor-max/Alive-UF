import { displayEmail, listSignups } from "@/lib/signups";
import { toCsv } from "@/lib/csv";
import { formatStockholm, formatStockholmDate } from "@/lib/time";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// GET /api/admin/export
//
// Behind the same Basic Auth as /admin — middleware.ts matches /api/admin too,
// so this cannot be fetched without the credentials.
//
// Timestamps are converted to Europe/Stockholm here, once, rather than left as
// UTC for a spreadsheet to guess at.
// ---------------------------------------------------------------------------

export async function GET() {
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

  return new Response(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="spark-signups-${label}.csv"`,
      "cache-control": "no-store",
    },
  });
}
