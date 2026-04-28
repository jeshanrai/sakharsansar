import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FadeUp, SlideInLeft } from "@/components/ui/Animations";
import { ArrowUpRight } from "lucide-react";

const rituals = [
  {
    eyebrow: "Morning",
    title: "Chiya, the way it should be",
    desc: "A spoon of jaggery powder dissolves into hot milk-tea and turns the whole cup amber.",
    image: "/products/jaggery-powder.jpg",
    nepali: "मिठो",
    href: "/blog",
  },
  {
    eyebrow: "Festive",
    title: "Sel roti, sweetened with the harvest",
    desc: "Liquid jaggery folded into rice-flour batter — a Tihar table classic from Sankhuwasabha kitchens.",
    image: "/products/liquid-jaggery.jpg",
    nepali: "उत्सव",
    href: "/blog",
  },
  {
    eyebrow: "Ayurvedic",
    title: "A square after every meal",
    desc: "Tradition holds it aids digestion and replaces refined sugar's late-day crash with quiet warmth.",
    image: "/products/jaggery-cubes.jpg",
    nepali: "आरोग्य",
    href: "/blog",
  },
];

export default function WaysToEnjoySection() {
  return (
    <section
      aria-label="Ways to savor"
      className="py-24 sm:py-36 px-6 sm:px-10 lg:px-16 bg-cream paper-grain"
    >
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16 sm:mb-24 items-end">
          <SlideInLeft className="md:col-span-7">
            <span className="label-caps text-caramel mb-5 block">Ways to Savor</span>
            <h2 className="font-serif text-h1 text-jaggery tracking-[-0.018em] text-balance">
              From <span className="italic font-light">chiya</span> to ritual.
            </h2>
          </SlideInLeft>
          <FadeUp delay={0.2} className="md:col-span-5">
            <p className="text-jaggery/70 text-lede max-w-md md:ml-auto">
              Jaggery isn&rsquo;t a substitute for sugar — it&rsquo;s its own ingredient,
              with its own grammar. Here&rsquo;s how Nepali kitchens use it.
            </p>
          </FadeUp>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12">
          {rituals.map((r, i) => (
            <FadeUp key={r.title} delay={i * 0.12}>
              <Link href={r.href} className="group flex flex-col h-full">
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-ivory mb-6">
                  <Image
                    src={r.image}
                    alt={r.title}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.04]"
                  />
                  <span className="absolute top-5 right-5 font-devanagari text-2xl text-cream drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]">
                    {r.nepali}
                  </span>
                </div>
                <span className="label-caps text-caramel mb-3 block">{r.eyebrow}</span>
                <h3 className="font-serif text-h3 text-jaggery mb-4 group-hover:text-caramel-deep transition-colors text-balance">
                  {r.title}
                </h3>
                <p className="text-jaggery/70 text-body mb-6">
                  {r.desc}
                </p>
                <span className="mt-auto inline-flex items-center gap-2 label-caps text-jaggery/80 group-hover:text-jaggery">
                  Read the recipe
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={1.5} />
                </span>
              </Link>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
