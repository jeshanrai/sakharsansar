import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import OrderDrawer from "@/components/layout/OrderDrawer";
import FaqsSection from "@/components/sections/FaqsSection";
import blogData from "@/data/blog.json";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog & Insights | SakharSansar",
  description: "Read our latest articles on pure Himalayan jaggery, its health benefits, recipes, and the story of our farmers in Sankhuwasabha.",
  alternates: {
    canonical: "https://sakharsansar.com/blog",
  },
  openGraph: {
    title: "Blog & Insights | SakharSansar",
    description: "Read our latest articles on pure Himalayan jaggery, its health benefits, recipes, and the story of our farmers in Sankhuwasabha.",
    url: "https://sakharsansar.com/blog",
    siteName: "SakharSansar",
    images: ["/hero.jpg"],
    type: "website",
  }
};

export default function BlogList() {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <OrderDrawer />

      <main className="py-32 sm:py-40 px-6 min-h-screen overflow-x-hidden">
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-16 sm:mb-24 flex flex-col gap-8 border-b border-black pb-8">
            <h1 className="font-poppins text-4xl sm:text-5xl md:text-7xl font-medium uppercase tracking-[0.1em] text-black">
              Insights &<br/>Stories
            </h1>
            <p className="text-sm font-light tracking-widest text-black/60 uppercase max-w-xl leading-loose">
              Explore the rich heritage, health benefits, and versatile culinary uses of pure Himalayan jaggery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-16">
            {blogData.map((post) => (
              <article key={post.slug}>
                <Link href={`/blog/${post.slug}`} className="group flex flex-col h-full cursor-pointer">
                  <div className="relative aspect-[4/3] w-full overflow-hidden mb-8 bg-[#F4F1ED]">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-[1s] ease-out"
                    />
                  </div>
                  <div className="flex flex-col flex-grow">
                    <div className="flex gap-4 items-center mb-6">
                      <span className="text-[10px] font-semibold tracking-[0.2em] text-black/50 border border-black/10 px-3 py-1 uppercase">{post.tags[0]}</span>
                      <time dateTime={post.date} className="text-[10px] tracking-widest text-black/40 uppercase font-medium">{post.date}</time>
                    </div>
                    <h2 className="font-poppins text-xl sm:text-2xl font-medium uppercase tracking-[0.1em] text-black mb-6 group-hover:text-black/70 transition-colors leading-relaxed">{post.title}</h2>
                    <p className="text-black/60 text-sm tracking-wide font-light flex-grow leading-relaxed mb-8">{post.description}</p>
                    <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-black mt-auto">
                      Read Article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1} />
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </main>

      <FaqsSection />
      <Footer />
    </>
  );
}
