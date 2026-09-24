import data from "@/data/content.json";

/**
 * The fields a product card needs, and nothing else.
 *
 * The product grids on the home page, the shop and the favourites page are
 * client components, and they used to import content.json directly — which
 * put every product's long description, tasting notes, how-to-use copy and FAQ
 * into the browser bundle, along with the testimonials and site FAQs that live
 * in the same file. About 3 KB per product, for a card that shows a name, a
 * price and a photo.
 *
 * Server pages call productCards() and pass the result down as a prop, so only
 * these fields cross to the browser. Client components import the type only.
 */
export type ProductCard = {
  slug: string;
  name: string;
  price: string;
  weight: string;
  image: string;
  category: string;
  /** Searched by the shop's filter box. */
  description: string;
};

export function productCards(): ProductCard[] {
  return data.products.map(({ slug, name, price, weight, image, category, description }) => ({
    slug,
    name,
    price,
    weight,
    image,
    category,
    description,
  }));
}
