import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FadeUp, SlideInLeft, SlideInRight } from "@/components/ui/Animations";
import { ArrowRight } from "lucide-react";

type Chapter = {
  eyebrow: string;
  title: string;
  body: string;
  quote: string;
  image: string;
  imageAlt: string;
  align: "left" | "right";
  cta: { label: string; href: string };
};

const chapters: Chapter[] = [
  {
    eyebrow: "The Land",
    title: "Grown where the Arun bends",
    body:
      "Sankhuwasabha sits where the Arun river bends west, a stitch of green between the great Makalu peaks and the warm subtropical valleys. The cane that grows here is small, dense and slow — the way the land insists. It takes thirteen months to ripen and another thirty hours to become jaggery.",
    quote: "The cane remembers the soil. The jaggery remembers the fire.",
    image: "/hero.jpg",
    imageAlt: "Terraced sugarcane fields in the Sankhuwasabha valley below the Makalu peaks",
    align: "right",
    cta: { label: "Read the journal", href: "/blog" },
  },
  {
    eyebrow: "The Farmers",
    title: "Forty-two families, one recipe",
    body:
      "Our cooperative is forty-two families across six villages. Some have farmed cane for so long the moulds in their kitchens are older than the road that connects them to town. They are not labourers; they are the recipe.",
    quote: "If you cut the cane angry, the jaggery turns bitter. So we wake before the day, and we are gentle.",
    image: "/farmers/farmer1.jpg",
    imageAlt: "A SakharSansar farmer tending the wood fire while making traditional jaggery",
    align: "left",
    cta: { label: "Meet the makers", href: "#makers" },
  },
  {
    eyebrow: "The Craft",
    title: "Wood-fire, and nothing else",
    body:
      "Wood-fire, iron kadhai, wooden spoon, wooden mould. Nothing else. No bleach, no sulphur, no anti-caking agents — none of the shortcuts that let factories sell cheap, pale jaggery year-round. Ours is amber because the fire made it amber, and sweet because the cane was sweet.",
    quote: "Anything you add to it is something you have to take out of yourself.",
    image: "/products/jaggery-block.jpg",
    imageAlt: "A hand-poured block of pure amber jaggery, set in a wooden mould",
    align: "right",
    cta: { label: "Shop the harvest", href: "/shop" },
  },
  {
    eyebrow: "The Promise",
    title: "Sweet on the land",
    body:
      "We pay our farmers above market for chemical-free cane. We pack only what we can ship within forty-eight hours. We use compostable kraft paper from a women's cooperative in the next valley. None of this scales easily — and that is exactly the point.",
    quote: "Sweetness should not cost the land. It should cost only patience.",
    image: "/products/liquid-jaggery.jpg",
    imageAlt: "Golden liquid jaggery being poured, packed in compostable kraft paper",
    align: "left",
    cta: { label: "Browse the range", href: "/shop" },
  },
];

export default function StoryChaptersSection() {
  return (
    <div aria-label="The story, in four chapters">
      {chapters.map((c, i) => {
        const imageLeft = c.align === "left";
        const Wrapper = imageLeft ? SlideInLeft : SlideInRight;
        return (
          <section
            key={c.title}
            aria-label={c.title}
            className={`px-6 sm:px-10 lg:px-16 py-16 sm:py-24 ${
              i % 2 === 0 ? 'bg-ivory' : 'bg-cream paper-grain'
            }`}
          >
            <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              {/* Photo — rectangle, slight rounding */}
              <Wrapper className={imageLeft ? '' : 'lg:order-2'}>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-beige/40 ring-1 ring-jaggery/5 shadow-sm">
                  <Image
                    src={c.image}
                    alt={c.imageAlt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </Wrapper>

              {/* Copy */}
              <FadeUp delay={0.1} className={imageLeft ? '' : 'lg:order-1'}>
                <span className="label-caps text-forest mb-4 block">{c.eyebrow}</span>
                <h2 className="font-display font-bold text-jaggery leading-[1.05] tracking-tight text-[clamp(1.8rem,3.4vw,2.85rem)]">
                  {c.title}
                </h2>
                <p className="text-jaggery/75 text-lede mt-6 max-w-xl">
                  {c.body}
                </p>
                <p className="font-serif italic text-jaggery/60 text-body mt-4 max-w-xl">
                  &ldquo;{c.quote}&rdquo;
                </p>
                <Link
                  href={c.cta.href}
                  className="group mt-7 inline-flex items-center gap-2 text-forest font-medium hover:text-jaggery transition-colors"
                >
                  <span className="border-b border-forest/30 group-hover:border-jaggery pb-0.5">{c.cta.label}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
                </Link>
              </FadeUp>
            </div>
          </section>
        );
      })}
    </div>
  );
}
