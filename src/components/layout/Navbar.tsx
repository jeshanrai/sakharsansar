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
    const handle = () => setScrolled(window.scrollY > 4);
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

  // Hide on admin routes
  if (pathname?.startsWith("/portfolio")) return null;

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && (pathname?.startsWith(href) ?? false));

  return (
    <>
      <nav
        aria-label="Main navigation"
        className={`fixed top-9 inset-x-0 z-50 h-[72px] bg-cream/95 backdrop-blur-md transition-shadow duration-300 ${
          scrolled
            ? "shadow-[0_1px_0_0_rgba(26,20,16,0.06)]"
            : "shadow-none"
        }`}
      >
        <div className="h-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 grid grid-cols-[auto_1fr_auto] items-center gap-8">
          {/* ─── Logo (left) ─────────────────── */}
          <Link
            href="/"
            aria-label="SakharSansar — home"
            onClick={closeMobile}
            className="block relative"
          >
            <div className="relative h-10 w-[170px] sm:w-[185px]">
              <Image
                src="/word-logo.svg"
                alt="SakharSansar"
                fill
                priority
                sizes="185px"
                className="object-contain object-left"
              />
            </div>
          </Link>

          {/* ─── Center nav (desktop) ───────── */}
          <ul className="hidden md:flex items-center justify-center gap-10 lg:gap-14">
            {NAV.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href} className="relative">
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative inline-block py-2 text-[14px] tracking-[0.01em] transition-colors duration-200 ${
                      active
                        ? "text-jaggery font-semibold"
                        : "text-jaggery/70 font-medium hover:text-jaggery"
                    }`}
                  >
                    {link.label}
                  </Link>
                  {/* Active dot indicator */}
                  {active && (
                    <span
                      aria-hidden
                      className="absolute left-1/2 -translate-x-1/2 -bottom-0.5 w-1 h-1 rounded-full bg-caramel"
                    />
                  )}
                </li>
              );
            })}
          </ul>

          {/* ─── Right utilities ────────────── */}
          <div className="flex items-center justify-end gap-2">
            {/* Cart with badge */}
            <button
              type="button"
              onClick={() => openOrderDrawer()}
              aria-label="Cart, 2 items"
              className="relative h-11 w-11 inline-flex items-center justify-center rounded-full text-jaggery hover:bg-jaggery/[0.06] transition-colors"
            >
              <ShoppingBag className="h-[19px] w-[19px]" strokeWidth={1.5} />
              <span
                aria-hidden
                className="absolute top-1.5 right-1.5 min-w-[16px] h-[16px] px-1 rounded-full bg-terracotta text-cream text-[10px] font-semibold flex items-center justify-center tabular-nums leading-none"
              >
                2
              </span>
            </button>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className="md:hidden h-11 w-11 inline-flex items-center justify-center rounded-full text-jaggery hover:bg-jaggery/[0.06] transition-colors"
            >
              {mobileOpen ? (
                <X className="h-[22px] w-[22px]" strokeWidth={1.5} />
              ) : (
                <Menu className="h-[22px] w-[22px]" strokeWidth={1.5} />
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
        <div
          className="absolute inset-0 bg-cream"
          onClick={closeMobile}
        />
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
                    className={`group flex items-center justify-between gap-4 py-5 border-b border-jaggery/10 ${
                      active
                        ? "text-jaggery"
                        : "text-jaggery/70 hover:text-jaggery"
                    } transition-colors`}
                  >
                    <span className="font-serif text-3xl tracking-tight">
                      {link.label}
                    </span>
                    {active && (
                      <span className="w-1.5 h-1.5 rounded-full bg-caramel" />
                    )}
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
            className="mt-10 w-full h-12 inline-flex items-center justify-center gap-2 rounded-full bg-jaggery text-cream text-[13px] font-semibold tracking-wide hover:bg-jaggery-soft transition-colors"
          >
            <ShoppingBag className="h-4 w-4" strokeWidth={1.6} />
            View Cart
          </button>
        </div>
      </div>
    </>
  );
}
