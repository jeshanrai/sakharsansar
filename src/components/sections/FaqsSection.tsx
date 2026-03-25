import React from 'react';
import data from "@/data/content.json";
import { FadeUp, ZoomIn } from "@/components/Animations";
import { Plus } from "lucide-react";

export default function FaqsSection() {
  return (
    <section className="py-32 px-6 bg-white border-b border-black/10">
      <div className="max-w-[1000px] mx-auto flex flex-col items-center">
        <ZoomIn>
          <div className="mb-24 flex flex-col items-center text-center">
            <h2 className="font-poppins text-3xl sm:text-5xl font-medium tracking-[0.1em] uppercase text-black mb-8">FAQ</h2>
            <div className="w-12 h-px bg-black" />
          </div>
        </ZoomIn>
        
        <div className="w-full flex flex-col">
          {data.faqs.map((faq, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <div className="border-b border-black/10 py-10 transition-colors group">
                <div className="flex justify-between items-start gap-8 cursor-default mb-6">
                  <h3 className="font-poppins text-xs font-semibold tracking-[0.1em] uppercase text-black group-hover:text-black/50 transition-colors max-w-lg leading-relaxed">{faq.question}</h3>
                  <Plus className="w-4 h-4 text-black/30 shrink-0" strokeWidth={1}/>
                </div>
                <p className="text-black/60 text-sm font-light leading-[2] lowercase tracking-wide max-w-2xl">{faq.answer}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
