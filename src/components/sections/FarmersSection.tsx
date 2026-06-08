import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SlideInLeft, SlideInRight } from "@/components/ui/Animations";
import { TreeTuft } from "@/components/ui/StoryArt";

/**
 * "Meet the maker" frame — peach band with the founder's portrait on the left
 * and a cream card on the right. SakharSansar is run end to end by one person,
 * Rashmita Bhandari, so this section features her rather than a team gallery.
 */
export default function FarmersSection() {
  return (
    <section
      id="makers"
      aria-label="Meet the maker"
      className="relative scroll-mt-28 bg-peach px-6 sm:px-10 lg:px-16 py-16 sm:py-24 overflow-hidden"
    >
      <TreeTuft
        aria-hidden
        className="pointer-events-none absolute bottom-10 left-[5%] w-16 h-16 text-peach-line/45 hidden lg:block"
      />

      <div className="max-w-[1180px] mx-auto grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-10">
        {/* Founder portrait */}
        <SlideInLeft className="lg:col-span-7">
          <figure>
            <div className="relative aspect-[5/4] w-full overflow-hidden rounded-[1.75rem] ring-1 ring-jaggery/10 shadow-xl shadow-jaggery/15">
              <Image
                src="/team/rashmita.jpg"
                alt="Rashmita Bhandari, founder of SakharSansar, on her farm in Sankhuwasabha"
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-4">
              <p className="font-display font-bold text-jaggery text-h4">Rashmita Bhandari</p>
              <p className="label-caps text-caramel mt-1">Founder · Farmer · Owner</p>
            </figcaption>
          </figure>
        </SlideInLeft>

        {/* Cream card */}
        <SlideInRight className="lg:col-span-5 lg:-mt-12 lg:z-10">
          <div className="rounded-[1.75rem] bg-ivory text-jaggery px-7 sm:px-11 py-10 sm:py-12 shadow-xl shadow-jaggery/10 ring-1 ring-jaggery/5">
            <h2 className="font-marker uppercase text-jaggery leading-[0.95] text-[clamp(1.9rem,3.8vw,2.9rem)]">
              Meet the maker
            </h2>
            <p className="text-jaggery/75 text-body mt-5">
              SakharSansar is Rashmita Bhandari&rsquo;s work, start to finish. She grows the
              cane on her terraces in Sankhuwasabha, tends the wood fire, pours the moulds
              and packs every block by hand — chemical-free, with no middleman between her
              fire and your kitchen. One pair of hands, one honest recipe.
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
