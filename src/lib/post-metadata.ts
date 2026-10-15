import type { Metadata } from "next";
import { type BlogPost, postPath, translationPair } from "./blog";
import { languageAlternates } from "./hreflang";
import { alternates, openGraph, twitter } from "./metadata";
import { OG_CONTENT_TYPE } from "./og";

/**
 * Metadata for one journal article, in either language.
 *
 * Shared by /blog/[slug] and /ne/blog/[slug] so the two locales cannot drift —
 * which matters most for the `hreflang` pair, since an annotation only counts
 * when both sides agree and both are generated here from the same call.
 */

/**
 * The post's social card, named with the post's own alt text.
 *
 * The card art comes from the colocated opengraph-image.tsx; this points at
 * that route and attaches a description of it. It has to be done here because
 * `export const alt` in that file is one string for the whole `[slug]`
 * segment, so every post advertised the same og:image:alt — "SakharSansar
 * Journal: stories from Sankhuwasabha" — describing no particular one.
 * `generateImageMetadata` is the documented way to vary it per slug, but it
 * cannot coexist with the `generateStaticParams` + `dynamicParams = false`
 * pair that keeps unknown slugs from rendering a card, and 404ing bad slugs is
 * worth more than a per-slug image URL.
 *
 * `post.imageAlt` is the alt already written for the hero photo, and the card
 * is built from that photo, so it describes the image rather than inventing a
 * second description of the same picture.
 *
 * Next appends a content hash for cache busting; the route serves the same
 * image without it.
 */
function socialCard(post: BlogPost, route: "opengraph-image" | "twitter-image") {
  return {
    url: `${postPath(post)}/${route}`,
    width: 1200,
    height: 630,
    // Written out because Next only infers the type when it resolves the
    // colocated file itself; naming the route by hand, as we have to here,
    // skips that and ships a card with no declared type.
    type: OG_CONTENT_TYPE,
    alt: post.imageAlt,
  };
}

export function postMetadata(post: BlogPost): Metadata {
  const pair = translationPair(post.slug);
  const path = postPath(post);

  return {
    // The root layout's `title.template` appends "| SakharSansar", which costs
    // 15 of the ~60 characters Google shows. Posts whose headline needs the
    // full width set `seoTitle` and opt out of the template entirely.
    title: post.seoTitle ? { absolute: post.seoTitle } : post.title,
    description: post.metaDescription ?? post.description,
    alternates: alternates({
      canonical: path,
      // A translated pair covers one topic in two languages. Without
      // reciprocal hreflang Google picks one and treats the other as a
      // near-duplicate; with it, each is served to the audience it was written
      // for. Generated from one place so both halves always match, and omitted
      // entirely for a post with no counterpart — an annotation pointing at a
      // page that does not exist is worse than none.
      ...(pair
        ? {
            languages: languageAlternates(
              post.lang === "ne"
                ? { ne: path, en: postPath(pair) }
                : { en: path, ne: postPath(pair) },
            ),
          }
        : {}),
    }),
    authors: [{ name: post.author }],
    openGraph: openGraph(
      {
        title: post.title,
        description: post.description,
        url: path,
        type: "article",
        publishedTime: post.date,
        modifiedTime: post.updated ?? post.date,
        authors: [post.author],
        tags: post.tags,
        images: [socialCard(post, "opengraph-image")],
      },
      // The three Devanagari articles were announcing themselves as en_NP.
      // `hasTranslation` gates og:locale:alternate on a counterpart actually
      // existing — one of the Nepali posts has none.
      { locale: post.lang === "ne" ? "ne" : "en", hasTranslation: Boolean(pair) },
    ),
    twitter: twitter({
      title: post.title,
      description: post.description,
      images: [socialCard(post, "twitter-image")],
    }),
  };
}
