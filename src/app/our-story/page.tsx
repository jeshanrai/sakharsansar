import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import OrderDrawer from "@/components/layout/OrderDrawer";
import Footer from "@/components/layout/Footer";
import StorySection from "@/components/sections/StorySection";
import StoryChaptersSection from "@/components/sections/StoryChaptersSection";
import FarmersSection from "@/components/sections/FarmersSection";
import StoryCtaSection from "@/components/sections/StoryCtaSection";

export const metadata: Metadata = {
  title: "Our Story | SakharSansar",
  description: "Seven generations of slow sweetness. Read the story of Sankhuwasabha, our farmers, the wood-fire craft, and the promise behind every block of pure Himalayan jaggery.",
  alternates: { canonical: "https://sakharsansar.com/our-story" },
  openGraph: {
    title: "Our Story | SakharSansar",
    description: "Seven generations of slow sweetness from Sankhuwasabha — the land, the farmers, the craft, the promise.",
    url: "https://sakharsansar.com/our-story",
    siteName: "SakharSansar",
    images: ["/hero.jpg"],
    type: "website",
  },
};

export default function OurStory() {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <OrderDrawer />
      <main className="overflow-x-hidden">
        <StorySection />
        <StoryChaptersSection />
        <FarmersSection />
        <StoryCtaSection />
      </main>
      <Footer />
    </>
  );
}
