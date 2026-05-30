"use client";

import { usePathname } from "next/navigation";
import { Tag, Truck, Sparkles, Flame } from "lucide-react";

type Msg = {
  icon: typeof Tag;
  text: string;
  highlight?: string;
};

const MESSAGES: Msg[] = [
  { icon: Tag, text: "Flat 10% off on pure sakhar above Rs. 1,500 — code", highlight: "SAKHAR10" },
  { icon: Sparkles, text: "100% organic sakhar · No chemicals · Direct from farmers" },
  { icon: Truck, text: "Free shipping pan-Nepal on orders above Rs. 2,000" },
  { icon: Flame, text: "Wood-fired sakhar from Sankhuwasabha · Shipped within 24h" },
];

export default function PromoBar() {
  const pathname = usePathname();
  // Don't show on admin/portfolio internal pages
  if (pathname?.startsWith("/portfolio")) return null;

  // Render the message set twice to enable seamless marquee loop
  const renderSet = (key: string | number) => (
    <div key={key} className="flex items-center shrink-0">
      {MESSAGES.map((msg, i) => (
        <div key={i} className="flex items-center gap-2.5 px-7">
          <msg.icon className="w-3.5 h-3.5 text-honey shrink-0" strokeWidth={1.75} />
          <span className="text-[12px] font-medium tracking-wide">
            {msg.text}
            {msg.highlight && (
              <>
                {" "}
                <span className="inline-flex items-baseline gap-0.5">
                  <span className="text-cream/40">&ldquo;</span>
                  <span className="font-display font-bold text-honey tracking-tight">
                    {msg.highlight}
                  </span>
                  <span className="text-cream/40">&rdquo;</span>
                </span>
              </>
            )}
          </span>
          <span className="text-honey/45 select-none" aria-hidden>✦</span>
        </div>
      ))}
    </div>
  );

  return (
    <div
      role="region"
      aria-label="Promotional offers"
      className="fixed top-0 inset-x-0 z-[60] h-9 bg-jaggery text-cream overflow-hidden border-b border-honey/15"
    >
      <div className="relative h-full flex items-center overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap will-change-transform">
          {renderSet("a")}
          {renderSet("b")}
        </div>
      </div>
      {/* Edge fades for soft entry/exit */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-jaggery to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-jaggery to-transparent"
      />
    </div>
  );
}
