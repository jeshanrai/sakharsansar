"use client";

import { memo, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Plus, Heart, X, ChevronRight, ArrowRight, Sparkles } from "lucide-react";
import data from "@/data/content.json";
import { useFavourites, useIsFavourite, toggleFavourite, clearFavourites } from "@/lib/favourites";
import { openOrderDrawer } from "@/components/layout/OrderDrawer";

type Product = (typeof data.products)[number];

const CARD_BG = "bg-[#2D9577] bg-[url('/hero-cane-bg.jpg')] bg-cover bg-center";

function ratingFor(slug: string) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) & 0xffff;
  const rating = (4.5 + (h % 5) / 10).toFixed(1);
  const count = 120 + (h % 400);
  return { rating, count };
}

export default function FavouritesContent() {
  const favourites = useFavourites();

  // Resolve slugs → products, preserving the store's most-recent-first order.
  const products = useMemo(() => {
    const bySlug = new Map(data.products.map((p) => [p.slug, p]));
    return favourites
      .map((slug) => bySlug.get(slug))
      .filter((p): p is Product => Boolean(p));
  }, [favourites]);

  const count = products.length;

  return (
    <section className="relative bg-cream pt-28 sm:pt-36 pb-20 sm:pb-28 px-5 sm:px-8 lg:px-12 min-h-[70vh] overflow-hidden">
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
            <li className="text-jaggery font-semibold">Favourites</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-10 sm:mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-6 h-px bg-caramel" />
              <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-caramel">
                Saved for later
              </span>
            </div>
            <h1 className="font-display font-bold text-jaggery tracking-tight text-balance leading-[0.95] text-[clamp(2.5rem,6vw,4.5rem)]">
              Your <span className="font-serif italic font-normal text-caramel-deep">favourites</span>.
            </h1>
            {count > 0 && (
              <p className="mt-4 text-[13px] font-bold tracking-[0.18em] uppercase text-jaggery/55">
                {count} {count === 1 ? "item" : "items"} saved
              </p>
            )}
          </div>

          {count > 0 && (
            <button
              onClick={clearFavourites}
              className="self-start sm:self-auto inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.15em] uppercase text-terracotta hover:text-jaggery transition-colors"
            >
              <X className="w-3.5 h-3.5" strokeWidth={2} />
              Clear all
            </button>
          )}
        </div>

        {count > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-7"
          >
            <AnimatePresence mode="popLayout">
              {products.map((product, i) => (
                <FavouriteCard key={product.slug} product={product} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <EmptyState />
        )}
      </div>
    </section>
  );
}

/* ─── Favourite card ─── */
const FavouriteCard = memo(function FavouriteCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const { rating, count } = ratingFor(product.slug);
  const favourited = useIsFavourite(product.slug);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92 }}
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
          {/* Toggle favourite */}
          <button
            type="button"
            onClick={() => toggleFavourite(product.slug)}
            aria-label={favourited ? `Remove ${product.name} from favourites` : `Add ${product.name} to favourites`}
            className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-cream/90 backdrop-blur-sm flex items-center justify-center transition-colors ${
              favourited ? "text-terracotta hover:bg-terracotta hover:text-cream" : "text-jaggery/45 hover:text-terracotta"
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${favourited ? "fill-current" : ""}`} strokeWidth={1.75} />
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

          {/* Add to bag → opens order drawer pre-filled */}
          <button
            type="button"
            onClick={() => openOrderDrawer(product.name)}
            aria-label={`Add ${product.name} to bag`}
            className="absolute inset-x-3 bottom-3 z-10 h-10 rounded-full bg-jaggery text-cream label-caps text-[10px] flex items-center justify-center gap-1.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={2} />
            Add to bag
          </button>
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
        </div>
      </div>
    </motion.article>
  );
});

/* ─── Empty state → explore products ─── */
function EmptyState() {
  const picks = data.products.slice(0, 4);

  return (
    <div className="py-10 sm:py-16">
      <div className="text-center max-w-md mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-honey/15 mb-6">
          <Heart className="w-7 h-7 text-caramel-deep" strokeWidth={1.5} />
        </div>
        <p className="font-display font-bold text-jaggery text-[clamp(1.75rem,3.5vw,2.75rem)] tracking-tight leading-tight">
          No favourites yet.
        </p>
        <p className="text-[14px] text-jaggery/55 mt-3 leading-relaxed">
          Tap the <Heart className="inline w-3.5 h-3.5 -mt-0.5 text-terracotta" strokeWidth={2} /> heart on any
          sakhar to save it here. In the meantime, explore our pure forms.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-flex items-center gap-2 h-12 px-7 rounded-full bg-jaggery text-cream text-[12.5px] font-semibold tracking-tight hover:bg-jaggery-soft hover:-translate-y-px transition-all duration-300 shadow-[0_8px_24px_rgba(26,20,16,0.15)]"
        >
          Explore products
          <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
        </Link>
      </div>

      {/* A taste of the collection */}
      <div className="mt-16 sm:mt-20">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <Sparkles className="w-4 h-4 text-caramel" strokeWidth={1.5} />
          <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-caramel">
            You might love
          </span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-7">
          {picks.map((product, i) => (
            <FavouriteCard key={product.slug} product={product} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
