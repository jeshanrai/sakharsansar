"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { openOrderDrawer } from './OrderDrawer';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <nav
      aria-label="Main navigation"
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md py-4 shadow-sm border-b border-black/5'
          : 'bg-white py-5 border-b border-black/10'
      } px-6 sm:px-12 flex justify-between items-center`}
    >
      <Link href="/" className="font-poppins font-semibold text-xl md:text-2xl text-black tracking-[0.1em] uppercase">
        SakharSansar
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex gap-10 text-[13px] font-medium tracking-widest uppercase items-center">
        <Link href="/#story" className="text-black hover:text-black/50 transition duration-300">Our Story</Link>
        <Link href="/#products" className="text-black hover:text-black/50 transition duration-300">Shop</Link>
        <Link href="/blog" className="text-black hover:text-black/50 transition duration-300">Blog</Link>
        <button
          onClick={() => openOrderDrawer()}
          className="px-6 py-3 border border-black text-black hover:bg-black hover:text-white transition duration-300"
        >
          Order Now
        </button>
      </div>

      {/* Mobile hamburger */}
      <button
        className="md:hidden text-black p-1"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
        aria-expanded={mobileOpen}
      >
        {mobileOpen ? <X className="w-6 h-6" strokeWidth={1.5} /> : <Menu className="w-6 h-6" strokeWidth={1.5} />}
      </button>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 top-[61px] bg-white z-40 flex flex-col items-center justify-center gap-10 animate-fade-in md:hidden">
          <Link href="/#story" onClick={() => setMobileOpen(false)} className="font-poppins text-2xl font-medium tracking-[0.15em] uppercase text-black hover:text-black/50 transition">
            Our Story
          </Link>
          <Link href="/#products" onClick={() => setMobileOpen(false)} className="font-poppins text-2xl font-medium tracking-[0.15em] uppercase text-black hover:text-black/50 transition">
            Shop
          </Link>
          <Link href="/blog" onClick={() => setMobileOpen(false)} className="font-poppins text-2xl font-medium tracking-[0.15em] uppercase text-black hover:text-black/50 transition">
            Blog
          </Link>
          <button
            onClick={() => { setMobileOpen(false); openOrderDrawer(); }}
            className="px-10 py-4 border border-black text-black hover:bg-black hover:text-white transition duration-300 text-sm tracking-[0.2em] uppercase font-medium"
          >
            Order Now
          </button>
        </div>
      )}
    </nav>
  );
}
