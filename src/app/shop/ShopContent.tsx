"use client";
import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { openOrderDrawer } from '@/components/layout/OrderDrawer';
import data from "@/data/content.json";
import { FadeUp, ZoomIn } from "@/components/Animations";
import { ShoppingBag, SlidersHorizontal, X, Search, ChevronDown } from "lucide-react";

const categories = ["All", ...Array.from(new Set(data.products.map(p => p.category)))];

const sortOptions = [
  { label: "Default", value: "default" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Name: A-Z", value: "name-asc" },
];

const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under Rs. 300", min: 0, max: 299 },
  { label: "Rs. 300 - Rs. 500", min: 300, max: 500 },
  { label: "Above Rs. 500", min: 501, max: Infinity },
];

function parsePrice(price: string): number {
  return parseInt(price.replace(/[^0-9]/g, ''), 10) || 0;
}

// Sidebar content shared between desktop and mobile
function SidebarFilters({
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  activePriceRange,
  setActivePriceRange,
  sortBy,
  setSortBy,
  hasActiveFilters,
  clearAll,
  productCounts,
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
    <div className="flex flex-col gap-7">
      {/* Search */}
      <div>
        <h3 className="font-poppins font-semibold text-sm uppercase tracking-wider text-[#2C1500]/70 mb-3">Search</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2C1500]/30" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white rounded-xl pl-10 pr-9 py-3 text-sm text-[#2C1500] placeholder:text-[#2C1500]/40 border border-[#2C1500]/10 focus:outline-none focus:border-[#C17A2A]/50 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2C1500]/40 hover:text-[#2C1500] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-poppins font-semibold text-sm uppercase tracking-wider text-[#2C1500]/70 mb-3">Categories</h3>
        <div className="flex flex-col gap-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 text-left ${
                activeCategory === cat
                  ? 'bg-[#C17A2A] text-white'
                  : 'text-[#2C1500]/70 hover:bg-[#C17A2A]/10 hover:text-[#C17A2A]'
              }`}
            >
              <span>{cat}</span>
              <span className={`text-xs ${activeCategory === cat ? 'text-white/70' : 'text-[#2C1500]/40'}`}>
                {productCounts[cat] ?? 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-poppins font-semibold text-sm uppercase tracking-wider text-[#2C1500]/70 mb-3">Price Range</h3>
        <div className="flex flex-col gap-1">
          {priceRanges.map((range, idx) => (
            <button
              key={idx}
              onClick={() => setActivePriceRange(idx)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 text-left ${
                activePriceRange === idx
                  ? 'bg-[#C17A2A] text-white'
                  : 'text-[#2C1500]/70 hover:bg-[#C17A2A]/10 hover:text-[#C17A2A]'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                activePriceRange === idx ? 'border-white' : 'border-[#2C1500]/30'
              }`}>
                {activePriceRange === idx && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort By */}
      <div>
        <h3 className="font-poppins font-semibold text-sm uppercase tracking-wider text-[#2C1500]/70 mb-3">Sort By</h3>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-white rounded-xl px-4 py-3 text-sm text-[#2C1500] border border-[#2C1500]/10 focus:outline-none focus:border-[#C17A2A]/50 transition-colors cursor-pointer appearance-none pr-10"
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2C1500]/40 pointer-events-none" />
        </div>
      </div>

      {/* Clear All */}
      {hasActiveFilters && (
        <button
          onClick={clearAll}
          className="w-full py-3 rounded-xl text-sm font-semibold text-red-500 bg-red-50 hover:bg-red-100 transition-all duration-300"
        >
          Clear All Filters
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

  // Lock body scroll when mobile filter is open
  useEffect(() => {
    if (mobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileFilterOpen]);

  // Product counts per category
  const productCounts = useMemo(() => {
    const counts: Record<string, number> = { All: data.products.length };
    data.products.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, []);

  const filteredProducts = useMemo(() => {
    let products = [...data.products];

    if (activeCategory !== "All") {
      products = products.filter(p => p.category === activeCategory);
    }

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
      case "price-asc":
        products.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
        break;
      case "price-desc":
        products.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
        break;
      case "name-asc":
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return products;
  }, [activeCategory, activePriceRange, sortBy, searchQuery]);

  const hasActiveFilters = activeCategory !== "All" || searchQuery.trim() !== "" || sortBy !== "default" || activePriceRange !== 0;

  const clearAll = () => {
    setActiveCategory("All");
    setSearchQuery("");
    setSortBy("default");
    setActivePriceRange(0);
  };

  const sidebarProps = {
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    activePriceRange,
    setActivePriceRange,
    sortBy,
    setSortBy,
    hasActiveFilters,
    clearAll,
    productCounts,
  };

  return (
    <section className="py-12 sm:py-16 px-6 sm:px-10 bg-white min-h-screen">
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <FadeUp>
          <p className="text-sm sm:text-base font-semibold tracking-[0.2em] uppercase text-[#C17A2A] mb-8 sm:mb-12 text-center">
            Our Collection
          </p>
        </FadeUp>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#FBF4E8] text-sm font-semibold text-[#2C1500] hover:bg-[#F5E9DA] transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="w-5 h-5 rounded-full bg-[#C17A2A] text-white text-xs flex items-center justify-center">
                !
              </span>
            )}
          </button>
        </div>

        {/* Mobile Filter Drawer (overlay) */}
        <div
          className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
            mobileFilterOpen ? 'visible' : 'invisible'
          }`}
        >
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
              mobileFilterOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => setMobileFilterOpen(false)}
          />
          {/* Drawer */}
          <div
            className={`absolute left-0 top-0 bottom-0 w-[300px] max-w-[85vw] bg-[#FBF4E8] shadow-2xl transition-transform duration-300 overflow-y-auto ${
              mobileFilterOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-poppins font-bold text-lg text-[#2C1500]">Filters</h2>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#2C1500]/60 hover:text-[#2C1500] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <SidebarFilters {...sidebarProps} />
            </div>
          </div>
        </div>

        {/* Main layout: Sidebar + Grid */}
        <div className="flex gap-8 lg:gap-10">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-[260px] shrink-0">
            <div className="fixed top-28 w-[260px] max-h-[calc(100vh-8rem)] overflow-y-auto bg-[#FBF4E8] rounded-2xl p-6">
              <h2 className="font-poppins font-bold text-lg text-[#2C1500] mb-6">Filters</h2>
              <SidebarFilters {...sidebarProps} />
            </div>
          </aside>

          {/* Products Area */}
          <div className="flex-1 min-w-0">
            {/* Results count */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-[#2C1500]/50">
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                {activeCategory !== "All" && ` in ${activeCategory}`}
              </p>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-8">
                {filteredProducts.map((product, i) => (
                  <ZoomIn key={product.slug} delay={i * 0.05} className="h-full">
                    <article className="group flex flex-col h-full bg-[#FBF4E8] rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-500">
                      <Link href={`/products/${product.slug}`} className="block">
                        <div className="relative aspect-square w-full overflow-hidden bg-[#F5E9DA]">
                          <Image
                            src={product.image}
                            alt={`${product.name} — ${product.weight} of pure natural jaggery`}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 text-[10px] sm:text-xs font-semibold tracking-wide text-[#C17A2A] bg-white/90 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1.5 rounded-full">
                            {product.category}
                          </span>
                        </div>
                      </Link>
                      <div className="flex flex-col flex-grow p-4 sm:p-6">
                        <Link href={`/products/${product.slug}`} className="block">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1.5 sm:gap-2 mb-2">
                            <h3 className="font-poppins text-base sm:text-xl font-semibold text-[#2C1500] group-hover:text-[#C17A2A] transition-colors leading-tight line-clamp-1 sm:line-clamp-none">
                              {product.name}
                            </h3>
                            <span className="text-[10px] sm:text-xs font-semibold tracking-wide text-[#C17A2A] bg-[#C17A2A]/10 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shrink-0 self-start sm:self-auto">
                              {product.weight}
                            </span>
                          </div>
                          <p className="text-[#2C1500]/55 text-xs sm:text-base leading-relaxed mb-4 sm:mb-5 flex-grow line-clamp-2 sm:line-clamp-none">
                            {product.description}
                          </p>
                        </Link>
                        <div className="flex items-center justify-between mt-auto pt-3 sm:pt-4 border-t border-[#2C1500]/10">
                          <p className="font-poppins text-base sm:text-xl font-bold text-[#2C1500]">
                            {product.price}
                          </p>
                          <button
                            onClick={() => openOrderDrawer(product.name)}
                            className="inline-flex items-center min-w-0 flex-shrink-0 gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-white bg-[#C17A2A] px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-full hover:bg-[#A8671F] transition-colors"
                          >
                            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" strokeWidth={2} />
                            <span>Add</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  </ZoomIn>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-xl text-[#2C1500]/40 font-medium">No products found</p>
                <p className="text-sm text-[#2C1500]/30 mt-2">Try adjusting your filters or search query.</p>
                <button
                  onClick={clearAll}
                  className="mt-6 px-6 py-2.5 rounded-full text-sm font-semibold text-[#C17A2A] bg-[#C17A2A]/10 hover:bg-[#C17A2A]/20 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
