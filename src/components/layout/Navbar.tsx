import React from 'react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-white z-50 py-5 px-6 sm:px-12 flex justify-between items-center border-b border-black/10 transition-all duration-300">
      <div className="font-poppins font-semibold text-xl md:text-2xl text-black tracking-[0.1em] uppercase">Himalayan Jaggery</div>
      <div className="hidden md:flex gap-10 text-[13px] font-medium tracking-widest uppercase items-center">
        <a href="#story" className="text-black hover:text-black/50 transition duration-300">Our Story</a>
        <a href="#products" className="text-black hover:text-black/50 transition duration-300">Shop</a>
        <a href="#contact" className="px-6 py-3 border border-black text-black hover:bg-black hover:text-white transition duration-300">Order Now</a>
      </div>
    </nav>
  );
}
