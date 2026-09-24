import Image from 'next/image';
import Link from 'next/link';
import Footer from "@/components/layout/Footer";
import OrderDrawer from "@/components/layout/OrderDrawer";
import ArticleBody from "@/components/blog/ArticleBody";
import { AnimatedWave, Bee } from "@/components/ui/StoryArt";
import { Daisy } from "@/components/ui/Doodles";
import JsonLd from "@/components/seo/JsonLd";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { AUTHOR, authorLd } from "@/lib/author";
import { type BlogPost, formatPostDate, postPath, relatedPosts, translationPair } from "@/lib/blog";
import { t, tagLabel } from "@/lib/i18n";
import {
  faqEntries,
  howToSteps,
  parseArticle,
  recipeParts,
  wordCount as countWords,
} from "@/lib/article";
import { ORG_ID, faqLd, howToLd, recipeLd } from "@/lib/seo";
import { SITE, absoluteUrl } from "@/lib/site";
import { LOCALES } from "@/lib/hreflang";
import { ArrowRight, Clock, Languages, Twitter, Facebook, Linkedin, MapPin, Phone, RefreshCw } from "lucide-react";

/**
 * One journal article, rendered.
 *
 * Lifted out of app/blog/[slug]/page.tsx when the Nepali posts moved to
 * /ne/blog/<slug>: two routes, two locales, one article layout. The route
 * files decide which posts they own and hand the record here; nothing about
 * the rendering differs by language beyond the `lang` attributes the post
 * already carries.
 */
export default function PostView({ post }: { post: BlogPost }) {
  // The other language of this article, if one was written. Only two of the
  // three Nepali posts have an English counterpart.
  const pair = translationPair(post.slug);

  const blocks = parseArticle(post.content);
  const wordCount = countWords(blocks);
  const readingMins = Math.max(1, Math.round(wordCount / 200));

  // Both derived from the parsed article rather than written alongside it, so
  // the structured data can never describe a heading the page doesn't render.
  const faqs = faqEntries(blocks);
  const steps = howToSteps(blocks);
  const recipe = post.recipe ? recipeParts(blocks) : null;
  const locale = post.lang === "ne" ? ("ne" as const) : ("en" as const);
  // One BCP-47 tag per locale, read from the same table the hreflang tags come
  // from. This was `post.lang ?? SITE.lang`, which gave the Nepali articles a
  // bare "ne" while their English counterparts said "en-NP" — the two halves
  // of a translation pair describing themselves in different forms. That is
  // the specific inconsistency docs/i18n-plan.md calls out as most likely to
  // get an annotation discarded, and it reached both the <article lang> and
  // the JSON-LD inLanguage.
  const lang = LOCALES[locale].htmlLang;

  const authorInitials = post.author
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const related = relatedPosts(post.slug);
  const m = t(locale);

  const postUrl = absoluteUrl(postPath(post));
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
    // Carries the same stable @id as /about/rashmita-bhandari, so a crawler
    // merges eleven bylines and the profile page into one entity rather than
    // twelve unrelated mentions of a name. `url` used to be absent, which left
    // the Person as a dead end.
    author: {
      ...authorLd(),
      ...(post.authorBio ? { description: post.authorBio } : {}),
      worksFor: { "@id": ORG_ID },
    },
    publisher: { "@id": ORG_ID },
    isPartOf: { "@id": absoluteUrl("/blog#blog") },
    datePublished: post.date,
    dateModified: modified,
    inLanguage: lang,
    articleSection: post.tags[0],
    keywords: post.tags.join(", "),
    wordCount,
    timeRequired: `PT${readingMins}M`,
    mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
  };

  // One trail, named once. The visible crumb localised "Journal" to "जर्नल"
  // on the Nepali articles while the BreadcrumbList went on saying "Journal" —
  // a trail shown in one language and described to Google in another.
  const trail = [
    { name: m.crumbJournal, path: "/blog" },
    { name: post.title, path: postPath(post) },
  ];

  const shareLinks = [
    { name: "Twitter", Icon: Twitter, href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(post.title)}` },
    { name: "Facebook", Icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}` },
    { name: "LinkedIn", Icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}` },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      {faqs.length > 0 && <JsonLd data={faqLd(faqs)} />}
      {steps.length > 0 && (
        <JsonLd
          data={howToLd({
            name: post.title,
            description: post.description,
            path: postPath(post),
            image: post.image,
            totalTime: post.howTo?.totalTime ?? "PT10M",
            supplies: post.howTo?.supplies,
            tools: post.howTo?.tools,
            steps,
          })}
        />
      )}
      {post.recipe && recipe && (
        <JsonLd
          data={recipeLd({
            name: post.title,
            description: post.description,
            path: postPath(post),
            image: post.image,
            author: post.author,
            datePublished: post.date,
            dateModified: modified,
            keywords: post.tags,
            inLanguage: lang,
            ...post.recipe,
            ...recipe,
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
            <Breadcrumbs trail={trail} className="mb-7" locale={locale} />

            {/* Language switcher. Rendered only where a translation actually
                exists — one of the Nepali articles has no English counterpart,
                and a control that leads nowhere is worse than none. The label
                is written in the language it switches *to*, which is the only
                version a reader who needs it can read. */}
            {pair && (
              <p className="mb-6">
                <Link
                  href={postPath(pair)}
                  hrefLang={pair.lang === "ne" ? "ne-NP" : "en-NP"}
                  lang={pair.lang === "ne" ? "ne" : "en"}
                  className="inline-flex items-center gap-2 rounded-full border border-jaggery/20 px-4 py-2 label-caps text-jaggery/70 hover:text-jaggery hover:border-jaggery/40 transition-colors"
                >
                  <Languages className="w-3.5 h-3.5" strokeWidth={1.75} aria-hidden />
                  {pair.lang === "ne" ? m.langSwitchToNe : m.langSwitchToEn}
                </Link>
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-6">
              <span className="inline-flex items-center rounded-full bg-grove/10 border border-grove/15 px-3.5 py-1.5 label-caps text-grove">
                {tagLabel(post.tags[0], locale)}
              </span>
              <time dateTime={post.date} className="label-caps text-jaggery/70">{formatPostDate(post.date, locale)}</time>
              <span className="w-1 h-1 rounded-full bg-jaggery/25" />
              <span className="inline-flex items-center gap-1.5 label-caps text-jaggery/70">
                <Clock className="w-3.5 h-3.5" strokeWidth={1.75} /> {readingMins} {m.articleReadTime}
              </span>
              {/* Purity advice dates; showing when it was last checked is the
                  point of re-checking it every six months. */}
              {post.updated && post.updated !== post.date && (
                <>
                  <span className="w-1 h-1 rounded-full bg-jaggery/25" />
                  <span className="inline-flex items-center gap-1.5 label-caps text-jaggery/70">
                    <RefreshCw className="w-3.5 h-3.5" strokeWidth={1.75} aria-hidden />
                    Updated <time dateTime={post.updated}>{formatPostDate(post.updated, locale)}</time>
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
                <Link
                  href={AUTHOR.path}
                  className="font-medium text-jaggery text-sm hover:text-grove transition-colors"
                >
                  {post.author}
                </Link>
                <p className="label-caps text-jaggery/70">
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
            {post.imageCredit && (
              <p className="mt-3 px-1 text-xs text-jaggery/60">
                {post.imageCredit.note ? `${post.imageCredit.note} ` : ""}
                Photo:{" "}
                <a href={post.imageCredit.source} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-jaggery">
                  {post.imageCredit.author}
                </a>
                ,{" "}
                <a href={post.imageCredit.licenseUrl} target="_blank" rel="noopener noreferrer license" className="underline underline-offset-2 hover:text-jaggery">
                  {post.imageCredit.license}
                </a>
                , via Wikimedia Commons, cropped.
              </p>
            )}
          </div>
        </div>

        {/* ─── Article body ───────────────────────────────────────── */}
        <article
          lang={lang}
          className="px-6 sm:px-10 lg:px-16 pt-14 sm:pt-20 pb-16"
        >
          <div className="max-w-[720px] mx-auto">
            <ArticleBody blocks={blocks} locale={locale} />

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
                  <span className="label-caps text-caramel-deep mb-2 block">{m.articleWrittenBy}</span>
                  <Link
                    href={AUTHOR.path}
                    className="font-display font-bold text-jaggery text-h4 hover:text-grove transition-colors"
                  >
                    {post.author}
                  </Link>
                  {post.authorRole && (
                    <p className="label-caps text-jaggery/70 mt-1.5">{post.authorRole}</p>
                  )}
                  <p className="text-jaggery/75 text-body mt-4">{post.authorBio}</p>
                  <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-jaggery/70 text-meta">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" strokeWidth={1.75} aria-hidden />
                      {SITE.origin.locality}, {SITE.origin.region}, Nepal
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
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-ivory border border-jaggery/10 px-3.5 py-1.5 label-caps text-jaggery/70"
                >
                  {tagLabel(tag, locale)}
                </span>
              ))}
            </div>

            {/* Share */}
            <div className="mt-10 flex items-center justify-between gap-4 flex-wrap">
              <p className="label-caps text-jaggery/70">{m.articleShare}</p>
              <div className="flex gap-2.5">
                {shareLinks.map(({ name, Icon, href }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Share on ${name}`}
                    className="h-11 w-11 rounded-full bg-ivory border border-jaggery/10 text-jaggery/70 flex items-center justify-center hover:bg-jaggery hover:text-cream hover:border-jaggery transition-colors"
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
          <section aria-label={m.articleKeepReading} className="px-6 sm:px-10 lg:px-16 pb-24 sm:pb-28">
            <div className="max-w-[1000px] mx-auto">
              <span className="label-caps text-caramel-deep mb-4 block">{m.articleMoreFrom}</span>
              <h2 className="font-marker uppercase text-jaggery leading-[0.98] text-[clamp(1.8rem,4vw,3rem)] text-balance mb-10">
                {m.articleKeepReading}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-7 sm:gap-10">
                {related.map((r) => (
                  <Link key={r.slug} href={postPath(r)} className="group flex flex-col">
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-ivory ring-1 ring-jaggery/8 mb-5">
                      <Image
                        src={r.image}
                        alt={r.imageAlt ?? r.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                      />
                    </div>
                    <span className="label-caps text-forest mb-2 block">{tagLabel(r.tags[0], locale)}</span>
                    <h3 className="font-marker uppercase text-jaggery text-2xl leading-[1.05] group-hover:text-caramel-deep transition-colors text-balance">
                      {r.title}
                    </h3>
                    <span className="mt-3 inline-flex items-center gap-2 label-caps text-jaggery/70 group-hover:text-jaggery transition-colors">
                      {m.articleReadArticle} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── Taste-the-story CTA band ───────────────────────────── */}
        <section aria-label={m.ctaButton} className="relative bg-grove text-cream px-6 sm:px-10 lg:px-16 pt-24 sm:pt-32 pb-20 sm:pb-24 overflow-hidden">
          <AnimatedWave aria-hidden flip className="absolute top-0 left-0 w-full h-[48px] sm:h-[68px] text-cream" />
          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <span className="label-caps text-honey-ink mb-5 block">{m.ctaEyebrow}</span>
            <h2 className="font-marker uppercase text-cream leading-[0.98] text-[clamp(2rem,4.4vw,3.4rem)] text-balance">
              {m.ctaHeading}
            </h2>
            <p className="text-cream/80 text-lede mt-6 max-w-xl mx-auto">
              {m.ctaBody}
            </p>
            <Link
              href="/shop"
              className="group mt-9 inline-flex items-center gap-3 rounded-full bg-cream text-jaggery label-caps px-9 py-4 hover:bg-honey transition-colors"
            >
              {m.ctaButton}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
            </Link>
          </div>
        </section>
      </main>

      <Footer locale={locale} />
    </>
  );
}
