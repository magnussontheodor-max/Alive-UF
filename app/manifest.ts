import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Spark — din AI-medgrundare",
    short_name: "Spark",
    description:
      "Spark hjälper dig från första idén till något människor faktiskt vill ha.",
    lang: "sv",
    start_url: "/",
    display: "standalone",
    background_color: "#262B31",
    theme_color: "#262B31",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
