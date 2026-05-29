import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone, ArrowUpRight } from "lucide-react";
import data from "@/data/content.json";
import NewsletterForm from "./NewsletterForm";

const socialLinks = [
  { icon: Instagram, href: "https://instagram.com/sakharsansar", label: "Instagram" },
  { icon: Facebook, href: "https://facebook.com/sakharsansar", label: "Facebook" },
];

const shopLinks = [
  { label: "All Jaggery", href: "/shop" },
  { label: "Blocks", href: "/shop" },
  { label: "Powder", href: "/shop" },
  { label: "Liquid", href: "/shop" },
  { label: "Cubes", href: "/shop" },
];

const learnLinks = [
  { label: "Our Story", href: "/our-story" },
  { label: "Journal", href: "/blog" },
  { label: "The Farmers", href: "/our-story" },
  { label: "The Process", href: "/our-story" },
];

const helpLinks = [
  { label: "Shipping", href: "/shipping-policy" },
  { label: "Refunds", href: "/refund-policy" },
  { label: "Privacy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-ink text-cream overflow-hidden paper-grain">
      {/* ─── Editorial top wave divider ────────────── */}
      <div aria-hidden className="absolute inset-x-0 -top-px z-10 leading-[0]">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="block w-full h-12 sm:h-16 text-cream">
          <path
            d="M0,60 C240,0 480,60 720,30 C960,0 1200,60 1440,20 L1440,60 L0,60 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Ambient honey glow */}
      <div aria-hidden className="absolute -top-32 left-1/3 w-[40rem] h-[40rem] rounded-full bg-honey/10 blur-3xl pointer-events-none" />
      <div aria-hidden className="absolute -bottom-20 right-0 w-[32rem] h-[32rem] rounded-full bg-caramel/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-32 sm:pt-44 pb-10">
        {/* ─── Newsletter editorial block ─────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pb-20 sm:pb-24 border-b border-cream/12">
          <div className="lg:col-span-6 xl:col-span-7">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-12 h-px bg-honey/60" />
              <span className="label-caps text-honey">Letters from afar</span>
            </div>
            <h2 className="font-serif font-soft text-cream tracking-[-0.022em] text-balance leading-[1.02]">
              <span className="block text-[clamp(2.25rem,5vw,4.5rem)]">Slow stories from</span>
              <span className="block text-[clamp(2.25rem,5vw,4.5rem)] italic font-light text-honey font-wonk">
                the Himalayas.
              </span>
            </h2>
            <p className="text-cream/70 text-lede mt-7 max-w-lg leading-relaxed text-pretty">
              Harvest dispatches, kitchen recipes, and quiet notes from Sankhuwasabha —
              delivered the way our jaggery is, slowly and with care.
            </p>
            <p className="mt-4 label-caps text-cream/40">
              One letter a season · No noise · Unsubscribe anytime
            </p>
          </div>

          <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-end">
            <NewsletterForm />
          </div>
        </section>

        {/* ─── Brand + columns grid ────────────────── */}
        <section className="grid grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-14 mt-20 sm:mt-24">
          {/* Brand block */}
          <div className="col-span-2 lg:col-span-5">
            <Link href="/" className="inline-flex flex-col mb-7 leading-none group" aria-label="SakharSansar — Home">
              <span className="font-devanagari text-base text-honey mb-2 tracking-[0.04em] group-hover:text-cream transition-colors">
                सखर संसार
              </span>
              <span className="font-serif font-soft text-cream text-[clamp(2rem,3vw,2.75rem)] tracking-[-0.018em] leading-none">
                SakharSansar
              </span>
            </Link>

            <p className="text-cream/75 text-body max-w-md leading-relaxed text-pretty mb-9">
              Wood-fired jaggery, hand-poured beneath open sky in Sankhuwasabha —
              shipped pan-Nepal, made the way it has been for{" "}
              <em className="font-serif text-cream">seven generations</em>.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group relative w-11 h-11 rounded-full border border-cream/15 flex items-center justify-center text-cream/70 hover:text-jaggery hover:bg-honey hover:border-honey transition-all duration-500"
                >
                  <Icon className="w-4 h-4 relative" strokeWidth={1.5} />
                </a>
              ))}
              <a
                href="mailto:hello@sakharsansar.com"
                className="ml-2 flex items-center gap-2 label-caps text-honey hover:text-cream transition-colors duration-500"
              >
                Say hello
                <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.75} />
              </a>
            </div>
          </div>

          {/* Shop column */}
          <FooterColumn title="Shop" items={shopLinks} />

          {/* Learn column */}
          <FooterColumn title="Learn" items={learnLinks} />

          {/* Help column */}
          <FooterColumn title="Help" items={helpLinks} />

          {/* Contact column */}
          <div className="col-span-2 lg:col-span-3 lg:col-start-10">
            <h4 className="label-caps text-cream/40 mb-6">Studio</h4>
            <div className="space-y-5">
              <div className="flex items-start gap-3 text-cream/85">
                <MapPin className="w-4 h-4 text-honey mt-1 shrink-0" strokeWidth={1.5} />
                <div className="leading-relaxed">
                  <p className="font-serif text-cream text-base tracking-tight">Sankhuwasabha</p>
                  <p className="text-meta text-cream/55">Koshi Province, Nepal</p>
                </div>
              </div>
              <a
                href="mailto:hello@sakharsansar.com"
                className="group flex items-center gap-3 text-cream/85 hover:text-cream transition-colors"
              >
                <Mail className="w-4 h-4 text-honey shrink-0 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                <span className="text-body">hello@sakharsansar.com</span>
              </a>
              <a
                href="tel:+977-0000000000"
                className="group flex items-center gap-3 text-cream/85 hover:text-cream transition-colors"
              >
                <Phone className="w-4 h-4 text-honey shrink-0 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                <span className="text-body nums-tabular">+977 0000 000 000</span>
              </a>
            </div>
          </div>
        </section>

        {/* ─── Decorative signature wordmark ─────────── */}
        <div className="mt-24 sm:mt-32 border-t border-cream/10 pt-12">
          <p
            aria-hidden
            className="font-serif font-soft text-cream/8 tracking-[-0.04em] text-[clamp(4rem,18vw,16rem)] leading-[0.85] whitespace-nowrap select-none"
            style={{ letterSpacing: "-0.04em" }}
          >
            SakharSansar
          </p>
        </div>

        {/* ─── Bottom bar ─────────────────────────────── */}
        <div className="mt-12 pt-8 border-t border-cream/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex flex-col gap-1.5">
            <p className="text-meta text-cream/55">
              &copy; {year} {data.brand.name}. Crafted with care in the Himalayas.
            </p>
            <p className="text-[11px] text-cream/30 tracking-wide">
              Set in <span className="font-serif italic">Fraunces</span> &amp; Inter ·
              Brewed in <span className="font-serif italic">Kathmandu</span>
            </p>
          </div>

          <ul className="flex flex-wrap gap-x-6 gap-y-2 label-caps text-cream/55">
            <li>
              <Link href="/privacy-policy" className="hover:text-honey transition-colors">
                Privacy
              </Link>
            </li>
            <li className="text-cream/20" aria-hidden>·</li>
            <li>
              <Link href="/terms" className="hover:text-honey transition-colors">
                Terms
              </Link>
            </li>
            <li className="text-cream/20" aria-hidden>·</li>
            <li>
              <Link href="/shipping-policy" className="hover:text-honey transition-colors">
                Shipping
              </Link>
            </li>
            <li className="text-cream/20" aria-hidden>·</li>
            <li>
              <Link href="/refund-policy" className="hover:text-honey transition-colors">
                Refund
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

/* ─── Column primitive ─── */
function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div className="col-span-1 lg:col-span-2">
      <h4 className="label-caps text-cream/40 mb-6">{title}</h4>
      <ul className="space-y-3.5">
        {items.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="group relative inline-flex items-center text-cream/80 hover:text-cream transition-colors duration-300 text-body"
            >
              <span className="relative">
                {item.label}
                <span className="absolute inset-x-0 -bottom-0.5 h-px bg-honey/60 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
