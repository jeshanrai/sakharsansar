import React from 'react';
import data from "@/data/content.json";
import { ZoomIn, FadeUp } from "@/components/Animations";
import { Check } from "lucide-react";

export default function TrustBanner() {
  return (
    <section aria-label="Trust Badges" className="py-12 sm:py-16 bg-[#C17A2A] text-white">
      <div className="max-w-[1440px] mx-auto px-6">
        <ZoomIn>
          <div className="text-center mb-10">
            <h2 className="font-poppins text-lg md:text-xl font-medium tracking-[0.2em] uppercase text-white">{data.trustBanner.title}</h2>
          </div>
        </ZoomIn>

        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-16">
          {data.trustBanner.badges.map((badge, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <div className="flex flex-col items-center gap-4 text-white group cursor-default">
                <Check className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" strokeWidth={1}/>
                <span className="text-[10px] md:text-xs font-semibold tracking-[0.1em] uppercase text-center max-w-[120px] text-white/90">{badge}</span>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
