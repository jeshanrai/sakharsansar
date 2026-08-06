import type { Metadata } from "next";
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
  alt: "SakharSansar: 100% organic, wood-fired Himalayan jaggery from Sankhuwasabha, Nepal",
} as const;

export function openGraph(overrides: OpenGraph): OpenGraph {
  return {
    type: "website",
    siteName: SITE.name,
    locale: SITE.ogLocale,
    ...overrides,
  } as OpenGraph;
}

export function twitter(overrides: Twitter): Twitter {
  return {
    card: "summary_large_image",
    ...overrides,
  } as Twitter;
}
