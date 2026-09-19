import price from "@/data/sakhar-price.json";
import content from "@/data/content.json";
import { renderOgCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

/**
 * The price card.
 *
 * A price is the one thing on this page somebody forwards to another person,
 * usually with "is this reasonable?" attached, so the card leads with the
 * figure rather than with the brand.
 */
export const alt =
  "Sankhuwasabha sakhar price in Nepal: what a kilo of wood-fired jaggery costs from SakharSansar";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOgCard({
    eyebrow: "PRICE · SANKHUWASABHA",
    title: "What a Kilo Costs",
    subtitle: price.description,
    chips: [
      ...content.products
        .filter((p) => p.slug !== "mixed-dry-fruits")
        .map((p) => `${p.price} / ${p.weight}`),
      "Pan-Nepal Delivery",
    ],
    image: "/products/sakhar-block-2.jpg",
  });
}
