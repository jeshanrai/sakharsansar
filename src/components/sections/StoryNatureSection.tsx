import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SlideInLeft, SlideInRight } from "@/components/ui/Animations";

/**
 * "Pure is in our nature" frame — green band with a large product image and a
 * cream card that overlaps its right edge, capped with a dark pill button.
 */
export default function StoryNatureSection() {
  return (
    <section
      aria-label="Pure is in our nature"
      className="relative bg-grove text-cream px-6 sm:px-10 lg:px-16 py-16 sm:py-24 overflow-hidden"
    >
      <div className="max-w-[1180px] mx-auto grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-0">
        {/* Image */}
        <SlideInLeft className="lg:col-span-7">
          <div className="relative aspect-[5/4] w-full overflow-hidden rounded-[1.75rem] ring-1 ring-cream/10 shadow-2xl shadow-grove-deep/40">
            <Image
              src="/products/jaggery-block.jpg"
              alt="A hand-poured block of pure amber jaggery, set in a wooden mould"
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
          </div>
        </SlideInLeft>

        {/* Overlapping card */}
        <SlideInRight className="lg:col-span-5 lg:-ml-16 lg:z-10">
          <div className="rounded-[1.75rem] bg-ivory text-jaggery px-7 sm:px-11 py-10 sm:py-12 shadow-2xl shadow-grove-deep/40">
            <h2 className="font-marker uppercase text-jaggery leading-[0.95] text-[clamp(1.9rem,3.8vw,2.9rem)]">
              Pure is in our nature
            </h2>
            <p className="text-jaggery/75 text-body mt-5">
              Wood fire, an iron kadhai, a wooden spoon and a wooden mould — nothing else.
              No bleach, no sulphur, no anti-caking agents. Our jaggery is amber because
              the fire made it amber, and sweet because the cane was sweet. It is the very
              best of what these Himalayan terraces have to give.
            </p>
            <Link
              href="/shop"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-jaggery text-cream label-caps px-7 py-3.5 hover:bg-grove transition-colors"
            >
              Find out more
            </Link>
          </div>
        </SlideInRight>
      </div>
    </section>
  );
}
