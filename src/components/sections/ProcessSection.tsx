import React from 'react';
import data from "@/data/content.json";
import { FadeUp } from "@/components/ui/Animations";

export default function ProcessSection() {
  return (
    <section aria-label="Our Process" className="py-24 sm:py-32 px-6 bg-white border-b border-black/10">
      <div className="max-w-[1440px] mx-auto">
        <FadeUp>
          <h2 className="font-poppins text-3xl sm:text-5xl font-medium tracking-[0.1em] uppercase text-center text-black mb-20 sm:mb-32">The Craftmanship</h2>
        </FadeUp>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 relative px-4">
          <div className="hidden md:block absolute top-[28px] left-[15%] right-[15%] h-px bg-black/10 -z-10" />
          {data.process.map((step, i) => (
            <FadeUp key={i} delay={i * 0.15}>
              <div className="flex flex-col items-center text-center bg-white">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-black flex items-center justify-center font-poppins text-lg sm:text-xl font-medium text-black mb-8 sm:mb-10 bg-white">
                  0{i + 1}
                </div>
                <h3 className="font-poppins text-xs font-semibold tracking-[0.2em] uppercase text-black mb-4 sm:mb-6">{step.title}</h3>
                <p className="text-black/60 px-2 sm:px-4 text-xs tracking-wide leading-loose font-light max-w-[250px]">{step.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
