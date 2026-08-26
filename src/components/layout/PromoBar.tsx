"use client";

import { usePathname } from "next/navigation";
import { Tag, Truck, Sparkles, Flame } from "lucide-react";
import { COMMERCE } from "@/lib/site";
import { localeFromPath, t } from "@/lib/i18n";
import type { Locale } from "@/lib/hreflang";

type Msg = {
  icon: typeof Tag;
  text: string;
  highlight?: string;
};

/**
 * The four promo lines, in the language of the page they sit above.
 *
 * The discount code itself is not translated — "SAKHAR10" is what the customer
 * types at checkout, and a translated coupon code is a coupon code that does
 * not work. Same reasoning as leaving "WhatsApp" alone.
 */
function messages(locale: Locale): Msg[] {
  const m = t(locale);
  return [
    { icon: Tag, text: m.promoDiscount, highlight: COMMERCE.discountCode },
    { icon: Sparkles, text: m.promoOrganic },
    { icon: Truck, text: m.promoShipping },
    { icon: Flame, text: m.promoWoodFired },
  ];
}

export default function PromoBar() {
  const pathname = usePathname();
  // Don't show on admin/portfolio internal pages
  if (pathname?.startsWith("/portfolio")) return null;

  // The bar is rendered by the root layout, which has no locale of its own —
  // but this is a client component, and the path is enough. It resolves during
  // the static prerender too, so the Nepali copy is in the served HTML rather
  // than swapped in after hydration.
  const MESSAGES = messages(localeFromPath(pathname));

  // Rendered twice so the -50% marquee slide loops seamlessly. Only the first
  // copy is content: the second is the same four strings again, and without
  // `aria-hidden` a screen reader read the whole promo bar twice before
  // reaching the page, while crawlers saw ~60 words of duplicated boilerplate
  // ahead of the real content on every URL.
  const renderSet = (key: string | number, duplicate = false) => (
    <div key={key} className="flex items-center shrink-0" aria-hidden={duplicate || undefined}>
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
          {renderSet("b", true)}
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
