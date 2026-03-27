import React from 'react';
import data from "@/data/content.json";
import { ZoomIn, FadeUp } from "@/components/Animations";
import { Check } from "lucide-react";

export default function TrustBanner() {
  return (
    <section aria-label="Trust Badges" className="py-10 sm:py-14 bg-[#2C1500]">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10">
        <div className="flex flex-wrap justify-center gap-8 sm:gap-12 md:gap-20">
          {data.trustBanner.badges.map((badge, i) => (
            <FadeUp key={i} delay={i * 0.08}>
              <div className="flex items-center gap-3 text-white">
                <div className="w-8 h-8 rounded-full bg-[#C17A2A] flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                <span className="text-sm sm:text-base font-medium text-white/90">{badge}</span>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
