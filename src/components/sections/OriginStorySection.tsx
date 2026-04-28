import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FadeUp, SlideInLeft, SlideInRight } from "@/components/ui/Animations";
import { ArrowUpRight } from "lucide-react";

export default function OriginStorySection() {
  return (
    <section
      aria-label="Origin story"
      className="py-24 sm:py-36 px-6 sm:px-10 lg:px-16 bg-cream paper-grain"
    >
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        {/* Image — asymmetric, breaks the grid */}
        <SlideInLeft className="lg:col-span-7 lg:-ml-6">
          <div className="relative aspect-[4/5] sm:aspect-[5/6] lg:aspect-[6/7] w-full overflow-hidden bg-beige/40">
            <Image
              src="/hero.jpg"
              alt="Sankhuwasabha landscape — terraced fields below the Himalayas"
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
            {/* Tiny location label, Yolélé style */}
            <div className="absolute bottom-5 left-5 sm:bottom-8 sm:left-8 bg-cream/95 backdrop-blur-sm px-4 py-3 max-w-[220px]">
              <span className="label-caps text-jaggery/60 block mb-1">Location</span>
              <span className="font-serif text-meta text-jaggery">
                Sankhuwasabha · Koshi · Nepal
              </span>
            </div>
          </div>
        </SlideInLeft>

        {/* Story text */}
        <SlideInRight delay={0.15} className="lg:col-span-5">
          <div className="flex flex-col">
            <FadeUp>
              <span className="label-caps text-caramel mb-5 block">Our Origin</span>
            </FadeUp>
            <h2 className="font-serif text-h1 text-jaggery tracking-[-0.018em] mb-8 text-balance">
              A Place Called <span className="italic font-light">Sankhuwasabha</span>
            </h2>
            <p className="text-jaggery/75 text-lede mb-7 max-w-xl has-dropcap">
              Cradled between the Arun valley and the foothills of Makalu, our village
              has been pouring jaggery from sugarcane juice since long before the road
              reached it. The recipe is unwritten — passed from grandmother to
              grandson across seven generations.
            </p>

            {/* Pull quote */}
            <blockquote className="border-l-2 border-caramel pl-6 my-4 max-w-md">
              <p className="pull-quote text-jaggery">
                &ldquo;The cane remembers the soil. The jaggery remembers the fire.&rdquo;
              </p>
              <footer className="label-caps text-jaggery/55 mt-4">
                — Ram Bahadur, third-generation maker
              </footer>
            </blockquote>

            <p className="text-jaggery/75 text-body mt-7 max-w-xl">
              No bleach. No sulphur. No factory. Just sugarcane, wood-fire, and the
              patient hands of farmers who still believe sweetness is something you
              earn from the earth.
            </p>

            <Link
              href="/our-story"
              className="group inline-flex items-center gap-3 label-caps text-jaggery mt-10 self-start border-b border-jaggery/30 pb-1.5 hover:border-jaggery transition-colors"
            >
              Read the full story
              <ArrowUpRight
                className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                strokeWidth={1.5}
              />
            </Link>
          </div>
        </SlideInRight>
      </div>
    </section>
  );
}
