import React from 'react';
import Link from 'next/link';
import { FadeUp } from "@/components/ui/Animations";
import { LandscapeBand, AnimatedWave } from "@/components/ui/StoryArt";

/**
 * "Real food, nothing added" frame — a centered green band with tonal
 * green-on-green landscape line-art and a cream pill, closing with a wavy
 * edge that flows down into the peach band below.
 */
export default function StoryMissionSection() {
  return (
    <section
      aria-label="Real food, nothing added"
      className="relative bg-grove text-cream px-6 sm:px-10 lg:px-16 pt-20 sm:pt-28 pb-28 sm:pb-36 overflow-hidden"
    >
      <LandscapeBand
        aria-hidden
        className="pointer-events-none absolute bottom-16 left-0 w-full h-[220px] text-grove-line/70"
      />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <FadeUp>
          <h2 className="font-marker uppercase text-cream leading-[0.95] text-[clamp(2rem,5vw,3.5rem)]">
            Real food, nothing added
          </h2>
        </FadeUp>
        <FadeUp delay={0.1}>
          <p className="text-cream/85 text-lede mt-6 max-w-xl mx-auto text-balance">
            Our mineral-rich jaggery tastes great and keeps the iron, magnesium and
            potassium that nature put in the cane — as part of a balanced, honest diet.
            We wanted to share the goodness of slow, unrefined sweetness, and let you in
            on the wonderful world of wood-fired jaggery.
          </p>
        </FadeUp>
        <FadeUp delay={0.2}>
          <Link
            href="/shop"
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-cream text-jaggery label-caps px-8 py-4 hover:bg-peach transition-colors"
          >
            Find out more
          </Link>
        </FadeUp>
      </div>

      {/* Wave down into the peach band */}
      <AnimatedWave
        aria-hidden
        className="absolute bottom-0 left-0 w-full h-[60px] sm:h-[80px] text-peach"
      />
    </section>
  );
}
