import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import OrderDrawer from "@/components/layout/OrderDrawer";
import Footer from "@/components/layout/Footer";
import ShopContent from "./ShopContent";

export const metadata: Metadata = {
  title: "Shop | SakharSansar",
  description: "Browse our full collection of pure, natural jaggery products — blocks, powder, cubes, liquid, and more. Direct from Sankhuwasabha farmers.",
  alternates: {
    canonical: "https://sakharsansar.com/shop",
  },
  openGraph: {
    title: "Shop | SakharSansar",
    description: "Browse our full collection of pure, natural jaggery products — blocks, powder, cubes, liquid, and more.",
    url: "https://sakharsansar.com/shop",
    siteName: "SakharSansar",
    images: ["/hero.jpg"],
    type: "website",
  },
};

export default function ShopPage() {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <OrderDrawer />
      <main className="overflow-x-hidden pt-20">
        <ShopContent />
      </main>
      <Footer />
    </>
  );
}
