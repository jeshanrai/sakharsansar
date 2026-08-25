import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ChevronRight, MessageCircle, Phone, Mail } from "lucide-react";
import Footer from "@/components/layout/Footer";
import OrderDrawer from "@/components/layout/OrderDrawer";
import ArticleBody from "@/components/blog/ArticleBody";
import QuoteForm from "@/components/wholesale/QuoteForm";
import JsonLd from "@/components/seo/JsonLd";
import { AnimatedWave, Bee } from "@/components/ui/StoryArt";
import { Daisy } from "@/components/ui/Doodles";
import wholesale from "@/data/wholesale.json";
import { faqEntries, parseArticle } from "@/lib/article";
import { breadcrumbLd, faqLd, webPageLd } from "@/lib/seo";
import { alternates, openGraph, twitter, DEFAULT_OG_IMAGE } from "@/lib/metadata";
import { SITE } from "@/lib/site";

/**
 * /wholesale — the B2B page.
 *
 * This was a journal post, /blog/wholesale-jaggery-nepal, and the writing is
 * unchanged: it already answered what a wholesale buyer actually asks, in the
 * register the rest of the site uses, and rewriting it would only have made it
 * worse. What changed is where it lives. A shop owner searching "jaggery
 * wholesale supplier Nepal" is making a commercial decision, and landing them
 * in a blog archive puts a reading experience in front of a buying one — the
 * page ranked as an article rather than as an offer.
 *
 * The old URL 301s here (see next.config.ts) so whatever the post had earned
 * comes with it. There is deliberately no copy of it left at /blog: two URLs
 * carrying the same 2,000 words would compete with each other, and the one
 * with the weaker intent tends to win.
 *
 * The body is the same parsed-markdown pipeline the journal uses, so the FAQ
 * schema below is generated from the questions the page actually renders.
 */

const PATH = "/wholesale";

export const metadata: Metadata = {
  title: "Wholesale Jaggery Nepal: Bulk Sakhar Supply",
  description: wholesale.description,
  alternates: alternates({ canonical: PATH }),
  openGraph: openGraph({
    title: "Wholesale Sakhar: Bulk Himalayan Jaggery from Sankhuwasabha",
    description: wholesale.description,
    url: PATH,
    images: [{ ...DEFAULT_OG_IMAGE, alt: wholesale.imageAlt }],
  }),
  twitter: twitter({
    title: "Wholesale Sakhar from Sankhuwasabha",
    description: wholesale.description,
  }),
};

export default function WholesalePage() {
  const blocks = parseArticle(wholesale.content);
  const faqs = faqEntries(blocks);

  const breadcrumb = breadcrumbLd([{ name: "Wholesale", path: PATH }]);

  const page = webPageLd({
    name: "Wholesale Sakhar: Bulk Himalayan Jaggery from Sankhuwasabha",
    path: PATH,
    description: wholesale.description,
    dateModified: wholesale.updated ?? wholesale.date,
  });

  // Plain opener. The six answers used to be stuffed in here as placeholder
  // text for the buyer to fill in; the form below asks for them properly.
  const waHref = `https://wa.me/${SITE.phoneDigits}?text=${encodeURIComponent(
    "Hi SakharSansar! I'd like a wholesale quote.",
  )}`;

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
                <li aria-current="page" className="text-grove truncate">Wholesale</li>
              </ol>
            </nav>

            <span className="inline-flex items-center rounded-full bg-grove/10 border border-grove/15 px-3.5 py-1.5 label-caps text-grove">
              B2B · Bulk supply
            </span>

            <h1 className="mt-6 font-marker uppercase text-jaggery leading-[0.95] tracking-tight text-[clamp(2.25rem,5.5vw,4.25rem)] text-balance">
              Wholesale Sakhar
            </h1>

            <p className="font-serif italic text-jaggery/75 text-lede mt-6 max-w-2xl">
              {wholesale.description}
            </p>

            {/* The quote request. WhatsApp first because it is how nearly every
                B2B enquiry actually arrives, and the message is pre-filled with
                the six answers the page asks for further down. */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href="#quote"
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-jaggery text-cream label-caps px-7 py-3.5 hover:bg-grove transition-colors"
              >
                Request a wholesale quote
                <ArrowDown className="w-4 h-4" strokeWidth={1.75} aria-hidden />
              </a>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 rounded-full border border-jaggery/20 text-jaggery label-caps px-7 py-3.5 hover:bg-jaggery/[0.04] transition-colors"
              >
                <MessageCircle className="w-4 h-4" strokeWidth={1.75} aria-hidden />
                Or message us on WhatsApp
              </a>
            </div>

            <p className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px] text-jaggery/70">
              <a href={`tel:+${SITE.phoneDigits}`} className="inline-flex items-center gap-2 hover:text-grove transition-colors">
                <Phone className="w-3.5 h-3.5" strokeWidth={1.75} aria-hidden />
                {SITE.phone}
              </a>
              <a href={`mailto:${SITE.email}`} className="inline-flex items-center gap-2 hover:text-grove transition-colors">
                <Mail className="w-3.5 h-3.5" strokeWidth={1.75} aria-hidden />
                {SITE.email}
              </a>
            </p>
          </div>

          <AnimatedWave aria-hidden className="absolute bottom-0 left-0 w-full h-[48px] sm:h-[68px] text-cream" />
        </header>

        {/* ─── Hero image ─────────────────────────────────────────── */}
        <div className="px-6 sm:px-10 lg:px-16 mt-10 sm:mt-12">
          <div className="max-w-[1000px] mx-auto">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl bg-ivory ring-1 ring-jaggery/8 shadow-xl shadow-jaggery/10">
              <Image
                src={wholesale.image}
                alt={wholesale.imageAlt}
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

            {/* The page argues its way to a quote, so it ends on the form that
                asks for the six answers it just finished explaining. Below the
                fold and interactive, so it is loaded on demand rather than in
                the bundle that has to hydrate before anything else works. */}
            <div id="quote" className="mt-16 scroll-mt-32">
              <QuoteForm />
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </>
  );
}
