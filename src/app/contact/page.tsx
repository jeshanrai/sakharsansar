import { Metadata } from "next";
import dynamic from "next/dynamic";
import ContactHero from "@/components/contact/ContactHero";
import ContactReach from "@/components/contact/ContactReach";
import JsonLd from "@/components/seo/JsonLd";
import { ORG_ID, WEBSITE_ID, breadcrumbLd } from "@/lib/seo";
import { SITE, absoluteUrl } from "@/lib/site";
import { openGraph, twitter } from "@/lib/metadata";

const Footer = dynamic(() => import("@/components/layout/Footer"));
const OrderDrawer = dynamic(() => import("@/components/layout/OrderDrawer"));

const PAGE_PATH = "/contact";
const PAGE_URL = absoluteUrl(PAGE_PATH);
const PAGE_DESC =
  "Get in touch with SakharSansar. We sell both retail (B2C) home delivery across Nepal and wholesale (B2B) bulk supply for shops, cafés and hotels. WhatsApp, call or email our farming cooperative in Sankhuwasabha.";

export const metadata: Metadata = {
  title: "Contact Us: B2B Wholesale & B2C Orders",
  description: PAGE_DESC,
  keywords: [
    "contact SakharSansar",
    "jaggery wholesale Nepal",
    "buy jaggery bulk Nepal",
    "B2B jaggery supplier",
    "B2C jaggery delivery",
    "sakhar wholesale",
    "jaggery reseller Nepal",
    "Sankhuwasabha jaggery contact",
  ],
  alternates: { canonical: PAGE_PATH },
  openGraph: openGraph({
    title: "Contact SakharSansar | B2B Wholesale & B2C Orders",
    description: PAGE_DESC,
    url: PAGE_PATH,
    type: "website",
  }),
  twitter: twitter({
    title: "Contact SakharSansar | Wholesale & Retail",
    description: PAGE_DESC,
  }),
};

export default function ContactPage() {
  // The Organization's own details live in the sitewide graph; this page's
  // node just points at it, so the phone number and address are stated once.
  const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${PAGE_URL}#webpage`,
    name: "Contact | SakharSansar",
    description: PAGE_DESC,
    url: PAGE_URL,
    isPartOf: { "@id": WEBSITE_ID },
    inLanguage: SITE.lang,
    mainEntity: { "@id": ORG_ID },
  };

  const breadcrumbJsonLd = breadcrumbLd([
    { name: "Contact", path: PAGE_PATH },
  ]);

  return (
    <>
      <JsonLd data={contactJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <OrderDrawer />
      <main className="overflow-x-hidden">
        <ContactHero />   {/* 1 · peach · intro + B2C / B2B */}
        <ContactReach />  {/* 2 · green · channels + form */}
      </main>
      <Footer />
    </>
  );
}
