import React from 'react';
import data from "@/data/content.json";
import { Leaf, ShieldCheck, Users, HandHeart } from "lucide-react";
import { ZoomIn } from "@/components/Animations";

const getIcon = (name: string) => {
  const cls = "w-8 h-8 sm:w-10 sm:h-10 text-[#C17A2A]";
  switch (name) {
    case "Leaf": return <Leaf className={cls} strokeWidth={1.5} />;
    case "ShieldCheck": return <ShieldCheck className={cls} strokeWidth={1.5} />;
    case "Users": return <Users className={cls} strokeWidth={1.5} />;
    case "HandHeart": return <HandHeart className={cls} strokeWidth={1.5} />;
    default: return <Leaf className={cls} strokeWidth={1.5} />;
  }
};

export default function HighlightsSection() {
  return (
    <section aria-label="Why Choose Us" className="py-20 sm:py-28 px-6 sm:px-10 bg-[#FBF4E8]">
      <h2 className="sr-only">Why Choose SakharSansar</h2>
      <div className="max-w-[1440px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
        {data.highlights.map((item, i) => (
          <ZoomIn key={i} delay={i * 0.1}>
            <div className="flex flex-col items-center text-center group bg-white rounded-2xl p-8 sm:p-10 hover:shadow-lg transition-shadow duration-500">
              <div className="mb-5 sm:mb-6 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#C17A2A]/10 flex items-center justify-center group-hover:bg-[#C17A2A]/20 transition-colors duration-500">
                {getIcon(item.icon)}
              </div>
              <h3 className="font-poppins font-semibold text-base sm:text-lg text-[#2C1500] mb-3">{item.title}</h3>
              <p className="text-[#2C1500]/60 text-sm sm:text-base leading-relaxed max-w-xs">{item.desc}</p>
            </div>
          </ZoomIn>
        ))}
      </div>
    </section>
  );
}
