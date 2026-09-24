import { Metadata } from "next";
import dynamic from "next/dynamic";
import FavouritesContent from "@/components/favourites/FavouritesContent";
import { alternates } from "@/lib/metadata";
import { productCards } from "@/lib/product-cards";

const Footer = dynamic(() => import("@/components/layout/Footer"));

export const metadata: Metadata = {
  title: "Your Favourites: Saved Sakhar",
  description:
    "Your saved sakhar. Revisit the pure, wood-fired Himalayan jaggery forms you love and add them to your order.",
  // Personalised, client-state page — nothing here is worth indexing, but the
  // links out to product pages still are, hence follow: true.
  robots: { index: false, follow: true },
  alternates: alternates({
    canonical: "/favourites",
  }),
};

export default function FavouritesPage() {
  return (
    <>
      <main className="overflow-x-hidden">
        <FavouritesContent catalogue={productCards()} />
      </main>
      <Footer />
    </>
  );
}
