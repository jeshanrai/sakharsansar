import type { Metadata } from "next";
import { BLOG_ENABLED } from "./blog";
import { LOCALES, type Locale } from "./hreflang";
import { SITE } from "./site";

/**
 * Helpers for per-page Open Graph and Twitter metadata.
 *
 * Next.js does *not* deep-merge these objects: a page that exports
 * `openGraph: { title }` replaces the root layout's entire `openGraph` block,
 * silently dropping `siteName`, `locale` and `type`. The same applies to
 * `twitter`, where losing `card` downgrades every shared link from a large
 * image card to a thumbnail.
 *
 * So pages build their blocks through these helpers instead of writing the
 * object literal directly — the shared fields come along automatically.
 */

type OpenGraph = NonNullable<Metadata["openGraph"]>;
type Twitter = NonNullable<Metadata["twitter"]>;
type Alternates = NonNullable<Metadata["alternates"]>;


/**
 * `alternates` replaces wholesale too — and every page sets a canonical, so
 * the root layout's feed-discovery `<link rel="alternate">` was being dropped
 * everywhere except /blog. Routing canonicals through here restores it, and
 * only while the journal actually has posts to serve.
 */
export function alternates(overrides: Alternates): Alternates {
  return {
    ...(BLOG_ENABLED
      ? {
          types: {
            "application/rss+xml": [
              { url: "/feed", title: "SakharSansar Journal" },
            ],
          },
        }
      : {}),
    ...overrides,
  };
}

/**
 * The sitewide card, for pages that don't warrant bespoke artwork.
 *
 * A colocated `opengraph-image.tsx` only fills in when a page leaves `images`
 * unset, and it only covers its own route segment. Pages with neither — the
 * legal pages — advertised no image at all and shared as a bare text link, so
 * they point at the root card explicitly. Resolved against `metadataBase`.
 *
 * Do NOT make this a default inside `openGraph()`: it would override the
 * colocated per-page cards on /shop, /products/* and /blog/*.
 */
export const DEFAULT_OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  // Next infers `og:image:type` for a colocated opengraph-image.tsx, but not
  // for a URL written out by hand like this one — so every page pointing here
  // shipped a card with no declared type. Some scrapers skip an image they
  // cannot type without fetching it first.
  type: "image/png",
  alt: "SakharSansar: 100% organic, wood-fired Himalayan jaggery from Sankhuwasabha, Nepal",
} as const;

/**
 * `omitType` means "this page emits its own og:type, leave it out".
 *
 * The product pages need og:type=product, which Next cannot express: its
 * OpenGraph type is a closed union with no 'product' member, and the resolver
 * throws on anything outside it. They render the tag themselves and need this
 * helper to stay quiet, but simply omitting `type` from the overrides falls
 * back to the "website" default below and ships two competing og:type tags.
 * Passing `undefined` is no good either — the resolver keys off `'type' in og`,
 * so the key would still be there and switch(undefined) throws. Hence a
 * separate flag rather than a sentinel value in the overrides.
 */
export function openGraph(
  overrides: OpenGraph,
  opts?: { omitType?: boolean; locale?: Locale; hasTranslation?: boolean },
): OpenGraph {
  // The locale used to be hardcoded to the site default, which meant the three
  // natively-written Devanagari articles under /ne announced themselves to
  // every scraper as `og:locale: en_NP`. Facebook and the rest use that to
  // decide which audience a shared link is for.
  const locale = opts?.locale ?? "en";
  const other: Locale = locale === "en" ? "ne" : "en";
  return {
    ...(opts?.omitType ? {} : { type: "website" }),
    siteName: SITE.name,
    locale: LOCALES[locale].ogLocale,
    // Only when the counterpart exists. `og:locale:alternate` naming a page
    // that was never translated is the same mistake as a non-reciprocal
    // hreflang: it describes a version of the page nobody can be sent to.
    ...(opts?.hasTranslation ? { alternateLocale: LOCALES[other].ogLocale } : {}),
    ...overrides,
  } as OpenGraph;
}

export function twitter(overrides: Twitter): Twitter {
  return {
    card: "summary_large_image",
    ...overrides,
  } as Twitter;
}
