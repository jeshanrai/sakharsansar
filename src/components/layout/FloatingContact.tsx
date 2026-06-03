"use client";

import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";

/**
 * Floating WhatsApp + Call buttons, bottom-right on every public page.
 *
 * ⚠️ Replace PHONE with the real number in international format, digits only
 *    (country code + number, no "+" or spaces). Nepal example: 97798XXXXXXXX.
 */
const PHONE = "9779860149199";
const WA_MESSAGE =
  "Hi SakharSansar! I'd like to know more about your jaggery.";

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.358.101 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.582 0 11.94-5.358 11.944-11.893a11.821 11.821 0 00-3.42-8.452z" />
    </svg>
  );
}

export default function FloatingContact() {
  const pathname = usePathname();
  // Hide on the admin portal
  if (pathname?.startsWith("/portfolio")) return null;

  const waHref = `https://wa.me/${PHONE}?text=${encodeURIComponent(WA_MESSAGE)}`;
  const telHref = `tel:+${PHONE}`;

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-3">
      {/* Call */}
      <a
        href={telHref}
        aria-label="Call SakharSansar"
        title="Call us"
        className="group h-12 w-12 sm:h-13 sm:w-13 inline-flex items-center justify-center rounded-full bg-jaggery text-cream shadow-lg shadow-jaggery/30 hover:bg-grove hover:-translate-y-0.5 transition-all duration-300"
      >
        <Phone className="h-5 w-5 sm:h-[22px] sm:w-[22px]" strokeWidth={1.8} />
      </a>

      {/* WhatsApp */}
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        title="Chat on WhatsApp"
        className="group relative h-14 w-14 sm:h-15 sm:w-15 inline-flex items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-[#25D366]/30 hover:-translate-y-0.5 transition-transform duration-300"
      >
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 motion-safe:animate-ping"
        />
        <WhatsAppIcon className="relative h-7 w-7 sm:h-8 sm:w-8" />
      </a>
    </div>
  );
}
