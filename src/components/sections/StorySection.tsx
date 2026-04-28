import React from 'react';
import Image from 'next/image';
import { FadeUp } from "@/components/ui/Animations";

export default function StorySection() {
  return (
    <section
      id="story"
      aria-label="Our Story"
      className="relative min-h-[88vh] flex flex-col bg-cream overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero.jpg"
          alt="Sankhuwasabha valley at first light"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-jaggery/60 via-jaggery/35 to-jaggery/75" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-end pb-20 sm:pb-28 px-6 sm:px-10 lg:px-16 pt-32">
        <div className="max-w-[1440px] mx-auto w-full">
          <FadeUp>
            <span className="label-caps text-honey mb-6 block">Our Story</span>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h1 className="font-serif font-soft text-cream text-display font-normal tracking-[-0.018em] max-w-4xl text-balance">
              Seven generations of <span className="italic font-light">slow sweetness.</span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-cream/85 text-lede mt-8 max-w-2xl">
              Long before there were brands, there was the recipe. Passed quietly from
              one generation to the next in the kitchens of Sankhuwasabha — a way of
              turning sugarcane into something the body actually wants.
            </p>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
