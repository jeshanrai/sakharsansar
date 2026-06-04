import { Metadata } from "next";
import dynamic from "next/dynamic";
import FavouritesContent from "@/components/favourites/FavouritesContent";

const Footer = dynamic(() => import("@/components/layout/Footer"));
const OrderDrawer = dynamic(() => import("@/components/layout/OrderDrawer"));

export const metadata: Metadata = {
  title: "Your Favourites — Saved Sakhar",
  description:
    "Your saved sakhar. Revisit the pure, wood-fired Himalayan jaggery forms you love and add them to your order.",
  robots: { index: false, follow: true },
  alternates: {
    canonical: "https://sakharsansar.com/favourites",
  },
};

export default function FavouritesPage() {
  return (
    <>
      <OrderDrawer />
      <main className="overflow-x-hidden">
        <FavouritesContent />
      </main>
      <Footer />
    </>
  );
}
