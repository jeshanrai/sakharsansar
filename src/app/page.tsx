import { Metadata } from "next";
import contentData from "@/data/content.json";
import Navbar from "@/components/layout/Navbar";
import OrderDrawer from "@/components/layout/OrderDrawer";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import TrustBanner from "@/components/sections/TrustBanner";
import HighlightsSection from "@/components/sections/HighlightsSection";
import StorySection from "@/components/sections/StorySection";
import FarmersSection from "@/components/sections/FarmersSection";
import ProductsSection from "@/components/sections/ProductsSection";
import WaysToEnjoySection from "@/components/sections/WaysToEnjoySection";
import ProcessSection from "@/components/sections/ProcessSection";
import ComparisonSection from "@/components/sections/ComparisonSection";
import BenefitsSection from "@/components/sections/BenefitsSection";
import BlogHighlightSection from "@/components/sections/BlogHighlightSection";
import FaqsSection from "@/components/sections/FaqsSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import CtaSection from "@/components/sections/CtaSection";

export const metadata: Metadata = {
  title: "SakharSansar | Pure & Natural from Sankhuwasabha",
  description: "Experience the authentic taste of 100% natural, chemical-free jaggery direct from farmers in Sankhuwasabha, Nepal. Order pure Himalayan gur.",
  keywords: ["Jaggery", "Natural Jaggery", "Sankhuwasabha", "Nepal", "SakharSansar", "Organic Gur", "Chemical Free", "Sweetener"],
  alternates: {
    canonical: "https://sakharsansar.com",
  },
  openGraph: {
    title: "SakharSansar | Pure & Natural from Sankhuwasabha",
    description: "Experience the authentic taste of 100% natural, chemical-free jaggery direct from farmers in Sankhuwasabha, Nepal. Order pure Himalayan gur.",
    url: "https://sakharsansar.com",
    siteName: "SakharSansar",
    images: [
      {
        url: "/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Pure SakharSansar from Sankhuwasabha",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SakharSansar | Pure & Natural",
    description: "100% natural, chemical-free jaggery direct from farmers in Sankhuwasabha, Nepal.",
    images: ["/hero.jpg"],
  },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "SakharSansar",
    "image": "https://sakharsansar.com/hero.jpg",
    "description": "Pure, Chemical-Free Jaggery sourced directly from farmers in Sankhuwasabha, Nepal.",
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
        <TrustBanner />
        <HighlightsSection />
        <StorySection />
        <FarmersSection />
        <ProductsSection />
        <WaysToEnjoySection />
        <BenefitsSection />
        <ComparisonSection />
        <ProcessSection />
        <TestimonialsSection />
        <BlogHighlightSection />
        <FaqsSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
