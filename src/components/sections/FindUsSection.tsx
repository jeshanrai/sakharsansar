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
    <section
      aria-label="Where to find us"
      className="py-20 sm:py-28 px-6 sm:px-10 lg:px-16 bg-cream border-t border-jaggery/10"
    >
      <div className="max-w-[1440px] mx-auto">
        <FadeUp>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12 sm:mb-16">
            <div>
              <span className="label-caps text-caramel mb-4 block">Where to Find Us</span>
              <h2 className="font-serif text-h2 text-jaggery">
                In trusted aisles &amp; marketplaces.
              </h2>
            </div>
            <p className="text-jaggery/65 text-body max-w-sm">
              Stocked by the retailers Nepal already trusts — online and on the shelf.
            </p>
          </div>
        </FadeUp>

        <div className="flex flex-wrap items-center justify-between gap-y-10 gap-x-8 sm:gap-x-12 border-t border-b border-jaggery/10 py-10 sm:py-14">
          {partners.map((partner, i) => (
            <FadeUp key={partner.name} delay={i * 0.06}>
              <Image
                src={partner.logo}
                alt={partner.name}
                width={140}
                height={50}
                loading="lazy"
                className="h-8 sm:h-10 w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              />
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
