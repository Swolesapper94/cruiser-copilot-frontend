import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Disclaimer } from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "Cruiser Copilot",
  description:
    "Evidence-driven diagnostic assistant for Toyota Land Cruiser 70 and 80 Series diesel engines.",
};

export const viewport: Viewport = {
  themeColor: "#07080A",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-4 pb-16 pt-6 sm:px-6">
          <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="h-8 w-1.5 rounded-full bg-technical" aria-hidden />
              <div>
                <p className="text-base font-semibold tracking-tight">
                  Cruiser Copilot
                </p>
                <p className="text-xs text-shop-muted">
                  70 &amp; 80 Series diesel — 1HZ / 1HD-T
                </p>
              </div>
            </div>
            <p className="label-caps">Evidence before answers</p>
          </header>

          <main className="flex-1">{children}</main>

          <Disclaimer />
        </div>
      </body>
    </html>
  );
}
