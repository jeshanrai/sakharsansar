"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import {
  HeroTitleWrapper,
  HeroSubtitleWrapper,
  HeroButtonWrapper,
} from "@/components/ui/Animations";

export default function HeroSection() {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <section
      aria-label="Hero"
      className="relative min-h-[88vh] sm:min-h-[92vh] flex flex-col bg-cream overflow-hidden"
    >
      {/* Full-bleed image */}
      <div className={`absolute inset-0 z-0 ${!isImageLoaded ? "bg-beige/40" : ""}`}>
        <Image
          src="/herobg.png"
          alt="Golden blocks of pure Himalayan jaggery from Sankhuwasabha, Nepal"
          fill
          priority
          sizes="100vw"
          className={`object-cover transition-opacity duration-1000 ${
            !isImageLoaded ? "opacity-0" : "opacity-100"
          }`}
          onLoad={() => setIsImageLoaded(true)}
        />
        {/* Warm vignette to ground type */}
        <div className="absolute inset-0 bg-gradient-to-r from-jaggery/65 via-jaggery/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-jaggery/45 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-end pt-32 sm:pt-40 pb-16 sm:pb-24 px-6 sm:px-10 lg:px-16">
        <div className="max-w-[1440px] mx-auto w-full">
          <div className="max-w-2xl">
            <HeroSubtitleWrapper className="mb-6 sm:mb-8">
              <p className="text-honey text-base sm:text-lg tracking-wide">
                <span className="font-devanagari">सखर संसार</span>
                <span className="font-serif italic"> — From Sankhuwasabha, with reverence</span>
              </p>
            </HeroSubtitleWrapper>

            <HeroTitleWrapper>
              <h1 className="font-serif font-soft text-cream text-display font-normal tracking-[-0.018em] text-balance">
                Sweetness from the
                <span className="italic font-light"> Roof </span>
                of the World
              </h1>
            </HeroTitleWrapper>

            <HeroSubtitleWrapper className="mt-7 sm:mt-9">
              <p className="text-cream/85 text-lede max-w-xl font-normal">
                Wood-fired jaggery, crafted by Himalayan farmers for seven generations.
                No chemicals, no middlemen — only mineral-rich gur, slow-poured by hand.
              </p>
            </HeroSubtitleWrapper>

            <HeroButtonWrapper className="mt-10 sm:mt-12 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
              <Link
                href="/shop"
                className="group inline-flex items-center justify-center label-caps px-9 py-4 bg-cream text-jaggery hover:bg-honey hover:text-jaggery transition-colors duration-500 rounded-full w-full sm:w-auto"
              >
                Discover the Harvest
                <ArrowDown className="w-3.5 h-3.5 ml-3 -rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={2} />
              </Link>
              <Link
                href="/our-story"
                className="label-caps text-cream/80 hover:text-cream underline underline-offset-[6px] decoration-cream/30 hover:decoration-cream/80 transition-all"
              >
                Read our story
              </Link>
            </HeroButtonWrapper>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="hidden sm:flex absolute right-10 lg:right-16 bottom-12 flex-col items-center gap-3 text-cream/60">
          <span className="label-caps text-[10px] [writing-mode:vertical-rl] rotate-180">
            Scroll
          </span>
          <span className="w-px h-12 bg-cream/40 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
