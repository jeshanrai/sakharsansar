import type { Metadata, Viewport } from "next";
import { Inter, Fraunces, Tiro_Devanagari_Hindi, Fredoka, Gochi_Hand } from "next/font/google";
import "./globals.css";
import PromoBar from "@/components/layout/PromoBar";
import Navbar from "@/components/layout/Navbar";
import FloatingContact from "@/components/layout/FloatingContact";
import JsonLd from "@/components/seo/JsonLd";
import Analytics from "@/components/seo/Analytics";
import { BLOG_ENABLED } from "@/lib/blog";
import { BUILD_ID } from "@/lib/build-id";
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
// axis (covering 300–600 in CSS weight) plus its SOFT axis, which softens
// terminals on display text via `font-variation-settings`.
// Optical sizing (`opsz`) is enabled globally in CSS via `font-optical-sizing`.
//
// WONK was dropped: `.font-wonk` is defined in globals.css but applied nowhere
// in the codebase, and every extra axis is carried in the variable font's
// payload whether or not anything varies along it.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["SOFT"],
  variable: "--font-fraunces",
  display: "swap",
});

// Devanagari serif for "सखर संसार" and other Nepali/Sanskrit accents.
// Tiro Devanagari Hindi was designed by John Hudson with editorial care —
// it shares Fraunces' warm, hand-cut feeling and pairs cleanly with it.
const tiroDevanagari = Tiro_Devanagari_Hindi({
  subsets: ["devanagari", "latin"],
  weight: ["400"],
  // Italic dropped: nothing in the codebase sets it, and each style is its own
  // woff2 download.
  style: ["normal"],
  variable: "--font-devanagari",
  display: "swap",
});

// Display sans for hero/promo treatments — chunky, rounded, sticker-friendly.
const fredoka = Fredoka({
  subsets: ["latin"],
  // 600 is the weight `.font-display` sets by default and 700 is what
  // `font-display font-bold` asks for. 500 was declared and never used.
  weight: ["600", "700"],
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
    // Advertising a feed that 404s makes readers show a broken subscription,
    // so discovery is tied to the journal actually having posts.
    ...(BLOG_ENABLED
      ? {
          types: {
            "application/rss+xml": [
              { url: "/feed", title: "SakharSansar Journal" },
            ],
          },
        }
      : {}),
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
  // Search Console ownership token. It ships in the public HTML by design, so
  // it lives here rather than in the host's env; GOOGLE_SITE_VERIFICATION can
  // still override it if the property is ever re-verified.
  verification: {
    google:
      process.env.GOOGLE_SITE_VERIFICATION ||
      "EMvfP2UCrvxmGFIQCJiDm_Weqyp5ta5fY799Flplfno",
  },
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
        {/*
          The hero background used to be preloaded here, on every route.

          Two problems. It named the raw file, so the preload fetched the
          original JPEG rather than anything next/image had optimised — the
          browser then downloaded the picture twice on the home page, once for
          the preload and once for the <Image> that actually renders. And it
          ran sitewide, so every policy page, article and product page paid for
          a hero image it never shows.

          HeroSection's <Image priority fetchPriority="high"> already emits a
          correct preload for the pages that need it.
        */}
        {/*
          Which build produced this page.

          Written here rather than through `metadata.other` on purpose: page
          metadata merges shallowly, so any route that later sets `other` for a
          reason of its own would drop this tag and quietly blind the check
          that depends on it. In the layout's own <head> it is unconditional.

          `npm run smoke:build` reads it back off the live site and fails if two
          routes disagree. See scripts/smoke-build.mjs.
        */}
        <meta name="x-build-id" content={BUILD_ID} />
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
        <Analytics />
      </body>
    </html>
  );
}
