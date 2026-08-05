import type { Metadata, Viewport } from "next";
import { Inter, Fraunces, Tiro_Devanagari_Hindi, Fredoka, Gochi_Hand } from "next/font/google";
import "./globals.css";
import PromoBar from "@/components/layout/PromoBar";
import Navbar from "@/components/layout/Navbar";
import FloatingContact from "@/components/layout/FloatingContact";
import JsonLd from "@/components/seo/JsonLd";
import { siteGraphLd } from "@/lib/seo";
import { SITE, SITE_URL } from "@/lib/site";

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

// Hand-drawn marker — used for the Our Story page headings to echo the
// playful, hand-lettered tone of the reference design. Upright, even-weight
// print lettering that reads cleanly in all-caps.
const gochiHand = Gochi_Hand({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-marker",
  display: "swap",
});

export const metadata: Metadata = {
  // Every relative URL in page metadata (canonicals, OG images) resolves
  // against this, so the canonical host is declared in exactly one place.
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SakharSansar | 100% Organic Sakhar from Sankhuwasabha",
    template: "%s | SakharSansar",
  },
  description:
    "100% organic Sakhar (Himalayan jaggery). Wood-fired, chemical-free, direct from Sankhuwasabha farmers.",
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE_URL }],
  creator: SITE.name,
  publisher: SITE.name,
  category: "Food & Beverage",
  formatDetection: { telephone: false },
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [{ url: "/feed", title: "SakharSansar Journal" }],
    },
  },
  // Defaults every page inherits and may narrow. `images` is deliberately
  // absent — the generated opengraph-image.tsx supplies it sitewide.
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: SITE.ogLocale,
    url: SITE_URL,
    title: "SakharSansar | 100% Organic Sakhar from Sankhuwasabha",
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "SakharSansar | 100% Organic Sakhar from Sankhuwasabha",
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    // Without these, Google caps result snippets and shows only a thumbnail.
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // Set GOOGLE_SITE_VERIFICATION in the host's env after claiming the new
  // domain in Search Console; the tag stays off until then.
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
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
    <html lang={SITE.lang} className="scroll-smooth">
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
        {/* Publisher + site identity, emitted once for every page so crawlers
            resolve all our Organization references to a single entity. */}
        <JsonLd data={siteGraphLd()} />
      </head>
      <body
        className={`${inter.variable} ${fraunces.variable} ${tiroDevanagari.variable} ${fredoka.variable} ${gochiHand.variable} font-sans antialiased bg-cream text-jaggery`}
      >
        <PromoBar />
        <Navbar />
        {children}
        <FloatingContact />
      </body>
    </html>
  );
}
