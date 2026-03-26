"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { openOrderDrawer } from '../layout/OrderDrawer';
import data from "@/data/content.json";
import { SlideInLeft, ZoomIn } from "@/components/Animations";

export default function ProductsSection() {
  return (
    <section id="products" aria-label="Shop Collection" className="py-32 px-6 bg-white border-b border-black/10">
      <div className="max-w-[1440px] mx-auto">
        <SlideInLeft>
          <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-black pb-8">
            <h2 className="font-poppins text-4xl sm:text-5xl font-medium uppercase tracking-[0.1em] text-black">Shop Collection</h2>
            <p className="text-sm font-light tracking-widest text-black/60 uppercase max-w-md">100% Core Collection. Direct from the mold to your table.</p>
          </div>
        </SlideInLeft>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 justify-center">
          {data.products.map((product, i) => (
            <ZoomIn key={product.slug} delay={i * 0.1} className="h-full">
              <article className="group flex flex-col h-full">
                <Link href={`/products/${product.slug}`} className="block">
                  <div className="relative aspect-[3/4] w-full overflow-hidden mb-6 bg-[#F4F1ED]">
                    <Image
                      src={product.image}
                      alt={`${product.name} — ${product.weight} of pure natural jaggery`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-[1s]"
                    />
                  </div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-poppins text-base sm:text-lg font-medium uppercase tracking-[0.1em] text-black group-hover:text-black/60 transition-colors">{product.name}</h3>
                    <span className="text-[10px] font-semibold tracking-[0.2em] text-black/50 border border-black/10 px-2 py-1 shrink-0 ml-2">{product.weight}</span>
                  </div>
                  <p className="text-black/60 text-xs tracking-wide mb-8 font-light flex-grow leading-relaxed">{product.description}</p>
                </Link>
                <div className="flex items-center justify-between border-t border-black/10 pt-6 mt-auto">
                  <p className="font-poppins text-sm font-medium tracking-widest uppercase text-black">{product.price}</p>
                  <button onClick={() => openOrderDrawer(product.name)} className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white bg-black px-6 py-3 hover:bg-black/80 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </article>
            </ZoomIn>
          ))}
        </div>
      </div>
    </section>
  );
}
