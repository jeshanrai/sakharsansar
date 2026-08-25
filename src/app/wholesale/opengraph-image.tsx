import wholesale from "@/data/wholesale.json";
import { renderOgCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

/**
 * The wholesale card.
 *
 * This page fell back to the sitewide homepage card, which sells a kilo of
 * jaggery to one person — the wrong pitch entirely for the only page on the
 * site addressed to shop owners, chaku makers and hotel buyers, and the one
 * most likely to be forwarded between them rather than found in search.
 */
export const alt =
  "Wholesale sakhar from SakharSansar: bulk wood-fired jaggery supplied across Nepal";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOgCard({
    eyebrow: "WHOLESALE · SANKHUWASABHA",
    title: "Bulk Sakhar, Direct",
    subtitle: wholesale.description,
    chips: ["Chemical Free", "Wood-Fired", "Nationwide Delivery"],
    image: "/products/sakhar-block-2.jpg",
  });
}
