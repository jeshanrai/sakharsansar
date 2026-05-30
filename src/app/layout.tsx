import type { Metadata, Viewport } from "next";
import { Inter, Fraunces, Tiro_Devanagari_Hindi, Fredoka } from "next/font/google";
import "./globals.css";
import PromoBar from "@/components/layout/PromoBar";
import Navbar from "@/components/layout/Navbar";

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

// Display sans for hero/promo treatments — chunky, rounded, sticker-friendly.
const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-fredoka",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sakharsansar.com"),
  title: {
    default: "SakharSansar | 100% Organic Sakhar from Sankhuwasabha",
    template: "%s | SakharSansar",
  },
  description:
    "100% organic Sakhar (Himalayan jaggery) — wood-fired, chemical-free, direct from Sankhuwasabha farmers.",
  applicationName: "SakharSansar",
  authors: [{ name: "SakharSansar" }],
  creator: "SakharSansar",
  publisher: "SakharSansar",
  formatDetection: { telephone: false },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5EDE0" },
    { media: "(prefers-color-scheme: dark)", color: "#1A1410" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Preconnect to Google Fonts origin so the font CSS resolves earlier */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Preload the hero LCP image (used in HeroSection + ProductsSection card frames) */}
        <link
          rel="preload"
          as="image"
          href="/hero-cane-bg.jpg"
          fetchPriority="high"
        />
      </head>
      <body
        className={`${inter.variable} ${fraunces.variable} ${tiroDevanagari.variable} ${fredoka.variable} font-sans antialiased bg-cream text-jaggery`}
      >
        <PromoBar />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
