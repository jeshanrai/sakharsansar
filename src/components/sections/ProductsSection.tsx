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

// Light badge logic — first two = bestsellers, last = new
function badgeFor(slug: string, index: number): { label: string; tone: string } | null {
  if (index === 0) return { label: "Bestseller", tone: "bg-caramel-deep text-cream" };
  if (index === 1) return { label: "Editor's Pick", tone: "bg-forest text-cream" };
  if (slug === "jaggery-spread" || slug === "spiced-jaggery-mix")
    return { label: "New", tone: "bg-honey text-jaggery" };
  return null;
}

const CATEGORIES = ["All", "Blocks", "Powder", "Cubes", "Liquid"] as const;
type Category = (typeof CATEGORIES)[number];

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
      className="relative py-20 sm:py-28 px-6 sm:px-10 lg:px-16 bg-cream paper-grain overflow-hidden"
    >
      <div aria-hidden className="absolute top-1/4 -right-32 w-[30rem] h-[30rem] rounded-full bg-honey/20 blur-3xl pointer-events-none" />

      <div className="relative max-w-[1440px] mx-auto">
        {/* ─── Section heading ─────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-10 sm:mb-14 items-end">
          <div className="md:col-span-7">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-10 h-px bg-caramel" />
              <span className="label-caps text-caramel">Shop the harvest</span>
            </div>
            <h2 className="font-serif font-soft text-jaggery tracking-[-0.02em] text-balance leading-[1.04]">
              <span className="block text-[clamp(2rem,4.5vw,3.75rem)]">
                Crafted with care.
              </span>
              <span className="block text-[clamp(2rem,4.5vw,3.75rem)] italic font-light text-caramel-deep font-wonk">
                Loved by 12,000+.
              </span>
            </h2>
          </div>
          <div className="md:col-span-5 md:text-right">
            <p className="text-jaggery/65 text-lede leading-relaxed md:ml-auto max-w-md">
              Hand-poured, slow-cooked, and shipped fresh. Each form carries the same
              honest gur — just shaped for a different ritual.
            </p>
          </div>
        </div>

        {/* ─── Category filter pills ─────────────── */}
        <div className="flex flex-wrap items-center gap-2.5 mb-10 sm:mb-12">
          {CATEGORIES.map((cat) => {
            const isActive = active === cat;
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`relative h-10 px-5 rounded-full label-caps text-[10px] transition-all duration-300 ${
                  isActive
                    ? "bg-jaggery text-cream shadow-lg shadow-jaggery/15"
                    : "bg-ivory text-jaggery/60 border border-jaggery/10 hover:border-jaggery/30 hover:text-jaggery"
                }`}
              >
                {cat}
              </button>
            );
          })}
          <div className="hidden sm:flex flex-1" />
          <Link
            href="/shop"
            className="group hidden sm:inline-flex items-center gap-2 label-caps text-jaggery/70 hover:text-caramel-deep transition-colors text-[10px]"
          >
            View all 8 forms
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.75} />
          </Link>
        </div>

        {/* ─── Product grid ───────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
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
          <div className="text-center py-16">
            <p className="font-serif text-jaggery/40 text-xl italic">
              Nothing in this form, yet.
            </p>
          </div>
        )}

        {/* ─── Mobile view all CTA ─────────────── */}
        <div className="mt-10 flex justify-center sm:hidden">
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 label-caps text-jaggery border-b border-jaggery/30 pb-1.5"
          >
            View all 8 forms
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.75} />
          </Link>
        </div>

        {/* ─── Trust band below grid ──────────── */}
        <div className="mt-20 sm:mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 pt-10 border-t border-jaggery/10">
          {[
            { fig: "12K+", label: "Happy homes" },
            { fig: "4.9★", label: "Average rating" },
            { fig: "8", label: "Curated forms" },
            { fig: "100%", label: "Chemical-free" },
          ].map((t) => (
            <div key={t.label} className="text-center sm:text-left">
              <p className="font-serif text-jaggery text-3xl sm:text-4xl tracking-tight nums-tabular leading-none">
                {t.fig}
              </p>
              <p className="label-caps text-jaggery/50 mt-2">{t.label}</p>
            </div>
          ))}
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
  // Mock a small discount for the first two for visual variety
  const hasDiscount = index < 2;
  const originalPrice = hasDiscount
    ? `Rs. ${Math.round(Number(product.price.replace(/[^0-9]/g, "")) * 1.25)}`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <article className="relative bg-ivory rounded-2xl overflow-hidden border border-jaggery/8 hover:border-jaggery/20 hover:shadow-xl hover:shadow-jaggery/8 hover:-translate-y-1 transition-all duration-500">
        {/* Image area */}
        <Link
          href={`/products/${product.slug}`}
          className="relative block aspect-square w-full overflow-hidden bg-cream"
          aria-label={`${product.name} — ${product.price}`}
        >
          {/* Badges */}
          {badge && (
            <span className={`absolute top-3 left-3 z-10 label-caps text-[9px] px-2.5 py-1 rounded-full ${badge.tone}`}>
              {badge.label}
            </span>
          )}
          {hasDiscount && (
            <span className="absolute top-3 right-3 z-10 label-caps text-[9px] px-2 py-1 rounded-full bg-terracotta text-cream">
              −20%
            </span>
          )}

          {/* Wishlist */}
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleWishlist();
            }}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className={`absolute ${badge ? "top-12" : "top-3"} ${hasDiscount ? "" : "right-3"} ${
              hasDiscount && !badge ? "top-12 right-3" : "right-3"
            } z-10 w-8 h-8 rounded-full bg-cream/90 backdrop-blur-sm flex items-center justify-center transition-colors ${
              isWishlisted ? "text-terracotta" : "text-jaggery/40 hover:text-terracotta"
            }`}
            style={hasDiscount ? { top: "3rem" } : undefined}
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-current" : ""}`} strokeWidth={1.75} />
          </button>

          <Image
            src={product.image}
            alt={`${product.name} — ${product.weight}`}
            fill
            loading={index < 4 ? "eager" : "lazy"}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.06]"
          />

          {/* Quick-view overlay */}
          <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
            <div className="bg-cream/95 backdrop-blur-md text-jaggery rounded-xl px-3 py-2 text-center label-caps text-[10px]">
              Quick view
            </div>
          </div>
        </Link>

        {/* Info */}
        <div className="p-4 sm:p-5">
          {/* Category + rating row */}
          <div className="flex items-center justify-between">
            <span className="label-caps text-caramel-deep text-[9px]">{product.category}</span>
            <div className="flex items-center gap-1 text-jaggery/70">
              <Star className="w-3 h-3 fill-honey stroke-honey" />
              <span className="text-[11px] font-medium nums-tabular tabular-nums">{rating}</span>
              <span className="text-[10px] text-jaggery/40">({count})</span>
            </div>
          </div>

          <Link href={`/products/${product.slug}`}>
            <h3 className="font-serif text-jaggery text-[18px] sm:text-lg tracking-tight leading-tight mt-2 group-hover:text-caramel-deep transition-colors">
              {product.name}
            </h3>
          </Link>

          <p className="text-[11px] text-jaggery/45 mt-1 nums-price">{product.weight}</p>

          {/* Price + add */}
          <div className="mt-3 flex items-end justify-between gap-3">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="font-serif text-jaggery text-xl tracking-tight nums-price">
                {product.price}
              </span>
              {originalPrice && (
                <span className="text-[11px] text-jaggery/35 line-through nums-price">
                  {originalPrice}
                </span>
              )}
            </div>
            <Link
              href={`/products/${product.slug}`}
              aria-label={`Add ${product.name} to bag`}
              className="group/btn w-10 h-10 rounded-full bg-jaggery text-cream hover:bg-caramel-deep hover:rotate-90 flex items-center justify-center shadow-md shadow-jaggery/15 transition-all duration-500"
            >
              <Plus className="w-4 h-4" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </article>
    </motion.div>
  );
});
