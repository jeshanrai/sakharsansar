import React from "react";

/**
 * Our Story line-art set — hand-drawn outline illustrations and organic
 * wavy section dividers, echoing the editorial reference design. Every piece
 * is decorative (aria-hidden) and inherits `currentColor` so it can be tinted
 * with text-* utilities. Motifs are Himalayan (mountains, sugarcane, a hill
 * hut) rather than dairy, to suit a jaggery brand.
 */

type ArtProps = { className?: string };

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Two loose hand-drawn hearts — hero accent. */
export const HeartScribble = ({ className = "" }: ArtProps) => (
  <svg viewBox="0 0 96 64" aria-hidden className={className}>
    <g {...stroke} strokeWidth={3.2}>
      <path d="M30 50C16 39 9 31 16 22c5-6 13-3 14 4 1-7 9-10 14-4 7 9 0 17-14 28Z" />
      <path d="M64 30c-8-6-12-11-8-16 3-4 8-2 9 2 1-4 6-6 9-2 4 5 0 10-10 16Z" />
    </g>
  </svg>
);

/** Himalayan peak range with snow caps. */
export const MountainRange = ({ className = "" }: ArtProps) => (
  <svg viewBox="0 0 220 110" aria-hidden className={className}>
    <g {...stroke} strokeWidth={2.4}>
      <path d="M2 104 46 28 74 64 108 16 146 72 180 34 218 104" />
      <path d="M36 41 46 28 57 42" />
      <path d="M97 31 108 16 120 35" />
      <path d="M170 49 180 34 191 51" />
    </g>
  </svg>
);

/** A single tall sugarcane stalk with nodes and leaves. */
export const Sugarcane = ({ className = "" }: ArtProps) => (
  <svg viewBox="0 0 64 150" aria-hidden className={className}>
    <g {...stroke} strokeWidth={2.4}>
      <path d="M32 146V14" />
      <path d="M25 128h14M25 104h14M25 80h14M25 56h14M25 32h14" />
      <path d="M32 60c-12-4-20-12-24-26 14 0 22 7 24 18" />
      <path d="M32 40c12-4 20-12 24-26-14 0-22 7-24 18" />
      <path d="M32 84c-12-4-20-12-24-26 14 0 22 7 24 18" />
    </g>
  </svg>
);

/** A little hill hut / farmhouse. */
export const Hut = ({ className = "" }: ArtProps) => (
  <svg viewBox="0 0 130 96" aria-hidden className={className}>
    <g {...stroke} strokeWidth={2.4}>
      <path d="M18 44 65 16l47 28" />
      <path d="M28 42v42h74V42" />
      <path d="M57 84V60h16v24" />
      <path d="M38 52h14v12H38zM78 52h14v12H78z" />
      <path d="M65 16V6" />
    </g>
  </svg>
);

/** A bushy tree tuft. */
export const TreeTuft = ({ className = "" }: ArtProps) => (
  <svg viewBox="0 0 84 88" aria-hidden className={className}>
    <g {...stroke} strokeWidth={2.4}>
      <path d="M42 84V52" />
      <path d="M42 60c-14 0-26-9-26-23 0-9 6-16 14-18 2-9 22-9 24 0 8 2 14 9 14 18 0 14-12 23-26 23Z" />
      <path d="M42 52l-9-9M42 60l9-9" />
    </g>
  </svg>
);

/**
 * Wide rolling-hills band — a full-width scene of hill curves with a hut,
 * trees and sugarcane, designed to sit at the foot of a section like the
 * reference landscape illustration. Stretches edge-to-edge.
 */
export const LandscapeBand = ({ className = "" }: ArtProps) => (
  <svg
    viewBox="0 0 1440 220"
    preserveAspectRatio="xMidYMax slice"
    aria-hidden
    className={className}
  >
    <g {...stroke} strokeWidth={2.2}>
      {/* far + near rolling hills */}
      <path d="M0 150C180 96 360 96 540 132s360 60 540 18 360-66 360-66" />
      <path d="M0 200C220 150 420 150 640 178s440 50 620 14 180-20 180-20" />
      {/* hut on the right rise */}
      <g transform="translate(1140 92) scale(0.8)">
        <path d="M18 44 65 16l47 28" />
        <path d="M28 42v42h74V42" />
        <path d="M57 84V60h16v24" />
        <path d="M40 52h12v12H40z" />
      </g>
      {/* tree tufts */}
      <g transform="translate(980 96) scale(0.55)">
        <path d="M42 84V52" />
        <path d="M42 60c-14 0-26-9-26-23 0-9 6-16 14-18 2-9 22-9 24 0 8 2 14 9 14 18 0 14-12 23-26 23Z" />
      </g>
      <g transform="translate(1300 104) scale(0.5)">
        <path d="M42 84V52" />
        <path d="M42 60c-14 0-26-9-26-23 0-9 6-16 14-18 2-9 22-9 24 0 8 2 14 9 14 18 0 14-12 23-26 23Z" />
      </g>
      {/* sugarcane cluster on the left */}
      <g transform="translate(120 70) scale(0.7)">
        <path d="M32 146V40" />
        <path d="M25 128h14M25 104h14M25 80h14M25 56h14" />
        <path d="M32 84c-12-4-20-12-24-26 14 0 22 7 24 18" />
        <path d="M32 64c12-4 20-12 24-26-14 0-22 7-24 18" />
      </g>
      <g transform="translate(180 84) scale(0.6)">
        <path d="M32 146V48" />
        <path d="M25 120h14M25 96h14M25 72h14" />
        <path d="M32 80c-12-4-20-12-24-26 14 0 22 7 24 18" />
      </g>
    </g>
  </svg>
);

/** A little line-art bee. */
export const Bee = ({ className = "" }: ArtProps) => (
  <svg viewBox="0 0 120 90" aria-hidden className={className}>
    <g {...stroke} strokeWidth={2.4}>
      {/* wings */}
      <path d="M64 30c10-16 30-20 36-10s-6 26-22 26" />
      <path d="M70 40c14-6 32 0 33 12s-22 14-32 4" />
      {/* body */}
      <ellipse cx="48" cy="50" rx="26" ry="18" />
      <path d="M40 34v32M52 33v34M63 38v24" />
      {/* head + antennae */}
      <circle cx="22" cy="50" r="8" />
      <path d="M18 43l-6-8M24 42l2-9" />
      {/* flight trail */}
      <path d="M86 64c8 4 8 10 0 12" />
    </g>
  </svg>
);

/** A little line-art ladybug. */
export const Ladybug = ({ className = "" }: ArtProps) => (
  <svg viewBox="0 0 90 80" aria-hidden className={className}>
    <g {...stroke} strokeWidth={2.4}>
      {/* head */}
      <path d="M30 20a16 16 0 0 1 30 0" />
      <path d="M40 12l-4-7M50 12l4-7" />
      {/* shell */}
      <path d="M14 44a31 31 0 0 1 62 0c0 18-14 30-31 30S14 62 14 44Z" />
      <path d="M45 22v52" />
      {/* spots */}
      <circle cx="30" cy="44" r="4" />
      <circle cx="60" cy="44" r="4" />
      <circle cx="33" cy="60" r="3.5" />
      <circle cx="57" cy="60" r="3.5" />
      {/* legs */}
      <path d="M16 38l-9-4M14 50H5M18 62l-8 5M74 38l9-4M76 50h9M72 62l8 5" />
    </g>
  </svg>
);

/**
 * Organic wavy divider. Renders a filled wave whose flat side is the bottom;
 * tint with `text-*` (fill follows currentColor). Set `flip` to hang the wave
 * from the top of a section instead.
 */
export const WavyEdge = ({
  className = "",
  flip = false,
}: ArtProps & { flip?: boolean }) => (
  <svg
    viewBox="0 0 1440 90"
    preserveAspectRatio="none"
    aria-hidden
    className={className}
    style={flip ? { transform: "scaleY(-1)" } : undefined}
  >
    <path
      fill="currentColor"
      d="M0 46C240 12 480 12 720 42s480 36 720 2v46H0Z"
    />
  </svg>
);
