import { Metadata } from "next";
import Script from "next/script";
import dynamic from "next/dynamic";
import ContactHero from "@/components/contact/ContactHero";
import ContactReach from "@/components/contact/ContactReach";

const Footer = dynamic(() => import("@/components/layout/Footer"));
const OrderDrawer = dynamic(() => import("@/components/layout/OrderDrawer"));

const PAGE_URL = "https://sakharsansar.com/contact";
const PAGE_DESC =
  "Get in touch with SakharSansar. We sell both retail (B2C) home delivery across Nepal and wholesale (B2B) bulk supply for shops, cafés and hotels. WhatsApp, call or email our farming cooperative in Sankhuwasabha.";

export const metadata: Metadata = {
  title: "Contact Us — B2B Wholesale & B2C Orders",
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
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Contact SakharSansar | B2B Wholesale & B2C Orders",
    description: PAGE_DESC,
    url: PAGE_URL,
    siteName: "SakharSansar",
    images: [{ url: "/hero.jpg", width: 1200, height: 630, alt: "Contact SakharSansar" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact SakharSansar | Wholesale & Retail",
    description: PAGE_DESC,
    images: ["/hero.jpg"],
  },
};

export default function ContactPage() {
  const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact | SakharSansar",
    "description": PAGE_DESC,
    "url": PAGE_URL,
    "mainEntity": {
      "@type": "Organization",
      "name": "SakharSansar",
      "url": "https://sakharsansar.com",
      "email": "hello@sakharsansar.com",
      "telephone": "+977-9860149199",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Sankhuwasabha",
        "addressRegion": "Koshi Province",
        "addressCountry": "NP",
      },
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "contactType": "sales",
          "telephone": "+977-9860149199",
          "email": "hello@sakharsansar.com",
          "areaServed": "NP",
          "availableLanguage": ["en", "ne"],
        },
        {
          "@type": "ContactPoint",
          "contactType": "wholesale",
          "telephone": "+977-9860149199",
          "email": "hello@sakharsansar.com",
          "areaServed": "NP",
        },
      ],
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sakharsansar.com" },
      { "@type": "ListItem", "position": 2, "name": "Contact", "item": PAGE_URL },
    ],
  };

  return (
    <>
      <Script
        id="ld-contact"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      <Script
        id="ld-breadcrumb-contact"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <OrderDrawer />
      <main className="overflow-x-hidden">
        <ContactHero />   {/* 1 · peach · intro + B2C / B2B */}
        <ContactReach />  {/* 2 · green · channels + form */}
      </main>
      <Footer />
    </>
  );
}
