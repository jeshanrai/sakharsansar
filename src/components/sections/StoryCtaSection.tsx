import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FadeUp } from "@/components/ui/Animations";

type RangeCard = {
  label: string;
  image: string;
  alt: string;
  href: string;
};

const cards: RangeCard[] = [
  {
    label: "Block",
    image: "/products/jaggery-block.jpg",
    alt: "Pure amber jaggery blocks, set in wooden moulds",
    href: "/shop",
  },
  {
    label: "Powder",
    image: "/products/jaggery-powder.jpg",
    alt: "Soft golden jaggery powder, stone-ground from wood-fired blocks",
    href: "/shop",
  },
  {
    label: "Liquid",
    image: "/products/liquid-jaggery.jpg",
    alt: "Golden liquid jaggery, slow-poured and chemical-free",
    href: "/shop",
  },
];

/**
 * Final range grid — the reference's "Start collecting" frame: a green band
 * with a faint oversized watermark behind three labelled product cards.
 */
export default function StoryCtaSection() {
  return (
    <section
      aria-label="Taste the whole range"
      className="relative bg-grove text-cream px-6 sm:px-10 lg:px-16 py-20 sm:py-28 overflow-hidden"
    >
      {/* Oversized faint watermark */}
      <span
        aria-hidden
        className="pointer-events-none select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-marker uppercase whitespace-nowrap text-grove-line/40 text-[22vw] leading-none tracking-tight"
      >
        Sakhar
      </span>

      <div className="relative z-10 max-w-[1180px] mx-auto">
        <FadeUp>
          <h2 className="font-marker uppercase text-cream text-center leading-[0.95] text-[clamp(2.25rem,5.5vw,4rem)] max-w-3xl mx-auto">
            Taste the whole range today
          </h2>
        </FadeUp>

        <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-7">
          {cards.map((c, i) => (
            <FadeUp key={c.label} delay={i * 0.1}>
              <Link
                href={c.href}
                aria-label={`Shop jaggery ${c.label}`}
                className="group relative block aspect-square w-full overflow-hidden rounded-[1.25rem] ring-1 ring-cream/10 shadow-2xl shadow-grove-deep/40"
              >
                <Image
                  src={c.image}
                  alt={c.alt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-grove-deep/80 via-grove-deep/10 to-transparent" />
                <span className="absolute inset-x-0 bottom-5 text-center font-marker uppercase text-cream text-3xl sm:text-4xl drop-shadow-sm">
                  {c.label}
                </span>
              </Link>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={0.2}>
          <div className="mt-12 flex justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-cream text-jaggery label-caps px-9 py-4 hover:bg-peach transition-colors"
            >
              Shop the harvest
            </Link>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
