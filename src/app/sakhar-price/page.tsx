import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, MessageCircle, ShoppingBag } from "lucide-react";
import Footer from "@/components/layout/Footer";
import OrderDrawer from "@/components/layout/OrderDrawer";
import ArticleBody from "@/components/blog/ArticleBody";
import JsonLd from "@/components/seo/JsonLd";
import { formatPostDate } from "@/lib/blog";
import { AnimatedWave, Bee } from "@/components/ui/StoryArt";
import { Daisy } from "@/components/ui/Doodles";
import price from "@/data/sakhar-price.json";
import content from "@/data/content.json";
import { faqEntries, parseArticle } from "@/lib/article";
import { breadcrumbLd, faqLd, webPageLd } from "@/lib/seo";
import { alternates, openGraph, twitter } from "@/lib/metadata";
import { SITE } from "@/lib/site";

/**
 * /sakhar-price — what a kilo costs, and where to buy it.
 *
 * This was /blog/sakhar-price-in-nepal, and the writing is unchanged apart
 * from naming the product the way buyers name it. What changed is the shelf.
 * Somebody searching "sankhuwasabha sakhar price" or "sakhar price in
 * Kathmandu" has their wallet out; landing them in a journal archive answers
 * the question and then asks them to go and find the shop themselves. The
 * same move /wholesale made, for the same reason, and the old URL 308s here
 * (see PROMOTED_POSTS in next.config.ts).
 *
 * The move cost nothing to make. The post had earned no impressions at all in
 * its first three weeks — Search Console records zero — so there was no
 * ranking to carry across and no reason to leave a second copy behind. Two
 * URLs holding the same two thousand words compete, and the weaker intent
 * tends to be the one that wins.
 *
 * Prices are read from content.json, the same record the shop and the product
 * pages render, so this page cannot quote a figure the checkout contradicts.
 */

const PATH = "/sakhar-price";

export const metadata: Metadata = {
  title: price.seoTitle,
  description: price.description,
  alternates: alternates({ canonical: PATH }),
  openGraph: openGraph({
    title: "Jaggery (Sakhar) Price in Nepal: The Full List",
    description: price.description,
    url: PATH,
  }),
  twitter: twitter({
    title: "Jaggery (Sakhar) Price in Nepal 2026",
    description: price.description,
  }),
};

export default function SakharPricePage() {
  const blocks = parseArticle(price.content);
  const faqs = faqEntries(blocks);

  const breadcrumb = breadcrumbLd([{ name: "Sakhar Price", path: PATH }]);

  const page = webPageLd({
    name: price.title,
    path: PATH,
    description: price.description,
    dateModified: price.updated ?? price.date,
  });

  const waHref = `https://wa.me/${SITE.phoneDigits}?text=${encodeURIComponent(
    "Hi SakharSansar! What is the price for sakhar delivered to my area?",
  )}`;

  // The two sweeteners, in the order a buyer compares them. The nut mix is a
  // snack rather than a price-per-kilo decision, so it stays out of the strip
  // and is left to the table in the body.
  const sweeteners = content.products.filter(
    (p) => p.slug !== "mixed-dry-fruits",
  );

  return (
    <>
      <JsonLd data={page} />
      <JsonLd data={breadcrumb} />
      {faqs.length > 0 && <JsonLd data={faqLd(faqs)} />}

      <OrderDrawer />

      <main className="bg-cream overflow-x-hidden">
        {/* ─── Hero (peach) ───────────────────────────────────────── */}
        <header className="relative bg-peach overflow-hidden pt-28 sm:pt-36 pb-24 sm:pb-32 px-6 sm:px-10 lg:px-16">
          <Bee aria-hidden className="pointer-events-none absolute top-28 right-[8%] w-24 h-16 text-peach-line/70 hidden md:block" />
          <Daisy aria-hidden className="pointer-events-none absolute top-24 right-[27%] w-14 h-14 text-peach-line/50 -rotate-12 hidden md:block" />

          <div className="relative z-10 max-w-[820px] mx-auto">
            {/* Trail matches the BreadcrumbList above it. */}
            <nav aria-label="Breadcrumb" className="mb-7">
              <ol className="flex items-center gap-2 label-caps text-jaggery/70 min-w-0">
                <li className="shrink-0">
                  <Link href="/" className="hover:text-grove transition-colors">Home</Link>
                </li>
                <ChevronRight className="w-3 h-3 shrink-0 text-jaggery/30" strokeWidth={2.5} aria-hidden />
                <li aria-current="page" className="text-grove truncate">Sakhar Price</li>
              </ol>
            </nav>

            <span className="inline-flex items-center rounded-full bg-grove/10 border border-grove/15 px-3.5 py-1.5 label-caps text-grove">
              Price list · सखर मूल्य
            </span>

            <h1 className="mt-6 font-marker uppercase text-jaggery leading-[0.95] tracking-tight text-[clamp(2.25rem,5.5vw,4.25rem)] text-balance">
              Sankhuwasabha Sakhar Price
            </h1>

            <p className="font-serif italic text-jaggery/75 text-lede mt-6 max-w-2xl">
              {price.description}
            </p>

            {/* A price page with no date on it is a price page nobody can
                trust. Same field the schema reads. */}
            <p className="mt-5 label-caps text-jaggery/60">
              Last updated:{" "}
              <time dateTime={price.updated ?? price.date}>
                {formatPostDate(price.updated ?? price.date)}
              </time>
            </p>

            {/* The answer, before the argument for it. Somebody who searched
                for a price should not have to read two thousand words to find
                one, and the figures come from the same record the checkout
                charges from. */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {sweeteners.map((p) => (
                <Link
                  key={p.slug}
                  href={`/products/${p.slug}`}
                  className="group rounded-2xl bg-cream/70 border border-jaggery/10 px-5 py-4 hover:border-grove/40 hover:bg-cream transition-colors"
                >
                  <span className="label-caps text-jaggery/60">{p.weight}</span>
                  <span className="mt-1 block font-display text-2xl text-jaggery">
                    {p.price}
                  </span>
                  <span className="mt-1 block text-[14px] text-jaggery/70 group-hover:text-grove transition-colors">
                    {p.name}
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-jaggery text-cream label-caps px-7 py-3.5 hover:bg-grove transition-colors"
              >
                <ShoppingBag className="w-4 h-4" strokeWidth={1.75} aria-hidden />
                Buy Sankhuwasabha sakhar
              </Link>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 rounded-full border border-jaggery/20 text-jaggery label-caps px-7 py-3.5 hover:bg-jaggery/[0.04] transition-colors"
              >
                <MessageCircle className="w-4 h-4" strokeWidth={1.75} aria-hidden />
                Ask about delivery
              </a>
            </div>

            <p className="mt-5 text-[14px] text-jaggery/70">
              Buying by the sack rather than the kilo?{" "}
              <Link href="/wholesale" className="text-grove underline underline-offset-4 hover:text-jaggery transition-colors">
                Wholesale is quoted separately
              </Link>
              .
            </p>
          </div>

          <AnimatedWave aria-hidden className="absolute bottom-0 left-0 w-full h-[48px] sm:h-[68px] text-cream" />
        </header>

        {/* ─── Hero image ─────────────────────────────────────────── */}
        <div className="px-6 sm:px-10 lg:px-16 mt-10 sm:mt-12">
          <div className="max-w-[1000px] mx-auto">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl bg-ivory ring-1 ring-jaggery/8 shadow-xl shadow-jaggery/10">
              <Image
                src={price.image}
                alt={price.imageAlt}
                fill
                priority
                sizes="(max-width: 1000px) 100vw, 1000px"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* ─── Body ───────────────────────────────────────────────── */}
        <article className="px-6 sm:px-10 lg:px-16 pt-14 sm:pt-20 pb-16">
          <div className="max-w-[720px] mx-auto">
            <ArticleBody blocks={blocks} />
          </div>
        </article>
      </main>

      <Footer />
    </>
  );
}
