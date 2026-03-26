import React from 'react';
import data from "@/data/content.json";
import { SlideInLeft, ZoomIn } from "@/components/Animations";
import { Coffee, Cookie, Utensils } from "lucide-react";

const getIcon = (index: number) => {
  switch (index) {
    case 0: return <Coffee className="w-8 h-8 text-black" strokeWidth={1} />;
    case 1: return <Cookie className="w-8 h-8 text-black" strokeWidth={1} />;
    case 2: return <Utensils className="w-8 h-8 text-black" strokeWidth={1} />;
    default: return <Coffee className="w-8 h-8 text-black" strokeWidth={1} />;
  }
};

export default function WaysToEnjoySection() {
  return (
    <section aria-label="Ways to Enjoy" className="py-24 sm:py-32 px-6 bg-black text-white">
      <div className="max-w-[1440px] mx-auto">
        <SlideInLeft>
          <div className="flex flex-col items-center mb-16 sm:mb-24 border-b border-white/20 pb-12">
            <h2 className="font-poppins text-3xl sm:text-5xl font-medium tracking-[0.1em] uppercase text-white mb-6">Culinary Pairings</h2>
            <p className="text-[10px] sm:text-xs uppercase tracking-widest text-white/50 max-w-lg text-center leading-loose">The delicate and natural sweetener for everyday indulgence.</p>
          </div>
        </SlideInLeft>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-16">
          {data.waysToEnjoy.map((way, i) => (
            <ZoomIn key={i} delay={i * 0.1}>
              <div className="flex flex-col items-center text-center group cursor-default">
                <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center mb-10 group-hover:-translate-y-2 transition-transform duration-500 bg-white/5">
                  {React.cloneElement(getIcon(i), { className: "w-6 h-6 text-white", strokeWidth: 1.5 })}
                </div>
                <h3 className="font-poppins text-xs font-semibold tracking-[0.2em] uppercase text-white mb-6 w-full pb-4 border-b border-white/10">{way.title}</h3>
                <p className="text-white/60 text-[11px] leading-loose max-w-[250px] font-light lowercase tracking-widest">{way.desc}</p>
              </div>
            </ZoomIn>
          ))}
        </div>
      </div>
    </section>
  );
}
