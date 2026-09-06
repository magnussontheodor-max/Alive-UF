"use client";

import { createElement, useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// Entrance motion.
//
// Elements settle in as they enter the viewport, and are given their resting
// state immediately if the observer is unavailable or the reader prefers
// reduced motion. Nothing is ever left invisible waiting for an event.
// ---------------------------------------------------------------------------

export default function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: 0 | 1 | 2 | 3;
  className?: string;
  as?: "div" | "section" | "li";
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const classes = [
    "mk-rise",
    delay ? `mk-rise-delay-${delay}` : "",
    shown ? "mk-in" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // createElement rather than <Tag>, so the ref stays typed as HTMLElement
  // across the three permitted tags without a cast.
  return createElement(Tag, { ref, className: classes }, children);
}
