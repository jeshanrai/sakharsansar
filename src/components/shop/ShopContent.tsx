"use client";

import React, { useState, useMemo, useEffect, useCallback, memo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Search,
  Star,
  Plus,
  Heart,
  ChevronDown,
  ArrowRight,
  SlidersHorizontal,
  Check,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import data from "@/data/content.json";
import { useIsFavourite, toggleFavourite } from "@/lib/favourites";

type Product = (typeof data.products)[number];

/* ─── Card backdrop (matches landing) ─────────────────────────── */
const CARD_BG =
  "bg-[#2D9577] bg-[url('/hero-cane-bg.jpg')] bg-cover bg-center";

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

function parsePrice(price: string): number {
  return parseInt(price.replace(/[^0-9]/g, ""), 10) || 0;
}

const CATEGORIES = ["All", ...Array.from(new Set(data.products.map((p) => p.category)))];

const SORT_OPTIONS = [
  { label: "Featured", value: "default" },
  { label: "Price · Low to High", value: "price-asc" },
  { label: "Price · High to Low", value: "price-desc" },
  { label: "Name · A–Z", value: "name-asc" },
];

const PRICE_RANGES = [
  { label: "Any Price", min: 0, max: Infinity },
  { label: "Under Rs. 300", min: 0, max: 299 },
  { label: "Rs. 300 – 500", min: 300, max: 500 },
  { label: "Above Rs. 500", min: 501, max: Infinity },
];

/* ─────────────────────────── Product Card (unchanged) ─────────────────────────── */
const ShopProductCard = memo(function ShopProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const { rating, count } = ratingFor(product.slug);
  const isWishlisted = useIsFavourite(product.slug);
  const badge = badgeFor(product.slug, index);
  const hasDiscount = index < 2;
  const originalPrice = hasDiscount
    ? `Rs. ${Math.round(parsePrice(product.price) * 1.25)}`
    : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: (index % 9) * 0.04, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative flex flex-col rounded-3xl p-3 sm:p-4 transition-transform duration-500 hover:-translate-y-1 ${CARD_BG}`}
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
              isWishlisted ? "text-terracotta" : "text-jaggery/45 hover:text-terracotta opacity-0 group-hover:opacity-100"
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-current" : ""}`} strokeWidth={1.75} />
          </button>

          <Link
            href={`/products/${product.slug}`}
            className="block absolute inset-0"
            aria-label={`${product.name} — ${product.price}`}
          >
            <Image
              src={product.image}
              alt={`${product.name} — ${product.weight} of pure organic sakhar`}
              fill
              loading={index < 6 ? "eager" : "lazy"}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
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
          <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-honey">
            {product.category}
          </span>
          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 fill-honey stroke-honey" />
            <span className="text-[13px] font-bold text-cream tabular-nums leading-none">{rating}</span>
            <span className="text-[11px] text-cream/75 font-medium leading-none">({count})</span>
          </div>
        </div>

        <Link href={`/products/${product.slug}`} className="block">
          <h3 className="font-display font-bold text-cream text-[20px] sm:text-[22px] tracking-tight leading-[1.1] line-clamp-2 min-h-[2.2em] group-hover:text-honey transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="mt-2.5 text-[10px] font-bold tracking-[0.2em] uppercase text-cream/80">
          {product.weight}
        </p>

        <div className="mt-4 flex items-baseline gap-2.5">
          <span className="font-display font-bold text-cream text-[24px] sm:text-[26px] tracking-tight nums-price leading-none">
            {product.price}
          </span>
          {originalPrice && (
            <span className="text-[13px] text-cream/60 line-through nums-price font-medium">
              {originalPrice}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
});

/* ─────────────────────────── Page ─────────────────────────── */
export default function ShopContent() {
  const [activeCategory, setActiveCategory] = useState("All");
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
      {/* ─── Editorial header ─────────────────────────── */}
      <section className="relative bg-cream pt-10 sm:pt-14 pb-2 px-5 sm:px-8 lg:px-12 overflow-hidden">
        {/* Soft honey halo */}
        <div
          aria-hidden
          className="absolute -top-32 -right-32 w-[34rem] h-[34rem] rounded-full bg-honey/15 blur-3xl pointer-events-none"
        />

        <div className="relative max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 text-[11px] font-medium text-jaggery/50">
              <li>
                <Link href="/" className="hover:text-jaggery transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="w-3 h-3" strokeWidth={2} />
              </li>
              <li className="text-jaggery font-semibold">Shop</li>
            </ol>
          </nav>

          {/* Headline block */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-end">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="w-6 h-px bg-caramel" />
                <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-caramel">
                  Shop pure sakhar
                </span>
              </div>
              <h1 className="font-display font-bold text-jaggery tracking-tight text-balance leading-[0.95]">
                <span className="block text-[clamp(2.75rem,7vw,5.5rem)]">
                  Every form of
                </span>
                <span className="block text-[clamp(2.75rem,7vw,5.5rem)] text-caramel-deep">
                  <span className="font-serif italic font-normal">honest</span> sakhar.
                </span>
              </h1>
            </div>

            {/* Right info card */}
            <div className="lg:col-span-4">
              <div className="bg-white/60 backdrop-blur-sm border border-jaggery/8 rounded-3xl p-5 sm:p-6">
                <p className="text-[14px] text-jaggery/70 leading-relaxed">
                  100% organic. Wood-fired in Sankhuwasabha. Hand-poured by farmers
                  for <em className="font-serif italic text-jaggery">seven generations</em>.
                </p>
                <div className="mt-5 pt-5 border-t border-jaggery/10 flex items-center gap-5">
                  <Stat value={String(data.products.length)} label="Forms" />
                  <span className="w-px h-8 bg-jaggery/12" />
                  <Stat value="4.9★" label="Rating" />
                  <span className="w-px h-8 bg-jaggery/12" />
                  <Stat value="100%" label="Organic" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Sticky filter bar ────────────────────────── */}
      <div className="sticky top-29 z-30 bg-cream/95 backdrop-blur-md mt-8 sm:mt-10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          {/* Filter controls */}
          <div className="border-t border-jaggery/10 pt-4 pb-3.5 flex items-center gap-3">
            {/* Category pills */}
            <div className="flex-1 min-w-0 overflow-x-auto scrollbar-hide -mx-1 px-1">
              <ul className="flex items-center gap-1">
                {CATEGORIES.map((cat) => {
                  const active = activeCategory === cat;
                  return (
                    <li key={cat}>
                      <button
                        onClick={() => setActiveCategory(cat)}
                        className={`relative inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full text-[13px] font-medium tracking-tight whitespace-nowrap transition-all ${
                          active
                            ? "bg-jaggery text-cream shadow-[0_4px_12px_rgba(26,20,16,0.12)]"
                            : "text-jaggery/65 hover:text-jaggery hover:bg-jaggery/[0.04]"
                        }`}
                      >
                        {cat}
                        <span className={`text-[10px] tabular-nums ${active ? "text-cream/60" : "text-jaggery/35"}`}>
                          {productCounts[cat] ?? 0}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Right utilities */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Inline search (desktop) */}
              <div className="hidden md:block relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-jaggery/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Find sakhar…"
                  className="h-9 w-[180px] lg:w-[220px] pl-9 pr-8 rounded-full bg-white border border-jaggery/12 text-[13px] text-jaggery placeholder:text-jaggery/40 focus:outline-none focus:border-jaggery/40 focus:w-[260px] transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-jaggery/45 hover:text-jaggery"
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
                className="md:hidden h-9 w-9 inline-flex items-center justify-center rounded-full text-jaggery/65 hover:text-jaggery hover:bg-jaggery/[0.04] transition-colors"
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
                  <span className="hidden sm:inline text-jaggery/55">Sort</span>
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
                              {active && <Check className="w-3.5 h-3.5 text-caramel" strokeWidth={2} />}
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
                    <Chip onRemove={() => setActiveCategory("All")}>{activeCategory}</Chip>
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
                    className="ml-1 text-[11px] font-bold tracking-[0.15em] uppercase text-terracotta hover:text-jaggery transition-colors"
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
            <p className="text-[12px] font-bold tracking-[0.18em] uppercase text-jaggery/55">
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
            <AnimatePresence mode="wait">
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
                  <h2 className="font-display font-bold text-2xl text-jaggery tracking-tight">Filter</h2>
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
                  <h3 className="text-[10px] font-bold tracking-[0.22em] uppercase text-jaggery/55 mb-3">
                    Search
                  </h3>
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-jaggery/40" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Find sakhar…"
                      className="w-full h-11 pl-10 pr-9 rounded-full bg-white border border-jaggery/12 text-[13px] text-jaggery placeholder:text-jaggery/40 focus:outline-none focus:border-jaggery/40"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        aria-label="Clear"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-jaggery/45 hover:text-jaggery"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <h3 className="text-[10px] font-bold tracking-[0.22em] uppercase text-jaggery/55 mb-3">
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
                              active ? "text-jaggery" : "text-jaggery/60 hover:text-jaggery"
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

/* ─── Stat (header) ─── */
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col leading-none">
      <span className="font-display font-bold text-jaggery text-[18px] tabular-nums">
        {value}
      </span>
      <span className="text-[9px] font-bold tracking-[0.18em] uppercase text-jaggery/45 mt-1.5">
        {label}
      </span>
    </div>
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
      <p className="font-display font-bold text-jaggery text-[clamp(1.75rem,3.5vw,2.75rem)] tracking-tight leading-tight">
        No sakhar found.
      </p>
      <p className="text-[14px] text-jaggery/55 mt-3 max-w-sm mx-auto leading-relaxed">
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
