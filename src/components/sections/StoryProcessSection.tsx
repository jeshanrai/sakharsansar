import React from 'react';
import { FadeUp, SlideInLeft, SlideInRight } from "@/components/ui/Animations";
import VideoFrame from "@/components/ui/VideoFrame";
import { Sprout, Flame, Hand, Package } from "lucide-react";

const steps = [
  { title: "Harvest", season: "Oct – Dec", desc: "Cane is cut at first light, when the juice is sweetest and coolest.", icon: Sprout },
  { title: "Wood-fire", season: "Same day", desc: "The juice reduces slowly in iron kadhais over open wood-fire — never gas, never sulphur.", icon: Flame },
  { title: "Hand-mould", season: "Cooled overnight", desc: "Once amber and pliable, it is poured by hand into wooden moulds and rested.", icon: Hand },
  { title: "Pack", season: "Within 48 hrs", desc: "Sealed in compostable kraft paper from our village cooperative — never plastic.", icon: Package },
];

/**
 * "How it's made" frame — peach band pairing a click-to-play making-process
 * film with the four craft steps.
 *
 * SCAFFOLD: the film's poster is an existing still; drop
 * /media/making-process.mp4 (+ keep or replace the poster) into public/ and the
 * play button streams it. Optional step stills can later sit at /process/*.jpg.
 */
export default function StoryProcessSection() {
  return (
    <section
      aria-label="How it's made"
      className="relative bg-peach px-6 sm:px-10 lg:px-16 py-16 sm:py-24 overflow-hidden"
    >
      <div className="max-w-[1180px] mx-auto">
        {/* Text on the left, vertical making-process film on the right. */}
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-12">
          <SlideInLeft className="lg:col-span-7">
            <div className="max-w-2xl">
              <span className="label-caps text-caramel mb-4 block">How it&rsquo;s made</span>
              <h2 className="font-marker uppercase text-jaggery leading-[0.95] text-[clamp(2rem,4vw,3.25rem)]">
                Four steps. No shortcuts.
              </h2>
              <p className="text-jaggery/70 text-lede mt-6">
                The same method our grandparents used — slow, smoky, and stubbornly free of
                the chemicals modern factories rely on. Press play and watch a batch come to life.
              </p>
            </div>
          </SlideInLeft>

          {/* A vertical, phone-shot clip of a batch reducing in the iron
              kadhai. Width-capped so the portrait frame sits without cropping;
              hugs the right edge on large screens. Plays with sound. */}
          <SlideInRight className="lg:col-span-5">
            <VideoFrame
              variant="play"
              src="/media/making-process.mp4"
              poster="/media/making-process-poster.jpg"
              posterAlt="Cane juice reducing in an iron kadhai over wood fire, stirred by hand"
              label="Watch: from cane to block"
              className="aspect-[9/16] w-full max-w-[360px] mx-auto lg:ml-auto lg:mr-0 ring-1 ring-jaggery/10 shadow-xl shadow-jaggery/15"
            />
          </SlideInRight>
        </div>

        {/* The four steps */}
        <div className="relative mt-14 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          <div aria-hidden className="hidden lg:block absolute left-0 right-0 top-7 h-px bg-jaggery/12" />
          {steps.map((s, i) => (
            <FadeUp key={s.title} delay={i * 0.1}>
              <div className="relative">
                <div className="flex items-center gap-4 lg:block">
                  <span className="relative z-10 inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-cream ring-1 ring-jaggery/12 text-forest">
                    <s.icon className="h-6 w-6" strokeWidth={1.5} />
                  </span>
                  <span className="font-serif italic text-jaggery/40 text-xl lg:hidden">0{i + 1}</span>
                </div>
                <span className="hidden lg:block font-serif italic text-jaggery/40 mt-5 mb-1">0{i + 1}</span>
                <h3 className="font-display font-bold text-jaggery text-h4 mt-4 lg:mt-2">{s.title}</h3>
                <span className="label-caps text-caramel mt-1.5 mb-3 block">{s.season}</span>
                <p className="text-jaggery/70 text-body max-w-xs">{s.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
