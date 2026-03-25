"use client";
import React from 'react';
import Link from 'next/link';
import { openOrderDrawer } from './OrderDrawer';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-white z-50 py-5 px-6 sm:px-12 flex justify-between items-center border-b border-black/10 transition-all duration-300">
      <Link href="/" className="font-poppins font-semibold text-xl md:text-2xl text-black tracking-[0.1em] uppercase">Himalayan Jaggery</Link>
      <div className="hidden md:flex gap-10 text-[13px] font-medium tracking-widest uppercase items-center">
        <Link href="/#story" className="text-black hover:text-black/50 transition duration-300">Our Story</Link>
        <Link href="/#products" className="text-black hover:text-black/50 transition duration-300">Shop</Link>
        <Link href="/blog" className="text-black hover:text-black/50 transition duration-300">Blog</Link>
        <button onClick={() => openOrderDrawer()} className="px-6 py-3 border border-black text-black hover:bg-black hover:text-white transition duration-300">Order Now</button>
      </div>
    </nav>
  );
}
