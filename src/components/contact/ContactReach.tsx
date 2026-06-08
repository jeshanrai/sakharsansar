import React from "react";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Youtube } from "lucide-react";
import { SlideInLeft, SlideInRight, FadeUp } from "@/components/ui/Animations";
import { AnimatedWave } from "@/components/ui/StoryArt";
import ContactForm from "./ContactForm";

const PHONE_DISPLAY = "+977 98-6014-9199";
const PHONE = "9779860149199";
const EMAIL = "sakharsansar@gmail.com";
const WA_MESSAGE = "Hi SakharSansar! I'd like to know more about your jaggery.";

const CHANNELS = [
  {
    icon: Phone,
    label: "Call us",
    value: PHONE_DISPLAY,
    href: `tel:+${PHONE}`,
    note: "Sun–Fri · 9am – 6pm NPT",
  },
  {
    icon: Mail,
    label: "Email us",
    value: EMAIL,
    href: `mailto:${EMAIL}`,
    note: "We reply within a day",
  },
  {
    icon: MapPin,
    label: "Find us",
    value: "Sankhuwasabha, Koshi Province, Nepal",
    href: "https://maps.google.com/?q=Sankhuwasabha+Nepal",
    note: "A cooperative of 42 farming families",
  },
];

const SOCIAL = [
  { icon: Facebook, href: "https://facebook.com/sakharsansar", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com/sakharsansar", label: "Instagram" },
  { icon: Youtube, href: "https://youtube.com/@sakharsansar", label: "YouTube" },
];

/**
 * Reach-us frame — peach band carrying the direct channels on one side and the
 * enquiry form on the other, closing the page before the footer.
 */
export default function ContactReach() {
  return (
    <section
      id="contact-form"
      aria-label="Reach us"
      className="relative bg-grove text-cream scroll-mt-28 px-6 sm:px-10 lg:px-16 pt-28 sm:pt-36 pb-24 sm:pb-32 overflow-hidden"
    >
      {/* Curved transition — peach flows down into the green */}
      <AnimatedWave
        aria-hidden
        flip
        className="absolute top-0 left-0 w-full h-[55px] sm:h-[75px] text-peach"
      />

      <div className="relative z-10 max-w-[1180px] mx-auto">
        <FadeUp>
          <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-18">
            <span className="label-caps text-honey mb-4 block">Reach us</span>
            <h2 className="font-marker uppercase text-cream leading-[0.95] text-[clamp(2rem,4.4vw,3.25rem)]">
              Drop us a line
            </h2>
            <p className="text-cream/80 text-body mt-6">
              Quickest on WhatsApp, but every channel reaches the same warm team. Fill
              the form, or use whatever&rsquo;s easiest for you below.
            </p>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
          {/* ── Direct channels ── */}
          <SlideInLeft className="flex flex-col gap-4">
            {CHANNELS.map(({ icon: Icon, label, value, href, note }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group flex items-start gap-4 rounded-2xl bg-ivory/70 hover:bg-ivory border border-jaggery/10 px-5 sm:px-6 py-5 transition-colors"
              >
                <span className="w-12 h-12 rounded-2xl bg-grove/10 text-grove flex items-center justify-center shrink-0 group-hover:bg-grove group-hover:text-cream transition-colors">
                  <Icon className="w-5 h-5" strokeWidth={1.75} />
                </span>
                <span className="flex flex-col">
                  <span className="label-caps text-caramel">{label}</span>
                  <span className="text-jaggery font-medium text-[16px] mt-1 leading-snug">{value}</span>
                  <span className="text-jaggery/55 text-[13px] mt-1 flex items-center gap-1.5">
                    {label === "Call us" && <Clock className="w-3 h-3" strokeWidth={2} />}
                    {note}
                  </span>
                </span>
              </a>
            ))}

            {/* WhatsApp highlight */}
            <a
              href={`https://wa.me/${PHONE}?text=${encodeURIComponent(WA_MESSAGE)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 rounded-2xl bg-honey text-jaggery px-6 py-4 label-caps hover:bg-cream transition-colors"
            >
              Chat on WhatsApp
            </a>

            {/* Socials */}
            <div className="flex items-center gap-3 pt-2">
              <span className="label-caps text-cream/60">Follow</span>
              {SOCIAL.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-full bg-cream/15 text-cream flex items-center justify-center hover:bg-honey hover:text-jaggery transition-colors"
                >
                  <Icon className="w-4 h-4" strokeWidth={1.7} />
                </a>
              ))}
            </div>
          </SlideInLeft>

          {/* ── Enquiry form ── */}
          <SlideInRight>
            <ContactForm />
          </SlideInRight>
        </div>
      </div>
    </section>
  );
}
