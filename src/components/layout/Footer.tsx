import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { BLOG_ENABLED } from "@/lib/blog";
import { SITE, STORY } from "@/lib/site";
import { SOCIAL_LINKS } from "@/components/ui/SocialLinks";

const SOCIAL = [
  ...SOCIAL_LINKS,
  { icon: Mail, href: `mailto:${SITE.email}`, label: "Email" },
];

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Explore",
    links: [
      { label: "Shop", href: "/shop" },
      { label: "Wholesale", href: "/wholesale" },
      { label: "Our Story", href: "/our-story" },
      ...(BLOG_ENABLED ? [{ label: "Blogs", href: "/blog" }] : []),
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
      // The footer links to every route on the site and appears on every page,
      // so with prefetching on, each page pulled the RSC payload for the whole
      // site into the background — ~164 KB of Fetch on /shop, against a 1.1 MB
      // page. These are a site map, not a next step: nobody's journey depends
      // on the privacy policy being warm. The nav and the product cards keep
      // their prefetch, because those are the links people actually take.
      <Link href={href} prefetch={false} className={classes}>
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
            <Link href="/" aria-label="SakharSansar home" className="inline-flex items-center gap-3.5">
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
                SakharSansar: wood-fired Himalayan jaggery, founded in {STORY.founded} by
                Rashmita Bhandari and made with {STORY.households} farming families in{" "}
                {SITE.origin.locality}, {SITE.origin.region}, Nepal.
              </p>
              <p>
                Chemical-free, and made the way those families have made it for{" "}
                {STORY.generations} generations.
              </p>

              {/* Reach us — the two details people look for in a footer */}
              <address className="not-italic space-y-2.5 pt-1">
                <a
                  href={`tel:${SITE.phone.replace(/[^+\d]/g, "")}`}
                  className="flex items-center gap-2.5 hover:text-grove transition-colors"
                >
                  <Phone className="w-4 h-4 shrink-0" strokeWidth={1.7} aria-hidden />
                  {SITE.phone}
                </a>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(
                    `${SITE.address.street} ${SITE.address.locality} Nepal`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 hover:text-grove transition-colors"
                >
                  <MapPin className="w-4 h-4 shrink-0" strokeWidth={1.7} aria-hidden />
                  {SITE.address.street}, {SITE.address.locality}, Nepal
                </a>
              </address>
            </div>
          </div>

          {/* ─── Link columns ─────────────────────────── */}
          <div className="md:col-span-6 grid grid-cols-3 gap-x-5 sm:gap-x-6 gap-y-10">
            {COLUMNS.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                {/* h2, not h4. The footer renders after main content on every page, so
                    on any page whose last heading is an h2 this skipped a level —
                    axe reports it as heading-order, and a screen-reader user
                    navigating by heading loses the footer's structure. The size
                    is set by the classes, not by the tag. */}
                <h2 className="font-marker uppercase text-jaggery text-lg sm:text-xl mb-5 sm:mb-6">{col.title}</h2>
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
          <p className="text-[13px] text-jaggery/70">
            © {new Date().getFullYear()} SakharSansar · Crafted in the Himalayas.
          </p>
          <p className="text-[13px] text-jaggery/70">
            {SITE.address.street}, {SITE.address.locality} · Made in {SITE.origin.locality} · Nepal
          </p>
        </div>
      </div>
    </footer>
  );
}
