import { Metadata } from "next";
import dynamic from "next/dynamic";
import ShopContent from "@/components/shop/ShopContent";

const Footer = dynamic(() => import("@/components/layout/Footer"));
const OrderDrawer = dynamic(() => import("@/components/layout/OrderDrawer"));

export const metadata: Metadata = {
  title: "Shop Pure Sakhar — Organic Himalayan Jaggery | SakharSansar",
  description:
    "Shop 100% organic Sakhar — wood-fired Himalayan jaggery from Sankhuwasabha. Eight pure forms (blocks, powder, cubes, liquid) direct from farmers. Chemical-free, premium quality.",
  keywords: [
    "Buy Sakhar Online",
    "Shop Organic Sakhar",
    "Pure Sakhar Nepal",
    "Himalayan Jaggery Shop",
    "Organic Jaggery Online",
    "Sankhuwasabha Sakhar",
    "Chemical-Free Sakhar",
    "Wood-fired Jaggery",
    "Premium Gur Nepal",
  ],
  alternates: {
    canonical: "https://sakharsansar.com/shop",
  },
  openGraph: {
    title: "Shop Pure Sakhar — Organic Himalayan Jaggery",
    description:
      "100% organic sakhar from Sankhuwasabha — eight pure forms, direct from farmers, shipped pan-Nepal.",
    url: "https://sakharsansar.com/shop",
    siteName: "SakharSansar",
    images: ["/hero.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop Pure Sakhar — Organic Himalayan Jaggery",
    description:
      "100% organic sakhar from Sankhuwasabha. Wood-fired, chemical-free, premium quality.",
    images: ["/hero.jpg"],
  },
};

export default function ShopPage() {
  return (
    <>
      <OrderDrawer />
      <main className="overflow-x-hidden">
        <ShopContent />
      </main>
      <Footer />
    </>
  );
}
