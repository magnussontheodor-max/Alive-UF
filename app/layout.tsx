import type { Metadata } from "next";
import { Chakra_Petch } from "next/font/google";
import "./globals.css";
import { DemoProvider } from "@/components/DemoState";
import { Shell } from "@/components/Shell";

const chakra = Chakra_Petch({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-chakra",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Spark — AI-medgrundare",
  description:
    "Spark är en AI-medgrundare för svenska förstagångsentreprenörer, byggd på verklig svensk registerdata.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sv" className={chakra.variable}>
      <body className="antialiased">
        <DemoProvider>
          <Shell>{children}</Shell>
        </DemoProvider>
      </body>
    </html>
  );
}
