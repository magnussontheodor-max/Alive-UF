"use client";

import { createElement, useEffect, useRef, useState } from "react";

// Entry motion.
//
// A sweep on scroll rather than an IntersectionObserver: an observer only
// reports what is intersecting *now*, so anything scrolled past in one jump —
// an anchor link, a flick on a phone — would stay invisible for good. Readers
// who prefer reduced motion see everything immediately.

export default function Rise({
  children,
  delay,
  className = "",
  as = "div",
  id,
}: {
  children: React.ReactNode;
  delay?: 1 | 2 | 3 | 4;
  className?: string;
  as?: "div" | "section" | "header" | "li" | "p" | "ol";
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }

    let pending = false;

    const stop = () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };

    function sweep() {
      pending = false;
      if (!node || node.getBoundingClientRect().top >= window.innerHeight * 0.94) return;
      setShown(true);
      stop();
    }

    function schedule() {
      if (pending) return;
      pending = true;
      requestAnimationFrame(sweep);
    }

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return stop;
  }, []);

  return createElement(
    as,
    {
      ref,
      id,
      "data-shown": shown,
      className: ["b-rise", delay ? `b-d${delay}` : "", className].filter(Boolean).join(" "),
    },
    children
  );
}
