"use client";

import { useState } from "react";
import Link from "next/link";
import SparkMark from "./SparkMark";

// Deliberately not a header bar: a hairline, the wordmark, two links and one
// small action. On mobile everything but the wordmark folds behind MENU.

const LINKS = [
  { href: "#sa-fungerar-det", label: "Hur det fungerar" },
  { href: "#om-spark", label: "Om Spark" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-md"
      style={{ background: "color-mix(in srgb, var(--paper) 86%, transparent)" }}
    >
      <div className="b-shell">
        <div
          className="flex h-[72px] items-center justify-between"
          style={{ borderBottom: "1px solid var(--rule)" }}
        >
          <Link href="/" aria-label="Spark, till startsidan">
            <SparkMark />
          </Link>

          <nav className="hidden items-center gap-9 sm:flex" aria-label="Sidnavigering">
            {LINKS.map((link) => (
              <a key={link.href} href={link.href} className="b-link text-[0.875rem]">
                {link.label}
              </a>
            ))}
            <a href="#tidig-tillgang" className="b-cta b-cta-sm">
              Få tidig tillgång
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobil-meny"
            className="b-label sm:hidden"
            style={{ color: "var(--ink)" }}
          >
            {open ? "Stäng" : "Meny"}
          </button>
        </div>
      </div>

      <div
        id="mobil-meny"
        hidden={!open}
        className="sm:hidden"
        style={{ borderBottom: "1px solid var(--rule)", background: "var(--paper)" }}
      >
        <div className="b-shell flex flex-col gap-5 py-7">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-[1.25rem] tracking-[-0.02em]"
            >
              {link.label}
            </a>
          ))}
          <a href="#tidig-tillgang" onClick={() => setOpen(false)} className="b-cta mt-1 self-start">
            Få tidig tillgång
          </a>
        </div>
      </div>
    </header>
  );
}
