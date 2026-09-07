import type { Metadata } from "next";
import { Chakra_Petch } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://spark.uf"),
  title: { default: title, template: "%s · Spark" },
  description,
  applicationName: "Spark",
  openGraph: {
    type: "website",
    locale: "sv_SE",
    siteName: "Spark",
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv" className={chakra.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
