import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import OrderDrawer from "@/components/layout/OrderDrawer";
import blogData from "@/data/blog.json";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog & Insights | Himalayan Jaggery",
  description: "Read our latest articles on pure Himalayan jaggery, its health benefits, recipes, and the story of our farmers in Sankhuwasabha.",
  openGraph: {
    title: "Blog & Insights | Himalayan Jaggery",
    description: "Read our latest articles on pure Himalayan jaggery, its health benefits, recipes, and the story of our farmers in Sankhuwasabha.",
    url: "https://himalayanjaggery.com/blog",
    siteName: "Himalayan Jaggery",
    images: ["/hero.jpg"],
    type: "website",
  }
};

export default function BlogList() {
  return (
    <div className="overflow-x-hidden bg-white selection:bg-black selection:text-white">
      <Navbar />
      <OrderDrawer />
      
      <main className="py-40 px-6 min-h-screen">
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-24 flex flex-col gap-8 border-b border-black pb-8">
            <h1 className="font-poppins text-5xl sm:text-7xl font-medium uppercase tracking-[0.1em] text-black">
              Insights &<br/>Stories
            </h1>
            <p className="text-sm font-light tracking-widest text-black/60 uppercase max-w-xl leading-loose">
              Explore the rich heritage, health benefits, and versatile culinary uses of pure Himalayan jaggery.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            {blogData.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.slug} className="group flex flex-col h-full cursor-pointer">
                <div className="relative aspect-[4/3] w-full overflow-hidden mb-8 bg-[#F4F1ED]">
                  <img src={post.image} alt={post.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1s] ease-out" />
                </div>
                <div className="flex flex-col flex-grow">
                  <div className="flex gap-4 items-center mb-6">
                    <span className="text-[10px] font-semibold tracking-[0.2em] text-black/50 border border-black/10 px-3 py-1 uppercase">{post.tags[0]}</span>
                    <span className="text-[10px] tracking-widest text-black/40 uppercase font-medium">{post.date}</span>
                  </div>
                  <h3 className="font-poppins text-2xl font-medium uppercase tracking-[0.1em] text-black mb-6 group-hover:text-black/70 transition-colors leading-relaxed">{post.title}</h3>
                  <p className="text-black/60 text-sm tracking-wide font-light flex-grow leading-relaxed mb-8">{post.description}</p>
                  <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-black mt-auto">
                    Read Article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
