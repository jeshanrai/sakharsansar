import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FadeUp, SlideInLeft, SlideInRight } from "@/components/ui/Animations";
import { TreeTuft } from "@/components/ui/StoryArt";

// Team portraits.
// SCAFFOLD: `image` points at the real files to drop into public/team/.
// They reuse an existing photo for now so nothing 404s — swap each in and the
// names/roles below stay. Add or remove rows freely.
const team = [
  { name: "Ram Bahadur", role: "Master fire-tender", image: "/team/member-1.jpg" },
  { name: "Anita Rai", role: "Harvest & cane lead", image: "/team/member-2.jpg" },
  { name: "Dhan Kumari", role: "Mould & finishing", image: "/team/member-3.jpg" },
  { name: "Bishnu Tamang", role: "Packing & dispatch", image: "/team/member-4.jpg" },
];

// Until the real files exist, fall back to a photo that's already in the repo
// so the gallery renders cleanly. Once you've dropped /team/member-*.jpg (and a
// /team/lead.jpg) into public/, flip this to `true`.
const TEAM_PHOTOS_READY = false;
const PLACEHOLDER = "/farmers/farmer1.jpg";

/**
 * "Meet the makers" frame — peach band with a rounded image on the left and a
 * cream card on the right, followed by a portrait gallery of the team.
 */
export default function FarmersSection() {
  return (
    <section
      id="makers"
      aria-label="Meet the makers"
      className="relative scroll-mt-28 bg-peach px-6 sm:px-10 lg:px-16 py-16 sm:py-24 overflow-hidden"
    >
      <TreeTuft
        aria-hidden
        className="pointer-events-none absolute bottom-10 left-[5%] w-16 h-16 text-peach-line/45 hidden lg:block"
      />

      <div className="max-w-[1180px] mx-auto grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-10">
        {/* Lead team photo (swap with /team/lead.jpg) */}
        <SlideInLeft className="lg:col-span-7">
          <div className="relative aspect-[5/4] w-full overflow-hidden rounded-[1.75rem] ring-1 ring-jaggery/10 shadow-xl shadow-jaggery/15">
            <Image
              src={TEAM_PHOTOS_READY ? "/team/lead.jpg" : "/farmers/farmer1.jpg"}
              alt="The SakharSansar cooperative tending the wood fire while making traditional jaggery"
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
          </div>
        </SlideInLeft>

        {/* Cream card */}
        <SlideInRight className="lg:col-span-5 lg:-mt-12 lg:z-10">
          <div className="rounded-[1.75rem] bg-ivory text-jaggery px-7 sm:px-11 py-10 sm:py-12 shadow-xl shadow-jaggery/10 ring-1 ring-jaggery/5">
            <h2 className="font-marker uppercase text-jaggery leading-[0.95] text-[clamp(1.9rem,3.8vw,2.9rem)]">
              Meet the makers
            </h2>
            <p className="text-jaggery/75 text-body mt-5">
              When we&rsquo;re not tending the fire, we&rsquo;re looking after each other.
              Our cooperative is forty-two farming families across six villages — paid
              above market for chemical-free cane, with no middleman between their fire and
              your kitchen. They are not labourers; they are the recipe.
            </p>
            <Link
              href="/shop"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-jaggery text-cream label-caps px-7 py-3.5 hover:bg-grove transition-colors"
            >
              Find out more
            </Link>
          </div>
        </SlideInRight>
      </div>

      {/* Team portrait gallery */}
      <div className="max-w-[1180px] mx-auto mt-14 sm:mt-20">
        <FadeUp>
          <span className="label-caps text-caramel mb-7 block">The hands on the fire</span>
        </FadeUp>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-7">
          {team.map((m, i) => (
            <FadeUp key={m.name} delay={i * 0.08}>
              <figure className="group">
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-cream ring-1 ring-jaggery/8 shadow-sm">
                  <Image
                    src={TEAM_PHOTOS_READY ? m.image : PLACEHOLDER}
                    alt={`${m.name} — ${m.role}`}
                    fill
                    loading="lazy"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
                <figcaption className="mt-3.5">
                  <p className="font-display font-bold text-jaggery">{m.name}</p>
                  <p className="label-caps text-jaggery/55 mt-0.5">{m.role}</p>
                </figcaption>
              </figure>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
