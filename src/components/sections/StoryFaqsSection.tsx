"use client";

import React, { useState } from 'react';
import { FadeUp } from "@/components/ui/Animations";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "Where does SakharSansar jaggery come from?",
    answer:
      "Every block, powder and pour is made in Sankhuwasabha, in the Koshi Province of eastern Nepal, where the Arun river meets the Makalu foothills. Our cooperative of forty-two families across six villages grows the cane and makes the jaggery by hand — there is no middleman between their fire and your kitchen.",
  },
  {
    question: "What makes your jaggery chemical-free?",
    answer:
      "We use nothing but slow-cooked sugarcane juice. No bleach, no sulphur, no anti-caking agents and no artificial colour — the shortcuts factories use to sell pale jaggery cheaply year-round. Our jaggery is naturally amber because the wood fire made it that way, which is why it keeps the full mineral profile of the cane.",
  },
  {
    question: "How is traditional Himalayan jaggery made?",
    answer:
      "Cane is harvested by hand, pressed, and the juice is reduced over an open wood fire in an iron kadhai for around thirty hours. It is stirred with a wooden spoon and set in wooden moulds to cool. It is the same method our farmers' grandparents used — patient, unhurried, and entirely natural.",
  },
  {
    question: "How is jaggery different from refined white sugar?",
    answer:
      "Refined sugar is stripped of everything but sweetness. Our unrefined jaggery retains iron, magnesium, potassium and other minerals naturally present in sugarcane, and releases its energy more gently. It carries a deep caramel flavour that white sugar simply cannot match.",
  },
  {
    question: "How does buying SakharSansar support farmers?",
    answer:
      "We pay our farming families above market rate for chemical-free cane, buy directly with no middleman, and pack in compostable kraft paper from a neighbouring women's cooperative. Choosing SakharSansar keeps an ancient craft alive and sustains rural livelihoods in the Himalayas.",
  },
];

export default function StoryFaqsSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": { "@type": "Answer", "text": faq.answer },
    })),
  };

  return (
    <section
      aria-label="Questions about our story and sourcing"
      className="relative px-6 sm:px-10 lg:px-16 py-20 sm:py-28 bg-peach overflow-hidden"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        <div className="lg:col-span-4">
          <FadeUp>
            <span className="label-caps text-caramel mb-5 block">Good to know</span>
            <h2 className="font-marker uppercase text-jaggery leading-[0.95] text-[clamp(2rem,4vw,3.25rem)]">
              Questions, <span className="text-grove">answered</span>
            </h2>
            <p className="text-jaggery/65 text-lede mt-6 max-w-sm">
              The things people ask most about where our jaggery comes from and how it&rsquo;s made.
            </p>
          </FadeUp>
        </div>

        <div className="lg:col-span-8">
          <dl className="border-t border-jaggery/12">
            {faqs.map((faq, i) => {
              const open = openIndex === i;
              return (
                <FadeUp key={i} delay={i * 0.06}>
                  <div className="border-b border-jaggery/12">
                    <dt>
                      <button
                        onClick={() => setOpenIndex(open ? null : i)}
                        className="w-full flex justify-between items-center gap-8 py-7 text-left cursor-pointer group"
                        aria-expanded={open}
                      >
                        <span className="font-serif text-h4 text-jaggery group-hover:text-forest transition-colors text-balance">
                          {faq.question}
                        </span>
                        <span className="shrink-0 w-9 h-9 rounded-full border border-jaggery/15 flex items-center justify-center text-jaggery group-hover:bg-forest group-hover:text-cream group-hover:border-forest transition-colors">
                          {open ? (
                            <Minus className="w-4 h-4" strokeWidth={1.75} />
                          ) : (
                            <Plus className="w-4 h-4" strokeWidth={1.75} />
                          )}
                        </span>
                      </button>
                    </dt>
                    <dd
                      className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        open ? 'max-h-96 opacity-100 pb-7' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <p className="text-jaggery/70 text-body max-w-2xl">{faq.answer}</p>
                    </dd>
                  </div>
                </FadeUp>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}
