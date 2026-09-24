"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

/**
 * One of our TikToks, as a poster until someone asks for it.
 *
 * TikTok's own embed script is a few hundred kilobytes of third-party
 * JavaScript and a cookie banner's worth of trackers, loaded whether or not
 * anyone presses play. This shows our own copy of the thumbnail and loads
 * TikTok's player only on click, so the article costs nothing extra to read.
 *
 * The VideoObject markup is rendered by the page, on the server, from the
 * same fields: see `videoLd` in @/lib/seo.
 */
export default function TikTokVideo({
  id,
  title,
  thumbnail,
  playLabel = "Play video",
}: {
  id: string;
  title: string;
  /** Our own copy under public/. TikTok's thumbnail URLs are signed and expire. */
  thumbnail: string;
  playLabel?: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-[9/16] w-full max-w-[340px] mx-auto overflow-hidden rounded-3xl bg-jaggery ring-1 ring-jaggery/10 shadow-xl shadow-jaggery/15">
      {playing ? (
        <iframe
          src={`https://www.tiktok.com/player/v1/${id}?autoplay=1&rel=0`}
          title={title}
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`${playLabel}: ${title}`}
          className="group absolute inset-0 h-full w-full"
        >
          <Image src={thumbnail} alt="" fill sizes="340px" className="object-cover" />
          <span className="absolute inset-0 flex items-center justify-center bg-jaggery/10 group-hover:bg-jaggery/20 transition-colors">
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-cream/95 text-jaggery shadow-lg">
              <Play className="h-7 w-7 translate-x-0.5" strokeWidth={1.75} fill="currentColor" />
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
