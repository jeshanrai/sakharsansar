import React from 'react';
import Image from 'next/image';
import data from "@/data/content.json";
import { FadeUp, SlideInRight } from "@/components/Animations";

export default function FarmersSection() {
  return (
    <section aria-label="Meet the Farmers" className="py-32 px-6 bg-[#F4F1ED]">
      <div className="max-w-[1440px] mx-auto">
        <FadeUp>
          <h2 className="font-poppins text-3xl sm:text-5xl font-medium tracking-[0.1em] uppercase text-center text-black mb-24">Meet The Makers</h2>
        </FadeUp>
        <div className="flex gap-12 overflow-x-auto pb-12 snap-x scrollbar-hide -mx-6 px-6">
          {data.farmers.map((farmer, i) => (
            <SlideInRight key={i} delay={i * 0.1} className="min-w-[85vw] md:min-w-[600px] snap-center">
              <div className="bg-white group cursor-default h-full border border-black/10 flex flex-col md:flex-row overflow-hidden">
                <div className="relative h-72 sm:h-96 md:h-auto md:min-h-[400px] w-full md:w-1/2 overflow-hidden bg-black/5">
                  <Image
                    src={farmer.image}
                    alt={`${farmer.name}, jaggery farmer from ${farmer.location}`}
                    fill
                    sizes="(max-width: 768px) 85vw, 300px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out grayscale group-hover:grayscale-0"
                  />
                </div>
                <div className="p-8 sm:p-12 md:w-1/2 flex flex-col justify-center">
                  <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-black/40 mb-4">{farmer.location}</span>
                  <h3 className="font-poppins text-2xl font-medium uppercase tracking-[0.1em] text-black mb-6">{farmer.name}</h3>
                  <p className="text-black/70 font-light leading-relaxed italic text-sm">&ldquo;{farmer.story}&rdquo;</p>
                </div>
              </div>
            </SlideInRight>
          ))}
        </div>
      </div>
    </section>
  );
}
