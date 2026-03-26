import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from "lucide-react";
import { HeroTitleWrapper, HeroSubtitleWrapper, HeroButtonWrapper } from "@/components/Animations";

export default function HeroSection() {
  return (
    <section aria-label="Hero" className="relative min-h-screen flex items-center justify-center pt-20 px-6 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero.jpg"
          alt="Golden blocks of pure natural jaggery from Sankhuwasabha, Nepal"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-[1.02]"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 text-center max-w-5xl mx-auto flex flex-col items-center mt-12">
        <HeroTitleWrapper className="font-poppins text-4xl sm:text-6xl md:text-8xl font-medium tracking-[0.1em] uppercase text-white leading-[1.1] mb-8">
          Pure Himalayan<br/>Jaggery
        </HeroTitleWrapper>
        <HeroSubtitleWrapper className="text-sm md:text-base text-white/90 tracking-[0.2em] uppercase max-w-xl mb-12 leading-relaxed">
          No chemicals. No middlemen. Just natural sweetness direct from Sankhuwasabha.
        </HeroSubtitleWrapper>
        <HeroButtonWrapper>
          <Link href="/#products" className="group px-10 py-4 bg-white text-black hover:bg-black hover:text-white text-xs md:text-sm tracking-[0.2em] uppercase transition-all duration-500 inline-flex items-center gap-4">
            Shop Collection <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.5}/>
          </Link>
        </HeroButtonWrapper>
      </div>
    </section>
  );
}
