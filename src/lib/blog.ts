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
}

export const posts: BlogPost[] = blogData as BlogPost[];

/** True once there is at least one post to show. */
export const BLOG_ENABLED = posts.length > 0;

/** Newest first — the order the index and the feed both want. */
export function sortedPosts(): BlogPost[] {
  return [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
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
