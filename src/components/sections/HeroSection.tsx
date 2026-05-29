"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Star,
  Tag,
  Sparkles,
} from "lucide-react";

type Slide = {
  id: string;
  eyebrow: string;
  eyebrowTone: "honey" | "terracotta" | "forest";
  headlineTop: string;
  headlineAccent: string;
  price: string;
  strike: string;
  badge: string;
  ctaLabel: string;
  ctaHref: string;
  product: string;
  imageBg: string;
};

const SLIDES: Slide[] = [
  {
    id: "harvest",
    eyebrow: "Winter Harvest",
    eyebrowTone: "honey",
    headlineTop: "Pure gur.",
    headlineAccent: "Slow-poured.",
    price: "Rs. 500",
    strike: "Rs. 650",
    badge: "Save 23%",
    ctaLabel: "Shop block",
    ctaHref: "/products/organic-jaggery-block",
    product: "/products/jaggery-block.jpg",
    imageBg: "from-honey/55 via-honey/15 to-transparent",
  },
  {
    id: "powder",
    eyebrow: "Daily Ritual",
    eyebrowTone: "terracotta",
    headlineTop: "Soft powder.",
    headlineAccent: "Ready to brew.",
    price: "Rs. 450",
    strike: "Rs. 560",
    badge: "20% Off",
    ctaLabel: "Shop powder",
    ctaHref: "/products/jaggery-powder",
    product: "/products/jaggery-powder.jpg",
    imageBg: "from-caramel/45 via-caramel/15 to-transparent",
  },
  {
    id: "gift",
    eyebrow: "New · Festive Trio",
    eyebrowTone: "forest",
    headlineTop: "Festive trio.",
    headlineAccent: "Hand-tied.",
    price: "Rs. 1,290",
    strike: "Rs. 1,600",
    badge: "Free Ship",
    ctaLabel: "Send gift",
    ctaHref: "/shop",
    product: "/products/jaggery-cubes.jpg",
    imageBg: "from-forest/35 via-honey/15 to-transparent",
  },
];

const AUTO_MS = 6500;

const TONE_MAP: Record<Slide["eyebrowTone"], { ring: string; dot: string; text: string }> = {
  honey: { ring: "border-honey/50 bg-honey/20 backdrop-blur-sm", dot: "bg-honey", text: "text-honey" },
  terracotta: { ring: "border-terracotta/50 bg-terracotta/20 backdrop-blur-sm", dot: "bg-terracotta", text: "text-cream" },
  forest: { ring: "border-cream/35 bg-cream/15 backdrop-blur-sm", dot: "bg-honey", text: "text-cream" },
};

export default function HeroSection() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback((next: number) => {
    setDirection(next > index ? 1 : -1);
    setIndex((next + SLIDES.length) % SLIDES.length);
  }, [index]);

  const goNext = useCallback(() => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  // Auto-advance
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(goNext, AUTO_MS);
    return () => clearInterval(timer);
  }, [paused, goNext]);

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    const el = containerRef.current;
    el?.addEventListener("keydown", handler);
    return () => el?.removeEventListener("keydown", handler);
  }, [goNext, goPrev]);

  const slide = SLIDES[index];
  const tone = TONE_MAP[slide.eyebrowTone];

  return (
    <section aria-label="Hero" className="relative bg-cream pt-29 pb-0">
      {/* ─── Carousel container ─── */}
      <div
        ref={containerRef}
        tabIndex={0}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
        className="relative overflow-hidden focus:outline-none"
      >
        {/* Sugarcane backdrop — no overlay */}
        <div aria-hidden className="absolute inset-0 z-0">
          <Image
            src="/hero-cane-bg.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>

        {/* Prev / Next arrows */}
        <button
          onClick={goPrev}
          aria-label="Previous slide"
          className="hidden lg:flex absolute left-4 xl:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-cream/95 backdrop-blur-sm border border-jaggery/10 text-jaggery items-center justify-center shadow-lg shadow-jaggery/10 hover:bg-jaggery hover:text-cream hover:-translate-y-[calc(50%+2px)] transition-all duration-300"
        >
          <ChevronLeft className="w-5 h-5" strokeWidth={1.75} />
        </button>
        <button
          onClick={goNext}
          aria-label="Next slide"
          className="hidden lg:flex absolute right-4 xl:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-cream/95 backdrop-blur-sm border border-jaggery/10 text-jaggery items-center justify-center shadow-lg shadow-jaggery/10 hover:bg-jaggery hover:text-cream hover:-translate-y-[calc(50%+2px)] transition-all duration-300"
        >
          <ChevronRight className="w-5 h-5" strokeWidth={1.75} />
        </button>

        <div className="relative max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-20 min-h-[760px] sm:min-h-[88svh] lg:min-h-[92svh] flex items-center py-12 sm:py-16 lg:py-20">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={slide.id}
              custom={direction}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 40 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center w-full"
            >
              {/* ── Left copy ── */}
              <div className="lg:col-span-6 xl:col-span-7 order-2 lg:order-1">
                {/* Eyebrow chip */}
                <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border ${tone.ring} ${tone.text}`}>
                  <span className="relative flex w-2 h-2">
                    <span className={`absolute inline-flex w-full h-full rounded-full ${tone.dot} animate-ping opacity-60`} />
                    <span className={`relative inline-flex w-2 h-2 rounded-full ${tone.dot}`} />
                  </span>
                  <span className="label-caps text-[10px]">{slide.eyebrow}</span>
                </div>

                {/* Headline — chunky display with sticker-cut accent */}
                <h1 className="mt-5 font-display font-bold text-cream tracking-tight text-balance leading-[0.95]">
                  <span className="block text-[clamp(2.75rem,7.5vw,6rem)] drop-shadow-[0_3px_0_rgba(26,20,16,0.18)]">
                    {slide.headlineTop}
                  </span>
                  <span className="block text-[clamp(3.25rem,9vw,7.5rem)] text-forest text-sticker leading-[1.05] mt-2 sm:mt-3">
                    {slide.headlineAccent}
                  </span>
                </h1>

                {/* Price row */}
                <div className="mt-7 flex items-end flex-wrap gap-4">
                  <div className="flex items-baseline gap-3">
                    <span className="font-serif text-cream text-[clamp(1.75rem,3vw,2.5rem)] tracking-tight nums-price leading-none">
                      {slide.price}
                    </span>
                    <span className="text-cream/45 text-lg line-through nums-price">{slide.strike}</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 bg-terracotta text-cream rounded-full px-3 py-1.5 label-caps text-[10px] shadow-lg shadow-ink/30">
                    <Tag className="w-3 h-3" strokeWidth={1.75} />
                    {slide.badge}
                  </span>
                </div>

                {/* CTA row */}
                <div className="mt-7 flex flex-col sm:flex-row sm:items-center gap-4">
                  <Link
                    href={slide.ctaHref}
                    className="group relative inline-flex items-center justify-center gap-3 px-7 py-4 rounded-full bg-jaggery text-cream font-medium overflow-hidden shadow-lg shadow-jaggery/25 hover:shadow-xl hover:shadow-jaggery/35 hover:-translate-y-0.5 transition-all duration-500"
                  >
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-honey/40 to-transparent" />
                    <ShoppingBag className="w-4 h-4 relative" strokeWidth={1.75} />
                    <span className="relative label-caps">{slide.ctaLabel}</span>
                    <ArrowUpRight className="w-4 h-4 relative group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={1.75} />
                  </Link>

                </div>

                {/* Trust row — minimal */}
                <div className="mt-7 flex items-center gap-2 text-[12px] text-cream/85">
                  <Star className="w-3.5 h-3.5 fill-honey stroke-honey" />
                  <span className="font-medium text-cream">4.9</span>
                  <span className="text-cream/40">·</span>
                  <span>1.2K+ reviews</span>
                </div>
              </div>

              {/* ── Right product visual ── */}
              <div className="lg:col-span-6 xl:col-span-5 relative order-1 lg:order-2">
                <div className="relative mx-auto max-w-[460px] aspect-square">
                  {/* Color-shifting blob backdrop */}
                  <div
                    aria-hidden
                    className={`absolute -inset-4 lg:-inset-6 rounded-[40%_60%_55%_45%/55%_45%_60%_40%] bg-gradient-to-br ${slide.imageBg} blur-2xl animate-pulse`}
                    style={{ animationDuration: "6s" }}
                  />
                  {/* Sparkle accent */}
                  <Sparkles aria-hidden className="absolute -top-2 left-2 w-6 h-6 text-honey/70 z-20" strokeWidth={1.5} />

                  {/* Image */}
                  <div className="relative w-full h-full rounded-[40%_60%_55%_45%/55%_45%_60%_40%] overflow-hidden bg-ivory shadow-2xl shadow-jaggery/20 ring-1 ring-jaggery/5">
                    <Image
                      src={slide.product}
                      alt=""
                      fill
                      priority={index === 0}
                      sizes="(max-width: 1024px) 80vw, 40vw"
                      className="object-cover scale-105"
                    />
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-tr from-jaggery/15 via-transparent to-transparent" />
                  </div>

                  {/* Floating badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 6 }}
                    transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute -top-3 -right-2 sm:-top-2 sm:-right-6 bg-jaggery text-cream rounded-2xl px-3.5 py-2.5 shadow-xl shadow-jaggery/30 max-w-[150px]"
                  >
                    <p className="label-caps text-honey text-[9px]">100% Pure</p>
                    <p className="font-serif text-cream text-[13px] tracking-tight mt-0.5">
                      Sankhuwasabha gur
                    </p>
                  </motion.div>

                  {/* Floating mini-stat */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute -bottom-3 -left-2 sm:-bottom-2 sm:-left-6 bg-cream border border-jaggery/10 rounded-2xl px-3.5 py-2.5 shadow-xl shadow-jaggery/15 flex items-center gap-2.5"
                  >
                    <div className="flex -space-x-1.5">
                      {["bg-honey", "bg-caramel", "bg-terracotta"].map((c, i) => (
                        <span key={i} className={`w-6 h-6 rounded-full ${c} border-2 border-cream`} />
                      ))}
                    </div>
                    <div className="leading-tight">
                      <p className="font-serif text-jaggery text-[13px] tracking-tight">12,000+ homes</p>
                      <p className="text-[10px] text-jaggery/55">love it daily</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ─── Dots + progress + arrows mobile ─── */}
        <div className="relative z-20 pb-6 sm:pb-8 flex items-center justify-center gap-5">
          <button
            onClick={goPrev}
            aria-label="Previous slide"
            className="lg:hidden w-10 h-10 rounded-full bg-cream border border-jaggery/10 text-jaggery flex items-center justify-center shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={1.75} />
          </button>

          <div className="flex items-center gap-2.5" role="tablist" aria-label="Hero slides">
            {SLIDES.map((s, i) => {
              const active = i === index;
              return (
                <button
                  key={s.id}
                  role="tab"
                  aria-selected={active}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => goTo(i)}
                  className={`relative h-2 rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    active ? "w-12 bg-cream/25" : "w-2 bg-cream/35 hover:bg-cream/55"
                  }`}
                >
                  {active && !paused && (
                    <motion.span
                      key={`progress-${index}`}
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: AUTO_MS / 1000, ease: "linear" }}
                      className="absolute inset-y-0 left-0 rounded-full bg-honey"
                    />
                  )}
                  {active && paused && (
                    <span className="absolute inset-0 rounded-full bg-honey" />
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={goNext}
            aria-label="Next slide"
            className="lg:hidden w-10 h-10 rounded-full bg-cream border border-jaggery/10 text-jaggery flex items-center justify-center shadow-sm"
          >
            <ChevronRight className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>

    </section>
  );
}
