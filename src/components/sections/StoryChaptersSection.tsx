import React from 'react';
import Image from 'next/image';
import { FadeUp, SlideInLeft, SlideInRight } from "@/components/ui/Animations";

const chapters = [
  {
    eyebrow: "Chapter I",
    title: "The Land",
    body:
      "Sankhuwasabha sits where the Arun river bends west, a stitch of green between the great Makalu peaks and the warm subtropical valleys. The cane that grows here is small, dense and slow — the way the land insists. It takes thirteen months to ripen and another thirty hours to become jaggery.",
    quote: "The cane remembers the soil. The jaggery remembers the fire.",
    image: "/hero.jpg",
    align: "left",
  },
  {
    eyebrow: "Chapter II",
    title: "The Farmers",
    body:
      "Our cooperative is forty-two families across six villages. Some have farmed cane for so long the moulds in their kitchens are older than the road that connects them to town. They are not labourers; they are the recipe.",
    quote: "If you cut the cane angry, the jaggery turns bitter. So we wake before the day, and we are gentle.",
    image: "/farmers/farmer1.jpg",
    align: "right",
  },
  {
    eyebrow: "Chapter III",
    title: "The Craft",
    body:
      "Wood-fire, iron kadhai, wooden spoon, wooden mould. Nothing else. No bleach, no sulphur, no anti-caking agents — none of the shortcuts that let factories sell cheap, pale jaggery year-round. Ours is amber because the fire made it amber. Ours is sweet because the cane was sweet.",
    quote: "Anything you add to it is something you have to take out of yourself.",
    image: "/products/jaggery-block.jpg",
    align: "left",
  },
  {
    eyebrow: "Chapter IV",
    title: "The Promise",
    body:
      "We pay our farmers above market for chemical-free cane. We pack only what we can ship within forty-eight hours. We use compostable kraft paper from a women's cooperative in the next valley. None of this scales easily — and that is exactly the point.",
    quote: "Sweetness should not cost the land. It should cost only patience.",
    image: "/products/liquid-jaggery.jpg",
    align: "right",
  },
];

export default function StoryChaptersSection() {
  return (
    <>
      {chapters.map((c, i) => {
        const isOdd = c.align === "left";
        const Wrapper = isOdd ? SlideInLeft : SlideInRight;
        return (
          <section
            key={c.title}
            aria-label={c.title}
            className={`px-6 sm:px-10 lg:px-16 py-24 sm:py-36 ${
              i % 2 === 0 ? 'bg-cream paper-grain' : 'bg-ivory'
            }`}
          >
            <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
              <Wrapper className={`lg:col-span-7 ${!isOdd ? 'lg:order-2' : ''}`}>
                <div className="relative aspect-[5/6] w-full overflow-hidden bg-beige/40">
                  <Image
                    src={c.image}
                    alt={c.title}
                    fill
                    loading="lazy"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover"
                  />
                </div>
              </Wrapper>

              <FadeUp delay={0.1} className={`lg:col-span-5 ${!isOdd ? 'lg:order-1' : ''}`}>
                <span className="label-caps text-caramel mb-5 block nums-oldstyle">{c.eyebrow}</span>
                <h2 className="font-serif text-h1 text-jaggery tracking-[-0.018em] mb-8 text-balance">
                  {c.title}
                </h2>
                <p className="text-jaggery/75 text-lede mb-8 max-w-xl has-dropcap">
                  {c.body}
                </p>
                <blockquote className="border-l-2 border-caramel pl-6 max-w-md">
                  <p className="pull-quote text-jaggery">
                    &ldquo;{c.quote}&rdquo;
                  </p>
                </blockquote>
              </FadeUp>
            </div>
          </section>
        );
      })}
    </>
  );
}
