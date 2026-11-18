import price from "@/data/sakhar-price.json";

/**
 * Last substantive edit of the non-post pages, by path.
 *
 * The sitemap leaves `lastmod` off any page without a real date (see the note
 * in sitemap.ts): a fabricated date teaches Google to ignore the field
 * sitewide. A page goes in here only on the day its copy actually changes, and
 * the same value feeds the page's own `dateModified` where its schema has one,
 * so the sitemap and the structured data cannot disagree.
 *
 * Posts are not listed: they carry `updated` in blog.json.
 */
export const PAGE_UPDATED: Record<string, string> = {
  "/": "2026-11-18",
  "/sakhar-price": price.updated ?? price.date,
  "/products/organic-jaggery-block": "2026-11-18",
  "/products/jaggery-powder": "2026-11-18",
  "/ne/products/organic-jaggery-block": "2026-11-18",
  "/ne/products/jaggery-powder": "2026-11-18",
};

/** The page's last edit as a Date, for the sitemap, or undefined. */
export function pageLastModified(path: string): Date | undefined {
  const iso = PAGE_UPDATED[path];
  return iso ? new Date(iso) : undefined;
}
