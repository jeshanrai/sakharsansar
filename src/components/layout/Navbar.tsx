"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingBag, Heart, Menu, X } from "lucide-react";
import { openOrderDrawer } from "./OrderDrawer";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/our-story", label: "Our Story" },
  { href: "/blog", label: "Blogs" },
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
        className={`fixed top-9 inset-x-0 z-50 h-[72px] bg-cream transition-shadow duration-300 ${
          scrolled
            ? "shadow-[0_2px_12px_-4px_rgba(26,20,16,0.18)]"
            : "shadow-[0_1px_0_0_rgba(26,20,16,0.06)]"
        }`}
      >
        <div className="h-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          {/* ─── Left: nav links (desktop) + hamburger (mobile) ─── */}
          <div className="flex items-center justify-self-start">
            <ul className="hidden md:flex items-center gap-9 lg:gap-12">
              {NAV.map((link) => {
                const active = isActive(link.href);
                return (
                  <li key={link.href} className="relative">
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={`relative inline-block py-2 font-marker uppercase text-[23px] lg:text-[25px] leading-none tracking-[0.02em] transition-colors duration-200 ${
                        active
                          ? "text-grove"
                          : "text-jaggery/80 hover:text-grove"
                      }`}
                    >
                      {link.label}
                    </Link>
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

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className="md:hidden h-11 w-11 -ml-2 inline-flex items-center justify-center rounded-full text-jaggery hover:bg-jaggery/[0.06] transition-colors"
            >
              {mobileOpen ? (
                <X className="h-[22px] w-[22px]" strokeWidth={1.5} />
              ) : (
                <Menu className="h-[22px] w-[22px]" strokeWidth={1.5} />
              )}
            </button>
          </div>

          {/* ─── Center: circular logo badge (reserves space) ─── */}
          <div className="w-[72px] sm:w-[90px]" aria-hidden />

          {/* ─── Right utilities ────────────── */}
          <div className="flex items-center justify-end justify-self-end gap-1">
            {/* Favourites */}
            <Link
              href="/shop"
              aria-label="Favourites"
              className="relative h-11 w-11 inline-flex items-center justify-center rounded-full text-jaggery hover:bg-jaggery/[0.06] transition-colors"
            >
              <Heart className="h-[19px] w-[19px]" strokeWidth={1.5} />
            </Link>

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
          </div>
        </div>

        {/* ─── Center: circular logo badge, protruding below the bar ─── */}
        <Link
          href="/"
          aria-label="SakharSansar — home"
          onClick={closeMobile}
          className="absolute left-1/2 top-2 -translate-x-1/2 z-[60] group"
        >
          <span className="block rounded-full bg-cream p-1 shadow-xl shadow-jaggery/25 ring-1 ring-jaggery/5 transition-transform duration-300 group-hover:-translate-y-0.5">
            <span className="relative block h-[60px] w-[60px] sm:h-[78px] sm:w-[78px] rounded-full overflow-hidden">
              <Image
                src="/logo-mark.webp"
                alt="SakharSansar"
                fill
                priority
                sizes="80px"
                className="object-cover scale-[1.02]"
              />
            </span>
          </span>
        </Link>
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
                    <span className="font-marker uppercase text-4xl tracking-wide">
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
