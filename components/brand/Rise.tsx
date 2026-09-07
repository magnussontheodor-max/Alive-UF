"use client";

import { createElement, useEffect, useRef, useState } from "react";

// Entry motion. Elements settle in on scroll, and are shown immediately when
// the reader prefers reduced motion or the observer is unavailable — nothing
// is ever left invisible waiting for an event.

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
  as?: "div" | "section" | "header" | "li" | "p";
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      typeof IntersectionObserver === "undefined"
    ) {
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
      { rootMargin: "0px 0px -10% 0px", threshold: 0.04 }
    );
    observer.observe(node);
    return () => observer.disconnect();
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
