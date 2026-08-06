import { renderOgCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt =
  "The SakharSansar story: seven generations of wood-fired jaggery in Sankhuwasabha, Nepal";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOgCard({
    eyebrow: "OUR STORY",
    title: "Seven Generations of Slow Sweetness",
    subtitle:
      "42 farming families, one wood-fire craft, zero chemicals.",
    chips: ["42 Families", "Since 2024", "Wood-Fired"],
    // The founder on the farm, not story-hero.png — that one is a 4096×1024
    // banner, and cropping it to the card's square well leaves a flat strip.
    image: "/team/rashmita.jpg",
  });
}
