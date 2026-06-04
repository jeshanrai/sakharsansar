"use client";

import React from 'react';
import { ArrowRight, Heart } from "lucide-react";
import { openOrderDrawer } from "@/components/layout/OrderDrawer";
import { useIsFavourite, toggleFavourite } from "@/lib/favourites";

export default function ProductActions({
  productName,
  slug,
}: {
  productName: string;
  slug: string;
}) {
  const favourited = useIsFavourite(slug);

  return (
    <div className="flex items-stretch gap-3">
      <button
        onClick={() => openOrderDrawer(productName)}
        className="group flex-1 inline-flex items-center justify-center gap-3 px-8 py-5 bg-jaggery text-cream label-caps hover:bg-jaggery-soft transition-colors rounded-full"
      >
        Add to Order
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
      </button>

      <button
        type="button"
        onClick={() => toggleFavourite(slug)}
        aria-pressed={favourited}
        aria-label={favourited ? `Remove ${productName} from favourites` : `Save ${productName} to favourites`}
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
