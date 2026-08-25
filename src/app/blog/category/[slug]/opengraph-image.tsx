import { notFound } from "next/navigation";
import { BLOG_CATEGORIES, findBlogCategory, postsTagged } from "@/lib/blog-categories";
import { renderOgCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

/**
 * A card per journal category.
 *
 * Like the shop categories, these seven hubs advertised no `og:image` at all.
 * They are the pages that answer a question rather than sell something, which
 * makes them the ones somebody links to in a thread — and a link with no card
 * gets a fraction of the clicks.
 *
 * `alt` is the segment-wide fallback; the page names the card with the
 * category's own alt text in generateMetadata.
 */
export const alt = "The SakharSansar Journal: writing about sakhar from Sankhuwasabha";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export const dynamicParams = false;

export function generateStaticParams() {
  return BLOG_CATEGORIES.map((c) => ({ slug: c.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = findBlogCategory(slug);
  if (!cat) notFound();

  // The newest article in the category, so each hub's card carries a photo
  // from the writing it actually collects.
  const [post] = postsTagged(cat.tag);

  return renderOgCard({
    eyebrow: `JOURNAL · ${cat.tag.toUpperCase()}`,
    title: cat.heading,
    subtitle: cat.description,
    image: post?.image,
  });
}
