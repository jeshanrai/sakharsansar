import React from 'react';
import { FadeUp, SlideInLeft } from "@/components/ui/Animations";
import { Sprout, Flame, Hand, Package } from "lucide-react";

const steps = [
  {
    title: "Harvest",
    desc: "Sugarcane is cut at first light, when the juice is sweetest and coolest.",
    icon: Sprout,
    season: "Oct – Dec",
  },
  {
    title: "Wood-Fire",
    desc: "Cane juice slowly reduces in iron kadhais over open wood-fire — never gas, never sulphur.",
    icon: Flame,
    season: "Same day",
  },
  {
    title: "Hand-Mould",
    desc: "Once amber and pliable, the jaggery is poured by hand into wooden moulds and rested.",
    icon: Hand,
    season: "Cooled overnight",
  },
  {
    title: "Pack",
    desc: "Sealed in compostable kraft paper from our village cooperative — never plastic.",
    icon: Package,
    season: "Within 48 hrs",
  },
];

export default function ProcessSection() {
  return (
    <section
      aria-label="Our process"
      className="py-24 sm:py-36 px-6 sm:px-10 lg:px-16 bg-jaggery text-cream paper-grain relative overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16 sm:mb-24 items-end">
          <SlideInLeft className="md:col-span-7">
            <span className="label-caps text-honey mb-5 block">The Craft</span>
            <h2 className="font-serif text-h1 text-cream tracking-[-0.018em] text-balance">
              Four steps. <span className="italic font-light">No shortcuts.</span>
            </h2>
          </SlideInLeft>
          <FadeUp delay={0.2} className="md:col-span-5">
            <p className="text-cream/70 text-lede max-w-md md:ml-auto">
              The same method our grandparents used. Slow, smoky, and stubbornly free
              of the chemicals modern factories rely on to cut corners.
            </p>
          </FadeUp>
        </div>

        {/* Horizontal scroll on mobile, 4-col grid on desktop */}
        <div className="relative">
          {/* Connecting line on desktop */}
          <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-cream/15" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 lg:gap-14">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <FadeUp key={step.title} delay={i * 0.12}>
                  <div className="flex flex-col">
                    {/* Numbered icon node */}
                    <div className="relative flex items-center gap-4 md:block mb-5 md:mb-8">
                      <div className="w-16 h-16 rounded-full border border-cream/25 bg-jaggery flex items-center justify-center relative z-10">
                        <Icon className="w-6 h-6 text-honey" strokeWidth={1.25} />
                      </div>
                      <span className="md:hidden font-serif text-2xl text-cream/40">
                        0{i + 1}
                      </span>
                    </div>

                    <span className="hidden md:block font-serif italic text-cream/45 mb-2 nums-oldstyle">
                      0{i + 1}
                    </span>
                    <h3 className="font-serif text-h3 text-cream mb-2">
                      {step.title}
                    </h3>
                    <span className="label-caps text-honey/85 mb-4 block">
                      {step.season}
                    </span>
                    <p className="text-cream/70 text-body max-w-xs">
                      {step.desc}
                    </p>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
