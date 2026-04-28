"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { openOrderDrawer } from './OrderDrawer';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navHeight, setNavHeight] = useState(76);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (navRef.current) setNavHeight(navRef.current.offsetHeight);
  }, [scrolled]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const navLinks = [
    { href: "/shop", label: "Shop" },
    { href: "/our-story", label: "Our Story" },
    { href: "/blog", label: "Journal" },
  ];

  return (
    <>
      <nav
        ref={navRef}
        aria-label="Main navigation"
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-cream/90 backdrop-blur-md border-b border-jaggery/10 py-3'
            : 'bg-cream/0 py-5'
        } px-5 sm:px-10 lg:px-16`}
      >
        <div className="flex items-center justify-between gap-6">
          {/* Wordmark — Devnagari accent + serif name */}
          <Link href="/" className="flex flex-col leading-none flex-shrink-0 group" aria-label="SakharSansar — home">
            <span className="font-devanagari text-[11px] sm:text-xs text-caramel-deep tracking-[0.06em] mb-0.5 transition-colors group-hover:text-jaggery">
              सखर&nbsp;संसार
            </span>
            <span className="font-serif text-xl sm:text-2xl text-jaggery tracking-[-0.012em]">
              SakharSansar
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-10 lg:gap-12">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="label-caps text-jaggery/70 hover:text-jaggery transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => openOrderDrawer()}
              className="hidden md:inline-flex items-center label-caps px-5 py-2.5 border border-jaggery text-jaggery hover:bg-jaggery hover:text-cream transition-colors duration-300 rounded-full"
            >
              Order
            </button>

            <button
              className="md:hidden text-jaggery p-2 -mr-2 touch-manipulation relative z-50"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen
                ? <X className="w-6 h-6" strokeWidth={1.5} />
                : <Menu className="w-6 h-6" strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Full-screen mobile overlay */}
      <div
        className={`fixed inset-0 bg-cream z-40 md:hidden transition-all duration-500 overflow-y-auto ${
          mobileOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        style={{ paddingTop: `calc(${navHeight}px + 1rem)` }}
      >
        <div className="px-8 py-12 flex flex-col gap-10 max-w-md mx-auto">
          <p className="text-caramel-deep text-sm">
            <span className="font-devanagari">सखर संसार</span>
            <span className="font-serif italic"> — Sweetness from the Roof of the World</span>
          </p>
          <ul className="flex flex-col gap-7">
            {navLinks.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={closeMobile}
                  className="font-serif text-h1 text-jaggery hover:text-caramel transition-colors block"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="border-t border-jaggery/15 pt-8">
            <button
              onClick={() => { closeMobile(); openOrderDrawer(); }}
              className="w-full inline-flex items-center justify-center label-caps px-8 py-4 bg-jaggery text-cream rounded-full hover:bg-jaggery-soft transition-colors"
            >
              Place an Order
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
