import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Youtube, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import data from "@/data/content.json";

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com/sakharsansar", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com/sakharsansar", label: "Instagram" },
  { icon: Youtube, href: "https://youtube.com/@sakharsansar", label: "YouTube" },
  { icon: Twitter, href: "https://twitter.com/sakharsansar", label: "Twitter" },
];

export default function Footer() {
  return (
    <footer className="bg-[#1a0d00] text-white pt-16 sm:pt-24 pb-8 px-6">
      <div className="max-w-[1440px] mx-auto">
        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16 mb-16 sm:mb-20">
          {/* Brand + Social */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h4 className="font-poppins font-medium text-2xl uppercase tracking-widest text-white mb-4">
              {data.brand.name}
            </h4>
            <p className="max-w-xs text-white/50 text-sm tracking-wide leading-relaxed mb-8">
              {data.brand.tagline}
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:border-[#C17A2A] hover:bg-[#C17A2A]/10 transition-all duration-300"
                >
                  <Icon className="w-4 h-4" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-poppins font-medium text-[11px] uppercase tracking-[0.2em] text-white/40 mb-8">
              Quick Links
            </h4>
            <ul className="space-y-4 text-xs tracking-widest uppercase text-white/70">
              <li>
                <Link href="/#products" className="hover:text-white transition duration-300">
                  Shop Collection
                </Link>
              </li>
              <li>
                <Link href="/our-story" className="hover:text-white transition duration-300">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition duration-300">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="hover:text-white transition duration-300">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-white transition duration-300">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / Policies */}
          <div>
            <h4 className="font-poppins font-medium text-[11px] uppercase tracking-[0.2em] text-white/40 mb-8">
              Policies
            </h4>
            <ul className="space-y-4 text-xs tracking-widest uppercase text-white/70">
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition duration-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition duration-300">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-white transition duration-300">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-white transition duration-300">
                  Refund &amp; Returns
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-poppins font-medium text-[11px] uppercase tracking-[0.2em] text-white/40 mb-8">
              Contact
            </h4>
            <div className="space-y-5 text-xs tracking-wide text-white/70">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C17A2A] mt-0.5 shrink-0" strokeWidth={1.5} />
                <p className="leading-relaxed">Sankhuwasabha,<br />Koshi Province, Nepal</p>
              </div>
              <a href="mailto:hello@sakharsansar.com" className="flex items-center gap-3 hover:text-white transition">
                <Mail className="w-4 h-4 text-[#C17A2A] shrink-0" strokeWidth={1.5} />
                <span>hello@sakharsansar.com</span>
              </a>
              <a href="tel:+977-0000000000" className="flex items-center gap-3 hover:text-white transition">
                <Phone className="w-4 h-4 text-[#C17A2A] shrink-0" strokeWidth={1.5} />
                <span>+977-0000000000</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] uppercase tracking-widest text-white/35">
          <p>&copy; {new Date().getFullYear()} {data.brand.name}. All rights reserved.</p>
          <p>Crafted with care in the Himalayas.</p>
        </div>
      </div>
    </footer>
  );
}
