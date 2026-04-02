import React from 'react';
import data from "@/data/content.json";
import { FadeUp } from "@/components/Animations";
import { Star } from "lucide-react";

export default function TestimonialsSection() {
  return (
    <section aria-label="Customer Testimonials" className="py-20 sm:py-28 px-6 sm:px-10 bg-[#FBF4E8]">
      <div className="max-w-[1440px] mx-auto">
        <div className="text-center mb-14 sm:mb-20">
          <p className="text-sm sm:text-base font-semibold tracking-[0.2em] uppercase text-[#C17A2A] mb-3">Testimonials</p>
          <h2 className="font-poppins text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2C1500]">What Our Customers Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 max-w-4xl mx-auto">
          {data.testimonials.map((test, i) => (
            <FadeUp key={i} delay={i * 0.15}>
              <figure className="bg-white rounded-2xl p-8 sm:p-10 hover:shadow-lg transition-shadow duration-500">
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 text-[#C17A2A] fill-[#C17A2A]" />
                  ))}
                </div>
                <blockquote>
                  <p className="text-base sm:text-lg text-[#2C1500]/80 leading-relaxed mb-6">
                    &ldquo;{test.review}&rdquo;
                  </p>
                </blockquote>
                <figcaption className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#C17A2A]/15 flex items-center justify-center">
                    <span className="font-poppins font-bold text-sm text-[#C17A2A]">{test.name.charAt(0)}</span>
                  </div>
                  <div>
                    <span className="block font-poppins text-base font-semibold text-[#2C1500] leading-none">{test.name}</span>
                    <span className="text-xs text-[#C17A2A] font-medium tracking-wide uppercase mt-1 block">{test.location}</span>
                  </div>
                </figcaption>
              </figure>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
