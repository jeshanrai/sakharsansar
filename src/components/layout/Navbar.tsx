"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { openOrderDrawer } from './OrderDrawer';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <nav
      ref={navRef}
      aria-label="Main navigation"
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled
          ? 'bg-white/95 backdrop-blur-md py-2 shadow-sm'
          : 'bg-white py-3'
        } px-4 sm:px-10 lg:px-16`}
    >
      <div className="flex items-center justify-between">
        {/* Left: Word Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/word-logo.svg"
            alt="SakharSansar"
            width={200}
            height={50}
            className="h-12 sm:h-14 w-auto"
            priority
          />
        </Link>

        {/* Center: Company Logo */}
        <div className="absolute left-1/2 -translate-x-1/2 overflow-visible">
          <Link href="/">
            <Image
              src="/company-logo.svg"
              alt="SakharSansar Logo"
              width={80}
              height={80}
              className={`transition-all duration-500 ${scrolled ? 'h-14 w-14 sm:h-16 sm:w-16' : 'h-16 w-16 sm:h-20 sm:w-20'}`}
              priority
            />
          </Link>
        </div>

        {/* Right: Desktop nav */}
        <div className="hidden md:flex gap-8 lg:gap-10 text-[15px] font-medium items-center text-[#2C1500]">
          <Link href="/our-story" className="hover:text-[#C17A2A] transition duration-300">Our Story</Link>
          <Link href="/shop" className="hover:text-[#C17A2A] transition duration-300">Shop</Link>
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
          className="md:hidden text-[#2C1500] p-2 -mr-2 touch-manipulation relative z-50 flex-shrink-0"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.5} /> : <Menu className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.5} />}
        </button>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-x-0 top-0 bottom-0 bg-white z-40 flex flex-col items-center justify-start gap-6 sm:gap-8 md:hidden transition-all duration-300 overflow-y-auto pb-10 ${mobileOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
        style={{ paddingTop: `calc(${navRef.current?.offsetHeight ?? 72}px + 2rem)` }}
      >
        <Link href="/our-story" onClick={closeMobile} className="font-poppins text-xl sm:text-2xl font-semibold text-[#2C1500] hover:text-[#C17A2A] active:text-[#C17A2A] transition">
          Our Story
        </Link>
        <Link href="/shop" onClick={closeMobile} className="font-poppins text-xl sm:text-2xl font-semibold text-[#2C1500] hover:text-[#C17A2A] active:text-[#C17A2A] transition">
          Shop
        </Link>
        <Link href="/blog" onClick={closeMobile} className="font-poppins text-xl sm:text-2xl font-semibold text-[#2C1500] hover:text-[#C17A2A] active:text-[#C17A2A] transition">
          Blog
        </Link>
        <button
          onClick={() => { closeMobile(); openOrderDrawer(); }}
          className="inline-flex items-center gap-3 mt-4 px-8 py-3.5 bg-[#C17A2A] text-white rounded-full text-base sm:text-lg font-semibold hover:bg-[#A8671F] active:bg-[#A8671F] transition duration-300"
        >
          <ShoppingBag className="w-5 h-5" strokeWidth={2} />
          Order Now
        </button>
      </div>
    </nav>
  );
}
