"use client";

import React from 'react';
import { ArrowRight } from "lucide-react";
import { openOrderDrawer } from "@/components/layout/OrderDrawer";

export default function ProductActions({ productName }: { productName: string }) {
  return (
    <button
      onClick={() => openOrderDrawer(productName)}
      className="group w-full inline-flex items-center justify-center gap-3 px-8 py-5 bg-jaggery text-cream label-caps hover:bg-jaggery-soft transition-colors rounded-full"
    >
      Add to Order
      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
    </button>
  );
}
