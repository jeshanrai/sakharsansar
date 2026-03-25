import React from 'react';
import Link from 'next/link';
import blogData from "@/data/blog.json";
import { FadeUp, SlideInRight } from "@/components/Animations";
import { ArrowRight } from "lucide-react";

export default function BlogHighlightSection() {
  const recentPosts = blogData.slice(0, 3);
  
  return (
    <section id="blog" className="py-32 px-6 bg-white border-b border-black/10">
      <div className="max-w-[1440px] mx-auto">
        <FadeUp>
          <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-black pb-8">
            <h2 className="font-poppins text-4xl sm:text-5xl font-medium uppercase tracking-[0.1em] text-black">Insights & Stories</h2>
            <Link href="/blog" className="group inline-flex items-center gap-4 text-xs font-semibold tracking-[0.2em] uppercase text-black hover:text-black/60 transition-colors">
              View All <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" strokeWidth={1.5}/>
            </Link>
          </div>
        </FadeUp>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {recentPosts.map((post, i) => (
            <SlideInRight key={post.slug} delay={i * 0.1} className="h-full">
              <Link href={`/blog/${post.slug}`} className="group flex flex-col h-full cursor-pointer">
                <div className="relative aspect-[4/3] w-full overflow-hidden mb-8 bg-[#F4F1ED]">
                  <img src={post.image} alt={post.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1s] ease-out" />
                </div>
                <div className="flex flex-col flex-grow">
                  <div className="flex gap-4 items-center mb-6">
                    <span className="text-[10px] font-semibold tracking-[0.2em] text-black/50 border border-black/10 px-3 py-1 uppercase">{post.tags[0]}</span>
                    <span className="text-[10px] tracking-widest text-black/40 uppercase font-medium">{post.date}</span>
                  </div>
                  <h3 className="font-poppins text-xl font-medium uppercase tracking-[0.1em] text-black mb-4 group-hover:text-black/70 transition-colors">{post.title}</h3>
                  <p className="text-black/60 text-sm tracking-wide font-light flex-grow leading-relaxed mb-8">{post.description}</p>
                  <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-black mt-auto">
                    Read Article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1} />
                  </div>
                </div>
              </Link>
            </SlideInRight>
          ))}
        </div>
      </div>
    </section>
  );
}
