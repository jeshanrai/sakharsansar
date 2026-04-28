"use client";

import React, { useState, useCallback, useEffect } from 'react';
import data from "@/data/content.json";
import { FadeUp } from "@/components/ui/Animations";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const total = data.testimonials.length;

  const next = useCallback(() => setActive(i => (i + 1) % total), [total]);
  const prev = useCallback(() => setActive(i => (i - 1 + total) % total), [total]);

  useEffect(() => {
    const id = setInterval(next, 7000);
    return () => clearInterval(id);
  }, [next]);

  const t = data.testimonials[active];

  return (
    <section
      aria-label="Customer voices"
      className="py-24 sm:py-36 px-6 sm:px-10 lg:px-16 bg-ivory paper-grain"
    >
      <div className="max-w-3xl mx-auto text-center">
        <FadeUp>
          <span className="label-caps text-caramel mb-12 block">Voices</span>
        </FadeUp>

        <FadeUp delay={0.1}>
          <blockquote
            key={active}
            className="animate-in fade-in duration-700"
          >
            {/* Decorative quote mark */}
            <span className="font-serif italic text-7xl sm:text-8xl text-caramel/30 leading-none block mb-2" aria-hidden="true">
              &ldquo;
            </span>
            <p className="pull-quote text-jaggery mb-12 text-2xl sm:text-3xl lg:text-[2.5rem]">
              {t.review}
            </p>
            <footer className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-caramel/15 flex items-center justify-center">
                <span className="font-serif text-xl text-caramel-deep">
                  {t.name.charAt(0)}
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <cite className="not-italic font-serif text-base text-jaggery">
                  {t.name}
                </cite>
                <span className="label-caps text-jaggery/55">{t.location}</span>
              </div>
            </footer>
          </blockquote>
        </FadeUp>

        {/* Navigation: arrows + dots */}
        <div className="mt-14 flex items-center justify-center gap-8">
          <button
            onClick={prev}
            aria-label="Previous testimonial"
            className="text-jaggery/50 hover:text-jaggery transition-colors p-1"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
          </button>

          <div className="flex items-center gap-3">
            {data.testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                aria-current={i === active}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === active
                    ? 'w-8 bg-jaggery'
                    : 'w-1.5 bg-jaggery/25 hover:bg-jaggery/50'
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            aria-label="Next testimonial"
            className="text-jaggery/50 hover:text-jaggery transition-colors p-1"
          >
            <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </section>
  );
}
