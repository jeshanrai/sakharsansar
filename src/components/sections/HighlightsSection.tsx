import React from 'react';
import data from "@/data/content.json";
import { Leaf, ShieldCheck, Users, HandHeart } from "lucide-react";
import { ZoomIn } from "@/components/Animations";

const getIcon = (name: string) => {
  switch (name) {
    case "Leaf": return <Leaf className="w-6 h-6 text-[#C17A2A]" strokeWidth={1} />;
    case "ShieldCheck": return <ShieldCheck className="w-6 h-6 text-[#C17A2A]" strokeWidth={1} />;
    case "Users": return <Users className="w-6 h-6 text-[#C17A2A]" strokeWidth={1} />;
    case "HandHeart": return <HandHeart className="w-6 h-6 text-[#C17A2A]" strokeWidth={1} />;
    default: return <Leaf className="w-6 h-6 text-[#C17A2A]" strokeWidth={1} />;
  }
};

export default function HighlightsSection() {
  return (
    <section aria-label="Why Choose Us" className="py-32 px-6 bg-[#FBF4E8] border-b border-[#C17A2A]/20">
      <h2 className="sr-only">Why Choose SakharSansar</h2>
      <div className="max-w-[1440px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-16">
        {data.highlights.map((item, i) => (
          <ZoomIn key={i} delay={i * 0.1}>
            <div className="flex flex-col items-center text-center group">
              <div className="mb-6 sm:mb-8 opacity-70 group-hover:opacity-100 transition duration-500">
                {getIcon(item.icon)}
              </div>
              <h3 className="font-poppins font-semibold text-xs tracking-[0.15em] uppercase text-[#2C1500] mb-4">{item.title}</h3>
              <p className="text-[#2C1500]/60 leading-loose text-sm font-light max-w-xs">{item.desc}</p>
            </div>
          </ZoomIn>
        ))}
      </div>
    </section>
  );
}
