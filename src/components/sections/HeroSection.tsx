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
    <section aria-label="Hero" className="relative h-screen min-h-[600px] overflow-hidden">
      {/* Full-bleed background image */}
      <div className="absolute top-0 right-0 bottom-[10%] left-[10%] z-0 rounded-3xl overflow-hidden">
        <Image
          src="/bghero.png"
          alt="Golden blocks of pure natural jaggery from Sankhuwasabha, Nepal"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-[1.2]"
        />
        {/* Subtle overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
      </div>

      {/* Left-aligned overlay card */}
      <div className="absolute inset-0 z-10 flex items-end pb-[2%] sm:items-end sm:pb-[3%]">
        <div className="w-full max-w-[1200px] ml-0 px-2 sm:px-3 lg:px-4">
          <HeroTitleWrapper>
            <div className="bg-black/40 backdrop-blur-xl border border-white/15 rounded-2xl px-7 py-5 sm:px-10 sm:py-7 lg:px-12 lg:py-8 max-w-[470px] shadow-[0_8px_32px_rgba(0,0,0,0.15)]">
              {/* Promo strip */}
              {showPromo && (
                <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/20">
                  <Truck className="w-4 h-4 text-white shrink-0" strokeWidth={1.5} />
                  <p className="text-xs text-white/80 font-medium leading-snug">
                    Free shipping on all orders! Ends 31st March
                  </p>
                  <button
                    onClick={() => setShowPromo(false)}
                    aria-label="Dismiss promo"
                    className="shrink-0 p-0.5 rounded-full hover:bg-black/5 transition ml-auto"
                  >
                    <X className="w-3.5 h-3.5 text-white/50" strokeWidth={2} />
                  </button>
                </div>
              )}

              <span className="block text-[10px] sm:text-[11px] font-semibold tracking-[0.25em] uppercase text-white/60 mb-3">
                SakharSansar
              </span>

              <h1 className="font-poppins text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-[1.1] uppercase">
                Pure Himalayan
                <br />
                Jaggery
              </h1>

              <HeroSubtitleWrapper className="mt-4">
                <p className="text-[13px] sm:text-sm text-white/70 max-w-xs leading-relaxed">
                  No chemicals. No middlemen. Just natural sweetness
                  direct from Sankhuwasabha.
                </p>
              </HeroSubtitleWrapper>

              <HeroButtonWrapper className="mt-6 sm:mt-8">
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
