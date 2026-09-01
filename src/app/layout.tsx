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
        <div className="mx-auto flex min-h-dvh w-full max-w-[1380px] flex-col px-4 pb-16 pt-5 sm:px-7">
          <header className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-[#292b29] pb-5">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-lg border border-[#5b4a33] bg-[#191712] font-mono text-xs font-bold text-practical" aria-hidden>
                CC
              </span>
              <div>
                <p className="text-base font-semibold tracking-tight">
                  Cruiser Copilot
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[.12em] text-shop-muted">
                  Field diagnostic system
                </p>
              </div>
            </div>
            <p className="label-caps">Vehicle → symptom → evidence</p>
          </header>

          <main className="flex-1">{children}</main>

          <Disclaimer />
        </div>
      </body>
    </html>
  );
}
