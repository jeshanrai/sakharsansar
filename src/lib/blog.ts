import blogData from "@/data/blog.json";

/**
 * The journal, and whether it currently has anything in it.
 *
 * The original three posts were retired as outdated. Rather than tear the blog
 * out of the codebase, every place that surfaces it — the nav, the footer, the
 * sitemap, the RSS feed, llms.txt, the /blog route itself — keys off
 * `BLOG_ENABLED` below. With no posts, the section disappears from the site
 * and from search engines entirely; add a post back to `src/data/blog.json`
 * and it all reappears on the next build with no code changes.
 *
 * The one thing that does not self-heal is the redirect block in
 * `next.config.ts` covering the three retired slugs — see the note there.
 */

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string;
  date: string;
  author: string;
  image: string;
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
