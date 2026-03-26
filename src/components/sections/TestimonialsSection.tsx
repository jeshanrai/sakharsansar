import React from 'react';
import data from "@/data/content.json";
import { FadeUp } from "@/components/Animations";

export default function TestimonialsSection() {
  return (
    <section aria-label="Customer Testimonials" className="py-32 sm:py-40 px-6 bg-[#F4F1ED]">
      <div className="max-w-[1440px] mx-auto">
        <h2 className="sr-only">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 sm:gap-24 lg:gap-40 items-center justify-center">
          {data.testimonials.map((test, i) => (
            <FadeUp key={i} delay={i * 0.2}>
              <figure className="flex flex-col text-center items-center group cursor-default">
                <blockquote>
                  <p className="font-poppins text-lg md:text-2xl font-light text-black italic tracking-wide mb-12 leading-loose max-w-lg">
                    &ldquo;{test.review}&rdquo;
                  </p>
                </blockquote>
                <div className="w-8 h-px bg-black/40 mb-8" />
                <figcaption className="font-poppins text-xs font-semibold uppercase tracking-[0.2em] text-black">
                  {test.name}
                </figcaption>
              </figure>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
