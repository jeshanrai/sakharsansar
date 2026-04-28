import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import OrderDrawer from "@/components/layout/OrderDrawer";
import blogData from "@/data/blog.json";
import { ArrowLeft } from "lucide-react";

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
    "keywords": post.tags.join(', '),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://sakharsansar.com/blog/${post.slug}`
    }
  };

  const paragraphs = post.content.split('\n\n');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header>
        <Navbar />
      </header>
      <OrderDrawer />

      <main className="bg-cream pt-28 sm:pt-36 pb-24 sm:pb-32 px-6 sm:px-10 lg:px-16 min-h-screen overflow-x-hidden">
        <article className="max-w-[760px] mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-3 label-caps text-jaggery/60 hover:text-jaggery transition-colors mb-12 sm:mb-16"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} /> Back to Journal
          </Link>

          <header className="mb-14">
            <div className="flex items-center gap-4 mb-7">
              <span className="label-caps text-caramel">{post.tags[0]}</span>
              <span className="w-1 h-1 rounded-full bg-jaggery/30" />
              <time dateTime={post.date} className="label-caps text-jaggery/45">
                {post.date}
              </time>
            </div>

            <h1 className="font-serif text-h1 text-jaggery tracking-[-0.018em] mb-7 text-balance">
              {post.title}
            </h1>

            <p className="font-serif italic text-jaggery/75 text-lede">
              {post.description}
            </p>
          </header>

          <div className="relative aspect-[16/9] w-full overflow-hidden mb-14 bg-ivory">
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 800px) 100vw, 800px"
              className="object-cover"
            />
          </div>

          <div className="pb-16 border-b border-jaggery/15">
            {paragraphs.map((paragraph, index) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3
                    key={index}
                    className="font-serif text-h3 text-jaggery mt-14 mb-6"
                  >
                    {paragraph.replace('### ', '')}
                  </h3>
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
          </div>

          <div className="pt-14 flex flex-col items-center text-center">
            <p className="label-caps text-jaggery/55 mb-7">Share this article</p>
            <div className="flex gap-8">
              {[
                { name: "Twitter", href: `https://twitter.com/intent/tweet?url=https://sakharsansar.com/blog/${post.slug}&text=${encodeURIComponent(post.title)}` },
                { name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=https://sakharsansar.com/blog/${post.slug}` },
                { name: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=https://sakharsansar.com/blog/${post.slug}` },
              ].map(s => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label-caps text-jaggery hover:text-caramel-deep transition-colors"
                >
                  {s.name}
                </a>
              ))}
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </>
  );
}
