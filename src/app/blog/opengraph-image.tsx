import { renderOgCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt =
  "SakharSansar Journal: jaggery recipes, health benefits and farm stories from Sankhuwasabha";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOgCard({
    eyebrow: "THE JOURNAL",
    title: "Letters from Sankhuwasabha",
    subtitle:
      "Recipes, rituals, and the slow stories behind every block.",
    chips: ["Recipes", "Benefits", "Farm Notes"],
    image: "/hero-cane-bg.jpg",
  });
}
