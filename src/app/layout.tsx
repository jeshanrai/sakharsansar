import type { Metadata } from "next";
import { Inter, Fraunces, Tiro_Devanagari_Hindi } from "next/font/google";
import "./globals.css";

// Body sans — Söhne-adjacent. Use 400 for body, 500 for emphasis.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

// Display serif — Fraunces is a variable font. We load the full variable
// axis (covering 300–600 in CSS weight) plus its SOFT and WONK axes so we
// can soften terminals on hero display text via `font-variation-settings`.
// Optical sizing (`opsz`) is enabled globally in CSS via `font-optical-sizing`.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK"],
  variable: "--font-fraunces",
  display: "swap",
});

// Devanagari serif for "सखर संसार" and other Nepali/Sanskrit accents.
// Tiro Devanagari Hindi was designed by John Hudson with editorial care —
// it shares Fraunces' warm, hand-cut feeling and pairs cleanly with it.
const tiroDevanagari = Tiro_Devanagari_Hindi({
  subsets: ["devanagari", "latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-devanagari",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sakharsansar.com"),
  title: "SakharSansar | Sweetness from the Roof of the World",
  description: "Wood-fired Himalayan jaggery from Sankhuwasabha, crafted by Nepali farmers for seven generations. Pure, chemical-free, hand-poured.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${fraunces.variable} ${tiroDevanagari.variable} font-sans antialiased bg-cream text-jaggery`}
      >
        {children}
      </body>
    </html>
  );
}
