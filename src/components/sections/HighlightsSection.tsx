import React from 'react';
import data from "@/data/content.json";
import { ClipboardList } from "lucide-react";
import { ZoomIn } from "@/components/Animations";

const getIcon = (name: string) => {
  const cls = "w-7 h-7 sm:w-8 sm:h-8 text-[#4A6CF7]";
  switch (name) {
    case "Leaf": return <ClipboardList className={cls} strokeWidth={1.5} />;
    case "ShieldCheck": return <ClipboardList className={cls} strokeWidth={1.5} />;
    case "Users": return <ClipboardList className={cls} strokeWidth={1.5} />;
    case "HandHeart": return <ClipboardList className={cls} strokeWidth={1.5} />;
    default: return <ClipboardList className={cls} strokeWidth={1.5} />;
  }
};

// Inner card inset styles for each card position
// Card 0: inner at bottom-left (gap at top & right)
// Card 1: inner at bottom-right (gap at top & left)
// Card 2: inner at top-right (gap at bottom & left)
// Card 3: inner at top-left (gap at bottom & right)
const innerStyles: React.CSSProperties[] = [
  { bottom: 0, left: 0, top: 'auto', right: 'auto' },
  { bottom: 0, right: 0, top: 'auto', left: 'auto' },
  { top: 0, right: 0, bottom: 'auto', left: 'auto' },
  { top: 0, left: 0, bottom: 'auto', right: 'auto' },
];

export default function HighlightsSection() {
  const gap = 28; // px gap between dashed border and inner card edge

  return (
    <section aria-label="Why Choose Us" className="py-20 sm:py-28 px-6 sm:px-10 bg-white">
      <h2 className="sr-only">Why Choose SakharSansar</h2>
      <div className="max-w-[1440px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10 items-start">
        {data.highlights.map((item, i) => (
          <ZoomIn key={i} delay={i * 0.1}>
            <div className={`${i % 2 === 1 ? 'lg:mt-20' : ''}`}>
              {/* Outer dashed border container */}
              <div className="relative border-2 border-dashed border-[#B0BEF7]/50 rounded-[32px] sm:rounded-[36px] h-[300px] sm:h-[360px]">
                {/* Inner solid card */}
                <div
                  style={{
                    ...innerStyles[i % 4],
                    position: 'absolute',
                    width: `calc(100% - ${gap}px)`,
                    height: `calc(100% - ${gap}px)`,
                  }}
                  className="bg-[#F5F7FB] rounded-[24px] sm:rounded-[28px] border-[1.5px] border-[#4A6CF7]/30 p-6 sm:p-8 flex flex-col justify-between"
                >
                  {/* Icon - top right */}
                  <div className="flex justify-end">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center">
                      {getIcon(item.icon)}
                    </div>
                  </div>

                  {/* Text - left aligned */}
                  <div className="text-left">
                    <h3 className="font-poppins font-bold text-lg sm:text-xl text-[#1a1a2e] mb-1.5 sm:mb-2">
                      {item.title}
                    </h3>
                    <p className="text-[#6b7280] text-sm sm:text-[15px] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ZoomIn>
        ))}
      </div>
    </section>
  );
}