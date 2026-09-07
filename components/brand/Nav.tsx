"use client";

import { useState } from "react";
import Link from "next/link";
import SparkMark from "./SparkMark";

// Not a header bar: the navigation sits inside the opening frame, as it does
// in the references. Two links, one action, a hairline under it.

const LINKS = [
  { href: "#sa-fungerar-det", label: "Hur det fungerar" },
  { href: "#om-spark", label: "Om Spark" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
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
            <a key={link.href} href={link.href} className="b-link b-nav-link">
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

      <div id="mobil-meny" hidden={!open} className="sm:hidden">
        <div
          className="flex flex-col gap-5 py-7"
          style={{ borderBottom: "1px solid var(--rule)" }}
        >
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
          <a href="#tidig-tillgang" onClick={() => setOpen(false)} className="b-cta mt-1 self-start">
            Få tidig tillgång
          </a>
        </div>
      </div>
    </div>
  );
}
