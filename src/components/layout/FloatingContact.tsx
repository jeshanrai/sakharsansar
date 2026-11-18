"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, Phone, X } from "lucide-react";
import { SITE } from "@/lib/site";
import { localeFromPath } from "@/lib/i18n";

/**
 * One floating contact button, bottom-right on every public page, that opens
 * a two-item menu: WhatsApp, Call.
 *
 * It replaced a stacked pair of round buttons (Call above WhatsApp) that took
 * 116px of a phone screen and sat on top of whatever scrolled under them —
 * the product description, the Add to cart button, the article byline.
 *
 * It never covers the things a visitor came to act on. Anything matching
 * AVOID — every price (they all carry `nums-price`) and anything marked
 * `data-fab-avoid` (Add to cart, Place an Order, the article author line) —
 * makes the button step aside while it passes underneath, and come back once
 * it has gone by. The footer carries enough bottom padding that the last line
 * of every page clears it.
 */
const PHONE = SITE.phoneDigits;
const AVOID = ".nums-price, [data-fab-avoid]";
/** Extra clearance around the button when testing for overlap. */
const GAP = 8;

const LABELS = {
  en: {
    toggle: "Contact SakharSansar",
    close: "Close contact menu",
    whatsapp: "WhatsApp",
    call: "Call us",
    message: "Hi SakharSansar! I'd like to know more about your jaggery.",
  },
  ne: {
    toggle: "सखर संसारलाई सम्पर्क गर्नुहोस्",
    close: "सम्पर्क मेनु बन्द गर्नुहोस्",
    whatsapp: "WhatsApp",
    call: "फोन गर्नुहोस्",
    message: "नमस्ते सखर संसार! मलाई तपाईंको सख्खरबारे थप जान्न मन छ।",
  },
} as const;

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.358.101 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.582 0 11.94-5.358 11.944-11.893a11.821 11.821 0 00-3.42-8.452z" />
    </svg>
  );
}

export default function FloatingContact() {
  const pathname = usePathname();
  // Open is remembered as "open on this path", so navigating closes the menu
  // without an effect resetting it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn !== null && openOn === pathname;
  const close = useCallback(() => setOpenOn(null), []);
  const [hidden, setHidden] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  // The button's resting place. It never moves — the button inside it fades
  // and slides — so its rect is a stable "where the button would be".
  const anchorRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const check = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;
    const a = anchor.getBoundingClientRect();
    const top = a.top - GAP;
    const bottom = a.bottom + GAP;
    const left = a.left - GAP;
    const right = a.right + GAP;
    let overlap = false;
    for (const el of document.querySelectorAll<HTMLElement>(AVOID)) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (r.bottom > top && r.top < bottom && r.right > left && r.left < right) {
        overlap = true;
        break;
      }
    }
    setHidden(overlap);
    if (overlap) setOpenOn(null);
  }, []);

  useEffect(() => {
    let frame = 0;
    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        check();
      });
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // Content that grows or shrinks without a scroll (accordions, images
    // loading, the shop filtering its grid) can move a price under the button.
    const ro = new ResizeObserver(schedule);
    ro.observe(document.body);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      ro.disconnect();
    };
  }, [check, pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open, close]);

  // Hide on the admin portal
  if (pathname?.startsWith("/portfolio")) return null;

  const L = LABELS[localeFromPath(pathname)];
  const waHref = `https://wa.me/${PHONE}?text=${encodeURIComponent(L.message)}`;
  const telHref = `tel:+${PHONE}`;

  const itemBase =
    "inline-flex items-center gap-2.5 h-12 pl-3.5 pr-5 rounded-full shadow-lg text-[15px] font-semibold transition-colors";

  return (
    <div
      ref={rootRef}
      className="fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] sm:right-6 sm:bottom-6 z-40 flex flex-col items-end gap-3 pointer-events-none"
    >
      {/* Menu */}
      <ul
        id={menuId}
        className={`flex flex-col items-end gap-2.5 transition-[opacity,transform,visibility] duration-200 ${
          open && !hidden
            ? "opacity-100 translate-y-0 visible pointer-events-auto"
            : "opacity-0 translate-y-2 invisible"
        }`}
      >
        <li>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
            className={`${itemBase} bg-[#25D366] text-white shadow-[#25D366]/30 hover:bg-[#1FB955]`}
          >
            <WhatsAppIcon className="h-6 w-6" />
            {L.whatsapp}
          </a>
        </li>
        <li>
          <a
            href={telHref}
            onClick={close}
            className={`${itemBase} bg-jaggery text-cream shadow-jaggery/30 hover:bg-grove`}
          >
            <Phone className="h-5 w-5 mx-0.5" strokeWidth={1.8} aria-hidden />
            {L.call}
          </a>
        </li>
      </ul>

      {/* Toggle */}
      <div ref={anchorRef} className="h-14 w-14">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? L.close : L.toggle}
          tabIndex={hidden ? -1 : 0}
          onClick={() => setOpenOn(open ? null : pathname)}
          className={`h-14 w-14 inline-flex items-center justify-center rounded-full shadow-xl transition-[opacity,transform,visibility,background-color] duration-300 ${
            open ? "bg-jaggery text-cream" : "bg-[#25D366] text-white shadow-[#25D366]/30"
          } ${hidden ? "opacity-0 translate-x-20 invisible" : "opacity-100 translate-x-0 visible pointer-events-auto"}`}
        >
          {open ? (
            <X className="h-6 w-6" strokeWidth={2} aria-hidden />
          ) : (
            <MessageCircle className="h-7 w-7" strokeWidth={1.8} aria-hidden />
          )}
        </button>
      </div>
    </div>
  );
}
