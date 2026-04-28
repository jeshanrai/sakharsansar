import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import data from "@/data/content.json";
import NewsletterForm from "./NewsletterForm";

const socialLinks = [
  { icon: Instagram, href: "https://instagram.com/sakharsansar", label: "Instagram" },
  { icon: Facebook, href: "https://facebook.com/sakharsansar", label: "Facebook" },
];

export default function Footer() {
  return (
    <footer className="bg-jaggery text-cream pt-24 sm:pt-32 pb-10 px-6 sm:px-10 lg:px-16 paper-grain">
      <div className="max-w-[1440px] mx-auto">
        {/* Newsletter — Letters from the Himalayas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 pb-20 sm:pb-24 border-b border-cream/15 mb-16 sm:mb-20">
          <div className="lg:col-span-6">
            <span className="label-caps text-honey mb-5 block">Newsletter</span>
            <h2 className="font-serif text-h1 text-cream tracking-[-0.018em] text-balance max-w-xl">
              Letters from the <span className="italic font-light">Himalayas</span>
            </h2>
            <p className="text-cream/70 text-lede mt-6 max-w-md">
              Seasonal stories, recipes, and harvest news from Sankhuwasabha — delivered the
              way our jaggery is, slowly and with care.
            </p>
          </div>

          <div className="lg:col-span-6">
            <NewsletterForm />
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-10 mb-16 sm:mb-20">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-4">
            <Link href="/" className="inline-flex flex-col mb-6 leading-none">
              <span className="font-devanagari text-sm text-honey mb-1.5 tracking-[0.04em]">सखर संसार</span>
              <span className="font-serif text-2xl text-cream tracking-[-0.012em]">SakharSansar</span>
            </Link>
            <p className="text-cream/70 text-body max-w-sm mb-8">
              {data.brand.tagline}. Wood-fired in Sankhuwasabha,
              poured by hand, shipped pan-Nepal.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-11 h-11 rounded-full border border-cream/20 flex items-center justify-center text-cream/70 hover:text-jaggery hover:bg-cream hover:border-cream transition-all duration-300"
                >
                  <Icon className="w-4 h-4" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h4 className="label-caps text-cream/45 mb-6">Shop</h4>
            <ul className="space-y-4 text-body text-cream/85">
              <li><Link href="/shop" className="hover:text-cream transition-colors">All Jaggery</Link></li>
              <li><Link href="/shop" className="hover:text-cream transition-colors">Blocks</Link></li>
              <li><Link href="/shop" className="hover:text-cream transition-colors">Powder</Link></li>
              <li><Link href="/shop" className="hover:text-cream transition-colors">Liquid</Link></li>
              <li><Link href="/shop" className="hover:text-cream transition-colors">Cubes</Link></li>
            </ul>
          </div>

          {/* Learn */}
          <div className="lg:col-span-2">
            <h4 className="label-caps text-cream/45 mb-6">Learn</h4>
            <ul className="space-y-4 text-body text-cream/85">
              <li><Link href="/our-story" className="hover:text-cream transition-colors">Our Story</Link></li>
              <li><Link href="/blog" className="hover:text-cream transition-colors">Journal</Link></li>
              <li><Link href="/our-story" className="hover:text-cream transition-colors">The Farmers</Link></li>
              <li><Link href="/our-story" className="hover:text-cream transition-colors">The Process</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h4 className="label-caps text-cream/45 mb-6">Contact</h4>
            <div className="space-y-5 text-body text-cream/85">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-honey mt-1.5 shrink-0" strokeWidth={1.5} />
                <p className="leading-relaxed">Sankhuwasabha,<br />Koshi Province, Nepal</p>
              </div>
              <a href="mailto:hello@sakharsansar.com" className="flex items-center gap-3 hover:text-cream transition-colors">
                <Mail className="w-4 h-4 text-honey shrink-0" strokeWidth={1.5} />
                <span>hello@sakharsansar.com</span>
              </a>
              <a href="tel:+977-0000000000" className="flex items-center gap-3 hover:text-cream transition-colors">
                <Phone className="w-4 h-4 text-honey shrink-0" strokeWidth={1.5} />
                <span>+977 0000 000 000</span>
              </a>
            </div>
          </div>
        </div>

        {/* Policies row */}
        <div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center gap-6 pt-8 border-t border-cream/10">
          <p className="text-meta text-cream/55">
            &copy; {new Date().getFullYear()} {data.brand.name}. Crafted with care in the Himalayas.
          </p>
          <ul className="flex flex-wrap gap-x-7 gap-y-2 label-caps text-cream/60">
            <li><Link href="/privacy-policy" className="hover:text-cream transition-colors">Privacy</Link></li>
            <li><Link href="/terms" className="hover:text-cream transition-colors">Terms</Link></li>
            <li><Link href="/shipping-policy" className="hover:text-cream transition-colors">Shipping</Link></li>
            <li><Link href="/refund-policy" className="hover:text-cream transition-colors">Refund</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
