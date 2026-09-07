"use client";

import { useState } from "react";
import Link from "next/link";
import SparkMark from "./SparkMark";

// Two links and a hairline. No call to action up here: the only one on the
// page is the field in the opening, a few lines below.

const LINKS = [
  { href: "#steg", label: "Hur det fungerar" },
  { href: "#om", label: "Om Spark" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header>
      <div className="b-shell">
        <div
          className="flex h-16 items-center justify-between gap-4"
          style={{ borderBottom: "1px solid var(--rule)" }}
        >
          <Link href="/" aria-label="Spark, till startsidan">
            <SparkMark />
          </Link>

          <nav className="hidden items-center gap-4 sm:flex" aria-label="Sidnavigering">
            {LINKS.map((link, i) => (
              <span key={link.href} className="flex items-center gap-4">
                {i > 0 && (
                  <span aria-hidden="true" className="text-[0.72rem]" style={{ color: "var(--ink-faint)" }}>
                    ·
                  </span>
                )}
                <a href={link.href} className="b-nav-link">
                  {link.label}
                </a>
              </span>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobil-meny"
            className="b-nav-link sm:hidden"
          >
            {open ? "Stäng" : "Meny"}
          </button>
        </div>
      </div>

      <div
        id="mobil-meny"
        hidden={!open}
        className="sm:hidden"
        style={{ borderBottom: "1px solid var(--rule)" }}
      >
        <div className="b-shell">
          <div className="flex flex-col items-start gap-5 py-6">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="b-nav-link text-[0.85rem]"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
