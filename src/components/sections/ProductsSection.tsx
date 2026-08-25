"use client";

import { memo, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ArrowRight, Heart } from "lucide-react";
import data from "@/data/content.json";
import { useIsFavourite, toggleFavourite } from "@/lib/favourites";

type Product = (typeof data.products)[number];


function badgeFor(slug: string, index: number): { label: string; tone: string } | null {
  if (index === 0) return { label: "Bestseller", tone: "bg-jaggery text-cream" };
  if (slug === "mixed-dry-fruits") return { label: "New", tone: "bg-honey text-jaggery" };
  return null;
}

// Derived from the data so adding or retiring a product never leaves a filter
// pointing at an empty shelf.
const CATEGORIES = [
  "All",
  ...Array.from(new Set(data.products.map((p) => p.category))),
] as const;
type Category = (typeof CATEGORIES)[number];

// Card backdrop — matches the hero sugarcane bg for visual continuity
/* The card backdrop.
 *
 * This used to point at /hero-cane-bg.jpg — the 1840px hero image, fetched raw
 * because a CSS background never passes through next/image. That is 70 KB for
 * a texture that renders a few hundred pixels wide behind a gradient scrim,
 * and on /shop it is the LCP element. Same picture at the size it is actually
 * drawn: 9 KB. The hero keeps the full-size file, where the width is used. */
const CARD_BG =
  "bg-[#2D9577] bg-[url('/cane-texture.jpg')] bg-cover bg-center";

export default function ProductsSection() {
  const [active, setActive] = useState<Category>("All");

  const filtered = useMemo(() => {
    if (active === "All") return data.products;
    return data.products.filter((p) => p.category === active);
  }, [active]);

  return (
    <section
      id="products"
      aria-label="Shop the harvest"
      className="relative py-20 sm:py-24 px-5 sm:px-8 lg:px-12 bg-cream overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto">
        {/* ─── Section header ───────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-10 sm:mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-6 h-px bg-caramel" />
              <span className="label-caps text-caramel-deep text-[10px]">Shop pure sakhar</span>
            </div>
            <h2 className="font-serif font-soft text-jaggery tracking-[-0.02em] text-balance leading-[1.05] text-[clamp(2rem,4vw,3.25rem)]">
              The sakhar collection.
            </h2>
          </div>
          <p className="text-jaggery/70 text-[15px] leading-relaxed max-w-sm sm:text-right">
            100% organic sakhar in three pure forms, one chemical-free harvest. Direct from Sankhuwasabha farmers.
          </p>
        </div>

        {/* ─── Filter row ───────────────────────── */}
        <div className="flex items-center justify-between gap-3 mb-8 sm:mb-10 pb-4 border-b border-jaggery/10">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide -mx-1 px-1">
            {CATEGORIES.map((cat) => {
              const isActive = active === cat;
              const count =
                cat === "All"
                  ? data.products.length
                  : data.products.filter((p) => p.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
                  className={`relative inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-[13px] font-medium tracking-tight whitespace-nowrap transition-colors ${
                    isActive
                      ? "bg-jaggery text-cream"
                      : "text-jaggery/70 hover:text-jaggery"
                  }`}
                >
                  {cat}
                  <span
                    className={`text-[10px] tabular-nums ${
                      isActive ? "text-cream/75" : "text-jaggery/35"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <Link
            href="/shop"
            className="group hidden sm:inline-flex items-center gap-1.5 label-caps text-[10px] text-jaggery/70 hover:text-jaggery transition-colors shrink-0"
          >
            View all
            <ArrowRight
              className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
              strokeWidth={1.75}
            />
          </Link>
        </div>

        {/* ─── Product grid ─────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -2 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-7"
          >
            {filtered.map((product, i) => (
              <ProductCard
                key={product.slug}
                product={product}
                index={i}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="font-serif text-jaggery/70 text-xl italic">
              Nothing in this form, yet.
            </p>
          </div>
        )}

        {/* ─── Mobile view-all ──────────────────── */}
        <div className="mt-10 flex justify-center sm:hidden">
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 label-caps text-[10px] text-jaggery border-b border-jaggery/30 pb-1.5"
          >
            View all {data.products.length} forms
            <ArrowRight
              className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
              strokeWidth={1.75}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Product card ─── */
const ProductCard = memo(function ProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const isWishlisted = useIsFavourite(product.slug);
  const badge = badgeFor(product.slug, index);

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.45, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative flex flex-col rounded-3xl p-3 sm:p-4 transition-transform duration-500 hover:-translate-y-1 ${CARD_BG}`}
    >
      {/* Legibility scrim — darkens the photo behind the text so it reads consistently */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-3xl bg-gradient-to-t from-jaggery/65 via-jaggery/20 to-transparent pointer-events-none"
      />

      {/* Image frame */}
      <div className="relative z-10 aspect-square w-full">
        {/* Inner image container */}
        <div className="relative w-full h-full rounded-2xl overflow-hidden bg-cream">
          {/* Badge — top-left */}
          {badge && (
            <span
              className={`absolute top-3 left-3 z-10 label-caps text-[9px] px-2.5 py-1 rounded-full ${badge.tone}`}
            >
              {badge.label}
            </span>
          )}

          {/* Wishlist — top-right */}
          <button
            type="button"
            onClick={() => toggleFavourite(product.slug)}
            aria-label={isWishlisted ? "Remove from favourites" : "Add to favourites"}
            className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-cream/90 backdrop-blur-sm flex items-center justify-center transition-colors ${
              isWishlisted
                ? "text-terracotta"
                : "text-jaggery/70 hover:text-terracotta opacity-0 group-hover:opacity-100"
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 ${isWishlisted ? "fill-current" : ""}`}
              strokeWidth={1.75}
            />
          </button>

          <Link
            href={`/products/${product.slug}`}
            className="block absolute inset-0"
            aria-label={`${product.name}, ${product.price}`}
          >
            <Image
              src={product.image}
              alt={`${product.name}, ${product.weight}`}
              fill
              loading={index < 4 ? "eager" : "lazy"}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
            />
          </Link>

          {/* Add-to-bag (slide up on hover) */}
          <Link
            href={`/products/${product.slug}`}
            aria-label={`Add ${product.name} to bag`}
            className="absolute inset-x-3 bottom-3 z-10 h-10 rounded-full bg-jaggery text-cream label-caps text-[10px] flex items-center justify-center gap-1.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={2} />
            Add to bag
          </Link>
        </div>
      </div>

      {/* Info */}
      <div className="relative z-10 pt-5 px-1.5 pb-1 flex flex-col [text-shadow:0_1px_2px_rgba(26,20,16,0.28)]">
        {/* Top meta — category */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-honey-ink">
            {product.category}
          </span>
        </div>

        {/* Product name — chunky display, locked to two lines so prices align */}
        <Link href={`/products/${product.slug}`} className="block">
          <h3 className="font-display font-bold text-cream text-[20px] sm:text-[22px] tracking-tight leading-[1.1] line-clamp-2 min-h-[2.2em] group-hover:text-honey transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Weight */}
        <p className="mt-2.5 text-[10px] font-bold tracking-[0.2em] uppercase text-cream/80">
          {product.weight}
        </p>

        {/* Price row */}
        <div className="mt-4 flex items-baseline gap-2.5">
          <span className="font-display font-bold text-cream text-[24px] sm:text-[26px] tracking-tight nums-price leading-none">
            {product.price}
          </span>
          {product.weight === "1kg" && (
            <span className="text-[12px] text-cream/75 font-medium">per kg</span>
          )}
        </div>
      </div>
    </motion.article>
  );
});
