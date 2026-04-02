import React from 'react';
import data from "@/data/content.json";
import { FadeUp } from "@/components/Animations";
import { Check } from "lucide-react";

export default function TrustBanner() {
  return (
    <section aria-label="Trust Badges" className="py-10 sm:py-14 bg-[#2C1500]">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-2 lg:flex lg:flex-wrap lg:justify-center gap-4 gap-y-6 sm:gap-8 md:gap-20">
          {data.trustBanner.badges.map((badge, i) => (
            <FadeUp key={i} delay={i * 0.08}>
              <div className="flex items-center gap-2.5 sm:gap-3 text-white">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#C17A2A] flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" strokeWidth={2.5} />
                </div>
                <span className="text-xs sm:text-base font-medium text-white/90 leading-tight">{badge}</span>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
