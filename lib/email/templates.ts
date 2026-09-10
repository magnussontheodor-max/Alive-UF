import { siteUrl } from "@/lib/env";
import { createToken } from "@/lib/tokens";

// ---------------------------------------------------------------------------
// Email content
//
// Same voice as the page: short, concrete, no exclamation marks and no promise
// we cannot keep. Every message goes out as both HTML and plain text, because
// a text/plain part is what stops a one-link email reading as spam — and some
// people genuinely read mail that way.
// ---------------------------------------------------------------------------

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!
  );
}

/** Wraps body content in the shell. Inline styles only — email clients strip
 *  everything else, and several ignore <style> blocks entirely. */
function shell(bodyHtml: string): string {
  return `<!doctype html>
<html lang="sv">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Spark</title>
</head>
<body style="margin:0;padding:0;background:#262B31;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#262B31;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
               style="max-width:520px;background:#262B31;">
          <tr>
            <td style="padding-bottom:28px;font-family:Helvetica,Arial,sans-serif;font-size:14px;
                       font-weight:700;letter-spacing:0.24em;color:#F0F2F3;text-transform:uppercase;">
              Spark.
            </td>
          </tr>
          ${bodyHtml}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export interface BuiltEmail {
  subject: string;
  html: string;
  text: string;
}

export function confirmationEmail(signupId: string): BuiltEmail {
  const unsubscribeUrl = `${siteUrl()}/api/unsubscribe?token=${encodeURIComponent(
    createToken("unsubscribe", signupId)
  )}`;
  const deleteUrl = `${siteUrl()}/api/delete-me?token=${encodeURIComponent(
    createToken("delete", signupId)
  )}`;
  const policyUrl = `${siteUrl()}/integritetspolicy`;

  const subject = "Du står på listan — Spark";

  const text = [
    "DU STÅR PÅ LISTAN.",
    "",
    "Tack. Vi hör av oss när Spark öppnar, hösten 2026, och skickar",
    "ingenting däremellan — inget nyhetsbrev, inga påminnelser.",
    "",
    "Har du skrivit vad du vill bygga så läser vi det. Det formar vad vi",
    "bygger först.",
    "",
    `Vill du bort från listan: ${unsubscribeUrl}`,
    `Vill du att vi raderar allt vi har om dig: ${deleteUrl}`,
    "",
    `Så hanterar vi uppgifterna: ${policyUrl}`,
  ].join("\n");

  const paragraph =
    "font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.7;color:#A9B4AE;margin:0 0 18px;";
  const small =
    "font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.7;color:#6B757D;margin:0 0 8px;";
  const link = "color:#F0F2F3;text-decoration:underline;";

  const html = shell(`
          <tr>
            <td>
              <h1 style="font-family:Helvetica,Arial,sans-serif;font-size:22px;line-height:1.25;
                         font-weight:700;letter-spacing:0.02em;color:#F0F2F3;margin:0 0 20px;
                         text-transform:uppercase;">
                Du står på listan.
              </h1>
              <p style="${paragraph}">
                Tack. Vi hör av oss när Spark öppnar, hösten 2026, och skickar ingenting
                däremellan — inget nyhetsbrev, inga påminnelser.
              </p>
              <p style="${paragraph}">
                Har du skrivit vad du vill bygga så läser vi det. Det formar vad vi bygger först.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding-top:24px;border-top:1px solid #343A41;">
              <p style="${small}">
                <a href="${escapeHtml(unsubscribeUrl)}" style="${link}">Ta bort mig från listan</a>
              </p>
              <p style="${small}">
                <a href="${escapeHtml(deleteUrl)}" style="${link}">Radera allt ni har om mig</a>
              </p>
              <p style="${small}">
                <a href="${escapeHtml(policyUrl)}" style="${link}">Så hanterar vi uppgifterna</a>
              </p>
            </td>
          </tr>`);

  return { subject, html, text };
}

/** The daily backup, sent to the admin address with the CSV inline. */
export function backupEmail(rowCount: number, dateLabel: string): BuiltEmail {
  const subject = `Spark — backup ${dateLabel} (${rowCount} signups)`;
  const text = [
    `Backup av signups, ${dateLabel} (Europe/Stockholm).`,
    `${rowCount} rader. CSV bifogad.`,
  ].join("\n");

  const html = shell(`
          <tr>
            <td>
              <p style="font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.7;
                        color:#A9B4AE;margin:0;">
                Backup av signups, ${escapeHtml(dateLabel)} (Europe/Stockholm).<br>
                ${rowCount} rader. CSV bifogad.
              </p>
            </td>
          </tr>`);

  return { subject, html, text };
}
