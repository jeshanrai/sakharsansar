import { Metadata } from "next";
import dynamic from "next/dynamic";
import contentData from "@/data/content.json";
import HeroSection from "@/components/sections/HeroSection";
import TrustStrip from "@/components/sections/TrustStrip";
import JsonLd from "@/components/seo/JsonLd";
import { ORG_ID, WEBSITE_ID, itemListLd } from "@/lib/seo";
import { SITE, absoluteUrl } from "@/lib/site";
import { openGraph, twitter } from "@/lib/metadata";

// Below-the-fold — split out of the initial JS bundle
const ProductsSection = dynamic(
  () => import("@/components/sections/ProductsSection"),
);
const Footer = dynamic(() => import("@/components/layout/Footer"));
const OrderDrawer = dynamic(() => import("@/components/layout/OrderDrawer"));

export const metadata: Metadata = {
  title: "Sakhar: 100% Organic Jaggery from Sankhuwasabha | SakharSansar",
  description:
    "Buy 100% organic Sakhar (pure Himalayan jaggery) direct from farmers in Sankhuwasabha. Wood-fired, chemical-free, premium quality, shipped pan-Nepal.",
  keywords: [
    "Sakhar",
    "Organic Sakhar",
    "Pure Sakhar",
    "Buy Sakhar Online",
    "100% Organic Jaggery",
    "Sankhuwasabha Sakhar",
    "Chemical-Free Sakhar",
    "Premium Sakhar Nepal",
    "Sakhar Sansar",
    "Wood-fired Jaggery",
    "Himalayan Jaggery",
    "Organic Gur Nepal",
    "Direct from Farmers",
    "Natural Sweetener",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: openGraph({
    title: "Sakhar: 100% Organic Jaggery from Sankhuwasabha",
    description:
      "Pure, premium Sakhar. Wood-fired by Himalayan farmers. 100% organic, no chemicals, direct from the farm.",
    url: "/",
  }),
  twitter: twitter({
    title: "Sakhar: 100% Organic Himalayan Jaggery",
    description:
      "Pure Sakhar from Sankhuwasabha. 100% organic, chemical-free, direct from farmers.",
  }),
};

export default function Home() {
  // The business itself is described once in the root layout's sitewide graph.
  // What the home page adds is the WebPage node and the catalogue listing.
  //
  // Note this is an ItemList of links, not eight full Product blocks. Each
  // product's own page carries the authoritative Product + Offer markup;
  // repeating it here would put two pages in competition to be the result
  // Google shows for the same item.
  const homeJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": absoluteUrl("/#webpage"),
    url: absoluteUrl("/"),
    name: "Sakhar: 100% Organic Jaggery from Sankhuwasabha",
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
    })),
  );

  return (
    <>
      <JsonLd data={homeJsonLd} />
      <JsonLd data={catalogueJsonLd} />

      <OrderDrawer />
      <main className="overflow-x-hidden">
        <HeroSection />
        <TrustStrip />
        <ProductsSection />
      </main>
      <Footer />
    </>
  );
}
