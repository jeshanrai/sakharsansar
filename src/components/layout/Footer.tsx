import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Youtube, Mail } from "lucide-react";

const SOCIAL = [
  { icon: Facebook, href: "https://facebook.com/sakharsansar", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com/sakharsansar", label: "Instagram" },
  { icon: Youtube, href: "https://youtube.com/@sakharsansar", label: "YouTube" },
  { icon: Mail, href: "mailto:hello@sakharsansar.com", label: "Email" },
];

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Explore",
    links: [
      { label: "Shop", href: "/shop" },
      { label: "Our Story", href: "/our-story" },
      { label: "Blogs", href: "/blog" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Contact Us", href: "mailto:hello@sakharsansar.com" },
      { label: "Shipping Policy", href: "/shipping-policy" },
      { label: "Refund Policy", href: "/refund-policy" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

function FooterLink({ href, label }: { href: string; label: string }) {
  const classes = "text-jaggery/70 hover:text-grove transition-colors text-[15px]";
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={classes}>
        {label}
      </Link>
    );
  }
  return (
    <a href={href} className={classes}>
      {label}
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="bg-peach text-jaggery">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pt-16 sm:pt-20 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-y-12 gap-x-8">
          {/* ─── Brand + social + address ─────────────── */}
          <div className="col-span-2 md:col-span-6">
            <Link href="/" aria-label="SakharSansar — home" className="inline-flex items-center gap-3.5">
              <span className="relative block h-12 w-12 rounded-full overflow-hidden border-2 border-jaggery/10">
                <Image src="/logo-mark.webp" alt="" fill sizes="48px" className="object-cover scale-[1.02]" />
              </span>
              <span className="relative block h-9 w-[180px]">
                <Image src="/word-logo.svg" alt="SakharSansar" fill sizes="180px" className="object-contain object-left" />
              </span>
            </Link>

            {/* Social row — dark filled circles */}
            <div className="mt-7 flex items-center gap-3">
              {SOCIAL.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  className="w-12 h-12 rounded-full bg-jaggery text-cream flex items-center justify-center hover:bg-grove transition-colors"
                >
                  <Icon className="w-5 h-5" strokeWidth={1.7} />
                </a>
              ))}
            </div>

            {/* Address */}
            <div className="mt-9 space-y-4 text-[15px] leading-relaxed text-jaggery/70 max-w-sm">
              <p>
                SakharSansar — wood-fired Himalayan jaggery, made by a cooperative of
                42 farming families in Sankhuwasabha, Koshi Province, Nepal.
              </p>
              <p>100% organic &amp; chemical-free. Direct from farmers, since seven generations.</p>
            </div>
          </div>

          {/* ─── Link columns ─────────────────────────── */}
          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title} className="col-span-1 md:col-span-2">
              <h4 className="font-marker uppercase text-jaggery text-xl mb-6">{col.title}</h4>
              <ul className="space-y-4">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <FooterLink href={link.href} label={link.label} />
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* ─── Bottom bar ───────────────────────────── */}
        <div className="mt-14 pt-6 border-t border-jaggery/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <p className="text-[13px] text-jaggery/55">
            © {new Date().getFullYear()} SakharSansar — Crafted in the Himalayas.
          </p>
          <p className="text-[13px] text-jaggery/55">Sankhuwasabha · Koshi Province · Nepal</p>
        </div>
      </div>
    </footer>
  );
}
