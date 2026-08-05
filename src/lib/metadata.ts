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
