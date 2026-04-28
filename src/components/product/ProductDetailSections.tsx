"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

type Section = {
  title: string;
  body: React.ReactNode;
};

export default function ProductDetailSections({ sections }: { sections: Section[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="border-t border-jaggery/15">
      {sections.map((s, i) => {
        const isOpen = open === i;
        return (
          <div key={s.title} className="border-b border-jaggery/15">
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between py-5 text-left group"
              aria-expanded={isOpen}
            >
              <span className="font-serif text-h4 text-jaggery">
                {s.title}
              </span>
              {isOpen ? (
                <Minus className="w-4 h-4 text-jaggery/60 group-hover:text-jaggery transition-colors" strokeWidth={1.5} />
              ) : (
                <Plus className="w-4 h-4 text-jaggery/60 group-hover:text-jaggery transition-colors" strokeWidth={1.5} />
              )}
            </button>
            <div
              className={`grid transition-[grid-template-rows] duration-500 ease-out ${
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              }`}
            >
              <div className="overflow-hidden">
                <div className="pb-6 text-jaggery/75 text-body">
                  {s.body}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
