import React from 'react';
import Image from 'next/image';
import data from "@/data/content.json";
import { FadeUp, SlideInLeft } from "@/components/ui/Animations";

// Hand-curated profile metadata to enrich the (currently sparse) content.json
const farmerMeta: Record<string, { years: number; village: string; quote: string }> = {
  "Ram Bahadur": {
    years: 22,
    village: "Khandbari · Sankhuwasabha",
    quote:
      "I have made jaggery longer than I have known how to read. The cane knows when the fire is right.",
  },
};

export default function FarmersSection() {
  return (
    <section
      aria-label="Meet the makers"
      className="py-24 sm:py-36 px-6 sm:px-10 lg:px-16 bg-jaggery text-cream paper-grain"
    >
      <div className="max-w-[1440px] mx-auto">
        <SlideInLeft>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16 sm:mb-24 items-end">
            <div className="md:col-span-7">
              <span className="label-caps text-honey mb-5 block">The Makers</span>
              <h2 className="font-serif text-h1 text-cream tracking-[-0.018em] text-balance">
                Forty-two families. <span className="italic font-light">One recipe.</span>
              </h2>
            </div>
            <p className="md:col-span-5 text-cream/70 text-lede md:max-w-md md:ml-auto">
              Every block we ship is made by someone we know by name. Here are a few
              of them.
            </p>
          </div>
        </SlideInLeft>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {data.farmers.map((farmer, i) => {
            const meta = farmerMeta[farmer.name] ?? {
              years: 15,
              village: farmer.location,
              quote: farmer.story,
            };
            return (
              <FadeUp key={farmer.name} delay={i * 0.1}>
                <article className="flex flex-col h-full">
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-jaggery-soft mb-6">
                    <Image
                      src={farmer.image}
                      alt={`${farmer.name}, jaggery maker from ${farmer.location}`}
                      fill
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <span className="label-caps text-honey mb-3 block">{meta.village}</span>
                  <h3 className="font-serif text-h4 text-cream mb-2">{farmer.name}</h3>
                  <span className="label-caps text-cream/55 mb-5 block nums-oldstyle">
                    {meta.years} years on the fire
                  </span>
                  <p className="font-serif italic text-cream/85 text-body">
                    &ldquo;{meta.quote}&rdquo;
                  </p>
                </article>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}
