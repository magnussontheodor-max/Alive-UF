import Link from "next/link";
import SparkMark from "./SparkMark";

// On black, above the green block, never on it. Two links, no call to
// action: the page's only one is the field a few lines below.

const LINKS = [
  { href: "#steg", label: "Hur det fungerar" },
  { href: "#om", label: "Om Spark" },
];

export default function Nav() {
  return (
    <header className="b-nav">
      <div className="b-inner">
        <Link href="/" aria-label="Spark, till startsidan">
          <SparkMark />
        </Link>

        <nav className="b-navlinks" aria-label="Sidnavigering">
          {LINKS.map((link, i) => (
            <span key={link.href} className="b-navlinks">
              {i > 0 && (
                <span className="b-navsep" aria-hidden="true">
                  ·
                </span>
              )}
              <a href={link.href} className="b-navlink">
                {link.label}
              </a>
            </span>
          ))}
        </nav>
      </div>
    </header>
  );
}
