import { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { ORG_ID, WEBSITE_ID, breadcrumbLd } from "@/lib/seo";
import { SITE, absoluteUrl } from "@/lib/site";
import OrderDrawer from "@/components/layout/OrderDrawer";
import Footer from "@/components/layout/Footer";
import StorySection from "@/components/sections/StorySection";
import StoryWelcomeSection from "@/components/sections/StoryWelcomeSection";
import StoryNatureSection from "@/components/sections/StoryNatureSection";
import StoryMissionSection from "@/components/sections/StoryMissionSection";
import StoryProcessSection from "@/components/sections/StoryProcessSection";
import StoryRootsSection from "@/components/sections/StoryRootsSection";
import FarmersSection from "@/components/sections/FarmersSection";
import StoryFaqsSection from "@/components/sections/StoryFaqsSection";
import StoryCtaSection from "@/components/sections/StoryCtaSection";
import { alternates, openGraph, twitter } from "@/lib/metadata";

const PAGE_PATH = "/our-story";
const PAGE_URL = absoluteUrl(PAGE_PATH);
const PAGE_DESC =
  "Seven generations of slow sweetness from Sankhuwasabha. Meet the 42 farming families, the wood-fire craft, and the chemical-free promise behind SakharSansar's pure Himalayan jaggery (sakhar).";

export const metadata: Metadata = {
  title: "Our Story: Wood-Fired Jaggery from Sankhuwasabha",
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
  alternates: alternates({ canonical: PAGE_PATH }),
  openGraph: openGraph({
    title: "Our Story | SakharSansar",
    description:
      "Seven generations of slow sweetness from Sankhuwasabha: the land, the farmers, the wood-fire craft, and the promise behind every block of pure Himalayan jaggery.",
    url: PAGE_PATH,
    type: "article",
  }),
  twitter: twitter({
    title: "Our Story | SakharSansar",
    description:
      "Seven generations of slow sweetness from Sankhuwasabha: the land, the farmers, the craft, the promise.",
  }),
};

export default function OurStory() {
  const aboutJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${PAGE_URL}#webpage`,
    name: "Our Story | SakharSansar",
    description: PAGE_DESC,
    url: PAGE_URL,
    isPartOf: { "@id": WEBSITE_ID },
    inLanguage: SITE.lang,
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: absoluteUrl("/hero.jpg"),
    },
    // The Organization is fully described once, sitewide; this is the page
    // Google should treat as the authoritative page *about* that entity.
    about: { "@id": ORG_ID },
    mainEntity: { "@id": ORG_ID },
  };

  const breadcrumbJsonLd = breadcrumbLd([
    { name: "Our Story", path: PAGE_PATH },
  ]);

  return (
    <>
      <JsonLd data={aboutJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <OrderDrawer />
      <main className="overflow-x-hidden">
        {/* Frames mirror the reference About-Us flow, top to bottom */}
        <StorySection />        {/* 1 · A bit about us (peach hero) */}
        <StoryWelcomeSection />  {/* 2 · Nice to meet us (green) */}
        <StoryNatureSection />   {/* 3 · Pure is in our nature (green) */}
        <StoryMissionSection />  {/* 4 · Real food, nothing added (green) */}
        <StoryProcessSection />  {/* · How it's made — making-process film (peach) */}
        <StoryRootsSection />    {/* 5 · Chemical-free at our roots (peach) */}
        <FarmersSection />       {/* 6 · Meet the maker (peach) */}
        <StoryFaqsSection />     {/* · Good to know */}
        <StoryCtaSection />      {/* 8 · Taste the whole range (green grid) */}
      </main>
      <Footer />
    </>
  );
}
