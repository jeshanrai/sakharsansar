import React from 'react';

import data from "@/data/content.json";
import { SlideInLeft, SlideInRight } from "@/components/Animations";
import { ArrowRight } from "lucide-react";

export default function StorySection() {
  return (
    <section id="story" className="py-32 px-6 bg-white border-b border-black/10 overflow-hidden">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <SlideInLeft>
          <div className="relative h-[600px] lg:h-[800px] w-full overflow-hidden group">
            <img src="/hero.jpg" alt="Our Story" loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out" />
          </div>
        </SlideInLeft>
        <SlideInRight delay={0.2}>
          <div className="flex flex-col justify-center px-4 md:px-12">
            <h2 className="font-poppins text-4xl sm:text-6xl font-medium uppercase tracking-[0.1em] text-black mb-8 leading-tight">{data.story.title}</h2>
            <div className="w-full h-px bg-black/20 mb-12" />
            <p className="text-base text-black/70 leading-loose max-w-xl font-light mb-12">
              {data.story.content}
            </p>
            <a href="#contact" className="group inline-flex items-center gap-4 text-xs font-semibold tracking-[0.2em] uppercase text-black transition-all">
              Discover the Origin <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" strokeWidth={1}/>
            </a>
          </div>
        </SlideInRight>
      </div>
    </section>
  );
}
