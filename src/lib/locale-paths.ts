import type { Locale } from "./hreflang";

/**
 * Which English pages have a Nepali counterpart, and where it lives.
 *
 * One list, read by everything that needs to know: the nav and footer (so a
 * Nepali reader's links stay in Nepali where a Nepali page exists), the
 * breadcrumb root, the language switcher, the hreflang pairs and the sitemap.
 * Before this, each of those assumed there was no /ne/shop, and said so in a
 * comment; a second list anywhere would be how they drift apart again.
 *
 * Only whole pages go here. docs/i18n-plan.md is explicit that a /ne/ page
 * which is mostly English is worse than no page, so a route is added when its
 * Nepali copy is written, not before.
 *
 * Deliberately free of data imports: the nav is a client component on every
 * page, and this file ends up in its bundle.
 */

/** Product slugs with a Nepali page. Kept in step with content.json by the
 *  /ne/products route, which 404s at build time on a slug it cannot find. */
export const NE_PRODUCT_SLUGS = [
  "organic-jaggery-block",
  "jaggery-powder",
  "mixed-dry-fruits",
] as const;

/** English path → Nepali path. The Nepali articles pair through
 *  `translationOf` in blog.json instead, because those are editorial pairs,
 *  not mirrored routes, and one of them has no English twin. */
export const NE_PAGES: Record<string, string> = {
  "/": "/ne",
  "/shop": "/ne/shop",
  "/wholesale": "/ne/wholesale",
  "/blog": "/ne/blog",
  ...Object.fromEntries(
    NE_PRODUCT_SLUGS.map((slug) => [`/products/${slug}`, `/ne/products/${slug}`]),
  ),
};

/** The Nepali counterpart of an English path, if there is one. */
export function nePathFor(enPath: string): string | undefined {
  return NE_PAGES[enPath];
}

/** The same site link, in the reader's language where that page exists. */
export function localizedHref(href: string, locale: Locale): string {
  return locale === "ne" ? (NE_PAGES[href] ?? href) : href;
}

/** Both directions, for the language switcher's path → counterpart map. */
export function pagePairs(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const [en, ne] of Object.entries(NE_PAGES)) {
    map[en] = ne;
    map[ne] = en;
  }
  return map;
}
