import blogData from "@/data/blog.json";

/**
 * The journal, and whether it currently has anything in it.
 *
 * Every place that surfaces the blog — the nav, the footer, the sitemap, the
 * RSS feed, llms.txt, the /blog route itself — keys off `BLOG_ENABLED` below.
 * With no posts the section disappears from the site and from search engines
 * entirely; add a post to `src/data/blog.json` and it all reappears on the
 * next build with no code changes. The temporary /blog redirect in
 * `next.config.ts` lifts itself the same way.
 *
 * The one thing that does not self-heal is the redirect block covering the
 * three retired slugs — see the note in `next.config.ts`.
 *
 * Post bodies are markdown-ish; `src/lib/article.ts` parses them, and the
 * page derives its HowTo and FAQ structured data from the same blocks it
 * renders.
 */

export interface BlogPost {
  slug: string;
  /** On-page H1. Free to be longer and more human than the title tag. */
  title: string;
  /**
   * Title tag, when it needs to differ from the H1 — set it where the H1 runs
   * past ~45 characters, since the layout template appends "| SakharSansar".
   * Used verbatim (no brand suffix), so keep it under 60 characters.
   */
  seoTitle?: string;
  description: string;
  content: string;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  /** ISO date of the last substantive edit. Feeds `dateModified`. */
  updated?: string;
  author: string;
  authorRole?: string;
  /** Two lines: who they are and why they can speak to this. An E-E-A-T signal. */
  authorBio?: string;
  authorImage?: string;
  image: string;
  /** Hero alt text. Falls back to the title, which is rarely descriptive enough. */
  imageAlt?: string;
  tags: string[];
  /**
   * BCP-47 language of the body, when it is not the site default. The Nepali
   * posts set "ne" so the rendered `<article lang>`, the `inLanguage` in the
   * schema and the hreflang pair all agree — without it Google reads a
   * Devanagari page as badly written English and ranks it accordingly.
   */
  lang?: string;
  /**
   * The same topic written in another language, as a slug in this journal.
   * Declared on BOTH posts of a pair; the page turns it into reciprocal
   * hreflang links, which is what stops the two being read as duplicates.
   */
  translationOf?: string;
  /**
   * Consumables and equipment for a post whose H2s are numbered tests, feeding
   * HowTo schema. Per-post because these were once hardcoded to the iodine
   * purity test and would have been attached to any post that grew a
   * "Test 1:" heading.
   */
  howTo?: { supplies?: string[]; tools?: string[]; totalTime?: string };
  /**
   * Present only on a recipe post. The ingredients and steps come from the
   * prose (see `recipeParts`); these are the facts the prose cannot carry.
   */
  recipe?: {
    prepTime?: string;
    cookTime?: string;
    totalTime?: string;
    recipeYield?: string;
    recipeCategory?: string;
    recipeCuisine?: string;
  };
}

/**
 * Where a post lives.
 *
 * The journal is bilingual, and the three Nepali articles used to sit at
 * /blog/<slug> alongside the English ones — same shelf, different language,
 * nothing in the URL to say so. They now live under /ne/, which is the locale
 * prefix the rest of the site will adopt if the Nepali experiment works
 * (see docs/i18n-plan.md). English stays un-prefixed so no existing English
 * URL had to move.
 *
 * Every link, sitemap entry, feed item and schema `@id` routes through here,
 * so a post's language decides its URL in exactly one place. The old
 * /blog/<nepali-slug> URLs 301 to the new ones — see next.config.ts.
 */
export function postPath(post: Pick<BlogPost, "slug" | "lang">): string {
  return post.lang === "ne" ? `/ne/blog/${post.slug}` : `/blog/${post.slug}`;
}

/** BCP-47 for a post. `lang` on the record is the short form. */
export function postLocale(post: Pick<BlogPost, "lang">): string {
  return post.lang === "ne" ? "ne-NP" : "en-NP";
}

/** The English half of the journal — what /blog lists and renders. */
export function englishPosts(): BlogPost[] {
  return posts.filter((p) => p.lang !== "ne");
}

/** The Nepali half — what /ne/blog renders. */
export function nepaliPosts(): BlogPost[] {
  return posts.filter((p) => p.lang === "ne");
}

export const posts: BlogPost[] = blogData as BlogPost[];

/** The other half of a translation pair, if this post declares one. */
export function translationPair(slug: string): BlogPost | undefined {
  const current = posts.find((p) => p.slug === slug);
  if (!current?.translationOf) return undefined;
  return posts.find((p) => p.slug === current.translationOf);
}

/** True once there is at least one post to show. */
export const BLOG_ENABLED = posts.length > 0;

/** Newest first — the order the index and the feed both want. */
/**
 * How many articles one page of the journal holds.
 *
 * The index rendered every post ever published, which is fine at ten and a
 * wall at fifty: one page carrying the whole archive gets slower with every
 * post, dilutes what any single URL is about, and gives a crawler one enormous
 * document instead of several focused ones.
 *
 * Twelve rather than six, because at ten posts a smaller page would split the
 * journal in two for no reason and put half of it a click further from the
 * home page. With the archive under this, `pageCount()` returns 1 and no
 * /blog/page/N route is generated at all — the split happens by itself on the
 * day the thirteenth post lands.
 */
export const POSTS_PER_PAGE = 12;

/** How many pages the journal currently needs. Always at least 1. */
export function pageCount(): number {
  return Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
}

/** The slice of the archive shown on page `n` (1-based), newest first. */
export function postsOnPage(n: number): BlogPost[] {
  const start = (n - 1) * POSTS_PER_PAGE;
  return sortedPosts().slice(start, start + POSTS_PER_PAGE);
}

export function sortedPosts(): BlogPost[] {
  return [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

/**
 * The posts to offer at the foot of `slug`, most relevant first.
 *
 * Ranked by how many tags they share with the current post, then by recency.
 * The previous rule — take the first two posts in file order — pointed every
 * article at the same two pages no matter what it was about, which wastes the
 * strongest internal links on the site: the ones a reader who finished the
 * article is most likely to follow. Tag overlap is a blunt relevance measure,
 * but it is the one the posts already carry, and it costs nothing to keep
 * accurate.
 *
 * Falls back to the newest posts if the slug is unknown, so a caller can never
 * end up with an empty rail.
 */
export function relatedPosts(slug: string, limit = 2): BlogPost[] {
  const current = posts.find((p) => p.slug === slug);
  if (!current) return sortedPosts().slice(0, limit);

  const tags = new Set(current.tags);

  return posts
    .filter((p) => p.slug !== slug)
    .map((post) => ({
      post,
      shared: post.tags.filter((t) => tags.has(t)).length,
    }))
    .sort(
      (a, b) =>
        b.shared - a.shared ||
        new Date(b.post.date).getTime() - new Date(a.post.date).getTime(),
    )
    .slice(0, limit)
    .map((scored) => scored.post);
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * "2026-08-07" → "7 August 2026".
 *
 * Formatted from the string parts rather than through `Date` or
 * `toLocaleDateString`: the stored dates are timezone-less calendar days, and
 * both of those would shift them by one in some timezones — which on a client
 * component shows up as a hydration mismatch.
 */
export function formatPostDate(iso: string): string {
  const [year, month, day] = iso.split("-");
  const name = MONTHS[Number(month) - 1];
  if (!name || !day || !year) return iso;
  return `${Number(day)} ${name} ${year}`;
}
