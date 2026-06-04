import { Metadata } from "next";
import Script from "next/script";
import OrderDrawer from "@/components/layout/OrderDrawer";
import Footer from "@/components/layout/Footer";
import StorySection from "@/components/sections/StorySection";
import StoryWelcomeSection from "@/components/sections/StoryWelcomeSection";
import StoryNatureSection from "@/components/sections/StoryNatureSection";
import StoryMissionSection from "@/components/sections/StoryMissionSection";
import StoryProcessSection from "@/components/sections/StoryProcessSection";
import StoryRootsSection from "@/components/sections/StoryRootsSection";
import FarmersSection from "@/components/sections/FarmersSection";
import StoryHeritageSection from "@/components/sections/StoryHeritageSection";
import StoryFaqsSection from "@/components/sections/StoryFaqsSection";
import StoryCtaSection from "@/components/sections/StoryCtaSection";

const PAGE_URL = "https://sakharsansar.com/our-story";
const PAGE_DESC =
  "Seven generations of slow sweetness from Sankhuwasabha. Meet the 42 farming families, the wood-fire craft, and the chemical-free promise behind SakharSansar's pure Himalayan jaggery (sakhar).";

export const metadata: Metadata = {
  title: "Our Story — Wood-Fired Jaggery from Sankhuwasabha",
  description: PAGE_DESC,
  keywords: [
    "SakharSansar story",
    "about Sakhar Sansar",
    "Sankhuwasabha jaggery",
    "Himalayan jaggery makers",
    "wood-fired jaggery Nepal",
    "chemical-free gur",
    "traditional jaggery making",
    "organic jaggery farmers Nepal",
    "direct from farmers jaggery",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Our Story | SakharSansar",
    description:
      "Seven generations of slow sweetness from Sankhuwasabha — the land, the farmers, the wood-fire craft, and the promise behind every block of pure Himalayan jaggery.",
    url: PAGE_URL,
    siteName: "SakharSansar",
    images: [
      {
        url: "/hero.jpg",
        width: 1200,
        height: 630,
        alt: "The Sankhuwasabha valley at first light, home of SakharSansar's wood-fired jaggery",
      },
    ],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Story | SakharSansar",
    description:
      "Seven generations of slow sweetness from Sankhuwasabha — the land, the farmers, the craft, the promise.",
    images: ["/hero.jpg"],
  },
};

export default function OurStory() {
  const aboutJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "Our Story | SakharSansar",
    "description": PAGE_DESC,
    "url": PAGE_URL,
    "primaryImageOfPage": "https://sakharsansar.com/hero.jpg",
    "about": {
      "@type": "Organization",
      "name": "SakharSansar",
      "alternateName": ["Sakhar Sansar", "Sakhar"],
      "url": "https://sakharsansar.com",
      "logo": "https://sakharsansar.com/word-logo.svg",
      "description":
        "SakharSansar makes 100% organic, chemical-free Himalayan jaggery (sakhar), wood-fired by a cooperative of 42 farming families in Sankhuwasabha, Nepal.",
      "foundingLocation": {
        "@type": "Place",
        "name": "Sankhuwasabha, Koshi Province, Nepal",
      },
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Sankhuwasabha",
        "addressRegion": "Koshi Province",
        "addressCountry": "NP",
      },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://sakharsansar.com",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Our Story",
        "item": PAGE_URL,
      },
    ],
  };

  return (
    <>
      <Script
        id="ld-about"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <Script
        id="ld-breadcrumb"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <OrderDrawer />
      <main className="overflow-x-hidden">
        {/* Frames mirror the reference About-Us flow, top to bottom */}
        <StorySection />        {/* 1 · A bit about us (peach hero) */}
        <StoryWelcomeSection />  {/* 2 · Nice to meet us (green) */}
        <StoryNatureSection />   {/* 3 · Pure is in our nature (green) */}
        <StoryMissionSection />  {/* 4 · Real food, nothing added (green) */}
        <StoryProcessSection />  {/* · How it's made — making-process film (peach) */}
        <StoryRootsSection />    {/* 5 · Chemical-free at our roots (peach) */}
        <FarmersSection />       {/* 6 · Meet the makers (peach) */}
        <StoryHeritageSection /> {/* 7 · Seven generations (peach) */}
        <StoryFaqsSection />     {/* · Good to know */}
        <StoryCtaSection />      {/* 8 · Taste the whole range (green grid) */}
      </main>
      <Footer />
    </>
  );
}
