"use client";

import { memo, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Plus, ArrowRight, Heart } from "lucide-react";
import data from "@/data/content.json";

type Product = (typeof data.products)[number];

// Deterministic mock rating per product (no Math.random — keeps SSR stable)
function ratingFor(slug: string) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) & 0xffff;
  const rating = (4.5 + (h % 5) / 10).toFixed(1);
  const count = 120 + (h % 400);
  return { rating, count };
}

function badgeFor(slug: string, index: number): { label: string; tone: string } | null {
  if (index === 0) return { label: "Bestseller", tone: "bg-jaggery text-cream" };
  if (slug === "jaggery-spread" || slug === "spiced-jaggery-mix")
    return { label: "New", tone: "bg-honey text-jaggery" };
  return null;
}

const CATEGORIES = ["All", "Blocks", "Powder", "Cubes", "Liquid"] as const;
type Category = (typeof CATEGORIES)[number];

// Card backdrop — matches the hero sugarcane bg for visual continuity
const CARD_BG =
  "bg-[#2D9577] bg-[url('/hero-cane-bg.jpg')] bg-cover bg-center";

export default function ProductsSection() {
  const [active, setActive] = useState<Category>("All");
  const [wishlisted, setWishlisted] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    if (active === "All") return data.products;
    return data.products.filter((p) => p.category === active);
  }, [active]);

  const toggleWishlist = (slug: string) => {
    setWishlisted((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

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
              <span className="label-caps text-caramel text-[10px]">Shop the harvest</span>
            </div>
            <h2 className="font-serif font-soft text-jaggery tracking-[-0.02em] text-balance leading-[1.05] text-[clamp(2rem,4vw,3.25rem)]">
              The collection.
            </h2>
          </div>
          <p className="text-jaggery/60 text-[15px] leading-relaxed max-w-sm sm:text-right">
            Eight forms, one harvest. Hand-poured in Sankhuwasabha and shipped fresh.
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
                      : "text-jaggery/60 hover:text-jaggery"
                  }`}
                >
                  {cat}
                  <span
                    className={`text-[10px] tabular-nums ${
                      isActive ? "text-cream/55" : "text-jaggery/35"
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
            className="group hidden sm:inline-flex items-center gap-1.5 label-caps text-[10px] text-jaggery/55 hover:text-jaggery transition-colors shrink-0"
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
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-7"
          >
            {filtered.map((product, i) => (
              <ProductCard
                key={product.slug}
                product={product}
                index={i}
                isWishlisted={wishlisted.has(product.slug)}
                onToggleWishlist={() => toggleWishlist(product.slug)}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="font-serif text-jaggery/40 text-xl italic">
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
            View all 8 forms
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
  isWishlisted,
  onToggleWishlist,
}: {
  product: Product;
  index: number;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
}) {
  const { rating, count } = ratingFor(product.slug);
  const badge = badgeFor(product.slug, index);
  const hasDiscount = index < 2;
  const originalPrice = hasDiscount
    ? `Rs. ${Math.round(Number(product.price.replace(/[^0-9]/g, "")) * 1.25)}`
    : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.45, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      className={`group flex flex-col rounded-3xl p-3 sm:p-4 transition-transform duration-500 hover:-translate-y-1 ${CARD_BG}`}
    >
      {/* Image frame */}
      <div className="relative aspect-square w-full">
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
            onClick={onToggleWishlist}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-cream/90 backdrop-blur-sm flex items-center justify-center transition-colors ${
              isWishlisted
                ? "text-terracotta"
                : "text-jaggery/45 hover:text-terracotta opacity-0 group-hover:opacity-100"
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
            aria-label={`${product.name} — ${product.price}`}
          >
            <Image
              src={product.image}
              alt={`${product.name} — ${product.weight}`}
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
      <div className="pt-5 px-1.5 pb-1 flex flex-col">
        {/* Top meta — category + rating */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-honey">
            {product.category}
          </span>
          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 fill-honey stroke-honey" />
            <span className="text-[13px] font-bold text-cream tabular-nums leading-none">
              {rating}
            </span>
            <span className="text-[11px] text-cream/55 font-medium leading-none">
              ({count})
            </span>
          </div>
        </div>

        {/* Product name — chunky display */}
        <Link href={`/products/${product.slug}`} className="block">
          <h3 className="font-display font-bold text-cream text-[20px] sm:text-[22px] tracking-tight leading-[1.1] group-hover:text-honey transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Weight */}
        <p className="mt-2.5 text-[10px] font-bold tracking-[0.2em] uppercase text-cream/65">
          {product.weight}
        </p>

        {/* Price row */}
        <div className="mt-4 flex items-baseline gap-2.5">
          <span className="font-display font-bold text-cream text-[24px] sm:text-[26px] tracking-tight nums-price leading-none">
            {product.price}
          </span>
          {originalPrice && (
            <span className="text-[13px] text-cream/45 line-through nums-price font-medium">
              {originalPrice}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
});
