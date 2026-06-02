"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ArrowUpRight } from "lucide-react";

type Post = {
  slug: string;
  title: string;
  description: string;
  image: string;
  date: string;
  tags: string[];
};

/**
 * "Blog Categories" — peach band with marker heading, filter pills, a search
 * box and a filtered card grid, matching the reference blog index.
 */
export default function BlogCategories({
  posts,
  categories,
}: {
  posts: Post[];
  categories: string[];
}) {
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");

  const filters = ["All", ...categories];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      const inCat = active === "All" || p.tags.includes(active);
      const inQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return inCat && inQuery;
    });
  }, [posts, active, query]);

  return (
    <section
      aria-label="Blog categories"
      className="relative bg-peach px-6 sm:px-10 lg:px-16 py-16 sm:py-24 overflow-hidden"
    >
      <div className="max-w-[1280px] mx-auto">
        <h2 className="font-marker uppercase text-jaggery text-center leading-[0.95] text-[clamp(2rem,5vw,3.5rem)] mb-12 sm:mb-16">
          Blog categories
        </h2>

        {/* Filters + search */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-12 sm:mb-16">
          <div className="flex flex-wrap gap-3">
            {filters.map((cat) => {
              const on = active === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActive(cat)}
                  aria-pressed={on}
                  className={`label-caps rounded-full px-5 py-2.5 border transition-colors ${
                    on
                      ? "bg-grove text-cream border-grove"
                      : "border-jaggery/25 text-jaggery/75 hover:border-jaggery hover:text-jaggery"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="relative lg:w-[340px] shrink-0">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-jaggery/40"
              strokeWidth={1.8}
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search blog posts…"
              aria-label="Search blog posts"
              className="w-full rounded-full border border-jaggery/25 bg-ivory/60 pl-11 pr-4 py-3.5 label-caps text-jaggery placeholder:text-jaggery/40 focus:outline-none focus:border-grove transition-colors"
            />
          </div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filtered.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col h-full rounded-2xl bg-ivory overflow-hidden ring-1 ring-jaggery/8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-jaggery-soft">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col flex-grow px-6 pt-6 pb-7">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="label-caps text-caramel">{post.tags[0]}</span>
                    <span className="w-1 h-1 rounded-full bg-jaggery/30" />
                    <time dateTime={post.date} className="label-caps text-jaggery/45">
                      {post.date}
                    </time>
                  </div>
                  <h3 className="font-display font-bold text-jaggery text-h4 leading-snug tracking-tight mb-3 group-hover:text-grove transition-colors text-balance">
                    {post.title}
                  </h3>
                  <p className="text-jaggery/70 text-body mb-5 flex-grow">{post.description}</p>
                  <span className="inline-flex items-center gap-2 label-caps text-grove group-hover:text-jaggery transition-colors">
                    Read more
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={1.8} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-jaggery/60 text-lede py-16">
            No posts found{query ? ` for “${query}”` : ""}. Try another category.
          </p>
        )}
      </div>
    </section>
  );
}
