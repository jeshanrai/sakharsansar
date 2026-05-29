"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X } from "lucide-react";
import { openOrderDrawer } from "./OrderDrawer";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/our-story", label: "Our Story" },
  { href: "/blog", label: "Journal" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 8);
    handle();
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  // Hide on internal/admin routes
  if (pathname?.startsWith("/portfolio")) return null;

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && (pathname?.startsWith(href) ?? false));

  return (
    <>
      <nav
        aria-label="Main navigation"
        className={`fixed top-9 inset-x-0 z-50 h-20 transition-colors duration-300 ${
          scrolled
            ? "bg-cream/95 backdrop-blur-md"
            : "bg-cream/75 backdrop-blur-sm"
        }`}
      >
        <div className="h-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex items-center gap-6">
          {/* ─── Logo ───────────────────────────── */}
          <Link
            href="/"
            aria-label="SakharSansar — home"
            onClick={closeMobile}
            className="flex-shrink-0"
          >
            <div className="relative h-10 w-[170px] sm:h-11 sm:w-[195px]">
              <Image
                src="/word-logo.svg"
                alt="SakharSansar"
                fill
                priority
                sizes="195px"
                className="object-contain object-left"
              />
            </div>
          </Link>

          {/* ─── Center nav (desktop) ──────────── */}
          <ul className="hidden md:flex items-center gap-9 lg:gap-12 mx-auto">
            {NAV.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`group relative inline-flex items-center text-[15px] font-semibold tracking-tight transition-colors duration-200 ${
                      active
                        ? "text-jaggery"
                        : "text-jaggery/75 hover:text-jaggery"
                    }`}
                  >
                    {link.label}
                    {/* Underline indicator */}
                    <span
                      aria-hidden
                      className={`pointer-events-none absolute -bottom-1.5 left-0 right-0 h-[2px] bg-caramel origin-left transition-transform duration-300 ease-out ${
                        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* ─── Right utilities ───────────────── */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 ml-auto md:ml-0">
            {/* Cart */}
            <button
              type="button"
              onClick={() => openOrderDrawer()}
              aria-label="Open cart"
              className="h-11 w-11 flex items-center justify-center rounded-full text-jaggery hover:bg-jaggery/8 transition-colors"
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.6} />
            </button>

            {/* Order CTA */}
            <button
              type="button"
              onClick={() => openOrderDrawer()}
              className="hidden sm:inline-flex items-center h-11 px-6 rounded-full bg-jaggery text-cream text-[14px] font-semibold tracking-tight hover:bg-jaggery-soft transition-colors"
            >
              Order Now
            </button>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className="md:hidden h-11 w-11 flex items-center justify-center rounded-full text-jaggery hover:bg-jaggery/8 transition-colors"
            >
              {mobileOpen ? (
                <X className="h-[22px] w-[22px]" strokeWidth={1.6} />
              ) : (
                <Menu className="h-[22px] w-[22px]" strokeWidth={1.6} />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* ─── Mobile drawer ───────────────────── */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
      >
        <div className="absolute inset-0 bg-cream" onClick={closeMobile} />
        <div className="relative h-full pt-32 pb-12 px-7 max-w-md mx-auto flex flex-col">
          <ul className="flex flex-col">
            {NAV.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={closeMobile}
                    aria-current={active ? "page" : undefined}
                    className={`block py-5 font-serif text-3xl tracking-tight border-b border-jaggery/10 transition-colors ${
                      active
                        ? "text-jaggery"
                        : "text-jaggery/70 hover:text-jaggery"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            onClick={() => {
              closeMobile();
              openOrderDrawer();
            }}
            className="mt-10 w-full h-12 rounded-full bg-jaggery text-cream text-[13px] font-medium tracking-wide hover:bg-jaggery-soft transition-colors"
          >
            Place an Order
          </button>
        </div>
      </div>
    </>
  );
}
