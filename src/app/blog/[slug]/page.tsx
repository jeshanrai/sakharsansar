import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Footer from "@/components/layout/Footer";
import OrderDrawer from "@/components/layout/OrderDrawer";
import { AnimatedWave, Bee } from "@/components/ui/StoryArt";
import { Daisy } from "@/components/ui/Doodles";
import blogData from "@/data/blog.json";
import { ArrowRight, ChevronRight, Clock, Twitter, Facebook, Linkedin } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogData.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const post = blogData.find((p) => p.slug === resolvedParams.slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} | SakharSansar Journal`,
    description: post.description,
    alternates: { canonical: `https://sakharsansar.com/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://sakharsansar.com/blog/${post.slug}`,
      siteName: "SakharSansar",
      images: [{ url: post.image, width: 1200, height: 630, alt: post.title }],
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.image],
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const resolvedParams = await params;
  const post = blogData.find((p) => p.slug === resolvedParams.slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "image": `https://sakharsansar.com${post.image}`,
    "author": { "@type": "Organization", "name": post.author },
    "publisher": {
      "@type": "Organization",
      "name": "SakharSansar",
      "logo": { "@type": "ImageObject", "url": "https://sakharsansar.com/hero.jpg" }
    },
    "datePublished": post.date,
    "dateModified": post.date,
    "inLanguage": "en",
    "articleSection": post.tags[0],
    "keywords": post.tags.join(', '),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://sakharsansar.com/blog/${post.slug}`
    }
  };

  const paragraphs = post.content.split('\n\n');
  const readingMins = Math.max(1, Math.round(post.content.split(/\s+/).length / 200));
  const authorInitials = post.author
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const related = blogData.filter((p) => p.slug !== post.slug).slice(0, 2);

  const shareLinks = [
    { name: "Twitter", Icon: Twitter, href: `https://twitter.com/intent/tweet?url=https://sakharsansar.com/blog/${post.slug}&text=${encodeURIComponent(post.title)}` },
    { name: "Facebook", Icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=https://sakharsansar.com/blog/${post.slug}` },
    { name: "LinkedIn", Icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=https://sakharsansar.com/blog/${post.slug}` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <OrderDrawer />

      <main className="bg-cream overflow-x-hidden">
        {/* ─── Hero (peach) ───────────────────────────────────────── */}
        <header className="relative bg-peach overflow-hidden pt-28 sm:pt-36 pb-24 sm:pb-32 px-6 sm:px-10 lg:px-16">
          {/* Doodles */}
          <Bee aria-hidden className="pointer-events-none absolute top-28 right-[8%] w-24 h-16 text-peach-line/70 hidden md:block" />
          <Daisy aria-hidden className="pointer-events-none absolute top-24 right-[27%] w-14 h-14 text-peach-line/50 -rotate-12 hidden md:block" />

          <div className="relative z-10 max-w-[820px] mx-auto">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-7">
              <ol className="flex items-center gap-2 label-caps text-jaggery/45">
                <li>
                  <Link href="/" className="hover:text-grove transition-colors">Home</Link>
                </li>
                <ChevronRight className="w-3 h-3 text-jaggery/30" strokeWidth={2.5} aria-hidden />
                <li>
                  <Link href="/blog" className="hover:text-grove transition-colors">Journal</Link>
                </li>
                <ChevronRight className="w-3 h-3 text-jaggery/30" strokeWidth={2.5} aria-hidden />
                <li aria-current="page" className="text-grove">Article</li>
              </ol>
            </nav>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="inline-flex items-center rounded-full bg-grove/10 border border-grove/15 px-3.5 py-1.5 label-caps text-grove">
                {post.tags[0]}
              </span>
              <time dateTime={post.date} className="label-caps text-jaggery/45">{post.date}</time>
              <span className="w-1 h-1 rounded-full bg-jaggery/25" />
              <span className="inline-flex items-center gap-1.5 label-caps text-jaggery/45">
                <Clock className="w-3.5 h-3.5" strokeWidth={1.75} /> {readingMins} min read
              </span>
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
              <div className="h-11 w-11 rounded-full bg-gradient-to-br from-honey to-caramel flex items-center justify-center text-cream font-serif text-sm shadow-sm">
                {authorInitials}
              </div>
              <div>
                <p className="font-medium text-jaggery text-sm">{post.author}</p>
                <p className="label-caps text-jaggery/45">SakharSansar Journal</p>
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
                alt={post.title}
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
            {paragraphs.map((paragraph, index) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h2
                    key={index}
                    className="font-serif text-h3 text-jaggery mt-14 mb-5 tracking-[-0.012em] text-balance"
                  >
                    {paragraph.replace('### ', '')}
                  </h2>
                );
              }
              return (
                <p
                  key={index}
                  className={`text-jaggery/85 text-lede mb-7 ${index === 0 ? 'has-dropcap' : ''}`}
                >
                  {paragraph}
                </p>
              );
            })}

            {/* Tags */}
            <div className="mt-14 pt-8 border-t border-jaggery/12 flex flex-wrap gap-2.5">
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
                        alt={r.title}
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
              Now — taste the story
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
