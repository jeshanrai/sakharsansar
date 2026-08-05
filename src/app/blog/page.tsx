import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Footer from "@/components/layout/Footer";
import OrderDrawer from "@/components/layout/OrderDrawer";
import BlogEditorsPicks from "@/components/sections/blog/BlogEditorsPicks";
import BlogCategories from "@/components/sections/blog/BlogCategories";
import JsonLd from "@/components/seo/JsonLd";
import blogData from "@/data/blog.json";
import { ORG_ID, WEBSITE_ID, breadcrumbLd } from "@/lib/seo";
import { SITE, absoluteUrl } from "@/lib/site";
import { Bee, Ladybug, AnimatedWave } from "@/components/ui/StoryArt";
import { Daisy } from "@/components/ui/Doodles";
import { ArrowRight } from "lucide-react";
import { openGraph, twitter } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Blogs | SakharSansar",
  description: "Letters from Sankhuwasabha: recipes, rituals, and the slow stories behind every block of pure Himalayan jaggery.",
  keywords: [
    "jaggery recipes",
    "jaggery health benefits",
    "gur vs sugar",
    "Himalayan jaggery guide",
    "Sankhuwasabha farming stories",
    "how jaggery is made",
  ],
  alternates: {
    canonical: "/blog",
    types: {
      "application/rss+xml": [{ url: "/feed", title: "SakharSansar Journal" }],
    },
  },
  openGraph: openGraph({
    title: "Blogs | SakharSansar",
    description: "Letters from Sankhuwasabha: recipes, rituals, and harvest notes.",
    url: "/blog",
    type: "website",
  }),
  twitter: twitter({
    title: "Blogs | SakharSansar",
    description: "Letters from Sankhuwasabha: recipes, rituals, and harvest notes.",
  }),
};

export default function BlogList() {
  const featured = blogData[0];
  const categories = [...new Set(blogData.flatMap((p) => p.tags ?? []))];

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
    blogPost: blogData.map((post) => ({
      "@type": "BlogPosting",
      "@id": absoluteUrl(`/blog/${post.slug}#post`),
      headline: post.title,
      description: post.description,
      url: absoluteUrl(`/blog/${post.slug}`),
      datePublished: post.date,
      image: absoluteUrl(post.image),
      author: { "@type": "Organization", name: post.author },
    })),
  };

  return (
    <>
      <JsonLd data={blogJsonLd} />
      <JsonLd data={breadcrumbLd([{ name: "Blog", path: "/blog" }])} />

      <OrderDrawer />

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
            <h1 className="font-marker uppercase text-jaggery leading-[0.9] tracking-tight text-[clamp(3rem,9vw,6.5rem)]">
              Blog
            </h1>
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
                href={`/blog/${featured.slug}`}
                className="group relative aspect-[4/3] sm:aspect-[3/2] w-full overflow-hidden rounded-[1.75rem] ring-1 ring-cream/10 shadow-2xl shadow-grove-deep/40"
              >
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.03]"
                />
              </Link>
              <div>
                <span className="label-caps text-honey mb-5 block">This month&rsquo;s featured blog</span>
                <Link href={`/blog/${featured.slug}`} className="group inline-block">
                  <h2 className="font-marker uppercase text-cream leading-[0.98] text-[clamp(2rem,4.4vw,3.4rem)] group-hover:text-honey transition-colors text-balance">
                    {featured.title}
                  </h2>
                </Link>
                <p className="text-cream/80 text-lede mt-6 max-w-xl">{featured.description}</p>
                <Link
                  href={`/blog/${featured.slug}`}
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
        <BlogEditorsPicks posts={blogData} />

        {/* ─── 4 · Blog Categories (peach) ──────────── */}
        <div className="relative bg-peach">
          {/* Wave: green dips down into the peach categories band */}
          <AnimatedWave
            aria-hidden
            flip
            className="absolute top-0 left-0 z-10 w-full h-[55px] sm:h-[80px] text-grove"
          />
          <div className="pt-10 sm:pt-16">
            <BlogCategories posts={blogData} categories={categories} />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
