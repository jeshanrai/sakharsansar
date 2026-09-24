import { Metadata } from "next";
import dynamic from "next/dynamic";
import ContactHero from "@/components/contact/ContactHero";
import ContactReach from "@/components/contact/ContactReach";
import JsonLd from "@/components/seo/JsonLd";
import { ORG_ID, WEBSITE_ID, breadcrumbLd } from "@/lib/seo";
import { SITE, absoluteUrl } from "@/lib/site";
import { alternates, openGraph, twitter } from "@/lib/metadata";

const Footer = dynamic(() => import("@/components/layout/Footer"));

const PAGE_PATH = "/contact";
const PAGE_URL = absoluteUrl(PAGE_PATH);
const PAGE_DESC =
  "Talk to SakharSansar about retail delivery anywhere in Nepal, or wholesale supply for shops, cafés and hotels. WhatsApp, call or email us.";

export const metadata: Metadata = {
  title: "Contact Us: B2B Wholesale & B2C Orders",
  description: PAGE_DESC,
  alternates: alternates({ canonical: PAGE_PATH }),
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

      <main className="overflow-x-hidden">
        <ContactHero />   {/* 1 · peach · intro + B2C / B2B */}
        <ContactReach />  {/* 2 · green · channels + form */}
      </main>
      <Footer />
    </>
  );
}
