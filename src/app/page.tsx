import { Metadata } from "next";
import dynamic from "next/dynamic";
import contentData from "@/data/content.json";
import HeroSection from "@/components/sections/HeroSection";
import TrustStrip from "@/components/sections/TrustStrip";
import JsonLd from "@/components/seo/JsonLd";
import { ORG_ID, WEBSITE_ID, itemListLd, productNodeId } from "@/lib/seo";
import { SITE, absoluteUrl } from "@/lib/site";
import { alternates, openGraph, twitter } from "@/lib/metadata";
import { languageAlternates } from "@/lib/hreflang";
import { nePathFor } from "@/lib/locale-paths";
import { productCards } from "@/lib/product-cards";

// Below-the-fold — split out of the initial JS bundle
const ProductsSection = dynamic(
  () => import("@/components/sections/ProductsSection"),
);
const Footer = dynamic(() => import("@/components/layout/Footer"));

export const metadata: Metadata = {
  // "Sankhuwasabha sakhar" is the name this product is actually known and
  // asked for by, and it appeared in no title on the site — every page led
  // with "Himalayan jaggery", a phrase we coined and nobody searches. The
  // exact phrase goes first, and the Devanagari spelling with it, because
  // that is what a Nepali keyboard types.
  // The rename to Sankhuwasabha sakhar took "jaggery" out of every
  // commercial title on the site. Semrush: "jaggery" is 1,900 a month and
  // "jaggery in nepal" 880, against a KD of 10 for the second. The local
  // name still leads; the English one follows it.
  title: "Sankhuwasabha Sakhar (सखर) | Jaggery in Nepal | SakharSansar",
  description:
    "Buy Sankhuwasabha Sakhar (सखर) direct from our farmers in Nepal. 100% organic, wood-fired, chemical-free jaggery in Nepal. Rs. 400 per kg, shipped pan-Nepal.",
  alternates: alternates({
    canonical: "/",
    languages: languageAlternates({ en: "/", ne: nePathFor("/")! }),
  }),
  openGraph: openGraph({
    title: "Sankhuwasabha Sakhar (सखर): Buy Organic Jaggery in Nepal",
    description:
      "Pure, premium Sankhuwasabha Sakhar. Wood-fired by Himalayan farmers. 100% organic, no chemicals, direct from the farm.",
    url: "/",
  }, { hasTranslation: true }),
  twitter: twitter({
    title: "Sankhuwasabha Sakhar (सखर): 100% Organic Jaggery",
    description:
      "Pure Sankhuwasabha Sakhar. 100% organic, chemical-free, direct from farmers.",
  }),
};

export default function Home() {
  // The business itself is described once in the root layout's sitewide graph.
  // What the home page adds is the WebPage node and the catalogue listing.
  //
  // Note this is an ItemList of links, not full Product blocks. Each
  // product's own page carries the authoritative Product + Offer markup;
  // repeating it here would put two pages in competition to be the result
  // Google shows for the same item.
  const homeJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": absoluteUrl("/#webpage"),
    url: absoluteUrl("/"),
    name: "Sankhuwasabha Sakhar: Buy Organic Jaggery in Nepal",
    description: SITE.description,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: absoluteUrl("/hero.jpg"),
    },
    inLanguage: SITE.lang,
  };

  const catalogueJsonLd = itemListLd(
    "SakharSansar jaggery collection",
    contentData.products.map((p) => ({
      name: p.name,
      path: `/products/${p.slug}`,
      id: productNodeId(p.slug),
    })),
  );

  return (
    <>
      <JsonLd data={homeJsonLd} />
      <JsonLd data={catalogueJsonLd} />

      <main className="overflow-x-hidden">
        <HeroSection />
        <TrustStrip />
        <ProductsSection products={productCards()} />
      </main>
      <Footer />
    </>
  );
}
