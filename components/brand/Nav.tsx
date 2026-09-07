"use client";

import { useState } from "react";
import Link from "next/link";
import SparkMark from "./SparkMark";

// Not a header bar: the navigation sits on the same left edge as everything
// else, with no rule under it. Two links and one action.

const LINKS = [
  { href: "#steg", label: "Hur det fungerar" },
  { href: "#om", label: "Om Spark" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header>
      <div className="b-shell">
        <div className="flex h-[68px] items-center justify-between gap-4">
          <Link href="/" aria-label="Spark, till startsidan">
            <SparkMark />
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Sidnavigering">
            {LINKS.map((link) => (
              <a key={link.href} href={link.href} className="b-link b-nav-link">
                {link.label}
              </a>
            ))}
            <a href="#anmalan" className="b-cta b-cta-sm">
              Få tidig tillgång
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobil-meny"
            className="b-nav-link md:hidden"
            style={{ color: "var(--ink)" }}
          >
            {open ? "Stäng" : "Meny"}
          </button>
        </div>
      </div>

      <div
        id="mobil-meny"
        hidden={!open}
        className="md:hidden"
        style={{ borderTop: "1px solid var(--rule)" }}
      >
        <div className="b-shell">
          <div className="flex flex-col items-start gap-5 py-6">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="b-nav-link text-[1.35rem]"
              >
                {link.label}
              </a>
            ))}
            <a href="#anmalan" onClick={() => setOpen(false)} className="b-cta mt-1">
              Få tidig tillgång
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
