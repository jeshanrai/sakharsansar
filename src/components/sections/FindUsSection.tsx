import React from 'react';
import Image from 'next/image';
import { FadeUp } from "@/components/ui/Animations";

const partners = [
  { name: "Daraz", logo: "/partners/daraz.svg" },
  { name: "BigMart", logo: "/partners/bigmart.svg" },
  { name: "Salesberry", logo: "/partners/salesberry.svg" },
  { name: "Bhatbhateni", logo: "/partners/bhatbhateni.svg" },
  { name: "Amazon", logo: "/partners/amazon.svg" },
];

export default function FindUsSection() {
  return (
    <section aria-label="Find Us At" className="py-20 sm:py-28 bg-[#FBF4E8]">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10">
        <FadeUp>
          <h2 className="font-poppins font-semibold text-2xl sm:text-3xl text-[#2C1500] text-center mb-12 sm:mb-16">
            Find Us At
          </h2>
        </FadeUp>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-16">
          {partners.map((partner, i) => (
            <FadeUp key={partner.name} delay={i * 0.1}>
              <div className="hover:opacity-80 transition-all duration-500 cursor-pointer">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={140}
                  height={60}
                  loading="lazy"
                  className="h-10 sm:h-12 w-auto object-contain rounded-lg grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                />
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
