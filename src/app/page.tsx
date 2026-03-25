import { Metadata } from "next";
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
  title: "Himalayan Jaggery | Pure & Natural from Sankhuwasabha",
  description: "Experience the authentic taste of 100% natural, chemical-free jaggery direct from farmers in Sankhuwasabha, Nepal. Order pure Himalayan gur.",
  keywords: ["Jaggery", "Natural Jaggery", "Sankhuwasabha", "Nepal", "Himalayan Jaggery", "Organic Gur", "Chemical Free", "Sweetener"],
  alternates: {
    canonical: "https://himalayanjaggery.com",
  },
  openGraph: {
    title: "Himalayan Jaggery | Pure & Natural from Sankhuwasabha",
    description: "Experience the authentic taste of 100% natural, chemical-free jaggery direct from farmers in Sankhuwasabha, Nepal. Order pure Himalayan gur.",
    url: "https://himalayanjaggery.com",
    siteName: "Himalayan Jaggery",
    images: [
      {
        url: "/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Pure Himalayan Jaggery from Sankhuwasabha",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Himalayan Jaggery | Pure & Natural",
    description: "100% natural, chemical-free jaggery direct from farmers in Sankhuwasabha, Nepal.",
    images: ["/hero.jpg"],
  },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Himalayan Jaggery",
    "image": "https://himalayanjaggery.com/hero.jpg",
    "description": "Pure, Chemical-Free Jaggery sourced directly from farmers in Sankhuwasabha, Nepal.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Sankhuwasabha",
      "addressRegion": "Koshi Province",
      "addressCountry": "NP"
    },
    "priceRange": "$$",
    "url": "https://himalayanjaggery.com"
  };

  return (
    <div className="overflow-x-hidden bg-white selection:bg-black selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <Navbar />
      <OrderDrawer />
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
      <Footer />
    </div>
  );
}
