import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/env";

// Only the two public pages. The confirmation pages are reachable by token
// only and the workspace is private.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const lastModified = new Date();

  return [
    { url: `${base}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    {
      url: `${base}/integritetspolicy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
