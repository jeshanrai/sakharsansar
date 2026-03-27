"use client";
import React from 'react';
import { openOrderDrawer } from '../layout/OrderDrawer';
import { ZoomIn } from "@/components/Animations";
import { ArrowRight } from "lucide-react";

export default function CtaSection() {
  return (
    <section id="contact" aria-label="Call to Action" className="py-32 sm:py-40 px-6 bg-[#C17A2A] text-white relative flex flex-col items-center justify-center min-h-[50vh] sm:min-h-[60vh]">
      <div className="max-w-5xl mx-auto text-center relative z-10 w-full">
        <ZoomIn>
          <div className="flex flex-col items-center justify-center">
            <h2 className="font-poppins text-4xl sm:text-5xl md:text-7xl font-medium tracking-[0.1em] uppercase text-white mb-12 max-w-4xl leading-[1.1]">
              Savor The<br/>Origin
            </h2>
            <div className="w-24 h-px bg-white/50 mb-12" />
            <p className="text-white/75 text-xs sm:text-sm tracking-[0.2em] font-light lowercase mb-16 max-w-xl mx-auto leading-[2.5]">
              Experience our handcrafted jaggery. Direct from farmers in Sankhuwasabha, Nepal to your doorstep.
            </p>
            <button onClick={() => openOrderDrawer()} className="group inline-flex items-center gap-6 px-10 sm:px-12 py-4 sm:py-5 bg-[#2C1500] text-white text-xs font-semibold tracking-[0.2em] uppercase hover:bg-[#3D2010] transition-colors">
              Place an Order <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.5}/>
            </button>
          </div>
        </ZoomIn>
      </div>
    </section>
  );
}
