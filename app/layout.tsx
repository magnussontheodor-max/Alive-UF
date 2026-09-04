import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { getCurrentStartup } from "@/lib/current";
import { backendMode } from "@/data";
import { reasoningMode } from "@/ai";
import { getStage } from "@/domain";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Every page reads the signed-in founder's own startup, so nothing here may be
// statically prerendered — a cached page would serve one founder's memory to
// everyone. Applies to all nested routes.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Spark UF",
  description:
    "An intelligent co-founder for first-time entrepreneurs in Sweden. Understands your startup, tracks what is known and unknown, and tells you what to do next.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const startup = await getCurrentStartup();

  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <div className="flex min-h-screen">
          <Sidebar
            startupName={startup?.name ?? null}
            stage={startup ? getStage(startup.stage).label : null}
            isDemo={startup?.isDemo ?? false}
          />
          <div className="flex min-w-0 flex-1 flex-col">
            <TopBar mode={backendMode()} reasoning={reasoningMode()} />
            <main className="min-w-0 flex-1">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
