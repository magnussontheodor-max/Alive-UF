"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/** Reports the page view once. No provider is attached yet, so this is a no-op
 *  until one is — the call site is what matters. */
export default function PageView({ path }: { path: string }) {
  useEffect(() => {
    track({ name: "page_view", path });
  }, [path]);
  return null;
}
