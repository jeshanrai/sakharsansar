import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SlideInLeft, SlideInRight } from "@/components/ui/Animations";
import { TreeTuft } from "@/components/ui/StoryArt";

/**
 * "Meet the makers" frame — peach band with a rounded image on the left and a
 * cream card on the right, the reverse stagger of the roots frame above.
 */
export default function FarmersSection() {
  return (
    <section
      id="makers"
      aria-label="Meet the makers"
      className="relative scroll-mt-28 bg-peach px-6 sm:px-10 lg:px-16 py-16 sm:py-24 overflow-hidden"
    >
      <TreeTuft
        aria-hidden
        className="pointer-events-none absolute bottom-10 left-[5%] w-16 h-16 text-peach-line/45 hidden lg:block"
      />

      <div className="max-w-[1180px] mx-auto grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-10">
        {/* Image */}
        <SlideInLeft className="lg:col-span-7">
          <div className="relative aspect-[5/4] w-full overflow-hidden rounded-[1.75rem] ring-1 ring-jaggery/10 shadow-xl shadow-jaggery/15">
            <Image
              src="/farmers/farmer1.jpg"
              alt="A SakharSansar farmer tending the wood fire while making traditional jaggery"
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
          </div>
        </SlideInLeft>

        {/* Cream card */}
        <SlideInRight className="lg:col-span-5 lg:-mt-12 lg:z-10">
          <div className="rounded-[1.75rem] bg-ivory text-jaggery px-7 sm:px-11 py-10 sm:py-12 shadow-xl shadow-jaggery/10 ring-1 ring-jaggery/5">
            <h2 className="font-marker uppercase text-jaggery leading-[0.95] text-[clamp(1.9rem,3.8vw,2.9rem)]">
              Meet the makers
            </h2>
            <p className="text-jaggery/75 text-body mt-5">
              When we&rsquo;re not tending the fire, we&rsquo;re looking after each other.
              Our cooperative is forty-two farming families across six villages — paid
              above market for chemical-free cane, with no middleman between their fire and
              your kitchen. They are not labourers; they are the recipe.
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
