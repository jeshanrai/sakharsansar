import { nepaliPosts } from "@/lib/blog";

/**
 * Twitter card for a Nepali article.
 *
 * The renderer is the English route's — same layout, same photo treatment, and
 * it reads the post's own title and date, so nothing about it is
 * language-specific. Only the slug list differs: this segment owns the Nepali
 * posts, the other owns the English ones.
 *
 * Route segment config cannot be re-exported — Next needs it as a literal in
 * the file that owns the route — so `dynamicParams` and `generateStaticParams`
 * are declared here rather than pulled through with the rest.
 */
export { default, alt, size, contentType } from "@/app/blog/[slug]/opengraph-image";

export const dynamicParams = false;

export function generateStaticParams() {
  return nepaliPosts().map((post) => ({ slug: post.slug }));
}
