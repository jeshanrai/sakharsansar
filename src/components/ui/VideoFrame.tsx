"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

/**
 * Self-hosted video frame for the brand pages.
 *
 * Two variants:
 *  - "ambient": muted, looping autoplay — for atmosphere (e.g. the farm loop).
 *  - "play":    shows the poster with a play button; loads the video with sound
 *               on click — for narrative films (e.g. the making-process film).
 *
 * Scaffolding-friendly: `poster` should point at an image that exists *today*,
 * so until the `.mp4` at `src` is added the frame simply shows the poster and
 * nothing looks broken. Drop the real file at `src` and it just works.
 */
export default function VideoFrame({
  src,
  poster,
  posterAlt = "",
  variant = "play",
  className = "",
  rounded = "rounded-[1.75rem]",
  label,
}: {
  src: string;
  poster: string;
  posterAlt?: string;
  variant?: "ambient" | "play";
  className?: string;
  rounded?: string;
  label?: string;
}) {
  const [playing, setPlaying] = useState(false);

  if (variant === "ambient") {
    return (
      <div className={`relative overflow-hidden ${rounded} ${className}`}>
        {/* Poster underlay — visible until the video paints (or if it's missing) */}
        <Image src={poster} alt={posterAlt} fill sizes="100vw" className="object-cover" />
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
        >
          <source src={src} type="video/mp4" />
        </video>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${rounded} ${className}`}>
      {playing ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          controls
          autoPlay
          playsInline
          poster={poster}
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={label ? `Play: ${label}` : "Play video"}
          className="group absolute inset-0 h-full w-full"
        >
          <Image src={poster} alt={posterAlt} fill sizes="100vw" className="object-cover" />
          <span className="absolute inset-0 bg-jaggery/25 group-hover:bg-jaggery/15 transition-colors" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-cream/95 text-jaggery shadow-xl shadow-jaggery/30 group-hover:scale-105 transition-transform">
              <Play className="ml-1 h-6 w-6 sm:h-7 sm:w-7 fill-jaggery" strokeWidth={1.5} />
            </span>
          </span>
          {label && (
            <span className="absolute bottom-4 left-5 right-5 text-left label-caps text-cream drop-shadow">
              {label}
            </span>
          )}
        </button>
      )}
    </div>
  );
}
