import type { Metadata } from "next";
import { countSignups, displayEmail, listSignups } from "@/lib/signups";
import { daysAgo, formatStockholm } from "@/lib/time";
import { isDatabaseConfigured } from "@/lib/env";

// Reads live data on every request, and must never be prerendered or cached.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: { absolute: "Admin · Spark" },
  robots: { index: false, follow: false },
};

// ---------------------------------------------------------------------------
// /admin
//
// Behind HTTP Basic Auth, enforced in middleware.ts. This is a server
// component: the rows are fetched with the service role key and rendered to
// HTML on the server, so neither the key nor the addresses ever exist as data
// in the browser.
//
// Every timestamp is run through formatStockholm. The database stores UTC.
// ---------------------------------------------------------------------------

export default async function AdminPage() {
  if (!isDatabaseConfigured()) {
    return (
      <main style={{ padding: 32, fontFamily: "system-ui, sans-serif" }}>
        <h1>Admin</h1>
        <p>
          Databasen är inte konfigurerad. Sätt <code>NEXT_PUBLIC_SUPABASE_URL</code> och{" "}
          <code>SUPABASE_SERVICE_ROLE_KEY</code>.
        </p>
      </main>
    );
  }

  const [total, lastWeek, rows] = await Promise.all([
    countSignups(),
    countSignups(daysAgo(7)),
    listSignups(1000),
  ]);

  const cell: React.CSSProperties = {
    padding: "10px 12px",
    borderBottom: "1px solid #23262b",
    verticalAlign: "top",
    fontSize: 13,
  };
  const head: React.CSSProperties = {
    ...cell,
    textAlign: "left",
    fontWeight: 600,
    color: "#9aa2ad",
    borderBottom: "1px solid #333940",
    whiteSpace: "nowrap",
  };

  return (
    <main
      style={{
        padding: "32px 24px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        background: "#0d0f12",
        color: "#e8eaed",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <header
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            alignItems: "baseline",
            justifyContent: "space-between",
          }}
        >
          <h1 style={{ fontSize: 20, margin: 0 }}>Spark — signups</h1>
          <a
            href="/api/admin/export"
            style={{
              fontSize: 13,
              color: "#0d0f12",
              background: "#24f08b",
              padding: "8px 14px",
              borderRadius: 3,
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Exportera CSV
          </a>
        </header>

        <div style={{ display: "flex", gap: 32, margin: "28px 0" }}>
          <div>
            <p style={{ margin: 0, fontSize: 12, color: "#9aa2ad" }}>Totalt</p>
            <p style={{ margin: "4px 0 0", fontSize: 32, fontWeight: 600 }}>{total}</p>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 12, color: "#9aa2ad" }}>Senaste 7 dygnen</p>
            <p style={{ margin: "4px 0 0", fontSize: 32, fontWeight: 600 }}>{lastWeek}</p>
          </div>
        </div>

        <p style={{ fontSize: 12, color: "#9aa2ad", marginBottom: 8 }}>
          Alla tider visas i Europe/Stockholm. Databasen lagrar UTC.
          {rows.length >= 1000 && " Visar de 1000 senaste — hämta resten via CSV-exporten."}
        </p>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={head}>E-post</th>
                <th style={head}>Vad vill du bygga?</th>
                <th style={head}>Datum</th>
                <th style={head}>Källa</th>
                <th style={head}>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td style={{ ...cell, color: "#9aa2ad" }} colSpan={5}>
                    Inga anmälningar än.
                  </td>
                </tr>
              )}
              {rows.map((row) => (
                <tr key={row.id}>
                  <td style={cell}>{displayEmail(row.email)}</td>
                  <td style={{ ...cell, maxWidth: 420, whiteSpace: "pre-wrap" }}>
                    {row.idea ?? <span style={{ color: "#5c636b" }}>—</span>}
                  </td>
                  <td style={{ ...cell, whiteSpace: "nowrap" }}>
                    {formatStockholm(row.created_at)}
                  </td>
                  <td style={cell}>{row.source ?? <span style={{ color: "#5c636b" }}>—</span>}</td>
                  <td style={cell}>
                    {row.unsubscribed ? (
                      <span style={{ color: "#e0a33a" }}>avregistrerad</span>
                    ) : (
                      <span style={{ color: "#5c636b" }}>aktiv</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
