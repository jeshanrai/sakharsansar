"use client";
import { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import data from "@/data/content.json";
import { FadeUp, SlideInLeft } from "@/components/ui/Animations";
import { ArrowRight } from "lucide-react";

type Product = (typeof data.products)[number];

const ProductCard = memo(function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col h-full"
      aria-label={`${product.name} — ${product.price}`}
    >
      <article className="flex flex-col h-full">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-ivory mb-6">
          <Image
            src={product.image}
            alt={`${product.name} — ${product.weight} of pure natural jaggery`}
            fill
            loading={index < 2 ? "eager" : "lazy"}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.04]"
          />
          {/* Hover label */}
          <span className="absolute bottom-5 left-5 right-5 label-caps text-cream bg-jaggery/85 backdrop-blur-sm px-4 py-3 text-center opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
            View Product
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-serif text-h4 text-jaggery group-hover:text-caramel-deep transition-colors">
              {product.name}
            </h3>
            <span className="font-serif text-base text-jaggery whitespace-nowrap nums-price">
              {product.price}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="label-caps text-jaggery/55 nums-price">{product.weight}</span>
            <span className="label-caps text-jaggery/45">{product.category}</span>
          </div>
        </div>
      </article>
    </Link>
  );
});

export default function ProductsSection() {
  // Hero showcase: first four products only
  const showcase = data.products.slice(0, 4);

  return (
    <section
      id="products"
      aria-label="The Collection"
      className="py-24 sm:py-36 px-6 sm:px-10 lg:px-16 bg-ivory"
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Editorial header — asymmetric */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16 sm:mb-24 items-end">
          <SlideInLeft className="md:col-span-7">
            <span className="label-caps text-caramel mb-5 block">The Collection</span>
            <h2 className="font-serif text-h1 text-jaggery tracking-[-0.018em] text-balance">
              Eight expressions of <span className="italic font-light">one cane</span>.
            </h2>
          </SlideInLeft>
          <FadeUp delay={0.2} className="md:col-span-5">
            <p className="text-jaggery/70 text-lede max-w-md md:ml-auto">
              From slow-poured blocks to spiced powders — every form is hand-crafted
              from a single, chemical-free harvest in Sankhuwasabha.
            </p>
          </FadeUp>
        </div>

        {/* 4-up showcase */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">
          {showcase.map((product, i) => (
            <FadeUp key={product.slug} delay={i * 0.08} className="h-full">
              <ProductCard product={product} index={i} />
            </FadeUp>
          ))}
        </div>

        {/* View full collection */}
        <div className="mt-20 sm:mt-24 flex justify-center">
          <Link
            href="/shop"
            className="group inline-flex items-center gap-3 label-caps text-jaggery border-b border-jaggery/30 hover:border-jaggery pb-1.5 transition-colors"
          >
            View the full collection
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </section>
  );
}
