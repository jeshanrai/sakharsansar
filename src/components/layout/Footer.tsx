import React from 'react';
import Link from 'next/link';
import data from "@/data/content.json";

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-16 sm:pt-24 pb-12 px-6 border-t border-black/10">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16 mb-16 sm:mb-24">
        <div className="sm:col-span-2 lg:col-span-2">
          <h4 className="font-poppins font-medium text-2xl sm:text-3xl uppercase tracking-widest text-white mb-6">{data.brand.name}</h4>
          <p className="max-w-md text-white/60 text-sm tracking-widest uppercase leading-loose">{data.brand.tagline}</p>
        </div>
        <div>
          <h4 className="font-poppins font-medium text-[11px] uppercase tracking-[0.2em] text-white/40 mb-8">Navigation</h4>
          <ul className="space-y-4 text-xs tracking-widest uppercase text-white/80">
            <li><Link href="/#story" className="hover:text-white transition duration-300">Our Story</Link></li>
            <li><Link href="/#products" className="hover:text-white transition duration-300">Shop Collection</Link></li>
            <li><Link href="/blog" className="hover:text-white transition duration-300">Insights & Blog</Link></li>
            <li><Link href="/#contact" className="hover:text-white transition duration-300">Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-poppins font-medium text-[11px] uppercase tracking-[0.2em] text-white/40 mb-8">Contact Information</h4>
          <div className="space-y-4 text-xs tracking-widest uppercase text-white/80 leading-relaxed">
            <p>Sankhuwasabha,<br/>Koshi Province, Nepal</p>
            <a href="mailto:hello@sakharsansar.com" className="pt-4 block hover:text-white transition">hello@sakharsansar.com</a>
          </div>
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto text-center md:text-left text-[11px] flex flex-col md:flex-row justify-between items-center gap-6 border-t border-white/10 pt-12 uppercase tracking-widest text-white/40">
        <p>&copy; {new Date().getFullYear()} {data.brand.name}. All rights reserved.</p>
        <p className="transition cursor-default">Crafted in the Himalayas.</p>
      </div>
    </footer>
  );
}
