import React from "react";

/**
 * Hand-drawn doodle set — Yeo Valley-style playful accents.
 * Each doodle inherits `currentColor` for the stroke/fill so it can be
 * tinted with text-* utilities. All are decorative (aria-hidden).
 */

type DoodleProps = { className?: string };

/** Five-petal daisy with a round centre. */
export const Daisy = ({ className = "" }: DoodleProps) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    aria-hidden
    className={className}
  >
    {Array.from({ length: 8 }).map((_, i) => (
      <ellipse
        key={i}
        cx="32"
        cy="14"
        rx="6.5"
        ry="12"
        fill="currentColor"
        transform={`rotate(${i * 45} 32 32)`}
      />
    ))}
    <circle cx="32" cy="32" r="8.5" className="fill-honey" />
  </svg>
);

/** Loose hand-drawn underline / emphasis stroke. */
export const Squiggle = ({ className = "" }: DoodleProps) => (
  <svg
    viewBox="0 0 220 24"
    fill="none"
    aria-hidden
    className={className}
  >
    <path
      d="M3 14C40 4 70 4 108 11s70 9 109-2"
      stroke="currentColor"
      strokeWidth="6"
      strokeLinecap="round"
    />
  </svg>
);

/** A little leaf sprig. */
export const Leaf = ({ className = "" }: DoodleProps) => (
  <svg viewBox="0 0 48 48" fill="none" aria-hidden className={className}>
    <path
      d="M24 44C24 28 30 10 44 4c2 18-4 34-20 40Z"
      fill="currentColor"
    />
    <path
      d="M24 44C24 28 18 10 4 4c-2 18 4 34 20 40Z"
      fill="currentColor"
      opacity="0.6"
    />
    <path d="M24 44V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
  </svg>
);

/** Beaming little sun. */
export const Sun = ({ className = "" }: DoodleProps) => (
  <svg viewBox="0 0 64 64" fill="none" aria-hidden className={className}>
    <circle cx="32" cy="32" r="12" fill="currentColor" />
    {Array.from({ length: 8 }).map((_, i) => (
      <line
        key={i}
        x1="32"
        y1="6"
        x2="32"
        y2="14"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        transform={`rotate(${i * 45} 32 32)`}
      />
    ))}
  </svg>
);

/** Hand-drawn wavy ribbon divider (full width). */
export const WaveDivider = ({ className = "" }: DoodleProps) => (
  <svg
    viewBox="0 0 1440 48"
    fill="none"
    preserveAspectRatio="none"
    aria-hidden
    className={className}
  >
    <path
      d="M0 24C180 4 360 4 540 20s360 24 540 8 360-24 360-24V48H0Z"
      fill="currentColor"
    />
  </svg>
);

/** Concentric hand-drawn swirl / spiral burst. */
export const Swirl = ({ className = "" }: DoodleProps) => (
  <svg viewBox="0 0 60 60" fill="none" aria-hidden className={className}>
    <path
      d="M30 8a22 22 0 1 1-21 27 16 16 0 1 1 19-19 10 10 0 1 1-9 13"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);
