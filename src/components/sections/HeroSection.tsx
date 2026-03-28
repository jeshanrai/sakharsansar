import Image from 'next/image';
import Link from 'next/link';
import { HeroTitleWrapper, HeroSubtitleWrapper, HeroButtonWrapper } from "@/components/Animations";

export default function HeroSection() {
  return (
    <section aria-label="Hero" className="relative min-h-screen overflow-hidden bg-[#FBF4E8]">
      {/* Full-bleed background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-products.png"
          alt="Golden blocks of pure natural jaggery from Sankhuwasabha, Nepal"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Left-aligned content card */}
      <div className="relative z-10 min-h-screen flex items-end sm:items-end lg:items-center px-4 sm:px-10 lg:px-20 pb-10 sm:pb-16 lg:pb-0 pt-28">
        <HeroTitleWrapper>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-8 sm:px-10 sm:py-12 lg:px-14 lg:py-14 max-w-xl shadow-lg">
            <span className="block text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-[#2C1500]/60 mb-3 sm:mb-4">
              SakharSansar
            </span>
            <h1 className="font-poppins text-3xl sm:text-5xl lg:text-6xl font-bold text-[#2C1500] leading-[1.08] uppercase">
              Pure Himalayan<br />Jaggery
            </h1>

            <HeroSubtitleWrapper className="mt-4 sm:mt-6">
              <p className="text-sm sm:text-base text-[#2C1500]/70 max-w-md leading-relaxed">
                No chemicals. No middlemen. Just natural sweetness direct from Sankhuwasabha.
              </p>
            </HeroSubtitleWrapper>

            <HeroButtonWrapper className="mt-6 sm:mt-8">
              <Link
                href="/#products"
                className="inline-flex items-center justify-center w-full sm:w-auto px-10 py-4 bg-[#2C1500] text-white hover:bg-[#1a0d00] text-sm sm:text-base font-semibold tracking-wide transition-all duration-500 rounded-full"
              >
                Buy now
              </Link>
            </HeroButtonWrapper>
          </div>
        </HeroTitleWrapper>
      </div>
    </section>
  );
}
