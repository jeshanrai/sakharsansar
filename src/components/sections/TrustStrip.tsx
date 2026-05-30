"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Leaf, Flame, HandHeart } from "lucide-react";

type Badge = {
  icon: typeof Leaf;
  big: string;
  small: string;
};

const BADGES: Badge[] = [
  { icon: Leaf, big: "100%", small: "Organic Sakhar" },
  { icon: ShieldCheck, big: "NO", small: "Chemicals" },
  { icon: Flame, big: "WOOD", small: "Fired" },
  { icon: HandHeart, big: "DIRECT", small: "from Farmers" },
];

export default function TrustStrip() {
  return (
    <section
      aria-label="Why SakharSansar"
      className="relative bg-jaggery text-cream py-16 sm:py-20 lg:py-24 px-6 sm:px-10 lg:px-16 overflow-hidden paper-grain"
    >
      {/* Decorative swirl pattern */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07] pointer-events-none text-cream"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160' fill='none' stroke='%23F5EDE0' stroke-width='1.5' stroke-linecap='round'><path d='M 20 40 Q 40 10, 60 40 T 100 40 T 140 40' opacity='0.5'/><path d='M 20 80 Q 50 50, 80 80 T 140 80' opacity='0.5'/><path d='M 20 120 Q 40 90, 60 120 T 100 120 T 140 120' opacity='0.5'/><circle cx='30' cy='60' r='3' fill='%23F5EDE0' stroke='none' opacity='0.4'/><circle cx='110' cy='30' r='2.5' fill='%23F5EDE0' stroke='none' opacity='0.4'/><circle cx='80' cy='110' r='3.5' fill='%23F5EDE0' stroke='none' opacity='0.4'/><circle cx='130' cy='100' r='2' fill='%23F5EDE0' stroke='none' opacity='0.4'/></svg>\")",
          backgroundSize: "240px 240px",
        }}
      />

      {/* Honey glows */}
      <div aria-hidden className="absolute -top-32 -right-32 w-[40rem] h-[40rem] rounded-full bg-honey/12 blur-3xl pointer-events-none" />
      <div aria-hidden className="absolute -bottom-32 -left-32 w-[36rem] h-[36rem] rounded-full bg-caramel/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-[1440px] mx-auto">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-honey/60" />
            <span className="label-caps text-honey">Why our sakhar</span>
            <span className="w-8 h-px bg-honey/60" />
          </div>
          <h2 className="font-display font-bold text-cream tracking-tight text-balance leading-[0.95]">
            <span className="block text-[clamp(2rem,4.5vw,3.5rem)]">100% organic.</span>
            <span className="block text-[clamp(2.5rem,5.5vw,4.5rem)] text-honey mt-1 sm:mt-2">Pure sakhar.</span>
          </h2>
        </motion.div>

        {/* Badge grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6 sm:gap-x-8 lg:gap-x-4">
          {BADGES.map((badge, i) => (
            <motion.div
              key={badge.big}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.65, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group flex items-center justify-center sm:justify-start lg:justify-center gap-4 sm:gap-5"
            >
              {/* Circular icon */}
              <div className="relative shrink-0">
                {/* Outer ring */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-[1.5px] border-cream/80 flex items-center justify-center transition-all duration-500 group-hover:border-honey group-hover:bg-honey/8 group-hover:scale-105">
                  <badge.icon
                    className="w-9 h-9 sm:w-11 sm:h-11 text-cream group-hover:text-honey transition-colors duration-500"
                    strokeWidth={1.4}
                  />
                </div>
                {/* Diagonal slash (only on NO badge to mimic strike-through) */}
                {badge.big === "NO" && (
                  <span
                    aria-hidden
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    <span className="block w-[78%] h-[1.5px] bg-cream/85 rotate-45 origin-center" />
                  </span>
                )}
              </div>

              {/* Chunky display text */}
              <div className="font-display font-bold text-cream leading-[0.88]">
                <p className="text-[clamp(1.9rem,3.5vw,2.6rem)] tracking-tight">
                  {badge.big}
                </p>
                <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] tracking-tight mt-1.5 text-cream/85 font-semibold uppercase">
                  {badge.small}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
