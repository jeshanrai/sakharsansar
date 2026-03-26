"use client";
import React, { useState } from 'react';
import data from "@/data/content.json";
import { FadeUp, ZoomIn } from "@/components/Animations";
import { Plus, Minus } from "lucide-react";

export default function FaqsSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": data.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section aria-label="Frequently Asked Questions" className="py-32 px-6 bg-white border-b border-black/10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
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
              <div className="border-b border-black/10 transition-colors group">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex justify-between items-center gap-8 py-8 sm:py-10 text-left cursor-pointer"
                  aria-expanded={openIndex === i}
                >
                  <h3 className="font-poppins text-xs sm:text-sm font-semibold tracking-[0.1em] uppercase text-black group-hover:text-black/50 transition-colors max-w-lg leading-relaxed">{faq.question}</h3>
                  {openIndex === i ? (
                    <Minus className="w-4 h-4 text-black/50 shrink-0 transition-transform" strokeWidth={1.5}/>
                  ) : (
                    <Plus className="w-4 h-4 text-black/30 shrink-0 transition-transform" strokeWidth={1}/>
                  )}
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                    openIndex === i ? 'max-h-60 opacity-100 pb-8' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-black/60 text-sm font-light leading-[2] tracking-wide max-w-2xl">{faq.answer}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
