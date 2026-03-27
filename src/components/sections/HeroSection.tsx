import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from "lucide-react";
import { HeroTitleWrapper, HeroSubtitleWrapper, HeroButtonWrapper } from "@/components/Animations";

export default function HeroSection() {
  return (
    <section aria-label="Hero" className="relative min-h-screen overflow-hidden bg-[#FBF4E8]">
      {/* Full-bleed background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero.jpg"
          alt="Golden blocks of pure natural jaggery from Sankhuwasabha, Nepal"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#2C1500]/70 via-[#2C1500]/40 to-transparent" />
      </div>

      {/* Left-aligned content */}
      <div className="relative z-10 min-h-screen flex items-end sm:items-center px-6 sm:px-10 lg:px-20 pb-24 sm:pb-0 pt-32">
        <div className="max-w-2xl">
          <HeroTitleWrapper className="mb-6">
            <span className="block text-sm sm:text-base font-semibold tracking-[0.2em] uppercase text-white/70 mb-5">
              SakharSansar
            </span>
            <span className="block font-poppins text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.08]">
              Pure Himalayan<br />Jaggery
            </span>
          </HeroTitleWrapper>

          <HeroSubtitleWrapper className="text-lg sm:text-xl text-white/80 max-w-lg mt-6 mb-10 leading-relaxed">
            No chemicals. No middlemen. Just natural sweetness direct from Sankhuwasabha.
          </HeroSubtitleWrapper>

          <HeroButtonWrapper>
            <Link
              href="/#products"
              className="group inline-flex items-center gap-3 px-9 py-4 bg-[#C17A2A] text-white hover:bg-[#A8671F] text-base font-semibold tracking-wide transition-all duration-500 rounded-full"
            >
              Shop Collection
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
            </Link>
          </HeroButtonWrapper>
        </div>
      </div>
    </section>
  );
}
