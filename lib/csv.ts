// ---------------------------------------------------------------------------
// CSV
//
// Written by hand rather than pulled from a package: the whole job is quoting.
//
// The leading-character guard is not paranoia. A cell beginning with =, +, -
// or @ is executed as a formula when the file is opened in Excel or Sheets, so
// an address like =cmd|'...'!A1 in a free-text field turns our own export into
// an attack on whoever opens it.
// ---------------------------------------------------------------------------

function cell(value: unknown): string {
  if (value === null || value === undefined) return "";

  let text = String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;

  return `"${text.replace(/"/g, '""')}"`;
}

export function toCsv(headers: string[], rows: unknown[][]): string {
  const lines = [headers.map(cell).join(","), ...rows.map((row) => row.map(cell).join(","))];
  // CRLF and a BOM, so Excel opens å, ä and ö correctly instead of as mojibake.
  return `﻿${lines.join("\r\n")}\r\n`;
}
