import { renderOgCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt =
  "Shop pure Sakhar: eight forms of organic, wood-fired Himalayan jaggery from Sankhuwasabha";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOgCard({
    eyebrow: "SHOP · SANKHUWASABHA",
    title: "Eight Forms of Pure Sakhar",
    subtitle:
      "Blocks, powder, cubes and liquid jaggery, direct from farmers.",
    chips: ["Chemical Free", "Wood-Fired", "Ships Pan-Nepal"],
    // Deliberately NOT a /products/* photo: every image in that folder is a
    // "gudworld"-branded packshot from another company, so putting one on the
    // shop's social card would advertise a competitor's packaging. Swap this
    // for a real SakharSansar product shot once one exists.
    image: "/hero.jpg",
  });
}
