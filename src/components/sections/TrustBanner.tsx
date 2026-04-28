import React from 'react';
import data from "@/data/content.json";
import { FadeUp } from "@/components/ui/Animations";

export default function TrustBanner() {
  return (
    <section
      aria-label="Promise"
      className="py-10 sm:py-14 bg-forest/95 text-cream"
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-4 sm:gap-x-10 items-center">
          {data.trustBanner.badges.map((badge, i) => (
            <FadeUp key={i} delay={i * 0.06}>
              <div className="flex items-baseline gap-3 sm:gap-4">
                <span className="font-serif italic text-honey/80 text-base shrink-0">
                  0{i + 1}
                </span>
                <span className="label-caps text-cream/90 leading-snug">
                  {badge}
                </span>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
