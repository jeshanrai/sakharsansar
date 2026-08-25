import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ArrowUpRight } from "lucide-react";
import Footer from "@/components/layout/Footer";
import OrderDrawer from "@/components/layout/OrderDrawer";
import JsonLd from "@/components/seo/JsonLd";
import { AnimatedWave } from "@/components/ui/StoryArt";
import { Daisy } from "@/components/ui/Doodles";
import {
  BLOG_CATEGORIES,
  findBlogCategory,
  postsTagged,
} from "@/lib/blog-categories";
import { formatPostDate, postPath } from "@/lib/blog";
import { WEBSITE_ID, ORG_ID, breadcrumbLd, itemListLd, postNodeId } from "@/lib/seo";
import { SITE, absoluteUrl } from "@/lib/site";
import { alternates, openGraph, twitter } from "@/lib/metadata";

/**
 * /blog/category/[slug] — a hub per journal topic.
 *
 * The eight filter pills on /blog were client state: narrowing the journal to
 * recipes produced no URL, so the view could not be shared and a crawler saw
 * one index rather than eight topic pages. Each category with written copy now
 * renders server-side with its own H1, canonical and intro.
 *
 * Sits under /blog/category/ rather than /blog/ so it cannot collide with a
 * post slug — the sibling [slug] route runs with dynamicParams false and would
 * otherwise have to reserve eight words no post is allowed to use.
 */

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return BLOG_CATEGORIES.map((c) => ({ slug: c.slug }));
}

/** Fully enumerated above, so anything else is a 404 rather than a soft one. */
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = findBlogCategory(slug);
  if (!cat) return { title: "Not Found", robots: { index: false } };

  return {
    title: cat.title,
    description: cat.description,
    alternates: alternates({ canonical: `/blog/category/${cat.slug}` }),
    openGraph: openGraph({
      title: cat.heading,
      description: cat.description,
      url: `/blog/category/${cat.slug}`,
    }),
    twitter: twitter({ title: cat.heading, description: cat.description }),
  };
}

export default async function BlogCategoryPage({ params }: Props) {
  const { slug } = await params;
  const cat = findBlogCategory(slug);
  if (!cat) notFound();

  const tagged = postsTagged(cat.tag);
  // A hub whose last post was retagged is a heading over nothing.
  if (tagged.length === 0) notFound();

  const path = `/blog/category/${cat.slug}`;

  const collection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name: cat.title,
    description: cat.description,
    isPartOf: { "@id": WEBSITE_ID },
    publisher: { "@id": ORG_ID },
    inLanguage: SITE.lang,
  };

  return (
    <>
      <JsonLd data={collection} />
      <JsonLd
        data={itemListLd(
          cat.heading,
          tagged.map((p) => ({
            name: p.title,
            path: postPath(p),
            id: postNodeId(postPath(p)),
          })),
        )}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "Journal", path: "/blog" },
          { name: cat.tag, path },
        ])}
      />

      <OrderDrawer />

      <main className="bg-cream overflow-x-hidden">
        <header className="relative bg-peach overflow-hidden pt-32 sm:pt-36 pb-24 sm:pb-32 px-6 sm:px-10 lg:px-16">
          <Daisy aria-hidden className="pointer-events-none absolute top-28 right-[12%] w-16 h-16 text-peach-line/50 -rotate-12 hidden md:block" />

          <div className="relative z-10 max-w-[820px] mx-auto">
            <nav aria-label="Breadcrumb" className="mb-7">
              <ol className="flex items-center gap-2 label-caps text-jaggery/70 min-w-0">
                <li className="shrink-0">
                  <Link href="/" className="hover:text-grove transition-colors">Home</Link>
                </li>
                <ChevronRight className="w-3 h-3 shrink-0 text-jaggery/30" strokeWidth={2.5} aria-hidden />
                <li className="shrink-0">
                  <Link href="/blog" className="hover:text-grove transition-colors">Journal</Link>
                </li>
                <ChevronRight className="w-3 h-3 shrink-0 text-jaggery/30" strokeWidth={2.5} aria-hidden />
                <li aria-current="page" className="text-grove truncate">{cat.tag}</li>
              </ol>
            </nav>

            <p className="label-caps text-jaggery/70 mb-4">
              {tagged.length} {tagged.length === 1 ? "article" : "articles"}
            </p>
            <h1 className="font-marker uppercase text-jaggery leading-[0.95] tracking-tight text-[clamp(2.25rem,5.5vw,4rem)] text-balance">
              {cat.heading}
            </h1>
            <p className="text-jaggery/75 text-body mt-6 max-w-2xl leading-relaxed">
              {cat.intro}
            </p>
          </div>

          <AnimatedWave aria-hidden className="absolute bottom-0 left-0 w-full h-[48px] sm:h-[68px] text-cream" />
        </header>

        {/* ─── The articles ───────────────────────────────────────── */}
        <section className="px-6 sm:px-10 lg:px-16 pt-14 sm:pt-20 pb-20 sm:pb-28">
          <div className="max-w-[1080px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {tagged.map((post) => (
              <article key={post.slug} className="group">
                <Link href={postPath(post)} className="block">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-ivory ring-1 ring-jaggery/8">
                    <Image
                      src={post.image}
                      alt={post.imageAlt ?? post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 340px"
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                  </div>
                  <div className="mt-4 flex items-center gap-2.5">
                    <time dateTime={post.date} className="label-caps text-jaggery/70">
                      {formatPostDate(post.date)}
                    </time>
                  </div>
                  <h2
                    lang={post.lang ?? undefined}
                    className="font-display font-bold text-jaggery text-h4 leading-snug tracking-tight mt-2 group-hover:text-grove transition-colors text-balance"
                  >
                    {post.title}
                  </h2>
                  <p className="text-jaggery/70 text-[15px] leading-relaxed mt-2 line-clamp-3">
                    {post.description}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 label-caps text-grove">
                    Read
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={2} aria-hidden />
                  </span>
                </Link>
              </article>
            ))}
          </div>

          {/* Sideways links to the other hubs — the reason these pages are
              worth having is that they connect the journal to itself. */}
          <nav aria-label="Other categories" className="max-w-[1080px] mx-auto mt-16 pt-10 border-t border-jaggery/10">
            <p className="label-caps text-jaggery/70 mb-4">More from the journal</p>
            <ul className="flex flex-wrap gap-2.5">
              <li>
                <Link
                  href="/blog"
                  className="inline-flex items-center h-9 px-4 rounded-full border border-jaggery/15 text-[13px] font-medium text-jaggery/70 hover:text-jaggery hover:border-jaggery/30 transition-colors"
                >
                  All articles
                </Link>
              </li>
              {BLOG_CATEGORIES.filter((c) => c.slug !== cat.slug).map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/blog/category/${c.slug}`}
                    prefetch={false}
                    className="inline-flex items-center h-9 px-4 rounded-full border border-jaggery/15 text-[13px] font-medium text-jaggery/70 hover:text-jaggery hover:border-jaggery/30 transition-colors"
                  >
                    {c.tag}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </section>
      </main>

      <Footer />
    </>
  );
}
