import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Mail, MapPin } from "lucide-react";

const NAV = [
  { label: "Shop", href: "/shop" },
  { label: "Our Story", href: "/our-story" },
  { label: "Journal", href: "/blog" },
];

const POLICY = [
  { label: "Privacy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms" },
  { label: "Shipping", href: "/shipping-policy" },
  { label: "Refunds", href: "/refund-policy" },
];

const SOCIAL = [
  {
    icon: Instagram,
    href: "https://instagram.com/sakharsansar",
    label: "Instagram",
  },
  {
    icon: Facebook,
    href: "https://facebook.com/sakharsansar",
    label: "Facebook",
  },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-cream paper-grain">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pt-16 pb-8">
        {/* ─── Top row ─────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 pb-12 border-b border-cream/10">
          {/* Brand */}
          <div className="md:col-span-2 max-w-md">
            <Link href="/" aria-label="SakharSansar — home" className="inline-block">
              <div className="relative h-10 w-[170px] brightness-0 invert">
                <Image
                  src="/word-logo.svg"
                  alt="SakharSansar"
                  fill
                  sizes="170px"
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <p className="mt-5 text-cream/65 text-sm leading-relaxed max-w-sm">
              100% organic Sakhar — wood-fired Himalayan jaggery from
              Sankhuwasabha. Pure, chemical-free, and direct from farmers.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-cream/65 text-[13px]">
              <a
                href="mailto:hello@sakharsansar.com"
                className="flex items-center gap-2 hover:text-honey transition-colors"
              >
                <Mail className="w-3.5 h-3.5" strokeWidth={1.6} />
                hello@sakharsansar.com
              </a>
              <span className="text-cream/20" aria-hidden>·</span>
              <span className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" strokeWidth={1.6} />
                Sankhuwasabha, Nepal
              </span>
            </div>
          </div>

          {/* Nav + Social */}
          <div>
            <h4 className="label-caps text-cream/40 mb-4">Explore</h4>
            <ul className="space-y-2.5">
              {NAV.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-cream/80 hover:text-honey transition-colors text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-center gap-2">
              {SOCIAL.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-cream/15 flex items-center justify-center text-cream/70 hover:text-ink hover:bg-honey hover:border-honey transition-all duration-300"
                >
                  <Icon className="w-3.5 h-3.5" strokeWidth={1.6} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Bottom bar ──────────────────────────── */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-xs text-cream/40">
            © {new Date().getFullYear()} SakharSansar — Crafted in the Himalayas.
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-cream/55">
            {POLICY.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="hover:text-honey transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
