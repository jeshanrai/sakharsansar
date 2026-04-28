import Link from 'next/link';
import { FadeUp } from "@/components/ui/Animations";
import { ArrowRight } from "lucide-react";

export default function StoryCtaSection() {
  return (
    <section
      aria-label="Taste the story"
      className="py-24 sm:py-36 px-6 sm:px-10 lg:px-16 bg-cream paper-grain"
    >
      <div className="max-w-3xl mx-auto text-center">
        <FadeUp>
          <span className="label-caps text-caramel mb-6 block">An Invitation</span>
        </FadeUp>
        <FadeUp delay={0.1}>
          <h2 className="font-serif text-h1 text-jaggery tracking-[-0.018em] mb-8 text-balance">
            Now &mdash; <span className="italic font-light">taste the story.</span>
          </h2>
        </FadeUp>
        <FadeUp delay={0.2}>
          <p className="text-jaggery/75 text-lede mb-10">
            Every block, powder, and pour ships directly from Sankhuwasabha to your
            home. There is no middleman. There never has been.
          </p>
        </FadeUp>
        <FadeUp delay={0.3}>
          <Link
            href="/shop"
            className="group inline-flex items-center justify-center gap-3 label-caps px-9 py-4 bg-jaggery text-cream rounded-full hover:bg-jaggery-soft transition-colors"
          >
            Taste the Harvest
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
          </Link>
        </FadeUp>
      </div>
    </section>
  );
}
