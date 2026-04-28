"use client";
import React, { useState, useMemo, useEffect, useCallback, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import data from "@/data/content.json";
import { FadeUp } from "@/components/ui/Animations";
import { SlidersHorizontal, X, Search, ChevronDown } from "lucide-react";

type Product = (typeof data.products)[number];

const ShopProductCard = memo(function ShopProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col h-full"
      aria-label={`${product.name} — ${product.price}`}
    >
      <article className="flex flex-col h-full">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-ivory mb-5">
          <Image
            src={product.image}
            alt={`${product.name} — ${product.weight} of pure natural jaggery`}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.04]"
          />
          <span className="absolute top-4 left-4 font-serif italic text-meta text-cream bg-jaggery/80 backdrop-blur-sm px-3 py-1">
            {product.category}
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
            <span className="label-caps text-jaggery/45 group-hover:text-jaggery transition-colors">
              View →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
});

const categories = ["All", ...Array.from(new Set(data.products.map(p => p.category)))];

const sortOptions = [
  { label: "Default", value: "default" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Name: A–Z", value: "name-asc" },
];

const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under Rs. 300", min: 0, max: 299 },
  { label: "Rs. 300 – Rs. 500", min: 300, max: 500 },
  { label: "Above Rs. 500", min: 501, max: Infinity },
];

function parsePrice(price: string): number {
  return parseInt(price.replace(/[^0-9]/g, ''), 10) || 0;
}

function SidebarFilters({
  searchQuery, setSearchQuery,
  activeCategory, setActiveCategory,
  activePriceRange, setActivePriceRange,
  sortBy, setSortBy,
  hasActiveFilters, clearAll, productCounts,
}: {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  activeCategory: string;
  setActiveCategory: (v: string) => void;
  activePriceRange: number;
  setActivePriceRange: (v: number) => void;
  sortBy: string;
  setSortBy: (v: string) => void;
  hasActiveFilters: boolean;
  clearAll: () => void;
  productCounts: Record<string, number>;
}) {
  return (
    <div className="flex flex-col gap-9">
      <div>
        <h3 className="label-caps text-jaggery/60 mb-3">Search</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-jaggery/35" />
          <input
            type="text"
            placeholder="Search the collection"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-cream border-b border-jaggery/20 pl-9 pr-9 py-3 text-sm text-jaggery placeholder:text-jaggery/35 focus:outline-none focus:border-jaggery transition-colors font-serif"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-jaggery/45 hover:text-jaggery transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div>
        <h3 className="label-caps text-jaggery/60 mb-3">Form</h3>
        <ul className="flex flex-col">
          {categories.map((cat) => (
            <li key={cat}>
              <button
                onClick={() => setActiveCategory(cat)}
                className={`w-full flex items-center justify-between py-2 text-left transition-colors ${
                  activeCategory === cat
                    ? 'text-jaggery'
                    : 'text-jaggery/55 hover:text-jaggery'
                }`}
              >
                <span className={`font-serif text-base ${activeCategory === cat ? 'italic' : ''}`}>
                  {cat}
                </span>
                <span className="label-caps text-jaggery/40">
                  {productCounts[cat] ?? 0}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="label-caps text-jaggery/60 mb-3">Price</h3>
        <ul className="flex flex-col">
          {priceRanges.map((range, idx) => (
            <li key={idx}>
              <button
                onClick={() => setActivePriceRange(idx)}
                className={`w-full flex items-center gap-3 py-2 text-left transition-colors ${
                  activePriceRange === idx ? 'text-jaggery' : 'text-jaggery/55 hover:text-jaggery'
                }`}
              >
                <span className={`w-3 h-3 rounded-full border ${
                  activePriceRange === idx ? 'border-jaggery bg-jaggery' : 'border-jaggery/30'
                }`} />
                <span className="font-serif text-base">{range.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="label-caps text-jaggery/60 mb-3">Sort By</h3>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-cream border-b border-jaggery/20 py-3 pr-8 text-sm text-jaggery font-serif focus:outline-none focus:border-jaggery transition-colors cursor-pointer appearance-none"
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-jaggery/45 pointer-events-none" />
        </div>
      </div>

      {hasActiveFilters && (
        <button
          onClick={clearAll}
          className="label-caps text-terracotta hover:underline self-start"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}

export default function ShopContent() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activePriceRange, setActivePriceRange] = useState(0);
  const [sortBy, setSortBy] = useState("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileFilterOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileFilterOpen]);

  const productCounts = useMemo(() => {
    const counts: Record<string, number> = { All: data.products.length };
    data.products.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, []);

  const filteredProducts = useMemo(() => {
    let products = [...data.products];
    if (activeCategory !== "All") products = products.filter(p => p.category === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    const range = priceRanges[activePriceRange];
    if (range && activePriceRange !== 0) {
      products = products.filter(p => {
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

  const hasActiveFilters = activeCategory !== "All" || searchQuery.trim() !== "" || sortBy !== "default" || activePriceRange !== 0;

  const clearAll = useCallback(() => {
    setActiveCategory("All");
    setSearchQuery("");
    setSortBy("default");
    setActivePriceRange(0);
  }, []);

  const sidebarProps = {
    searchQuery,
    setSearchQuery: useCallback((v: string) => setSearchQuery(v), []),
    activeCategory,
    setActiveCategory: useCallback((v: string) => setActiveCategory(v), []),
    activePriceRange,
    setActivePriceRange: useCallback((v: number) => setActivePriceRange(v), []),
    sortBy,
    setSortBy: useCallback((v: string) => setSortBy(v), []),
    hasActiveFilters,
    clearAll,
    productCounts,
  };

  return (
    <section className="py-12 sm:py-20 px-6 sm:px-10 lg:px-16 bg-cream min-h-screen">
      <div className="max-w-[1440px] mx-auto">
        {/* Editorial header */}
        <FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-14 sm:mb-20 items-end">
            <div className="md:col-span-8">
              <span className="label-caps text-caramel mb-5 block">The Collection</span>
              <h1 className="font-serif font-soft text-jaggery text-display tracking-[-0.018em] text-balance">
                Eight expressions of <span className="italic font-light">one cane.</span>
              </h1>
            </div>
            <p className="md:col-span-4 text-jaggery/75 text-lede md:max-w-sm md:ml-auto">
              Each form &mdash; block, powder, liquid, cube &mdash; pulls a different
              flavour from the same Sankhuwasabha harvest.
            </p>
          </div>
        </FadeUp>

        {/* Mobile filter toggle */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="inline-flex items-center gap-2 label-caps px-5 py-3 border border-jaggery/30 text-jaggery hover:bg-jaggery hover:text-cream transition-colors rounded-full"
          >
            <SlidersHorizontal className="w-4 h-4" strokeWidth={1.5} />
            Filters
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-caramel" />
            )}
          </button>
        </div>

        {/* Mobile drawer */}
        <div className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
          mobileFilterOpen ? 'visible' : 'invisible'
        }`}>
          <div
            className={`absolute inset-0 bg-jaggery/30 transition-opacity duration-300 ${
              mobileFilterOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className={`absolute left-0 top-0 bottom-0 w-[320px] max-w-[85vw] bg-cream shadow-2xl transition-transform duration-300 overflow-y-auto ${
            mobileFilterOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
            <div className="p-7">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-serif text-2xl text-jaggery">Filters</h2>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  aria-label="Close filters"
                  className="text-jaggery/60 hover:text-jaggery transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <SidebarFilters {...sidebarProps} />
            </div>
          </div>
        </div>

        <div className="flex gap-12 lg:gap-16">
          <aside className="hidden lg:block w-[230px] shrink-0">
            <div className="sticky top-32">
              <SidebarFilters {...sidebarProps} />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="mb-8 flex items-center justify-between border-b border-jaggery/15 pb-4">
              <p className="label-caps text-jaggery/55">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'piece' : 'pieces'}
                {activeCategory !== "All" && ` · ${activeCategory}`}
              </p>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-12 sm:gap-x-8 sm:gap-y-16">
                {filteredProducts.map((product, i) => (
                  <FadeUp key={product.slug} delay={i * 0.05} className="h-full">
                    <ShopProductCard product={product} />
                  </FadeUp>
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <p className="font-serif text-2xl text-jaggery/50 mb-3">Nothing matches.</p>
                <p className="text-sm text-jaggery/40 mb-8 font-light">
                  Try clearing a filter or refining your search.
                </p>
                <button
                  onClick={clearAll}
                  className="label-caps px-6 py-3 border border-jaggery text-jaggery hover:bg-jaggery hover:text-cream transition-colors rounded-full"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
