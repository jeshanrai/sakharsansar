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
    // icon.svg used to be listed here. It was a 1.87 MB SVG wrapping a
    // 3922x3922 base64 PNG — served as the favicon on every page load, and
    // requested twice, which was the single largest download on the site by an
    // order of magnitude. Replaced by app/icon.png at 192px and 7 KB.
    icons: [
      { src: "/icon.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      { src: "/logo-mark.webp", sizes: "240x240", type: "image/webp" },
    ],
  };
}
