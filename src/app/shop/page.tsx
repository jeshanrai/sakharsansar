import { Metadata } from "next";
import dynamic from "next/dynamic";
import ShopContent from "@/components/shop/ShopContent";
import JsonLd from "@/components/seo/JsonLd";
import data from "@/data/content.json";
import { WEBSITE_ID, breadcrumbLd, itemListLd } from "@/lib/seo";
import { SITE, absoluteUrl } from "@/lib/site";
import { alternates, openGraph, twitter } from "@/lib/metadata";

const Footer = dynamic(() => import("@/components/layout/Footer"));
const OrderDrawer = dynamic(() => import("@/components/layout/OrderDrawer"));

export const metadata: Metadata = {
  // No brand suffix here — the root layout's `title.template` appends
  // "| SakharSansar" to every child segment's title.
  title: "Shop Pure Sakhar: Organic Himalayan Jaggery",
  description:
    "Shop 100% organic Sakhar, wood-fired Himalayan jaggery from Sankhuwasabha. Eight pure forms (blocks, powder, cubes, liquid) direct from farmers. Chemical-free, premium quality.",
  keywords: [
    "Buy Sakhar Online",
    "Shop Organic Sakhar",
    "Pure Sakhar Nepal",
    "Himalayan Jaggery Shop",
    "Organic Jaggery Online",
    "Sankhuwasabha Sakhar",
    "Chemical-Free Sakhar",
    "Wood-fired Jaggery",
    "Premium Gur Nepal",
  ],
  alternates: alternates({
    canonical: "/shop",
  }),
  openGraph: openGraph({
    title: "Shop Pure Sakhar: Organic Himalayan Jaggery",
    description:
      "100% organic sakhar from Sankhuwasabha: eight pure forms, direct from farmers, shipped pan-Nepal.",
    url: "/shop",
    type: "website",
  }),
  twitter: twitter({
    title: "Shop Pure Sakhar: Organic Himalayan Jaggery",
    description:
      "100% organic sakhar from Sankhuwasabha. Wood-fired, chemical-free, premium quality.",
  }),
};

export default function ShopPage() {
  // CollectionPage + ItemList is what marks this as a category page and names
  // the product pages under it — without restating each product's Offer, which
  // belongs on the product page itself.
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": absoluteUrl("/shop#webpage"),
    url: absoluteUrl("/shop"),
    name: "Shop Pure Sakhar: Organic Himalayan Jaggery",
    description:
      "The full SakharSansar range — blocks, powder, cubes, liquid jaggery and more, wood-fired in Sankhuwasabha.",
    isPartOf: { "@id": WEBSITE_ID },
    inLanguage: SITE.lang,
  };

  const listJsonLd = itemListLd(
    "SakharSansar product range",
    data.products.map((p) => ({ name: p.name, path: `/products/${p.slug}` })),
  );

  return (
    <>
      <JsonLd data={collectionJsonLd} />
      <JsonLd data={listJsonLd} />
      <JsonLd data={breadcrumbLd([{ name: "Shop", path: "/shop" }])} />

      <OrderDrawer />
      <main className="overflow-x-hidden pt-10">
        {/* The shop had no <h1> at all — its first element was the sticky
            filter bar — so the site's main commercial page offered search
            engines no heading and screen readers no entry point. Rendered on
            the server, so the copy is in the first byte of HTML for the
            crawlers that never run JS. */}
        <header className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pb-7 sm:pb-9">
          <p className="text-[11px] font-bold tracking-caps uppercase text-jaggery/55 mb-3">
            The Full Range
          </p>
          <h1 className="font-marker uppercase text-jaggery leading-[0.9] tracking-tight text-[clamp(2rem,5vw,3.25rem)]">
            Shop Pure Sakhar
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] sm:text-base text-jaggery/70 leading-relaxed">
            Eight forms of 100% organic Himalayan jaggery — blocks, powder,
            cubes and liquid — wood-fired without chemicals by our farming
            cooperative in Sankhuwasabha, and shipped across Nepal.
          </p>
        </header>
        <ShopContent />
      </main>
      <Footer />
    </>
  );
}
