import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SlideInLeft, SlideInRight } from "@/components/ui/Animations";
import { Sugarcane } from "@/components/ui/StoryArt";

/**
 * "Chemical-free at our roots" frame — peach band with a cream card and a
 * rounded image, staggered against each other with a dark pill button.
 */
export default function StoryRootsSection() {
  return (
    <section
      aria-label="Chemical-free at our roots"
      className="relative bg-peach px-6 sm:px-10 lg:px-16 py-16 sm:py-24 overflow-hidden"
    >
      <Sugarcane
        aria-hidden
        className="pointer-events-none absolute top-10 right-[4%] w-16 h-40 text-peach-line/45 hidden lg:block"
      />

      <div className="max-w-[1180px] mx-auto grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-10">
        {/* Cream card */}
        <SlideInLeft className="lg:col-span-5 lg:mt-12 lg:z-10">
          <div className="rounded-[1.75rem] bg-ivory text-jaggery px-7 sm:px-11 py-10 sm:py-12 shadow-xl shadow-jaggery/10 ring-1 ring-jaggery/5">
            <h2 className="font-marker uppercase text-jaggery leading-[0.95] text-[clamp(1.9rem,3.8vw,2.9rem)]">
              Chemical-free at our roots
            </h2>
            <p className="text-jaggery/75 text-body mt-5">
              The cane is a celebrity around here, but the real VIP is the soil beneath it.
              Grown without chemicals on living Himalayan terraces, our cane carries the
              full mineral richness of the land — and our whole craft is about adding
              nothing and taking nothing away. Honest, ground-up stuff.
            </p>
            <Link
              href="/shop"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-jaggery text-cream label-caps px-7 py-3.5 hover:bg-grove transition-colors"
            >
              Our promise
            </Link>
          </div>
        </SlideInLeft>

        {/* Image */}
        <SlideInRight className="lg:col-span-7 lg:order-last">
          <div className="relative aspect-[5/4] w-full overflow-hidden rounded-[1.75rem] ring-1 ring-jaggery/10 shadow-xl shadow-jaggery/15">
            <Image
              src="/products/jaggery-powder.jpg"
              alt="Mineral-rich amber jaggery, ground from chemical-free Himalayan cane"
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
          </div>
        </SlideInRight>
      </div>
    </section>
  );
}
