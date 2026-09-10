import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/env";

// The application behind /dashboard is one founder's private workspace and the
// admin area is behind Basic Auth; neither belongs in an index.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin", "/dashboard", "/founder", "/opportunities", "/memory",
                 "/assumptions", "/evidence", "/activity", "/research", "/validation",
                 "/product", "/task", "/settings", "/avregistrerad", "/raderad"],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
