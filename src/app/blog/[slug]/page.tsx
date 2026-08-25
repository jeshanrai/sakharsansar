import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostView from "@/components/blog/PostView";
import { englishPosts, posts as blogData } from "@/lib/blog";
import { postMetadata } from "@/lib/post-metadata";

/**
 * /blog/[slug] — the English journal.
 *
 * The Nepali articles used to render here too, at the same URL shape with a
 * different language inside. They now live at /ne/blog/<slug> and the old
 * URLs 301 there (see next.config.ts), so this route owns the English posts
 * only. Both routes render the same <PostView> and build their metadata from
 * the same helper, which is what keeps the hreflang pair reciprocal.
 */

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return englishPosts().map((post) => ({ slug: post.slug }));
}

/**
 * Every valid slug is known at build time from src/data/blog.json, so any
 * other slug is simply wrong. Without this, Next renders unknown slugs on
 * demand and `notFound()` inside the page yields a *soft* 404 — HTTP 200
 * carrying 404 content, which Google reports as an error and may index.
 * `false` makes the router return a real 404 before rendering anything.
 */
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogData.find((p) => p.slug === slug && p.lang !== "ne");
  if (!post) return { title: "Post Not Found", robots: { index: false } };
  return postMetadata(post);
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogData.find((p) => p.slug === slug && p.lang !== "ne");
  if (!post) notFound();
  return <PostView post={post} />;
}
