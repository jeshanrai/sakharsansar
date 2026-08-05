import { Metadata } from "next";
import dynamic from "next/dynamic";
import ShopContent from "@/components/shop/ShopContent";
import JsonLd from "@/components/seo/JsonLd";
import data from "@/data/content.json";
import { WEBSITE_ID, breadcrumbLd, itemListLd } from "@/lib/seo";
import { SITE, absoluteUrl } from "@/lib/site";
import { openGraph, twitter } from "@/lib/metadata";

const Footer = dynamic(() => import("@/components/layout/Footer"));
const OrderDrawer = dynamic(() => import("@/components/layout/OrderDrawer"));

export const metadata: Metadata = {
  title: "Shop Pure Sakhar: Organic Himalayan Jaggery | SakharSansar",
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
  alternates: {
    canonical: "/shop",
  },
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
        <ShopContent />
      </main>
      <Footer />
    </>
  );
}
