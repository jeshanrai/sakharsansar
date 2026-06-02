import React from 'react';
import Image from 'next/image';
import { FadeUp, SlideInLeft, SlideInRight } from "@/components/ui/Animations";

/**
 * "Nice to meet" frame — deep green band with a staggered cream card and a
 * rounded image, the way the reference offsets the two against each other.
 * Top padding clears the hero image that bleeds down from the section above.
 */
export default function StoryWelcomeSection() {
  return (
    <section
      aria-label="Nice to meet us"
      className="relative bg-grove text-cream px-6 sm:px-10 lg:px-16 py-20 sm:py-28 overflow-hidden"
    >
      <div className="max-w-[1180px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
        {/* Cream card — sits lower */}
        <SlideInLeft className="lg:col-span-6 lg:mt-24 lg:z-10">
          <div className="rounded-[1.75rem] bg-ivory text-jaggery px-7 sm:px-12 py-10 sm:py-14 shadow-2xl shadow-grove-deep/40">
            <h2 className="font-marker uppercase text-jaggery leading-[0.95] text-[clamp(2rem,4.4vw,3.25rem)]">
              Nice to meet us
            </h2>
            <p className="text-jaggery/75 text-body mt-6">
              Welcome to the valley. For seven generations, our families have farmed the
              terraces of Sankhuwasabha, pressing sugarcane and reducing it slowly over
              wood fire to make jaggery the right way. On our hillside farms we still do
              things by hand — and you can taste it. From dense amber blocks to golden
              liquid pours, every batch is made with care, as sweet as nature intended.
            </p>
          </div>
        </SlideInLeft>

        {/* Image — sits higher */}
        <SlideInRight className="lg:col-span-6 lg:-mt-10">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.75rem] ring-1 ring-cream/10 shadow-2xl shadow-grove-deep/40">
            <Image
              src="/hero.jpg"
              alt="A young farmer looking out over the terraced Sankhuwasabha valley"
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </SlideInRight>
      </div>

      <FadeUp className="sr-only">
        <span>Seven generations of wood-fired Himalayan jaggery.</span>
      </FadeUp>
    </section>
  );
}
