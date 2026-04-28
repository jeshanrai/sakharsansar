import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import OrderDrawer from "@/components/layout/OrderDrawer";
import blogData from "@/data/blog.json";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Journal | SakharSansar",
  description: "Letters from Sankhuwasabha — recipes, rituals, and the slow stories behind every block of pure Himalayan jaggery.",
  alternates: { canonical: "https://sakharsansar.com/blog" },
  openGraph: {
    title: "Journal | SakharSansar",
    description: "Letters from Sankhuwasabha — recipes, rituals, and harvest notes.",
    url: "https://sakharsansar.com/blog",
    siteName: "SakharSansar",
    images: ["/hero.jpg"],
    type: "website",
  },
};

export default function BlogList() {
  const [featured, ...rest] = blogData;

  return (
    <>
      <header>
        <Navbar />
      </header>
      <OrderDrawer />

      <main className="bg-cream pt-32 sm:pt-40 pb-24 sm:pb-32 px-6 sm:px-10 lg:px-16 min-h-screen overflow-x-hidden">
        <div className="max-w-[1440px] mx-auto">
          {/* Editorial header */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-16 sm:mb-24 items-end border-b border-jaggery/15 pb-10">
            <div className="md:col-span-8">
              <span className="label-caps text-caramel mb-5 block">The Journal</span>
              <h1 className="font-serif font-soft text-jaggery text-display tracking-[-0.018em] text-balance">
                Letters from <span className="italic font-light">Sankhuwasabha.</span>
              </h1>
            </div>
            <p className="md:col-span-4 text-jaggery/70 text-lede md:max-w-sm md:ml-auto">
              Recipes, rituals, harvest notes, and the slow stories behind the jaggery
              we pour by hand.
            </p>
          </div>

          {/* Featured */}
          {featured && (
            <Link
              href={`/blog/${featured.slug}`}
              className="group grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-20 sm:mb-32"
            >
              <div className="lg:col-span-7 relative aspect-[4/3] sm:aspect-[3/2] w-full overflow-hidden bg-ivory">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.03]"
                />
              </div>
              <div className="lg:col-span-5 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-5">
                  <span className="label-caps text-caramel">{featured.tags[0]}</span>
                  <span className="w-1 h-1 rounded-full bg-jaggery/30" />
                  <time dateTime={featured.date} className="label-caps text-jaggery/45">
                    {featured.date}
                  </time>
                </div>
                <h2 className="font-serif text-h1 text-jaggery tracking-[-0.018em] mb-6 group-hover:text-caramel-deep transition-colors text-balance">
                  {featured.title}
                </h2>
                <p className="text-jaggery/75 text-lede mb-8">
                  {featured.description}
                </p>
                <span className="inline-flex items-center gap-3 label-caps text-jaggery border-b border-jaggery/30 group-hover:border-jaggery pb-1.5 self-start transition-colors">
                  Read the article
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={1.5} />
                </span>
              </div>
            </Link>
          )}

          {/* Rest of posts — 2-col grid */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-16 sm:gap-x-16 sm:gap-y-24">
              {rest.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col h-full"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-ivory mb-6">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="label-caps text-caramel">{post.tags[0]}</span>
                    <span className="w-1 h-1 rounded-full bg-jaggery/30" />
                    <time dateTime={post.date} className="label-caps text-jaggery/45">
                      {post.date}
                    </time>
                  </div>
                  <h2 className="font-serif text-h3 text-jaggery tracking-[-0.012em] mb-4 group-hover:text-caramel-deep transition-colors text-balance">
                    {post.title}
                  </h2>
                  <p className="text-jaggery/70 text-body mb-5 flex-grow">
                    {post.description}
                  </p>
                  <span className="inline-flex items-center gap-2 label-caps text-jaggery/80 group-hover:text-jaggery">
                    Read more
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={1.5} />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
