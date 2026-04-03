"use client";
import { memo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { openOrderDrawer } from '../layout/OrderDrawer';
import data from "@/data/content.json";
import { SlideInLeft, ZoomIn } from "@/components/Animations";
import { ShoppingBag } from "lucide-react";

type Product = (typeof data.products)[number];

const ProductCard = memo(function ProductCard({ product }: { product: Product }) {
  const handleOrder = useCallback(() => openOrderDrawer(product.name), [product.name]);

  return (
    <article className="group flex flex-col h-full bg-[#FBF4E8] rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-500">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square w-full overflow-hidden bg-[#F5E9DA]">
          <Image
            src={product.image}
            alt={`${product.name} — ${product.weight} of pure natural jaggery`}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>
      </Link>
      <div className="flex flex-col flex-grow p-4 sm:p-6">
        <Link href={`/products/${product.slug}`} className="block">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1.5 sm:gap-2 mb-2">
            <h3 className="font-poppins text-base sm:text-xl font-semibold text-[#2C1500] group-hover:text-[#C17A2A] transition-colors leading-tight line-clamp-1 sm:line-clamp-none">{product.name}</h3>
            <span className="text-[10px] sm:text-xs font-semibold tracking-wide text-[#C17A2A] bg-[#C17A2A]/10 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shrink-0 self-start sm:self-auto">{product.weight}</span>
          </div>
          <p className="text-[#2C1500]/55 text-xs sm:text-base leading-relaxed mb-4 sm:mb-5 flex-grow line-clamp-2 sm:line-clamp-none">{product.description}</p>
        </Link>
        <div className="flex items-center justify-between mt-auto pt-3 sm:pt-4 border-t border-[#2C1500]/10">
          <p className="font-poppins text-base sm:text-xl font-bold text-[#2C1500]">{product.price}</p>
          <button
            onClick={handleOrder}
            className="inline-flex items-center min-w-0 flex-shrink-0 gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-white bg-[#C17A2A] px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-full hover:bg-[#A8671F] transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" strokeWidth={2} />
            <span>Add</span>
          </button>
        </div>
      </div>
    </article>
  );
});

export default function ProductsSection() {
  return (
    <section id="products" aria-label="Shop Collection" className="py-20 sm:py-28 px-6 sm:px-10 bg-white">
      <div className="max-w-[1440px] mx-auto">
        <SlideInLeft>
          <div className="mb-14 sm:mb-20 text-center">
            <p className="text-sm sm:text-base font-semibold tracking-[0.2em] uppercase text-[#C17A2A] mb-3">Our Products</p>
            <h2 className="font-poppins text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2C1500]">Shop Collection</h2>
            <p className="text-base sm:text-lg text-[#2C1500]/50 mt-4 max-w-lg mx-auto">100% natural. Direct from the mold to your table.</p>
          </div>
        </SlideInLeft>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8">
          {data.products.map((product, i) => (
            <ZoomIn key={product.slug} delay={i * 0.1} className="h-full">
              <ProductCard product={product} />
            </ZoomIn>
          ))}
        </div>
      </div>
    </section>
  );
}
