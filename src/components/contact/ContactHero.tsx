import React from "react";
import Link from "next/link";
import { ChevronRight, Home, Store, Check, ArrowRight } from "lucide-react";
import { FadeUp, SlideInLeft, SlideInRight } from "@/components/ui/Animations";
import { HeartScribble } from "@/components/ui/StoryArt";

const PHONE = "9779860149199";
const WA_B2B =
  "Hi SakharSansar! I'm interested in wholesale / bulk (B2B) supply of your jaggery.";
const WA_B2C = "Hi SakharSansar! I'd like to order jaggery for my home.";

const B2C_POINTS = [
  "Pan-Nepal home delivery",
  "Single blocks to family packs",
  "Festive & gifting hampers",
];

const B2B_POINTS = [
  "Wholesale & bulk pricing",
  "Retail, café, hotel & reseller supply",
  "Private-label & custom packaging",
];

/**
 * Contact intro — peach band echoing the Our Story opener: hand-marker
 * headline with a scribble accent, a warm lede, and the two ways we sell
 * (B2C retail + B2B wholesale) as staggered cards.
 */
export default function ContactHero() {
  return (
    <section
      aria-label="Contact us"
      className="relative bg-peach overflow-hidden pt-20 sm:pt-24 pb-20 sm:pb-28"
    >
      <div className="relative z-10 px-6 sm:px-10 lg:px-16">
        {/* Breadcrumb */}
        <FadeUp>
          <nav aria-label="Breadcrumb" className="mb-6 flex justify-center">
            <ol className="flex items-center gap-2 label-caps text-jaggery/45">
              <li>
                <Link href="/" className="hover:text-grove transition-colors">
                  Home
                </Link>
              </li>
              <ChevronRight className="w-3 h-3 text-jaggery/30" strokeWidth={2.5} aria-hidden />
              <li aria-current="page" className="text-grove">
                Contact
              </li>
            </ol>
          </nav>
        </FadeUp>

        <div className="max-w-2xl mx-auto text-center">
          <FadeUp delay={0.05}>
            <div className="relative inline-block">
              <HeartScribble className="absolute -left-12 -top-5 w-14 h-10 sm:-left-16 sm:-top-6 sm:w-20 sm:h-14 text-peach-line rotate-[-8deg]" />
              <h1 className="font-marker uppercase text-jaggery leading-[0.9] tracking-tight text-[clamp(2.5rem,8vw,6rem)]">
                Let&rsquo;s talk sweet
              </h1>
            </div>
          </FadeUp>

          <FadeUp delay={0.15}>
            <p className="text-jaggery/75 text-lede mt-6 max-w-xl mx-auto text-balance">
              We sell both ways — straight to your kitchen, and by the crate to the shops,
              cafés and hotels that share our love for honest sweetness. Whichever you are,
              there&rsquo;s a real farming family on the other end.
            </p>
          </FadeUp>
        </div>

        {/* ── Two ways to buy: B2C + B2B ── */}
        <div className="mt-16 sm:mt-20 max-w-[1180px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-7 items-stretch">
          <SlideInLeft className="lg:mt-8">
            <AudienceCard
              tag="B2C · Retail"
              icon={<Home className="w-6 h-6" strokeWidth={1.75} />}
              title="For your home"
              copy="Order pure, wood-fired jaggery for everyday tea, cooking and gifting — delivered to your door anywhere in Nepal."
              points={B2C_POINTS}
              ctaLabel="Shop the collection"
              ctaHref="/shop"
              waHref={`https://wa.me/${PHONE}?text=${encodeURIComponent(WA_B2C)}`}
            />
          </SlideInLeft>

          <SlideInRight className="lg:-mt-2">
            <AudienceCard
              tag="B2B · Wholesale"
              icon={<Store className="w-6 h-6" strokeWidth={1.75} />}
              title="For your business"
              copy="Stock your store, café or hotel with consistent, certified, chemical-free jaggery — at wholesale rates, with packaging built around your brand."
              points={B2B_POINTS}
              ctaLabel="Request a wholesale quote"
              ctaHref="#contact-form"
              waHref={`https://wa.me/${PHONE}?text=${encodeURIComponent(WA_B2B)}`}
              featured
            />
          </SlideInRight>
        </div>
      </div>
    </section>
  );
}

function AudienceCard({
  tag,
  icon,
  title,
  copy,
  points,
  ctaLabel,
  ctaHref,
  waHref,
  featured = false,
}: {
  tag: string;
  icon: React.ReactNode;
  title: string;
  copy: string;
  points: string[];
  ctaLabel: string;
  ctaHref: string;
  waHref: string;
  featured?: boolean;
}) {
  return (
    <div
      className={`h-full flex flex-col rounded-[1.75rem] bg-ivory text-jaggery px-7 sm:px-10 py-9 sm:py-12 shadow-2xl shadow-jaggery/10 ${
        featured ? "ring-2 ring-honey" : "ring-1 ring-jaggery/5"
      }`}
    >
      <div className="flex items-center gap-4 mb-6">
        <span className="w-12 h-12 rounded-2xl bg-grove/10 text-grove flex items-center justify-center shrink-0">
          {icon}
        </span>
        <span className="label-caps text-caramel">{tag}</span>
      </div>

      <h2 className="font-marker uppercase text-jaggery leading-[0.95] text-[clamp(1.6rem,3vw,2.25rem)]">
        {title}
      </h2>
      <p className="text-jaggery/75 text-body mt-4">{copy}</p>

      <ul className="mt-6 space-y-3">
        {points.map((point) => (
          <li key={point} className="flex items-start gap-3 text-jaggery/80 text-[15px]">
            <span className="mt-0.5 w-5 h-5 rounded-full bg-grove/10 text-grove flex items-center justify-center shrink-0">
              <Check className="w-3 h-3" strokeWidth={3} />
            </span>
            {point}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-8 flex flex-col sm:flex-row gap-3">
        <Link
          href={ctaHref}
          className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-jaggery text-cream label-caps hover:bg-jaggery-soft transition-colors"
        >
          {ctaLabel}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.75} />
        </Link>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-jaggery/20 text-jaggery label-caps hover:border-grove hover:text-grove transition-colors"
        >
          WhatsApp
        </a>
      </div>
    </div>
  );
}
