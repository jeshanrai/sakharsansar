import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import OrderDrawer from "@/components/layout/OrderDrawer";
import Footer from "@/components/layout/Footer";
import StorySection from "@/components/sections/StorySection";
import FarmersSection from "@/components/sections/FarmersSection";
import WaysToEnjoySection from "@/components/sections/WaysToEnjoySection";
import BenefitsSection from "@/components/sections/BenefitsSection";
import ComparisonSection from "@/components/sections/ComparisonSection";
import ProcessSection from "@/components/sections/ProcessSection";

export const metadata: Metadata = {
  title: "Our Story | SakharSansar",
  description: "Learn about SakharSansar's roots in Sankhuwasabha, our farmers, traditional jaggery-making process, and the values behind every block of pure Himalayan gur.",
  alternates: {
    canonical: "https://sakharsansar.com/our-story",
  },
  openGraph: {
    title: "Our Story | SakharSansar",
    description: "Learn about SakharSansar's roots in Sankhuwasabha, our farmers, traditional jaggery-making process, and the values behind every block of pure Himalayan gur.",
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
        <FarmersSection />
        <ProcessSection />
        <WaysToEnjoySection />
        <BenefitsSection />
        <ComparisonSection />
      </main>
      <Footer />
    </>
  );
}
