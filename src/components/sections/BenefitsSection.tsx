import React from 'react';
import data from "@/data/content.json";
import { SlideInLeft, SlideInRight } from "@/components/Animations";

export default function BenefitsSection() {
  return (
    <section aria-label="Health Benefits" className="py-24 sm:py-32 px-6 bg-white border-b border-black/10">
      <div className="max-w-[1440px] mx-auto">
        <SlideInLeft>
          <div className="mb-16 sm:mb-24 text-center md:text-left flex flex-col md:flex-row justify-between items-end gap-6 border-b border-black/10 pb-12">
            <h2 className="font-poppins text-3xl sm:text-5xl font-medium tracking-[0.1em] uppercase text-black">A Body Cleanser</h2>
            <p className="text-[10px] md:text-xs text-black/50 uppercase tracking-widest font-semibold max-w-sm leading-loose">Pure sugarcane juice activated. Rich in minerals and antioxidants.</p>
          </div>
        </SlideInLeft>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black/10">
          {data.benefits.map((benefit, i) => (
            <div key={i} className="bg-white p-8 sm:p-12 lg:p-20 group hover:bg-[#F4F1ED]/50 transition-colors duration-500">
              {i % 2 === 0 ? (
                <SlideInLeft delay={0.1}>
                  <div className="flex flex-col h-full justify-center">
                    <span className="text-black/30 font-poppins text-xs tracking-[0.2em] mb-4 block leading-none">0{i+1}</span>
                    <h3 className="font-poppins text-lg sm:text-xl font-medium uppercase tracking-[0.1em] text-black mb-6 sm:mb-8">{benefit.title}</h3>
                    <p className="text-black/60 leading-[2] text-sm font-light">{benefit.desc}</p>
                  </div>
                </SlideInLeft>
              ) : (
                <SlideInRight delay={0.2}>
                  <div className="flex flex-col h-full justify-center">
                    <span className="text-black/30 font-poppins text-xs tracking-[0.2em] mb-4 block leading-none">0{i+1}</span>
                    <h3 className="font-poppins text-lg sm:text-xl font-medium uppercase tracking-[0.1em] text-black mb-6 sm:mb-8">{benefit.title}</h3>
                    <p className="text-black/60 leading-[2] text-sm font-light">{benefit.desc}</p>
                  </div>
                </SlideInRight>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
