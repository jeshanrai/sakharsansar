"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Truck, X } from "lucide-react";
import {
  HeroTitleWrapper,
  HeroSubtitleWrapper,
  HeroButtonWrapper,
} from "@/components/Animations";

export default function HeroSection() {
  const [showPromo, setShowPromo] = useState(true);

  return (
    <section aria-label="Hero" className="relative flex flex-col sm:block sm:h-screen sm:min-h-[600px] overflow-hidden bg-white sm:bg-transparent pt-[70px] sm:pt-0">
      {/* Mobile background image (natural flow) */}
      <div className="block sm:hidden w-full relative z-0">
        <Image
          src="/herobg.png"
          alt="Golden blocks of pure natural jaggery from Sankhuwasabha, Nepal"
          width={1200}
          height={800}
          priority
          sizes="100vw"
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Desktop background image (full bleed area) */}
      <div className="hidden sm:block absolute sm:top-0 sm:right-0 sm:bottom-[10%] sm:left-[25%] z-0 sm:rounded-3xl overflow-hidden">
        <Image
          src="/herobg.png"
          alt="Golden blocks of pure natural jaggery from Sankhuwasabha, Nepal"
          fill
          priority
          sizes="100vw"
          className="sm:object-fill"
        />
        {/* Subtle overlay for text readability */}
        <div className="hidden sm:block absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
      </div>

      {/* Promo strip - top right */}
      {showPromo && (
        <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-auto sm:right-4 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-xl border border-white/15 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 shadow-[0_4px_16px_rgba(0,0,0,0.15)]">
          <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white shrink-0" strokeWidth={1.5} />
          <p className="text-[10px] sm:text-xs text-white/80 font-medium leading-snug">
            Free shipping on all orders! Ends 31st March
          </p>
          <button
            onClick={() => setShowPromo(false)}
            aria-label="Dismiss promo"
            className="shrink-0 p-0.5 rounded-full hover:bg-white/10 transition ml-2"
          >
            <X className="w-3.5 h-3.5 text-white/50" strokeWidth={2} />
          </button>
        </div>
      )}

      {/* Overlay card / Content below on mobile */}
      <div className="relative sm:absolute sm:inset-0 z-10 flex flex-col justify-start sm:justify-end px-5 py-8 sm:p-0 sm:pb-[3%]">
        <div className="w-full max-w-[1200px] mx-auto sm:ml-0 sm:px-3 lg:px-4">
          <HeroTitleWrapper>
            <div className="bg-white sm:bg-black/40 sm:backdrop-blur-xl border-none sm:border-solid sm:border border-white/15 rounded-none sm:rounded-2xl px-2 py-4 sm:px-10 sm:py-7 lg:px-12 lg:py-8 w-full sm:max-w-[470px] shadow-none sm:shadow-[0_8px_32px_rgba(0,0,0,0.15)] flex flex-col items-center sm:items-start text-center sm:text-left">
              <span className="block text-[11px] sm:text-[11px] font-semibold tracking-[0.25em] uppercase text-[#C17A2A] sm:text-white/60 mb-3 sm:mb-3">
                SakharSansar
              </span>

              <h1 className="font-poppins text-3xl sm:text-3xl lg:text-4xl font-bold text-[#4A2511] sm:text-white leading-[1.15] uppercase">
                Pure Himalayan
                <br />
                Jaggery
              </h1>

              <HeroSubtitleWrapper className="mt-3 sm:mt-4">
                <p className="text-[14px] sm:text-sm text-gray-700 sm:text-white/80 max-w-sm leading-relaxed">
                  No chemicals. No middlemen. Just natural sweetness
                  direct from Sankhuwasabha.
                </p>
              </HeroSubtitleWrapper>

              <HeroButtonWrapper className="mt-8 sm:mt-8 w-full sm:w-auto">
                <Link
                  href="/#products"
                  className="inline-flex items-center justify-center w-full sm:w-auto px-10 py-3.5 bg-[#C17A2A] text-white hover:bg-[#A8671F] text-sm font-semibold tracking-wide transition-all duration-300 rounded-full"
                >
                  Shop now
                </Link>
              </HeroButtonWrapper>
            </div>
          </HeroTitleWrapper>
        </div>
      </div>
    </section>
  );
}
