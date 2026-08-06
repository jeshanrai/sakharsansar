import { renderOgCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt =
  "Contact SakharSansar for wholesale (B2B) and retail (B2C) organic jaggery orders across Nepal";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOgCard({
    eyebrow: "GET IN TOUCH",
    title: "Wholesale & Retail Orders",
    subtitle:
      "Talk to our cooperative in Sankhuwasabha. WhatsApp, call or email.",
    chips: ["B2B Bulk", "B2C Delivery", "Pan-Nepal"],
    image: "/farmers/farmer1.jpg",
  });
}
