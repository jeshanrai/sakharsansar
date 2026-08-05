import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/**
 * Web app manifest. Beyond installability, this is what gives the site a
 * proper name and icon when someone adds it to a phone home screen — the
 * common way customers in Nepal return to a shop they've bought from.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name} — ${SITE.tagline}`,
    short_name: SITE.name,
    description: SITE.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#F5EDE0",
    theme_color: "#F5EDE0",
    lang: SITE.lang,
    categories: ["food", "shopping", "lifestyle"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/logo-mark.webp", sizes: "240x240", type: "image/webp" },
    ],
  };
}
