import { renderOgCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt =
  "Shop pure Sakhar: blocks, powder and dry fruits, wood-fired in Sankhuwasabha";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOgCard({
    eyebrow: "SHOP · SANKHUWASABHA",
    title: "Three Forms of Pure Sakhar",
    subtitle:
      "Blocks, powder and sakhar-coated dry fruits, direct from farmers.",
    chips: ["Chemical Free", "Wood-Fired", "Ships Pan-Nepal"],
    // Now a real SakharSansar shot — our own kraft pouch with our own sticker
    // on it. The note that used to sit here warned that this folder held
    // another company's branded packshots; those have been removed.
    image: "/products/sakhar-powder.jpg",
  });
}
