import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SlideInLeft, SlideInRight } from "@/components/ui/Animations";

/**
 * "Seven generations" frame — the anniversary/heritage band (the reference's
 * "Celebrating 30 Years"), peach with a cream card on the left and a rounded
 * image on the right, finished with a dark pill button.
 */
export default function StoryHeritageSection() {
  return (
    <section
      aria-label="Seven generations of craft"
      className="relative bg-peach px-6 sm:px-10 lg:px-16 py-16 sm:py-24 overflow-hidden"
    >
      <div className="max-w-[1180px] mx-auto grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-10">
        {/* Cream card */}
        <SlideInLeft className="lg:col-span-5 lg:z-10">
          <div className="rounded-[1.75rem] bg-ivory text-jaggery px-7 sm:px-11 py-10 sm:py-12 shadow-xl shadow-jaggery/10 ring-1 ring-jaggery/5">
            <h2 className="font-marker uppercase text-jaggery leading-[0.95] text-[clamp(1.9rem,3.8vw,2.9rem)]">
              Seven generations
            </h2>
            <p className="text-jaggery/75 text-body mt-5">
              Now we&rsquo;re seven generations deep, our cooperative has grown from a
              single kitchen fire into a family of forty-two households across six
              villages: farmers, fire-tenders, packers, neighbours. We&rsquo;re as
              determined today as ever to share honest, wood-fired sweetness and keep an
              ancient Himalayan craft alive — harvest after harvest, forever.
            </p>
            <Link
              href="/shop"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-jaggery text-cream label-caps px-7 py-3.5 hover:bg-grove transition-colors"
            >
              Find out more
            </Link>
          </div>
        </SlideInLeft>

        {/* Image */}
        <SlideInRight className="lg:col-span-7 lg:order-last">
          <div className="relative aspect-[5/4] w-full overflow-hidden rounded-[1.75rem] ring-1 ring-jaggery/10 shadow-xl shadow-jaggery/15">
            <Image
              src="/products/jaggery1.jpg"
              alt="Blocks of wood-fired jaggery, made the same way for seven generations"
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
          </div>
        </SlideInRight>
      </div>
    </section>
  );
}
