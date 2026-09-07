import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Chakra_Petch } from "next/font/google";
import { siteUrl, umami } from "@/lib/env";
import "./globals.css";

// The only face on the site. Every word is uppercase, so weight and
// letter-spacing carry the whole hierarchy: short labels take extreme
// tracking, running sentences never more than 0.13em.
const chakra = Chakra_Petch({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const title = "Spark — Din AI-medgrundare för att starta företag";
const description =
  "Spark hjälper dig från idé till validerad möjlighet och första digitala produkt — steg för steg.";

export const viewport: Viewport = {
  themeColor: "#08090A",
  colorScheme: "dark",
};

// The OG image is not listed here: app/opengraph-image.tsx is picked up
// automatically for every route, so a hard-coded url would only be a second
// source of truth to forget to update.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: title, template: "%s · Spark" },
  description,
  applicationName: "Spark",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "sv_SE",
    url: siteUrl(),
    siteName: "Spark",
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const analytics = umami();

  return (
    <html lang="sv" className={chakra.variable}>
      <body className="font-sans antialiased">
        {children}

        {/* Cookie-free and self-hosted, so there is nothing to ask consent for
            and no banner on the site. Rendered only when both variables are
            set; without them the page simply has no analytics. */}
        {analytics && (
          <Script
            src={analytics.src}
            data-website-id={analytics.websiteId}
            strategy="afterInteractive"
            defer
          />
        )}
      </body>
    </html>
  );
}
