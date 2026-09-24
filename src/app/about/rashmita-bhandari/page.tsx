import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { AnimatedWave } from "@/components/ui/StoryArt";
import { Daisy } from "@/components/ui/Doodles";
import { AUTHOR, AUTHOR_ID, authorLd } from "@/lib/author";
import { BLOG_ENABLED, formatPostDate, sortedPosts, postPath } from "@/lib/blog";
import { ORG_ID, WEBSITE_ID } from "@/lib/seo";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { SITE, STORY, absoluteUrl } from "@/lib/site";
import { alternates, openGraph, twitter, DEFAULT_OG_IMAGE } from "@/lib/metadata";

/**
 * /about/rashmita-bhandari — the author page.
 *
 * She had a byline on every post and no page of her own, so the `Person` in
 * all that BlogPosting markup pointed nowhere and the site's best credibility
 * claim — the person who makes the sakhar is the person writing about it —
 * was left implicit. This is the page those bylines now link to and the
 * `@id` the schema resolves against.
 *
 * The list of everything she has written is generated from blog.json rather
 * than maintained here, so it cannot fall behind the journal.
 */

const posts = sortedPosts();

export const metadata: Metadata = {
  title: "Rashmita Bhandari: Founder, Farmer & Owner",
  description:
    "Rashmita Bhandari founded SakharSansar in 2024. She makes the wood-fired sakhar herself in Sankhuwasabha, and writes everything on this site.",
  alternates: alternates({ canonical: AUTHOR.path }),
  openGraph: openGraph({
    type: "profile",
    title: `${AUTHOR.name}: ${AUTHOR.role}`,
    description: AUTHOR.summary,
    url: AUTHOR.path,
    images: [{ ...DEFAULT_OG_IMAGE, alt: AUTHOR.imageAlt }],
  }),
  twitter: twitter({ title: AUTHOR.name, description: AUTHOR.summary }),
};

export default function AuthorPage() {
  const profile = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${absoluteUrl(AUTHOR.path)}#webpage`,
    url: absoluteUrl(AUTHOR.path),
    name: `${AUTHOR.name}: ${AUTHOR.role}`,
    description: AUTHOR.summary,
    inLanguage: SITE.lang,
    isPartOf: { "@id": WEBSITE_ID },
    publisher: { "@id": ORG_ID },
    // The page is *about* her, and she is its main entity — the pairing that
    // tells a crawler this is a profile rather than a page mentioning a name.
    about: { "@id": AUTHOR_ID },
    // `founder: {@id: organization}` used to sit here too, which says the
    // Person was founded by the company. The edge belongs on the Organization
    // and now lives there (see organizationLd), pointing the other way.
    mainEntity: {
      ...authorLd(),
      worksFor: { "@id": ORG_ID },
    },
  };

  return (
    <>
      <JsonLd data={profile} />

      <main className="bg-cream overflow-x-hidden">
        {/* ─── Hero (peach) ───────────────────────────────────────── */}
        <header className="relative bg-peach overflow-hidden pt-32 sm:pt-36 pb-24 sm:pb-32 px-6 sm:px-10 lg:px-16">
          <Daisy aria-hidden className="pointer-events-none absolute top-28 right-[12%] w-16 h-16 text-peach-line/50 -rotate-12 hidden md:block" />

          <div className="relative z-10 max-w-[900px] mx-auto">
            {/* The BreadcrumbList used to name a middle crumb, "About",
                pointing at this same URL — two consecutive ListItems with one
                href between them, describing a /about index that does not
                exist. The page never showed it, which is how it survived. */}
            <Breadcrumbs trail={[{ name: AUTHOR.name, path: AUTHOR.path }]} className="mb-7" />

            <div className="flex flex-col sm:flex-row sm:items-center gap-7">
              <Image
                src={AUTHOR.image}
                alt={AUTHOR.imageAlt}
                width={132}
                height={132}
                priority
                className="h-28 w-28 sm:h-33 sm:w-33 rounded-full object-cover shadow-xl shadow-jaggery/15 ring-4 ring-cream shrink-0"
              />
              <div>
                <p className="label-caps text-jaggery/70 mb-3">{AUTHOR.role}</p>
                <h1 className="font-marker uppercase text-jaggery leading-[0.95] tracking-tight text-[clamp(2.25rem,5.5vw,4rem)]">
                  {AUTHOR.name}
                </h1>
              </div>
            </div>

            <p className="font-serif italic text-jaggery/75 text-lede mt-7 max-w-2xl">
              {AUTHOR.summary}
            </p>
          </div>

          <AnimatedWave aria-hidden className="absolute bottom-0 left-0 w-full h-[48px] sm:h-[68px] text-cream" />
        </header>

        {/* ─── Bio ────────────────────────────────────────────────── */}
        <section className="px-6 sm:px-10 lg:px-16 pt-14 sm:pt-20 pb-4">
          <div className="max-w-[720px] mx-auto space-y-6 text-jaggery/75 text-body">
            <h2 className="font-marker uppercase text-jaggery leading-[0.95] text-[clamp(1.6rem,3.4vw,2.4rem)]">
              Who makes this
            </h2>
            <p>
              Rashmita Bhandari founded SakharSansar in {STORY.founded}. She tends
              the wood fire, pours the moulds and packs every block by hand, in{" "}
              {SITE.origin.locality}, {SITE.origin.region}. The cane comes off the
              terraces her family and forty-one neighbouring households farm — the
              same terraces, and the same method, that have produced sakhar there
              for {STORY.generations} generations.
            </p>
            <p>
              That is the whole of her claim to write about jaggery, and it is
              worth being precise about what it does and does not cover. She can
              tell you what a wood fire does to cane juice, why a block cracks the
              way it does, what a clarifier would change and why she does not use
              one, and what an honest kilo of hill sakhar costs to make. She is
              not a nutritionist or a doctor, and where the writing here touches
              health — whether sakhar is safe for diabetics, what the WHO says
              about daily sugar — it cites published sources rather than her
              opinion, and says plainly when the honest answer is an
              uncomfortable one.
            </p>
            <p>
              She writes everything on this site. That includes the parts that
              cost the business money: the article that tells you to buy cheaper
              Terai gur if price is what matters, the price page that works out
              what a kilo costs per cup and then suggests using less of it, and
              the wholesale page that names the buyers who should not order from
              her. The reasoning is simple enough — a customer who was told the
              truth the first time comes back.
            </p>
          </div>
        </section>

        {/* ─── Everything she has written ─────────────────────────── */}
        {BLOG_ENABLED && (
          <section className="px-6 sm:px-10 lg:px-16 pt-12 pb-20 sm:pb-28">
            <div className="max-w-[720px] mx-auto">
              <h2 className="font-marker uppercase text-jaggery leading-[0.95] text-[clamp(1.6rem,3.4vw,2.4rem)] mb-7">
                Everything she has written
              </h2>
              <ul className="divide-y divide-jaggery/10 border-y border-jaggery/10">
                {posts.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={postPath(post)}
                      // A full bibliography — every post she has written. High
                      // link count, low intent per link.
                      prefetch={false}
                      className="group flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1.5 py-4 hover:text-grove transition-colors"
                    >
                      <span
                        lang={post.lang ?? undefined}
                        className="font-medium text-jaggery group-hover:text-grove transition-colors text-balance"
                      >
                        {post.title}
                      </span>
                      <time
                        dateTime={post.date}
                        className="label-caps text-jaggery/70 shrink-0 sm:ml-6"
                      >
                        {formatPostDate(post.date)}
                      </time>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  href="/our-story"
                  className="group inline-flex items-center gap-2.5 rounded-full bg-jaggery text-cream label-caps px-7 py-3.5 hover:bg-grove transition-colors"
                >
                  How the sakhar is made
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
                </Link>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2.5 rounded-full border border-jaggery/20 text-jaggery label-caps px-7 py-3.5 hover:bg-jaggery/[0.04] transition-colors"
                >
                  Shop the sakhar
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
