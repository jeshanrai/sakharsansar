import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Footer from "@/components/layout/Footer";
import OrderDrawer from "@/components/layout/OrderDrawer";
import ArticleBody from "@/components/blog/ArticleBody";
import { AnimatedWave, Bee } from "@/components/ui/StoryArt";
import { Daisy } from "@/components/ui/Doodles";
import JsonLd from "@/components/seo/JsonLd";
import { posts as blogData, formatPostDate } from "@/lib/blog";
import {
  faqEntries,
  howToSteps,
  parseArticle,
  wordCount as countWords,
} from "@/lib/article";
import { ORG_ID, breadcrumbLd, faqLd, howToLd } from "@/lib/seo";
import { SITE, absoluteUrl } from "@/lib/site";
import { ArrowRight, ChevronRight, Clock, Twitter, Facebook, Linkedin, MapPin, Phone, RefreshCw } from "lucide-react";
import { alternates, openGraph, twitter } from "@/lib/metadata";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogData.map((post) => ({ slug: post.slug }));
}

/**
 * Every valid slug is known at build time from src/data/blog.json, so any
 * other slug is simply wrong. Without this, Next renders unknown slugs
 * on demand and `notFound()` inside the page yields a *soft* 404 — HTTP 200
 * carrying 404 content, which Google reports as an error and may index.
 * `false` makes the router return a real 404 before rendering anything.
 */
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const post = blogData.find((p) => p.slug === resolvedParams.slug);
  if (!post) return { title: "Post Not Found", robots: { index: false } };

  return {
    // The root layout's `title.template` appends "| SakharSansar", which costs
    // 15 of the ~60 characters Google shows. Posts whose headline needs the
    // full width set `seoTitle` and opt out of the template entirely.
    title: post.seoTitle ? { absolute: post.seoTitle } : post.title,
    description: post.description,
    alternates: alternates({ canonical: `/blog/${post.slug}` }),
    keywords: post.tags,
    authors: [{ name: post.author }],
    openGraph: openGraph({
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      // Card art comes from the colocated opengraph-image.tsx, which sets the
      // headline over the post's photo at a true 1200×630.
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      authors: [post.author],
      tags: post.tags,
    }),
    twitter: twitter({
      title: post.title,
      description: post.description,
    }),
  };
}

export default async function BlogPost({ params }: Props) {
  const resolvedParams = await params;
  const post = blogData.find((p) => p.slug === resolvedParams.slug);
  if (!post) notFound();

  const blocks = parseArticle(post.content);
  const wordCount = countWords(blocks);
  const readingMins = Math.max(1, Math.round(wordCount / 200));

  // Both derived from the parsed article rather than written alongside it, so
  // the structured data can never describe a heading the page doesn't render.
  const faqs = faqEntries(blocks);
  const steps = howToSteps(blocks);

  const authorInitials = post.author
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const related = blogData.filter((p) => p.slug !== post.slug).slice(0, 2);

  const postUrl = absoluteUrl(`/blog/${post.slug}`);
  const modified = post.updated ?? post.date;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${postUrl}#post`,
    headline: post.title,
    description: post.description,
    image: absoluteUrl(post.image),
    url: postUrl,
    // A named human author is a first-hand-experience signal the publisher
    // node can't carry on its own; the publisher stays the Organization.
    author: {
      "@type": "Person",
      name: post.author,
      ...(post.authorRole ? { jobTitle: post.authorRole } : {}),
      ...(post.authorBio ? { description: post.authorBio } : {}),
      ...(post.authorImage ? { image: absoluteUrl(post.authorImage) } : {}),
      worksFor: { "@id": ORG_ID },
    },
    publisher: { "@id": ORG_ID },
    isPartOf: { "@id": absoluteUrl("/blog#blog") },
    datePublished: post.date,
    dateModified: modified,
    inLanguage: SITE.lang,
    articleSection: post.tags[0],
    keywords: post.tags.join(", "),
    wordCount,
    timeRequired: `PT${readingMins}M`,
    mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
  };

  const breadcrumbJsonLd = breadcrumbLd([
    { name: "Journal", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` },
  ]);

  const shareLinks = [
    { name: "Twitter", Icon: Twitter, href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(post.title)}` },
    { name: "Facebook", Icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}` },
    { name: "LinkedIn", Icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}` },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      {faqs.length > 0 && <JsonLd data={faqLd(faqs)} />}
      {steps.length > 0 && (
        <JsonLd
          data={howToLd({
            name: post.title,
            description: post.description,
            path: `/blog/${post.slug}`,
            image: post.image,
            totalTime: "PT10M",
            supplies: ["Warm water", "Tincture of iodine", "A piece of sakhar (jaggery)"],
            tools: ["A clear glass", "A spoon", "Daylight"],
            steps,
          })}
        />
      )}

      <OrderDrawer />

      <main className="bg-cream overflow-x-hidden">
        {/* ─── Hero (peach) ───────────────────────────────────────── */}
        <header className="relative bg-peach overflow-hidden pt-28 sm:pt-36 pb-24 sm:pb-32 px-6 sm:px-10 lg:px-16">
          {/* Doodles */}
          <Bee aria-hidden className="pointer-events-none absolute top-28 right-[8%] w-24 h-16 text-peach-line/70 hidden md:block" />
          <Daisy aria-hidden className="pointer-events-none absolute top-24 right-[27%] w-14 h-14 text-peach-line/50 -rotate-12 hidden md:block" />

          <div className="relative z-10 max-w-[820px] mx-auto">
            {/* Breadcrumb — the trail matches the BreadcrumbList above it. */}
            <nav aria-label="Breadcrumb" className="mb-7">
              <ol className="flex items-center gap-2 label-caps text-jaggery/45 min-w-0">
                <li className="shrink-0">
                  <Link href="/" className="hover:text-grove transition-colors">Home</Link>
                </li>
                <ChevronRight className="w-3 h-3 shrink-0 text-jaggery/30" strokeWidth={2.5} aria-hidden />
                <li className="shrink-0">
                  <Link href="/blog" className="hover:text-grove transition-colors">Journal</Link>
                </li>
                <ChevronRight className="w-3 h-3 shrink-0 text-jaggery/30" strokeWidth={2.5} aria-hidden />
                <li aria-current="page" className="text-grove truncate">{post.title}</li>
              </ol>
            </nav>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-6">
              <span className="inline-flex items-center rounded-full bg-grove/10 border border-grove/15 px-3.5 py-1.5 label-caps text-grove">
                {post.tags[0]}
              </span>
              <time dateTime={post.date} className="label-caps text-jaggery/45">{formatPostDate(post.date)}</time>
              <span className="w-1 h-1 rounded-full bg-jaggery/25" />
              <span className="inline-flex items-center gap-1.5 label-caps text-jaggery/45">
                <Clock className="w-3.5 h-3.5" strokeWidth={1.75} /> {readingMins} min read
              </span>
              {/* Purity advice dates; showing when it was last checked is the
                  point of re-checking it every six months. */}
              {post.updated && post.updated !== post.date && (
                <>
                  <span className="w-1 h-1 rounded-full bg-jaggery/25" />
                  <span className="inline-flex items-center gap-1.5 label-caps text-jaggery/45">
                    <RefreshCw className="w-3.5 h-3.5" strokeWidth={1.75} aria-hidden />
                    Updated <time dateTime={post.updated}>{formatPostDate(post.updated)}</time>
                  </span>
                </>
              )}
            </div>

            {/* Title — hand-marker, consistent with every page hero */}
            <h1 className="font-marker uppercase text-jaggery leading-[0.95] tracking-tight text-[clamp(2.25rem,5.5vw,4.25rem)] text-balance">
              {post.title}
            </h1>

            <p className="font-serif italic text-jaggery/75 text-lede mt-6 mb-8 max-w-2xl">
              {post.description}
            </p>

            {/* Byline */}
            <div className="flex items-center gap-3">
              {post.authorImage ? (
                <Image
                  src={post.authorImage}
                  alt=""
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-full object-cover shadow-sm"
                />
              ) : (
                <div className="h-11 w-11 rounded-full bg-gradient-to-br from-honey to-caramel flex items-center justify-center text-cream font-serif text-sm shadow-sm">
                  {authorInitials}
                </div>
              )}
              <div>
                <p className="font-medium text-jaggery text-sm">{post.author}</p>
                <p className="label-caps text-jaggery/45">
                  {post.authorRole ?? "SakharSansar Journal"}
                </p>
              </div>
            </div>
          </div>

          {/* Wave pours the peach hero down into the cream article */}
          <AnimatedWave aria-hidden className="absolute bottom-0 left-0 w-full h-[48px] sm:h-[68px] text-cream" />
        </header>

        {/* ─── Hero image ─────────────────────────────────────────── */}
        <div className="px-6 sm:px-10 lg:px-16 mt-10 sm:mt-12">
          <div className="max-w-[1000px] mx-auto">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl bg-ivory ring-1 ring-jaggery/8 shadow-xl shadow-jaggery/10">
              <Image
                src={post.image}
                // The headline is rarely a description of the photograph, and
                // this is the one alt tag on the page worth writing by hand.
                alt={post.imageAlt ?? post.title}
                fill
                priority
                sizes="(max-width: 1000px) 100vw, 1000px"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* ─── Article body ───────────────────────────────────────── */}
        <article className="px-6 sm:px-10 lg:px-16 pt-14 sm:pt-20 pb-16">
          <div className="max-w-[720px] mx-auto">
            <ArticleBody blocks={blocks} />

            {/* Author — who wrote this and why they would know */}
            {post.authorBio && (
              <aside className="mt-16 rounded-2xl bg-ivory ring-1 ring-jaggery/8 px-6 sm:px-8 py-8 flex flex-col sm:flex-row gap-6">
                {post.authorImage && (
                  <Image
                    src={post.authorImage}
                    alt={`${post.author}, ${post.authorRole ?? "SakharSansar"}`}
                    width={96}
                    height={96}
                    className="h-24 w-24 shrink-0 rounded-full object-cover"
                  />
                )}
                <div>
                  <span className="label-caps text-caramel mb-2 block">Written by</span>
                  <p className="font-display font-bold text-jaggery text-h4">{post.author}</p>
                  {post.authorRole && (
                    <p className="label-caps text-jaggery/45 mt-1.5">{post.authorRole}</p>
                  )}
                  <p className="text-jaggery/75 text-body mt-4">{post.authorBio}</p>
                  <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-jaggery/60 text-meta">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" strokeWidth={1.75} aria-hidden />
                      {SITE.address.locality}, {SITE.address.region}, Nepal
                    </span>
                    <a
                      href={`tel:${SITE.phone.replace(/[^+\d]/g, "")}`}
                      className="inline-flex items-center gap-1.5 hover:text-grove transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" strokeWidth={1.75} aria-hidden />
                      {SITE.phone}
                    </a>
                  </div>
                </div>
              </aside>
            )}

            {/* Tags */}
            <div className="mt-12 pt-8 border-t border-jaggery/12 flex flex-wrap gap-2.5">
              {post.tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center rounded-full bg-ivory border border-jaggery/10 px-3.5 py-1.5 label-caps text-jaggery/55"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Share */}
            <div className="mt-10 flex items-center justify-between gap-4 flex-wrap">
              <p className="label-caps text-jaggery/55">Share this story</p>
              <div className="flex gap-2.5">
                {shareLinks.map(({ name, Icon, href }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Share on ${name}`}
                    className="h-11 w-11 rounded-full bg-ivory border border-jaggery/10 text-jaggery/65 flex items-center justify-center hover:bg-jaggery hover:text-cream hover:border-jaggery transition-colors"
                  >
                    <Icon className="w-4 h-4" strokeWidth={1.75} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </article>

        {/* ─── Keep reading ───────────────────────────────────────── */}
        {related.length > 0 && (
          <section aria-label="Keep reading" className="px-6 sm:px-10 lg:px-16 pb-24 sm:pb-28">
            <div className="max-w-[1000px] mx-auto">
              <span className="label-caps text-caramel mb-4 block">More from the Journal</span>
              <h2 className="font-marker uppercase text-jaggery leading-[0.98] text-[clamp(1.8rem,4vw,3rem)] text-balance mb-10">
                Keep reading
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-7 sm:gap-10">
                {related.map((r) => (
                  <Link key={r.slug} href={`/blog/${r.slug}`} className="group flex flex-col">
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-ivory ring-1 ring-jaggery/8 mb-5">
                      <Image
                        src={r.image}
                        alt={r.imageAlt ?? r.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                      />
                    </div>
                    <span className="label-caps text-forest mb-2 block">{r.tags[0]}</span>
                    <h3 className="font-marker uppercase text-jaggery text-2xl leading-[1.05] group-hover:text-caramel-deep transition-colors text-balance">
                      {r.title}
                    </h3>
                    <span className="mt-3 inline-flex items-center gap-2 label-caps text-jaggery/55 group-hover:text-jaggery transition-colors">
                      Read article <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── Taste-the-story CTA band ───────────────────────────── */}
        <section aria-label="Shop the harvest" className="relative bg-grove text-cream px-6 sm:px-10 lg:px-16 pt-24 sm:pt-32 pb-20 sm:pb-24 overflow-hidden">
          <AnimatedWave aria-hidden flip className="absolute top-0 left-0 w-full h-[48px] sm:h-[68px] text-cream" />
          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <span className="label-caps text-honey mb-5 block">From page to pantry</span>
            <h2 className="font-marker uppercase text-cream leading-[0.98] text-[clamp(2rem,4.4vw,3.4rem)] text-balance">
              Now, taste the story
            </h2>
            <p className="text-cream/80 text-lede mt-6 max-w-xl mx-auto">
              Every block, powder and pour ships directly from our Sankhuwasabha
              cooperative to your home. No middleman, no shortcuts.
            </p>
            <Link
              href="/shop"
              className="group mt-9 inline-flex items-center gap-3 rounded-full bg-cream text-jaggery label-caps px-9 py-4 hover:bg-honey transition-colors"
            >
              Shop the harvest
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
