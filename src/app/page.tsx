import { Metadata } from "next";
import dynamic from "next/dynamic";
import Script from "next/script";
import contentData from "@/data/content.json";
import HeroSection from "@/components/sections/HeroSection";
import TrustStrip from "@/components/sections/TrustStrip";

// Below-the-fold — split out of the initial JS bundle
const ProductsSection = dynamic(
  () => import("@/components/sections/ProductsSection"),
);
const Footer = dynamic(() => import("@/components/layout/Footer"));
const OrderDrawer = dynamic(() => import("@/components/layout/OrderDrawer"));

export const metadata: Metadata = {
  title: "Sakhar — 100% Organic Jaggery from Sankhuwasabha | SakharSansar",
  description:
    "Buy 100% organic Sakhar (pure Himalayan jaggery) direct from farmers in Sankhuwasabha. Wood-fired, chemical-free, premium quality — shipped pan-Nepal.",
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
    canonical: "https://sakharsansar.com",
  },
  openGraph: {
    title: "Sakhar — 100% Organic Jaggery from Sankhuwasabha",
    description:
      "Pure, premium Sakhar — wood-fired by Himalayan farmers. 100% organic, no chemicals, direct from the farm.",
    url: "https://sakharsansar.com",
    siteName: "SakharSansar",
    images: [
      {
        url: "/hero.jpg",
        width: 1200,
        height: 630,
        alt: "100% organic Sakhar — wood-fired Himalayan jaggery from Sankhuwasabha, Nepal",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sakhar — 100% Organic Himalayan Jaggery",
    description:
      "Pure Sakhar from Sankhuwasabha. 100% organic, chemical-free, direct from farmers.",
    images: ["/hero.jpg"],
  },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "SakharSansar",
    "alternateName": ["Sakhar Sansar", "Sakhar"],
    "image": "https://sakharsansar.com/hero.jpg",
    "description":
      "100% organic Sakhar (Himalayan jaggery) — wood-fired, chemical-free, direct from Sankhuwasabha farmers. Premium pure gur shipped pan-Nepal.",
    "keywords":
      "Sakhar, Organic Sakhar, Pure Sakhar, 100% Organic Jaggery, Sankhuwasabha Sakhar, Chemical-Free Sakhar, Premium Jaggery Nepal, Wood-fired Sakhar",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Sankhuwasabha",
      "addressRegion": "Koshi Province",
      "addressCountry": "NP",
    },
    "priceRange": "$$",
    "url": "https://sakharsansar.com",
  };

  const productsJsonLd = contentData.products.map(product => ({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": `https://sakharsansar.com${product.image}`,
    "brand": {
      "@type": "Brand",
      "name": "SakharSansar"
    },
    "offers": {
      "@type": "Offer",
      "price": product.price.replace(/[^0-9]/g, ''),
      "priceCurrency": "NPR",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "SakharSansar"
      }
    },
    "weight": {
      "@type": "QuantitativeValue",
      "value": product.weight.replace(/[^0-9.]/g, ''),
      "unitCode": "KGM"
    }
  }));

  return (
    <>
      <Script
        id="ld-business"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {productsJsonLd.map((productLd, i) => (
        <Script
          key={i}
          id={`ld-product-${i}`}
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
        />
      ))}

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
