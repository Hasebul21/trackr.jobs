import type { Metadata } from "next";
import { JetBrains_Mono, Lato } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import "./globals.css";

// Lato (sans) + JetBrains Mono mirror the "Coffee" design system from
// the trading project. tokens.css references these CSS variables so
// the family swap propagates everywhere without further wiring.
const lato = Lato({
  variable: "--font-lato",
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "job·stes — international tech jobs",
  description:
    "Aggregated software-engineering jobs with visa sponsorship and relocation support from TokyoDev, Japan Dev, Relocate.me, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${lato.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)] font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-1">{children}</main>
          <Toaster position="bottom-right" closeButton richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
