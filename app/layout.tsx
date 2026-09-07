import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Might: the display face for the public site. Condensed and uppercase-only,
// so it carries headlines, labels and controls but never running paragraphs.
//
// LICENCE: personal use only (app/fonts/Might-LICENCE.txt). A commercial
// licence must be bought from funtypefonts.com before launch. To swap it out,
// change this one declaration — everything reads it through --font-display.
const might = localFont({
  src: "./fonts/Might.ttf",
  variable: "--font-display",
  display: "swap",
  adjustFontFallback: false,
});

// The squarish, wide-tracked techno register of the reference specimen, used
// for the wordmark and the smallest labels only.
const techno = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-techno",
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
    <html lang="sv" className={`${inter.variable} ${might.variable} ${techno.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
