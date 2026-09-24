"use client";

import React, { useState, useMemo, useEffect, useCallback, memo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Search,
  Plus,
  Heart,
  ChevronDown,
  ArrowRight,
  SlidersHorizontal,
  Check,
  Sparkles,
} from "lucide-react";
import data from "@/data/content.json";
import { categorySlug, findCategory } from "@/lib/categories";
import { useIsFavourite, toggleFavourite } from "@/lib/favourites";

type Product = (typeof data.products)[number];

/* ─── Card backdrop (matches landing) ─────────────────────────── */
/* The card backdrop.
 *
 * This used to point at /hero-cane-bg.jpg — the 1840px hero image, fetched raw
 * because a CSS background never passes through next/image. That is 70 KB for
 * a texture that renders a few hundred pixels wide behind a gradient scrim,
 * and on /shop it is the LCP element. Same picture at the size it is actually
 * drawn: 9 KB. The hero keeps the full-size file, where the width is used. */
const CARD_BG =
  "bg-[#2D9577] bg-[url('/cane-texture.jpg')] bg-cover bg-center";


function badgeFor(slug: string, index: number): { label: string; tone: string } | null {
  if (index === 0) return { label: "Bestseller", tone: "bg-jaggery text-cream" };
  if (slug === "mixed-dry-fruits") return { label: "New", tone: "bg-honey text-jaggery" };
  return null;
}

function parsePrice(price: string): number {
  return parseInt(price.replace(/[^0-9]/g, ""), 10) || 0;
}

const CATEGORIES = ["All", ...Array.from(new Set(data.products.map((p) => p.category)))];

/**
 * Where a category pill points.
 *
 * These were buttons flipping client state, so a filtered shop had no address:
 * it could not be linked, shared or crawled, and the site offered nothing for
 * "jaggery powder Nepal" but a single product page. They are anchors now, which
 * updates the URL the way router.push would *and* leaves a real href for a
 * crawler that never runs the click handler.
 *
 * A category without a written intro has no route (see lib/categories.ts), so
 * it stays on /shop and filters in place rather than linking to a 404.
 */
function categoryHref(cat: string): string | null {
  if (cat === "All") return "/shop";
  return findCategory(categorySlug(cat)) ? `/shop/${categorySlug(cat)}` : null;
}

const SORT_OPTIONS = [
  { label: "Featured", value: "default" },
  { label: "Price · Low to High", value: "price-asc" },
  { label: "Price · High to Low", value: "price-desc" },
  { label: "Name · A–Z", value: "name-asc" },
];

const PRICE_RANGES = [
  { label: "Any Price", min: 0, max: Infinity },
  { label: "Under Rs. 200", min: 0, max: 199 },
  { label: "Rs. 200 – 300", min: 200, max: 300 },
  { label: "Above Rs. 300", min: 301, max: Infinity },
];

/* ─────────────────────────── Product Card (unchanged) ─────────────────────────── */
const ShopProductCard = memo(function ShopProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const isWishlisted = useIsFavourite(product.slug);
  const badge = badgeFor(product.slug, index);

  return (
    // CSS animation, not framer-motion. See `.animate-card-in` in globals.css:
    // the motion version wrote opacity:0 into the server HTML, so the grid —
    // this page's LCP element — could not paint until hydration finished.
    <article
      style={{ animationDelay: `${(index % 9) * 0.04}s` }}
      className={`animate-card-in group relative flex flex-col rounded-3xl p-3 sm:p-4 transition-transform duration-500 hover:-translate-y-1 ${CARD_BG}`}
    >
      {/* Legibility scrim — darkens the photo behind the text so it reads consistently */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-3xl bg-gradient-to-t from-jaggery/65 via-jaggery/20 to-transparent pointer-events-none"
      />

      <div className="relative z-10 aspect-square w-full">
        <div className="relative w-full h-full rounded-2xl overflow-hidden bg-cream">
          {badge && (
            <span className={`absolute top-3 left-3 z-10 label-caps text-[9px] px-2.5 py-1 rounded-full ${badge.tone}`}>
              {badge.label}
            </span>
          )}

          <button
            type="button"
            onClick={() => toggleFavourite(product.slug)}
            aria-label={isWishlisted ? "Remove from favourites" : "Add to favourites"}
            className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-cream/90 backdrop-blur-sm flex items-center justify-center transition-colors ${
              isWishlisted ? "text-terracotta" : "text-jaggery/70 hover:text-terracotta opacity-0 group-hover:opacity-100"
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-current" : ""}`} strokeWidth={1.75} />
          </button>

          <Link
            href={`/products/${product.slug}`}
            className="block absolute inset-0"
            aria-label={`${product.name}, ${product.price}`}
          >
            <Image
              src={product.image}
              alt={`${product.name}, ${product.weight} of pure organic sakhar`}
              fill
              loading={index < 6 ? "eager" : "lazy"}
              // The grid is two columns until lg and three after it, so the
              // card is 50vw then 33vw. This used to declare 33vw at 640px and
              // 25vw above 1024 — a four-column layout that does not exist —
              // which had the browser fetching a 320px image for a 410px slot
              // and rendering product photography slightly soft. Under-declared
              // rather than over: the bytes were fine, the picture was not.
              sizes="(max-width: 1023px) 50vw, 33vw"
              className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
            />
          </Link>

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

      <div className="relative z-10 pt-5 px-1.5 pb-1 flex flex-col [text-shadow:0_1px_2px_rgba(26,20,16,0.28)]">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-honey-ink">
            {product.category}
          </span>
        </div>

        <Link href={`/products/${product.slug}`} className="block">
          <h2 className="font-display font-bold text-cream text-[20px] sm:text-[22px] tracking-tight leading-[1.1] line-clamp-2 min-h-[2.2em] group-hover:text-honey transition-colors">
            {product.name}
          </h2>
        </Link>

        <p className="mt-2.5 text-[10px] font-bold tracking-[0.2em] uppercase text-cream/80">
          {product.weight}
        </p>

        <div className="mt-4 flex items-baseline gap-2.5">
          <span className="font-display font-bold text-cream text-[24px] sm:text-[26px] tracking-tight nums-price leading-none">
            {product.price}
          </span>
          {product.weight === "1kg" && (
            <span className="text-[12px] text-cream/75 font-medium">per kg</span>
          )}
        </div>
      </div>
    </article>
  );
});

/* ─────────────────────────── Page ─────────────────────────── */
export default function ShopContent({
  /** Set by /shop/[category]; /shop leaves it at "All". */
  initialCategory = "All",
}: {
  initialCategory?: string;
} = {}) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activePriceRange, setActivePriceRange] = useState(0);
  const [sortBy, setSortBy] = useState("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOpen, setSortOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sortOpen) return;
    const onClick = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [sortOpen]);

  useEffect(() => {
    document.body.style.overflow = filtersOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [filtersOpen]);

  const productCounts = useMemo(() => {
    const counts: Record<string, number> = { All: data.products.length };
    data.products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, []);

  const filteredProducts = useMemo(() => {
    let products = [...data.products];
    if (activeCategory !== "All") products = products.filter((p) => p.category === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      products = products.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
      );
    }
    const range = PRICE_RANGES[activePriceRange];
    if (range && activePriceRange !== 0) {
      products = products.filter((p) => {
        const price = parsePrice(p.price);
        return price >= range.min && price <= range.max;
      });
    }
    switch (sortBy) {
      case "price-asc":  products.sort((a, b) => parsePrice(a.price) - parsePrice(b.price)); break;
      case "price-desc": products.sort((a, b) => parsePrice(b.price) - parsePrice(a.price)); break;
      case "name-asc":   products.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return products;
  }, [activeCategory, activePriceRange, sortBy, searchQuery]);

  const hasActiveFilters =
    activeCategory !== "All" ||
    searchQuery.trim() !== "" ||
    sortBy !== "default" ||
    activePriceRange !== 0;

  const activeCount =
    (activeCategory !== "All" ? 1 : 0) +
    (activePriceRange !== 0 ? 1 : 0) +
    (sortBy !== "default" ? 1 : 0) +
    (searchQuery.trim() !== "" ? 1 : 0);

  const clearAll = useCallback(() => {
    setActiveCategory("All");
    setSearchQuery("");
    setSortBy("default");
    setActivePriceRange(0);
  }, []);

  const activeSortLabel = SORT_OPTIONS.find((s) => s.value === sortBy)?.label || "Featured";

  return (
    <>
      {/* ─── Sticky filter bar ────────────────────────── */}
      <div className="sticky top-29 z-30 bg-cream border-b border-jaggery/10 shadow-[0_6px_16px_-12px_rgba(26,20,16,0.25)]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          {/* Filter controls */}
          <div className="pt-4 pb-3.5 flex items-center gap-3">
            {/* Category pills */}
            <div className="flex-1 min-w-0 overflow-x-auto scrollbar-hide -mx-1 px-1">
              <ul className="flex items-center gap-1">
                {CATEGORIES.map((cat) => {
                  const active = activeCategory === cat;
                  const href = categoryHref(cat);
                  const className = `relative inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full text-[13px] font-medium tracking-tight whitespace-nowrap transition-all ${
                    active
                      ? "bg-jaggery text-cream shadow-[0_4px_12px_rgba(26,20,16,0.12)]"
                      : "text-jaggery/70 hover:text-jaggery hover:bg-jaggery/[0.04]"
                  }`;
                  const label = (
                    <>
                      {cat}
                      <span className={`text-[10px] tabular-nums ${active ? "text-cream/75" : "text-jaggery/35"}`}>
                        {productCounts[cat] ?? 0}
                      </span>
                    </>
                  );
                  return (
                    <li key={cat}>
                      {href ? (
                        <Link
                          href={href}
                          scroll={false}
                          aria-current={active ? "page" : undefined}
                          className={className}
                        >
                          {label}
                        </Link>
                      ) : (
                        <button onClick={() => setActiveCategory(cat)} className={className}>
                          {label}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Right utilities */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Inline search (desktop) */}
              <div className="hidden md:block relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-jaggery/70" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Find sakhar…"
                  className="h-9 w-[180px] lg:w-[220px] pl-9 pr-8 rounded-full bg-white border border-jaggery/12 text-[13px] text-jaggery placeholder:text-jaggery/70 focus:outline-none focus:border-jaggery/40 focus:w-[260px] transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-jaggery/70 hover:text-jaggery"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Mobile search button → expands filters drawer */}
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                aria-label="Search and filters"
                className="md:hidden h-9 w-9 inline-flex items-center justify-center rounded-full text-jaggery/70 hover:text-jaggery hover:bg-jaggery/[0.04] transition-colors"
              >
                <Search className="w-4 h-4" strokeWidth={1.6} />
              </button>

              {/* Sort dropdown */}
              <div ref={sortRef} className="relative">
                <button
                  type="button"
                  onClick={() => setSortOpen((v) => !v)}
                  aria-haspopup="listbox"
                  aria-expanded={sortOpen}
                  className="inline-flex items-center gap-1.5 h-9 px-3 sm:px-4 rounded-full text-jaggery hover:bg-jaggery/[0.04] transition-colors text-[12px] font-semibold tracking-tight border border-jaggery/12"
                >
                  <span className="hidden sm:inline text-jaggery/70">Sort</span>
                  <span className="hidden sm:inline text-jaggery/25">·</span>
                  <span className="sm:hidden">Sort</span>
                  <span className="hidden sm:inline">{activeSortLabel.split(" · ")[0]}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {sortOpen && (
                    <motion.ul
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18 }}
                      role="listbox"
                      className="absolute right-0 top-full mt-2 w-60 bg-white border border-jaggery/10 rounded-2xl shadow-[0_8px_30px_rgba(26,20,16,0.10)] p-1.5 z-20"
                    >
                      {SORT_OPTIONS.map((opt) => {
                        const active = sortBy === opt.value;
                        return (
                          <li key={opt.value}>
                            <button
                              type="button"
                              role="option"
                              aria-selected={active}
                              onClick={() => { setSortBy(opt.value); setSortOpen(false); }}
                              className={`w-full flex items-center justify-between gap-3 h-10 px-3 rounded-xl text-left text-[13px] tracking-tight transition-colors ${
                                active ? "bg-jaggery/8 text-jaggery font-semibold" : "text-jaggery/70 hover:bg-jaggery/[0.04] font-medium"
                              }`}
                            >
                              {opt.label}
                              {active && <Check className="w-3.5 h-3.5 text-caramel-deep" strokeWidth={2} />}
                            </button>
                          </li>
                        );
                      })}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>

              {/* Filters button */}
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                // The "Filter" label is `hidden sm:inline`, so below 640px this
                // was an icon with no accessible name at all.
                aria-label="Filters"
                className="relative inline-flex items-center gap-1.5 h-9 px-3 sm:px-4 rounded-full text-jaggery hover:bg-jaggery/[0.04] transition-colors text-[12px] font-semibold tracking-tight border border-jaggery/12"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" strokeWidth={1.75} />
                <span className="hidden sm:inline">Filter</span>
                {activeCount > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[16px] h-[16px] px-1 rounded-full bg-caramel text-cream text-[9px] font-bold tabular-nums">
                    {activeCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Active filter chips */}
          <AnimatePresence>
            {hasActiveFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pb-4 flex items-center gap-2 flex-wrap">
                  {activeCategory !== "All" && (
                    <Chip onRemove={() => router.push("/shop", { scroll: false })}>
                      {activeCategory}
                    </Chip>
                  )}
                  {activePriceRange !== 0 && (
                    <Chip onRemove={() => setActivePriceRange(0)}>{PRICE_RANGES[activePriceRange].label}</Chip>
                  )}
                  {sortBy !== "default" && (
                    <Chip onRemove={() => setSortBy("default")}>{activeSortLabel}</Chip>
                  )}
                  {searchQuery && (
                    <Chip onRemove={() => setSearchQuery("")}>&ldquo;{searchQuery}&rdquo;</Chip>
                  )}
                  <button
                    onClick={clearAll}
                    className="ml-1 text-[11px] font-bold tracking-[0.15em] uppercase text-terracotta-ink hover:text-jaggery transition-colors"
                  >
                    Clear all
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ─── Product grid ─────────────────────────────── */}
      <section className="bg-cream pt-6 sm:pt-8 pb-20 sm:pb-28 px-5 sm:px-8 lg:px-12 min-h-[60vh]">
        <div className="max-w-7xl mx-auto">
          {/* Result count */}
          <div className="mb-7 flex items-center justify-between">
            <p className="text-[12px] font-bold tracking-[0.18em] uppercase text-jaggery/70">
              Showing{" "}
              <span className="text-jaggery">{filteredProducts.length}</span>{" "}
              {filteredProducts.length === 1 ? "form" : "forms"}
              {activeCategory !== "All" && (
                <>
                  <span className="mx-2 text-jaggery/25">·</span>
                  <span className="text-caramel-deep">{activeCategory}</span>
                </>
              )}
            </p>
          </div>

          {filteredProducts.length > 0 ? (
            <AnimatePresence mode="wait" initial={false}>
              {/* initial={false}: the grid is in the server HTML at full opacity
                  rather than invisible until hydration. Filter changes animate. */}
              <motion.div
                key={`${activeCategory}-${activePriceRange}-${sortBy}-${searchQuery}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -2 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-7"
              >
                {filteredProducts.map((product, i) => (
                  <ShopProductCard
                    key={product.slug}
                    product={product}
                    index={i}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          ) : (
            <EmptyState onReset={clearAll} />
          )}
        </div>
      </section>

      {/* ─── Filters / search drawer ──────────────────── */}
      <AnimatePresence>
        {filtersOpen && (
          <div className="fixed inset-0 z-[60]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFiltersOpen(false)}
              className="absolute inset-0 bg-jaggery/45 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="absolute right-0 top-0 bottom-0 w-[360px] max-w-[92vw] bg-cream shadow-2xl overflow-y-auto"
            >
              <div className="p-7">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-marker uppercase text-2xl text-jaggery tracking-tight">Filter</h2>
                  <button
                    onClick={() => setFiltersOpen(false)}
                    aria-label="Close filters"
                    className="w-9 h-9 rounded-full text-jaggery hover:bg-jaggery/[0.06] flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Mobile search */}
                <div className="md:hidden mb-8">
                  <h3 className="text-[10px] font-bold tracking-[0.22em] uppercase text-jaggery/70 mb-3">
                    Search
                  </h3>
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-jaggery/70" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Find sakhar…"
                      className="w-full h-11 pl-10 pr-9 rounded-full bg-white border border-jaggery/12 text-[13px] text-jaggery placeholder:text-jaggery/70 focus:outline-none focus:border-jaggery/40"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        aria-label="Clear"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-jaggery/70 hover:text-jaggery"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <h3 className="text-[10px] font-bold tracking-[0.22em] uppercase text-jaggery/70 mb-3">
                    Price
                  </h3>
                  <ul className="flex flex-col gap-0.5">
                    {PRICE_RANGES.map((range, idx) => {
                      const active = activePriceRange === idx;
                      return (
                        <li key={idx}>
                          <button
                            onClick={() => setActivePriceRange(idx)}
                            className={`w-full flex items-center gap-3 py-2 text-left transition-colors ${
                              active ? "text-jaggery" : "text-jaggery/70 hover:text-jaggery"
                            }`}
                          >
                            <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                              active ? "border-jaggery" : "border-jaggery/25"
                            }`}>
                              {active && <span className="w-1.5 h-1.5 rounded-full bg-jaggery" />}
                            </span>
                            <span className={`text-[14px] tracking-tight ${active ? "font-semibold" : "font-medium"}`}>
                              {range.label}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <button
                  onClick={() => setFiltersOpen(false)}
                  className="w-full h-12 rounded-full bg-jaggery text-cream text-[13px] font-semibold tracking-tight hover:bg-jaggery-soft transition-colors"
                >
                  Show {filteredProducts.length} forms
                </button>
                {hasActiveFilters && (
                  <button
                    onClick={() => { clearAll(); setFiltersOpen(false); }}
                    className="mt-3 w-full h-11 rounded-full text-[12px] font-semibold tracking-tight text-terracotta hover:bg-terracotta/8 transition-colors"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Removable chip ─── */
function Chip({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 h-7 pl-3 pr-1 rounded-full bg-jaggery/8 text-jaggery text-[12px] font-medium tracking-tight">
      {children}
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove filter"
        className="w-5 h-5 rounded-full hover:bg-jaggery/12 flex items-center justify-center transition-colors"
      >
        <X className="w-3 h-3" strokeWidth={2} />
      </button>
    </span>
  );
}

/* ─── Empty state ─── */
function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="text-center py-20 sm:py-28">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-honey/15 mb-6">
        <Sparkles className="w-7 h-7 text-caramel-deep" strokeWidth={1.5} />
      </div>
      <p className="font-marker uppercase text-jaggery text-[clamp(1.75rem,3.5vw,2.75rem)] tracking-tight leading-tight">
        No sakhar found.
      </p>
      <p className="text-[14px] text-jaggery/70 mt-3 max-w-sm mx-auto leading-relaxed">
        We couldn&apos;t find a form matching your filters.
        Try adjusting your search or browse the full collection.
      </p>
      <button
        onClick={onReset}
        className="mt-8 inline-flex items-center gap-2 h-12 px-7 rounded-full bg-jaggery text-cream text-[12.5px] font-semibold tracking-tight hover:bg-jaggery-soft hover:-translate-y-px transition-all duration-300 shadow-[0_8px_24px_rgba(26,20,16,0.15)]"
      >
        Browse all sakhar
        <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
      </button>
    </div>
  );
}
