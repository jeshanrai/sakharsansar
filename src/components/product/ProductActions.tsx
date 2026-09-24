"use client";

import React from 'react';
import { ArrowRight, Heart } from "lucide-react";
import { openOrderDrawer } from "@/components/layout/OrderDrawer";
import { useIsFavourite, toggleFavourite } from "@/lib/favourites";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/hreflang";

export default function ProductActions({
  productName,
  slug,
  locale = "en",
}: {
  productName: string;
  slug: string;
  /** Labels only. `productName` stays English: the drawer keys on it. */
  locale?: Locale;
}) {
  const favourited = useIsFavourite(slug);
  const m = t(locale);

  return (
    <div className="flex items-stretch gap-3">
      <button
        onClick={() => openOrderDrawer(productName)}
        className="group flex-1 inline-flex items-center justify-center gap-3 px-8 py-5 bg-jaggery text-cream label-caps hover:bg-jaggery-soft transition-colors rounded-full"
      >
        {m.buyAddToOrder}
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
      </button>

      <button
        type="button"
        onClick={() => toggleFavourite(slug)}
        aria-pressed={favourited}
        aria-label={`${favourited ? m.buyRemoveFav : m.buySaveFav}: ${productName}`}
        className={`shrink-0 inline-flex items-center justify-center w-[60px] rounded-full border transition-colors ${
          favourited
            ? "bg-terracotta/10 border-terracotta text-terracotta"
            : "border-jaggery/20 text-jaggery hover:border-terracotta hover:text-terracotta"
        }`}
      >
        <Heart className={`w-5 h-5 ${favourited ? "fill-current" : ""}`} strokeWidth={1.5} />
      </button>
    </div>
  );
}
