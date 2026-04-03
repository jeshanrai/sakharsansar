"use client";

import React from 'react';
import { ArrowRight } from "lucide-react";
import { openOrderDrawer } from "@/components/layout/OrderDrawer";

export default function ProductActions({ productName }: { productName: string }) {
  return (
    <button
      onClick={() => openOrderDrawer(productName)}
      className="group w-full sm:w-auto inline-flex items-center justify-center gap-4 px-12 py-5 bg-black text-white text-[11px] font-semibold tracking-[0.2em] uppercase hover:bg-black/85 transition-colors"
    >
      Order Now
      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
    </button>
  );
}
