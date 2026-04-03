"use client";

import { openOrderDrawer } from "../layout/OrderDrawer";
import { ArrowRight } from "lucide-react";

export default function OrderButton() {
  return (
    <button
      onClick={() => openOrderDrawer()}
      className="group inline-flex items-center gap-3 px-10 py-4 sm:py-5 bg-[#C17A2A] text-white text-base sm:text-lg font-semibold rounded-full hover:bg-[#A8671F] transition-colors duration-300"
    >
      Place an Order
      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
    </button>
  );
}
