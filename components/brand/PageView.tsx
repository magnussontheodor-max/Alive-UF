"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/** Reports the view once. The sink is a no-op until a provider is connected. */
export default function PageView({ path }: { path: string }) {
  useEffect(() => {
    track({ name: "page_view", path });
  }, [path]);
  return null;
}
