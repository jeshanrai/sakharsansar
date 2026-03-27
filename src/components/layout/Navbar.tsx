"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingBag } from 'lucide-react';
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
          ? 'bg-white/95 backdrop-blur-md py-3 shadow-sm'
          : 'bg-white py-4'
      } px-6 sm:px-10 lg:px-16 flex justify-between items-center`}
    >
      <Link href="/" className="font-poppins font-bold text-xl sm:text-2xl text-[#2C1500] tracking-wide">
        SakharSansar
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex gap-8 lg:gap-10 text-[15px] font-medium items-center text-[#2C1500]">
        <Link href="/our-story" className="hover:text-[#C17A2A] transition duration-300">Our Story</Link>
        <Link href="/#products" className="hover:text-[#C17A2A] transition duration-300">Shop</Link>
        <Link href="/blog" className="hover:text-[#C17A2A] transition duration-300">Blog</Link>
        <button
          onClick={() => openOrderDrawer()}
          className="ml-2 inline-flex items-center gap-2 px-7 py-3 bg-[#C17A2A] text-white rounded-full text-[15px] font-semibold hover:bg-[#A8671F] transition duration-300"
        >
          <ShoppingBag className="w-4 h-4" strokeWidth={2} />
          Order Now
        </button>
      </div>

      {/* Mobile hamburger */}
      <button
        className="md:hidden text-[#2C1500] p-1"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
        aria-expanded={mobileOpen}
      >
        {mobileOpen ? <X className="w-7 h-7" strokeWidth={1.5} /> : <Menu className="w-7 h-7" strokeWidth={1.5} />}
      </button>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 top-[56px] bg-white z-40 flex flex-col items-center justify-center gap-10 animate-fade-in md:hidden">
          <Link href="/our-story" onClick={() => setMobileOpen(false)} className="font-poppins text-2xl font-semibold text-[#2C1500] hover:text-[#C17A2A] transition">
            Our Story
          </Link>
          <Link href="/#products" onClick={() => setMobileOpen(false)} className="font-poppins text-2xl font-semibold text-[#2C1500] hover:text-[#C17A2A] transition">
            Shop
          </Link>
          <Link href="/blog" onClick={() => setMobileOpen(false)} className="font-poppins text-2xl font-semibold text-[#2C1500] hover:text-[#C17A2A] transition">
            Blog
          </Link>
          <button
            onClick={() => { setMobileOpen(false); openOrderDrawer(); }}
            className="inline-flex items-center gap-3 px-10 py-4 bg-[#C17A2A] text-white rounded-full text-lg font-semibold hover:bg-[#A8671F] transition duration-300"
          >
            <ShoppingBag className="w-5 h-5" strokeWidth={2} />
            Order Now
          </button>
        </div>
      )}
    </nav>
  );
}
