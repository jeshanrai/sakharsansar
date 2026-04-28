import { Metadata } from "next";
import dynamic from "next/dynamic";
import contentData from "@/data/content.json";
import Navbar from "@/components/layout/Navbar";
import OrderDrawer from "@/components/layout/OrderDrawer";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import OriginStorySection from "@/components/sections/OriginStorySection";
import ProductsSection from "@/components/sections/ProductsSection";

// Below-the-fold sections — lazy-loaded
const ProcessSection = dynamic(() => import("@/components/sections/ProcessSection"));
const WaysToEnjoySection = dynamic(() => import("@/components/sections/WaysToEnjoySection"));
const TestimonialsSection = dynamic(() => import("@/components/sections/TestimonialsSection"));
const FindUsSection = dynamic(() => import("@/components/sections/FindUsSection"));
const TrustBanner = dynamic(() => import("@/components/sections/TrustBanner"));

export const metadata: Metadata = {
  title: "SakharSansar | Sweetness from the Roof of the World",
  description: "Wood-fired Himalayan jaggery from Sankhuwasabha, hand-poured by Nepali farmers for seven generations. Pure, chemical-free, mineral-rich gur.",
  keywords: ["Jaggery", "Himalayan Jaggery", "Sankhuwasabha", "Nepal", "SakharSansar", "Organic Gur", "Chemical Free", "Wood-fired", "Sweetener"],
  alternates: {
    canonical: "https://sakharsansar.com",
  },
  openGraph: {
    title: "SakharSansar | Sweetness from the Roof of the World",
    description: "Wood-fired Himalayan jaggery from Sankhuwasabha, hand-poured by Nepali farmers for seven generations.",
    url: "https://sakharsansar.com",
    siteName: "SakharSansar",
    images: [
      {
        url: "/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Pure Himalayan jaggery from Sankhuwasabha",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SakharSansar | Wood-fired Himalayan jaggery",
    description: "Pure, chemical-free jaggery hand-poured in Sankhuwasabha, Nepal.",
    images: ["/hero.jpg"],
  },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "SakharSansar",
    "image": "https://sakharsansar.com/hero.jpg",
    "description": "Wood-fired Himalayan jaggery from Sankhuwasabha, Nepal.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Sankhuwasabha",
      "addressRegion": "Koshi Province",
      "addressCountry": "NP"
    },
    "priceRange": "$$",
    "url": "https://sakharsansar.com"
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {productsJsonLd.map((productLd, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
        />
      ))}

      <header>
        <Navbar />
      </header>
      <OrderDrawer />
      <main className="overflow-x-hidden">
        <HeroSection />
        <OriginStorySection />
        <ProductsSection />
        <ProcessSection />
        <WaysToEnjoySection />
        <TestimonialsSection />
        <TrustBanner />
        <FindUsSection />
      </main>
      <Footer />
    </>
  );
}
