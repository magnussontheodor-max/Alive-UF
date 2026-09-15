"use client";

/* Panelens egna färger är hårdkodade. Den får aldrig läsa de tokens
   den styr — annars blir den oläslig så fort man ändrar paletten. */
export const P = {
  yta: "#15181C",
  yta2: "#1C2126",
  yta3: "#242A31",
  kant: "#2E353D",
  text: "#E8ECEF",
  text2: "#9AA6B2",
  text3: "#6B7682",
  accent: "#5B9DD9",
  ok: "#5FBF8F",
  bad: "#E07A6B",
};

export function Rad({
  etikett, hoger, children, htmlFor,
}: { etikett: string; hoger?: React.ReactNode; children?: React.ReactNode; htmlFor?: string }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8, marginBottom: 5 }}>
        <label htmlFor={htmlFor} style={{ fontSize: 11, color: P.text2 }}>{etikett}</label>
        {hoger ? <span style={{ fontSize: 10.5, color: P.text3, fontVariantNumeric: "tabular-nums" }}>{hoger}</span> : null}
      </div>
      {children}
    </div>
  );
}

export function Reglage({
  varde, min, max, step, onChange, onCommit, id,
}: {
  varde: number; min: number; max: number; step: number;
  onChange: (v: number) => void; onCommit?: () => void; id?: string;
}) {
  return (
    <input
      id={id}
      type="range"
      min={min}
      max={max}
      step={step}
      value={varde}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      onMouseUp={onCommit}
      onTouchEnd={onCommit}
      style={{ width: "100%", accentColor: P.accent, height: 18, cursor: "pointer" }}
    />
  );
}

export function Knapp({
  children, onClick, variant = "tyst", disabled, titel, full,
}: {
  children: React.ReactNode; onClick?: () => void;
  variant?: "primar" | "tyst" | "fara"; disabled?: boolean; titel?: string; full?: boolean;
}) {
  const stil: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
    padding: "6px 10px", borderRadius: 5, fontSize: 11.5, lineHeight: 1.2,
    border: `1px solid ${variant === "primar" ? P.accent : P.kant}`,
    background: variant === "primar" ? P.accent : "transparent",
    color: variant === "primar" ? "#0B1520" : variant === "fara" ? P.bad : P.text,
    opacity: disabled ? 0.4 : 1,
    cursor: disabled ? "not-allowed" : "pointer",
    width: full ? "100%" : undefined,
    fontFamily: "inherit",
  };
  return (
    <button type="button" onClick={onClick} disabled={disabled} title={titel} style={stil}>
      {children}
    </button>
  );
}

export function Falt({
  varde, onChange, placeholder, mono,
}: { varde: string; onChange: (v: string) => void; placeholder?: string; mono?: boolean }) {
  return (
    <input
      value={varde}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%", padding: "5px 8px", borderRadius: 5, border: `1px solid ${P.kant}`,
        background: P.yta2, color: P.text, fontSize: 11.5,
        fontFamily: mono ? "ui-monospace, SFMono-Regular, Menlo, monospace" : "inherit",
        outline: "none",
      }}
    />
  );
}

export function Valj({
  varde, val, onChange, id,
}: { varde: string; val: { v: string; t: string }[]; onChange: (v: string) => void; id?: string }) {
  return (
    <select
      id={id}
      value={varde}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%", padding: "5px 8px", borderRadius: 5, border: `1px solid ${P.kant}`,
        background: P.yta2, color: P.text, fontSize: 11.5, fontFamily: "inherit", outline: "none",
      }}
    >
      {val.map((o) => (
        <option key={o.v} value={o.v}>{o.t}</option>
      ))}
    </select>
  );
}

export function Vaxel({
  pa, onChange, etikett,
}: { pa: boolean; onChange: (v: boolean) => void; etikett: string }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!pa)}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
        width: "100%", padding: "7px 9px", borderRadius: 5, border: `1px solid ${P.kant}`,
        background: P.yta2, color: P.text, fontSize: 11.5, fontFamily: "inherit",
        cursor: "pointer", marginBottom: 6,
      }}
    >
      <span>{etikett}</span>
      <span style={{
        width: 28, height: 16, borderRadius: 999, flex: "0 0 28px",
        background: pa ? P.accent : P.yta3, position: "relative", transition: "background .15s",
      }}>
        <span style={{
          position: "absolute", top: 2, left: pa ? 14 : 2, width: 12, height: 12,
          borderRadius: 999, background: "#fff", transition: "left .15s",
        }} />
      </span>
    </button>
  );
}

export function Grupp({ titel, children }: { titel: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 18 }}>
      <h4 style={{
        margin: "0 0 10px", fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase",
        color: P.text3, fontWeight: 600,
      }}>{titel}</h4>
      {children}
    </section>
  );
}
