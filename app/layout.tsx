import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// The only face on the site. Weight and letter-spacing carry the whole
// hierarchy: heavy uppercase for headings, tracked uppercase for the small
// interface words, light sentence case for anything read as prose.
const inter = Inter({
  subsets: ["latin"],
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
    <html lang="sv" className={inter.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
