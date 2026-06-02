import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FadeUp } from "@/components/ui/Animations";
import { HeartScribble } from "@/components/ui/StoryArt";
import { ChevronRight } from "lucide-react";

export default function StorySection() {
  return (
    <section
      id="story"
      aria-label="Our Story"
      className="relative bg-peach overflow-hidden pt-20 sm:pt-24 pb-[24vw] sm:pb-[19vw] lg:pb-[15vw]"
    >
      {/* Hand-drawn banner — sugarcane harvest and wood-fire craft frame the
          open centre where the headline sits. Anchored to the foot of the hero
          and faded into the peach so it reads as a background. */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 z-0">
        <Image
          src="/story-hero.png"
          alt=""
          width={4096}
          height={1024}
          priority
          fetchPriority="high"
          sizes="100vw"
          className="w-full h-auto"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-peach via-peach/30 to-transparent" />
      </div>

      <div className="relative z-10 px-6 sm:px-10 lg:px-16">
        {/* Breadcrumb */}
        <FadeUp>
          <nav aria-label="Breadcrumb" className="mb-6 flex justify-center">
            <ol className="flex items-center gap-2 label-caps text-jaggery/45">
              <li><Link href="/" className="hover:text-grove transition-colors">Home</Link></li>
              <ChevronRight className="w-3 h-3 text-jaggery/30" strokeWidth={2.5} aria-hidden />
              <li aria-current="page" className="text-grove">Our Story</li>
            </ol>
          </nav>
        </FadeUp>

        <div className="max-w-2xl mx-auto text-center">
          <FadeUp delay={0.05}>
            <div className="relative inline-block">
              <HeartScribble className="absolute -left-16 -top-6 w-20 h-14 text-peach-line rotate-[-8deg] hidden sm:block" />
              <h1 className="font-marker uppercase text-jaggery leading-[0.9] tracking-tight text-[clamp(2.75rem,8vw,6rem)]">
                A bit about us
              </h1>
            </div>
          </FadeUp>

          <FadeUp delay={0.15}>
            <p className="text-jaggery/75 text-lede mt-6 max-w-xl mx-auto text-balance">
              Come harvest or hard winter, we&rsquo;ve been making honest, wood-fired
              jaggery from the heart of the Sankhuwasabha hills for seven generations.
              After all, there is no greater sweetness than the kind nature makes herself.
            </p>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
