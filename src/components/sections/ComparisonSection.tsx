import React from 'react';
import { ZoomIn, FadeUp } from "@/components/Animations";
import { Check, X } from "lucide-react";

const rows = [
  { label: "Processing", original: "Hand-Crafted", market: "Industrial" },
  { label: "Chemicals", original: "Zero Additives", market: "Bleach & Sulphur" },
  { label: "Nutritional Value", original: "Minerals Preserved", market: "Empty Calories" },
  { label: "Origin", original: "Sankhuwasabha Farm", market: "Industrial Plant" },
];

export default function ComparisonSection() {
  return (
    <section aria-label="Comparison" className="py-32 px-6 bg-[#F4F1ED]">
      <div className="max-w-[1000px] mx-auto">
        <FadeUp>
          <div className="mb-20 text-center flex flex-col items-center">
            <h2 className="font-poppins text-3xl sm:text-5xl font-medium tracking-[0.1em] uppercase text-black mb-6">Original vs Refined</h2>
            <div className="w-12 h-px bg-black mb-6" />
          </div>
        </FadeUp>
        <ZoomIn delay={0.2}>
          <div className="overflow-x-auto">
            <table className="w-full border border-black/20 bg-white border-collapse">
              <thead>
                <tr className="bg-black text-white text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em]">
                  <th scope="col" className="p-6 md:p-8 text-left font-semibold">Specification</th>
                  <th scope="col" className="p-6 md:p-8 text-center border-l border-white/20 font-semibold">The Original</th>
                  <th scope="col" className="p-6 md:p-8 text-center border-l border-white/20 font-semibold text-white/50">Market Sugar</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={idx} className="border-b border-black/10 last:border-b-0 hover:bg-[#F4F1ED]/40 transition text-xs font-light">
                    <td className="p-6 md:p-8 text-black/60 uppercase tracking-widest">{row.label}</td>
                    <td className="p-6 md:p-8 text-center font-medium text-black uppercase tracking-[0.1em] border-l border-black/10">
                      <span className="inline-flex items-center gap-2 justify-center">
                        <Check className="w-4 h-4 text-black" strokeWidth={1.5} />
                        <span className="hidden sm:inline">{row.original}</span>
                      </span>
                    </td>
                    <td className="p-6 md:p-8 text-center text-black/40 uppercase tracking-[0.1em] border-l border-black/10">
                      <span className="inline-flex items-center gap-2 justify-center">
                        <X className="w-4 h-4 text-black/30" strokeWidth={1.5} />
                        <span className="hidden sm:inline">{row.market}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ZoomIn>
      </div>
    </section>
  );
}
