import React from 'react';
import { ZoomIn, FadeUp } from "@/components/Animations";
import { Check, X } from "lucide-react";

export default function ComparisonSection() {
  return (
    <section className="py-32 px-6 bg-[#F4F1ED]">
      <div className="max-w-[1000px] mx-auto">
        <FadeUp>
          <div className="mb-20 text-center flex flex-col items-center">
            <h2 className="font-poppins text-3xl sm:text-5xl font-medium tracking-[0.1em] uppercase text-black mb-6">Original vs Refined</h2>
            <div className="w-12 h-px bg-black mb-6" />
          </div>
        </FadeUp>
        <ZoomIn delay={0.2}>
          <div className="w-full border border-black/20 bg-white">
            <div className="grid grid-cols-3 bg-black text-white text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em]">
              <div className="p-6 md:p-8">Specification</div>
              <div className="p-6 md:p-8 text-center border-l border-white/20">The Original</div>
              <div className="p-6 md:p-8 text-center border-l border-white/20 text-white/50">Market Sugar</div>
            </div>
            
            {[
              { label: "Processing", original: <Check className="w-4 h-4 mx-auto text-black" />, market: <X className="w-4 h-4 mx-auto text-black/30" /> },
              { label: "Chemicals", original: "Zero Additives", market: "Bleach & Sulphur" },
              { label: "Nutritional Value", original: "Minerals Preserved", market: "Empty Calories" },
              { label: "Origin", original: "Sankhuwasabha Farm", market: "Industrial Plant" },
            ].map((row, idx) => (
              <div key={idx} className="grid grid-cols-3 border-b border-black/10 last:border-b-0 hover:bg-[#F4F1ED]/40 transition text-xs font-light">
                <div className="p-6 md:p-8 text-black/60 uppercase tracking-widest">{row.label}</div>
                <div className="p-6 md:p-8 text-center font-medium text-black uppercase tracking-[0.1em] flex items-center justify-center border-l border-black/10">{row.original}</div>
                <div className="p-6 md:p-8 text-center text-black/40 uppercase tracking-[0.1em] flex items-center justify-center border-l border-black/10">{row.market}</div>
              </div>
            ))}
          </div>
        </ZoomIn>
      </div>
    </section>
  );
}
