import React from 'react';
import { ZoomIn } from "@/components/Animations";
import OrderButton from "./OrderButton";

export default function CtaSection() {
  return (
    <section id="contact" aria-label="Call to Action" className="py-24 sm:py-32 px-6 sm:px-10 bg-[#2C1500] relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#C17A2A]/10" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-[#C17A2A]/5" />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <ZoomIn>
          <p className="text-sm sm:text-base font-semibold tracking-[0.2em] uppercase text-[#C17A2A] mb-4">Direct from Sankhuwasabha</p>
          <h2 className="font-poppins text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Savor The Origin
          </h2>
          <p className="text-lg sm:text-xl text-white/60 mb-12 max-w-xl mx-auto leading-relaxed">
            Experience our handcrafted jaggery. Direct from farmers in Sankhuwasabha, Nepal to your doorstep.
          </p>
          <OrderButton />
        </ZoomIn>
      </div>
    </section>
  );
}
