"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Post = {
  slug: string;
  title: string;
  description: string;
  image: string;
};

/**
 * "Editor's Picks" — a green band with a horizontally scrolling card rail and
 * round arrow controls, mirroring the reference blog carousel.
 */
export default function BlogEditorsPicks({ posts }: { posts: Post[] }) {
  const railRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector<HTMLElement>("[data-card]");
    const amount = card ? card.offsetWidth + 28 : rail.clientWidth * 0.8;
    rail.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  if (posts.length === 0) return null;

  return (
    <section
      aria-label="Editor's picks"
      className="relative bg-grove text-cream px-6 sm:px-10 lg:px-16 py-16 sm:py-24 overflow-hidden"
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Header + controls */}
        <div className="flex items-end justify-between gap-4 mb-10 sm:mb-14">
          <h2 className="font-marker uppercase text-cream leading-[0.95] text-[clamp(1.6rem,5vw,3.5rem)]">
            Editor&rsquo;s picks
          </h2>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="Previous picks"
              className="h-10 w-10 sm:h-12 sm:w-12 inline-flex items-center justify-center rounded-full border border-cream/40 text-cream hover:bg-cream hover:text-grove transition-colors"
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={1.8} />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="Next picks"
              className="h-10 w-10 sm:h-12 sm:w-12 inline-flex items-center justify-center rounded-full border border-cream/40 text-cream hover:bg-cream hover:text-grove transition-colors"
            >
              <ArrowRight className="w-5 h-5" strokeWidth={1.8} />
            </button>
          </div>
        </div>

        {/* Rail */}
        <div
          ref={railRef}
          className="flex gap-5 sm:gap-7 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-6 px-6 sm:mx-0 sm:px-0"
        >
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              data-card
              className="group snap-start shrink-0 w-[78%] sm:w-[44%] lg:w-[31%]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.25rem] ring-1 ring-cream/10 shadow-xl shadow-grove-deep/40">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 78vw, (max-width: 1024px) 44vw, 31vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <h3 className="font-marker uppercase text-cream text-2xl leading-[1.05] mt-5 group-hover:text-honey transition-colors text-balance">
                {post.title}
              </h3>
              <p className="text-cream/75 text-body mt-3 line-clamp-2">{post.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
