import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Youtube, Mail } from "lucide-react";

// lucide-react has no brand TikTok glyph, so we use a filled inline SVG that
// matches the size/colour API of the lucide icons used alongside it.
function TikTok(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

type SocialIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const SOCIAL: { icon: SocialIcon; href: string; label: string }[] = [
  { icon: Facebook, href: "https://facebook.com/sakharsansar", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com/sakharsansar", label: "Instagram" },
  { icon: TikTok, href: "https://tiktok.com/@sakharsansar", label: "TikTok" },
  { icon: Youtube, href: "https://youtube.com/@sakharsansar", label: "YouTube" },
  { icon: Mail, href: "mailto:sakharsansar@gmail.com", label: "Email" },
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
      { label: "Contact Us", href: "/contact" },
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
    <footer id="contact" className="bg-peach text-jaggery scroll-mt-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pt-16 sm:pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-12 gap-x-8">
          {/* ─── Brand + social + address ─────────────── */}
          <div className="md:col-span-6">
            <Link href="/" aria-label="SakharSansar — home" className="inline-flex items-center gap-3.5">
              <span className="relative block h-12 w-12 rounded-full overflow-hidden border-2 border-jaggery/10">
                <Image src="/logo-mark.webp" alt="" fill sizes="48px" className="object-cover scale-[1.02]" />
              </span>
              <span className="relative block h-8 w-[150px] sm:h-9 sm:w-[180px]">
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
          <div className="md:col-span-6 grid grid-cols-3 gap-x-5 sm:gap-x-6 gap-y-10">
            {COLUMNS.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h4 className="font-marker uppercase text-jaggery text-lg sm:text-xl mb-5 sm:mb-6">{col.title}</h4>
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
