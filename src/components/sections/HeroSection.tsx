import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from "lucide-react";
import { HeroTitleWrapper, HeroSubtitleWrapper, HeroButtonWrapper } from "@/components/Animations";

export default function HeroSection() {
  return (
    <section aria-label="Hero" className="relative min-h-screen overflow-hidden">
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
      </div>

      {/* Left-aligned content overlay */}
      <div className="relative z-10 min-h-screen flex items-end sm:items-center px-6 sm:px-12 lg:px-20 pb-20 sm:pb-0 pt-32">
        <div className="bg-white/85 backdrop-blur-md p-8 sm:p-12 lg:p-16 max-w-xl w-full">
          <HeroTitleWrapper className="mb-2">
            <span className="block text-[10px] sm:text-xs font-semibold tracking-[0.3em] uppercase text-[#2C1500]/60 mb-4">
              SakharSansar
            </span>
            <span className="block font-poppins text-3xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-[0.04em] text-[#2C1500] leading-[1.05]">
              Pure Himalayan Jaggery
            </span>
          </HeroTitleWrapper>

          <HeroSubtitleWrapper className="text-sm sm:text-base text-[#2C1500]/70 tracking-wide max-w-md mt-5 mb-10 leading-relaxed font-light">
            No chemicals. No middlemen. Just natural sweetness direct from Sankhuwasabha.
          </HeroSubtitleWrapper>

          <HeroButtonWrapper>
            <Link
              href="/#products"
              className="group inline-flex items-center gap-3 px-10 py-4 bg-[#2C1500] text-white hover:bg-[#1a0d00] text-xs sm:text-sm tracking-[0.2em] uppercase transition-all duration-500 rounded-full"
            >
              Shop Collection
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
            </Link>
          </HeroButtonWrapper>
        </div>
      </div>
    </section>
  );
}
