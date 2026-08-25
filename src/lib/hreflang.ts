import type { Metadata } from "next";

/**
 * Reciprocal `hreflang` annotations, generated rather than written.
 *
 * Two defects this fixes, both in the markup the site already emitted:
 *
 *   1. The pairs disagreed with themselves. One side said `hreflang="ne"` and
 *      the other `hreflang="en-NP"` — a bare language against a regional one.
 *      Google accepts either form, but not reliably when the two halves of a
 *      pair use different ones, and an annotation it distrusts is ignored.
 *   2. There was no `x-default`, so for every visitor who is neither an
 *      en-NP nor a ne-NP match — which is most of the internet — Google chose
 *      which version to show. We should choose.
 *
 * The rule that matters most: never hand-write a pair. Annotations are only
 * honoured when both sides point at each other, and hand-maintained pairs
 * break the first time a slug is renamed. Callers pass the two paths and this
 * emits both directions plus the default, identically on both pages.
 *
 * A page with no translation gets no annotations at all. That is deliberate:
 * an hreflang pointing at a page that does not exist, or at an untranslated
 * page in the wrong language, is worse than none — and one of the Nepali
 * articles has no English counterpart.
 */

export const LOCALES = {
  en: { hreflang: "en-NP", htmlLang: "en-NP", ogLocale: "en_NP" },
  ne: { hreflang: "ne-NP", htmlLang: "ne-NP", ogLocale: "ne_NP" },
} as const;

export type Locale = keyof typeof LOCALES;

/** `x-default` points at English: most traffic that matches neither reads it. */
export const DEFAULT_LOCALE: Locale = "en";

/**
 * The `languages` map for `alternates`, for a page that has a translation.
 *
 * Pass site-relative paths; `metadataBase` resolves them. Returns undefined
 * when there is no pair, so a caller can spread it unconditionally.
 */
export function languageAlternates(pair?: {
  en: string;
  ne: string;
}): NonNullable<Metadata["alternates"]>["languages"] | undefined {
  if (!pair) return undefined;
  return {
    [LOCALES.en.hreflang]: pair.en,
    [LOCALES.ne.hreflang]: pair.ne,
    "x-default": pair[DEFAULT_LOCALE],
  };
}

/**
 * The same map, typed for `sitemap.ts`.
 *
 * MetadataRoute.Sitemap wants `Languages<string>` while the page metadata type
 * allows URLs and descriptor objects, so the two cannot share one signature.
 * Both are built from this one shape, which is the part that matters: the
 * sitemap and the page can never disagree about who pairs with whom.
 */
export function languageAlternateUrls(pair: {
  en: string;
  ne: string;
}): Record<string, string> {
  return {
    [LOCALES.en.hreflang]: pair.en,
    [LOCALES.ne.hreflang]: pair.ne,
    "x-default": pair[DEFAULT_LOCALE],
  };
}
