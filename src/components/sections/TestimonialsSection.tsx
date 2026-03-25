import React from 'react';
import data from "@/data/content.json";
import { FadeUp } from "@/components/Animations";

export default function TestimonialsSection() {
  return (
    <section className="py-40 px-6 bg-[#F4F1ED]">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 lg:gap-40 items-center justify-center">
          {data.testimonials.map((test, i) => (
            <FadeUp key={i} delay={i * 0.2}>
              <div className="flex flex-col text-center items-center group cursor-default">
                <p className="font-poppins text-lg md:text-2xl font-light text-black italic tracking-wide mb-12 leading-loose max-w-lg">
                  "{test.review}"
                </p>
                <div className="w-8 h-px bg-black/40 mb-8" />
                <p className="font-poppins text-xs font-semibold uppercase tracking-[0.2em] text-black">
                  {test.name}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
