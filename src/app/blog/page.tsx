import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Footer from "@/components/layout/Footer";
import BlogEditorsPicks from "@/components/sections/blog/BlogEditorsPicks";
import BlogCategories from "@/components/sections/blog/BlogCategories";
import JsonLd from "@/components/seo/JsonLd";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { BLOG_ENABLED, pageCount, postPath, postsOnPage, sortedPosts } from "@/lib/blog";
import { BLOG_CATEGORIES } from "@/lib/blog-categories";
import { ORG_ID, WEBSITE_ID } from "@/lib/seo";
import { SITE, absoluteUrl } from "@/lib/site";
import { Bee, Ladybug, AnimatedWave } from "@/components/ui/StoryArt";
import { Daisy } from "@/components/ui/Doodles";
import { ArrowRight } from "lucide-react";
import { alternates, openGraph, twitter } from "@/lib/metadata";
import { languageAlternates } from "@/lib/hreflang";
import { nePathFor } from "@/lib/locale-paths";

export const metadata: Metadata = {
  // Absolute, so the root layout's "| SakharSansar" template is not appended
  // on top. With it, the title ran to 64 characters and Google cut the brand
  // off the end. "Blogs" alone, which this was before, carried no keyword at
  // all; "SakharSansar Journal" after it drew 50 impressions and no clicks in
  // four weeks, because a brand name is not a reason to click. Named dishes
  // and Nepal are.
  title: { absolute: "Sakhar Recipes from Nepal: Yomari, Chaku, Sel Roti & More" },
  description: "Yomari, chaku, sel roti, thekua and til ko laddu with hill sakhar, plus straight answers on jaggery vs sugar, diabetes and storage, from Nepal.",
  alternates: alternates({
    canonical: "/blog",
    languages: languageAlternates({ en: "/blog", ne: nePathFor("/blog")! }),
    types: {
      "application/rss+xml": [{ url: "/feed", title: "SakharSansar Journal" }],
    },
  }),
  openGraph: openGraph({
    title: "SakharSansar Journal: Jaggery Recipes & Benefits",
    description: "Letters from Sankhuwasabha: recipes, rituals, and harvest notes.",
    url: "/blog",
    type: "website",
  }, { hasTranslation: true }),
  twitter: twitter({
    title: "SakharSansar Journal: Jaggery Recipes & Benefits",
    description: "Letters from Sankhuwasabha: recipes, rituals, and harvest notes.",
  }),
};

export default function BlogList() {
  // With no posts the page renders as an empty shell — a hero over nothing.
  // Google reads that as thin content, so it 404s instead. Publishing a post
  // brings the page straight back with no code change.
  if (!BLOG_ENABLED) notFound();

  // Newest first, and the featured post is dropped from the carousel below it —
  // otherwise a journal with one post shows that post twice in a row.
  // Page one only. The index used to render the whole archive, which grows
  // without bound; /blog/page/[n] carries the rest, and builds itself the day
  // there is a rest to carry.
  const ordered = postsOnPage(1);
  const [featured, ...rest] = ordered;
  const totalPages = pageCount();
  const categories = [...new Set(ordered.flatMap((p) => p.tags ?? []))];

  // Typing the index as a Blog (rather than a generic WebPage) is what links
  // the individual BlogPosting pages to a single publication.
  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": absoluteUrl("/blog#blog"),
    url: absoluteUrl("/blog"),
    name: "SakharSansar Journal",
    description:
      "Letters from Sankhuwasabha: recipes, rituals, and the slow stories behind every block of pure Himalayan jaggery.",
    isPartOf: { "@id": WEBSITE_ID },
    publisher: { "@id": ORG_ID },
    inLanguage: SITE.lang,
    blogPost: sortedPosts().map((post) => ({
      "@type": "BlogPosting",
      "@id": absoluteUrl(`${postPath(post)}#post`),
      headline: post.title,
      description: post.description,
      url: absoluteUrl(postPath(post)),
      datePublished: post.date,
      image: absoluteUrl(post.image),
      author: { "@type": "Organization", name: post.author },
    })),
  };

  return (
    <>
      <JsonLd data={blogJsonLd} />


      <main className="overflow-x-hidden">
        {/* ─── 1 · Hero (peach) ─────────────────────── */}
        <section
          aria-label="Blog"
          className="relative bg-peach px-6 sm:px-10 lg:px-16 pt-28 sm:pt-36 pb-24 sm:pb-32 overflow-hidden"
        >
          {/* Doodles */}
          <Ladybug
            aria-hidden
            className="pointer-events-none absolute top-24 right-[34%] w-16 h-16 text-peach-line/70 -rotate-12 hidden md:block"
          />
          <Bee
            aria-hidden
            className="pointer-events-none absolute top-32 right-[8%] w-28 h-20 text-peach-line/70 hidden md:block"
          />
          <Daisy
            aria-hidden
            className="pointer-events-none absolute top-[11rem] right-[16%] w-16 h-16 text-peach-line/50 hidden md:block"
          />

          <div className="max-w-[1280px] mx-auto">
            <Breadcrumbs trail={[{ name: "Blog", path: "/blog" }]} />
            {/* The subject line below used to live *inside* this H1, to give
                the hub a heading that named something people search for rather
                than the bare word "Blog".

                It did name it, but it made the H1 74 characters of two
                unrelated sentences run together: a screen reader announced
                "Blog Jaggery recipes, health benefits and farm stories from
                Sankhuwasabha" as one heading, and Google truncates well before
                the end of that.

                Same two lines on screen, same styling — the second one is now
                a paragraph, which is what it always was. */}
            {/* "Blog" was the whole H1 — the single strongest on-page signal
                on the page, spent on a word that describes the format rather
                than the subject. The title tag already says what this is;
                the heading now agrees with it. The clamp comes down because
                three words at 9vw is a different hero from one word at 9vw,
                and the band around it was sized for the latter. */}
            <h1 className="font-marker uppercase text-jaggery leading-[0.9] tracking-tight text-[clamp(2.5rem,7vw,5rem)]">
              Jaggery Recipes &amp; Benefits
            </h1>
            <p className="mt-4 text-jaggery/70 font-medium text-[clamp(0.95rem,1.6vw,1.15rem)] leading-snug max-w-2xl">
              What we have worked out about sakhar — how to cook with it, what
              it does and does not do for you, and what actually happens on the
              terraces in Sankhuwasabha.
            </p>
          </div>

          {/* Wave down into the green featured band */}
          <AnimatedWave
            aria-hidden
            className="absolute bottom-0 left-0 w-full h-[55px] sm:h-[80px] text-grove"
          />
        </section>

        {/* ─── 2 · Featured (green) ─────────────────── */}
        {featured && (
          <section
            aria-label="This month's featured blog"
            className="relative bg-grove text-cream px-6 sm:px-10 lg:px-16 pt-6 sm:pt-10 pb-16 sm:pb-24 overflow-hidden"
          >
            <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <Link
                href={postPath(featured)}
                className="group relative aspect-[4/3] sm:aspect-[3/2] w-full overflow-hidden rounded-[1.75rem] ring-1 ring-cream/10 shadow-2xl shadow-grove-deep/40"
              >
                <Image
                  src={featured.image}
                  alt={featured.imageAlt ?? featured.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.03]"
                />
              </Link>
              <div>
                <span className="label-caps text-honey-ink mb-5 block">This month&rsquo;s featured blog</span>
                <Link href={postPath(featured)} className="group inline-block">
                  <h2 className="font-marker uppercase text-cream leading-[0.98] text-[clamp(2rem,4.4vw,3.4rem)] group-hover:text-honey transition-colors text-balance">
                    {featured.title}
                  </h2>
                </Link>
                <p className="text-cream/80 text-lede mt-6 max-w-xl">{featured.description}</p>
                <Link
                  href={postPath(featured)}
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-cream text-jaggery label-caps px-8 py-4 hover:bg-honey transition-colors"
                >
                  Read the article
                  <ArrowRight className="w-4 h-4" strokeWidth={2} />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ─── 3 · Editor's Picks (green carousel) ──── */}
        <BlogEditorsPicks posts={rest} />

        {/* ─── 4 · Blog Categories (peach) ──────────── */}
        <div className="relative bg-peach">
          {/* Wave: green dips down into the peach categories band */}
          <AnimatedWave
            aria-hidden
            flip
            className="absolute top-0 left-0 z-10 w-full h-[55px] sm:h-[80px] text-grove"
          />
          <div className="pt-10 sm:pt-16">
            <BlogCategories
              posts={ordered}
              categories={categories}
              hubSlugs={BLOG_CATEGORIES.map((c) => c.slug)}
            />
          </div>

          {/* Renders only once the archive outgrows one page. A real link in
              the server HTML, not a button — a crawler does not click, and a
              reader cannot bookmark what has no address. */}
          {totalPages > 1 && (
            <nav
              aria-label="Journal pagination"
              className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16 pb-16 sm:pb-20 flex items-center justify-between gap-4"
            >
              <span className="label-caps text-jaggery/60">
                Page 1 of {totalPages}
              </span>
              <Link
                href="/blog/page/2"
                className="inline-flex items-center gap-2 rounded-full bg-jaggery text-cream label-caps px-7 py-3.5 hover:bg-grove transition-colors"
              >
                Older articles
                <ArrowRight className="w-4 h-4" strokeWidth={2} />
              </Link>
            </nav>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
