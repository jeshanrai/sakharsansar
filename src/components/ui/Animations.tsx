import React from "react";

/**
 * Scroll and entrance reveals.
 *
 * These were framer-motion `whileInView` wrappers and a `"use client"`
 * directive. That made every section using one a client component: 22 of the
 * 25 had no state, no handlers and no reason to hydrate at all, and each one
 * pulled framer-motion into its page bundle.
 *
 * They are now plain elements carrying a class, and the animation lives in
 * globals.css as a scroll-driven CSS animation. Same component API, so no
 * call site changed — but these are server components now, and the sections
 * that only used them for animation are server components again too.
 *
 * The base state is *visible*. A browser without scroll-driven animation
 * support, or with JavaScript off, shows the content immediately — which is
 * better than the motion version managed, since that wrote `opacity: 0` into
 * the server HTML and left it there until hydration finished.
 *
 * `delay` is applied as `animation-delay`. On the scroll-driven variants it is
 * ignored by design: a view() timeline is driven by scroll position, not time,
 * and a delay on it would hold the element invisible past the point it should
 * have appeared. It is kept in the signature because call sites pass it, and
 * it still does what it says on the hero wrappers below.
 */

type Props = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
};

function reveal(variant: string, name: string) {
  const Reveal = ({ children, className = "" }: Props) => (
    <div className={`${variant} ${className}`.trim()}>{children}</div>
  );
  // Without this the factory produces anonymous components, which show up as
  // "Unknown" in React DevTools and error under react/display-name.
  Reveal.displayName = name;
  return Reveal;
}

export const FadeUp = reveal("reveal", "FadeUp");
export const SlideInLeft = reveal("reveal-left", "SlideInLeft");
export const SlideInRight = reveal("reveal-right", "SlideInRight");
export const ZoomIn = reveal("reveal-in", "ZoomIn");

/**
 * Hero entrances, which run on load rather than on scroll — they are above the
 * fold by definition, so there is nothing to scroll them into. Here `delay`
 * does apply, and staggers the three in sequence.
 */
function heroRise(defaultDelay: number, name: string) {
  const HeroRise = ({ children, className = "", delay = defaultDelay }: Props) => (
    <div
      className={`hero-rise ${className}`.trim()}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
  HeroRise.displayName = name;
  return HeroRise;
}

export const HeroTitleWrapper = heroRise(0, "HeroTitleWrapper");
export const HeroSubtitleWrapper = heroRise(0.2, "HeroSubtitleWrapper");
export const HeroButtonWrapper = heroRise(0.4, "HeroButtonWrapper");
