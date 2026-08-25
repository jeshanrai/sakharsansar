"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, RotateCcw } from "lucide-react";

/**
 * Route-level error boundary.
 *
 * Without this file, any thrown render error in a route segment falls through
 * to Next's built-in error screen: unstyled, brandless, and in production a
 * bare "Application error: a client-side exception has occurred" with no way
 * onward. The 404 was already handled properly by `not-found.tsx`; this is the
 * other half, and it was missing.
 *
 * Must be a Client Component and must accept `reset` — that is the contract
 * Next uses to re-render the segment without a full page reload.
 *
 * Deliberately does NOT import Footer or Navbar. Those pull in the whole
 * layout tree, and an error boundary that depends on the code most likely to
 * have thrown is an error boundary that throws while rendering the error.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // `removeConsole` in next.config.ts keeps error and warn in production, so
    // this survives the build and is the only trace of what went wrong.
    console.error("Route error:", error);
  }, [error]);

  return (
    <main className="bg-cream overflow-x-hidden pt-36 pb-24 px-5 sm:px-8 lg:px-12 min-h-[70vh]">
      <div className="max-w-3xl mx-auto">
        <p className="text-[11px] font-bold tracking-caps uppercase text-jaggery/70 mb-3">
          Something went wrong
        </p>
        <h1 className="font-marker uppercase text-jaggery leading-[0.9] tracking-tight text-[clamp(2.25rem,6vw,4rem)]">
          The kadhai boiled over
        </h1>
        <p className="mt-5 max-w-xl text-base sm:text-lg text-jaggery/70 leading-relaxed">
          A page on our side failed to load. Nothing you did caused it, and
          nothing in your bag has been lost. Try again, and if it keeps
          happening we would genuinely like to know.
        </p>

        {error.digest && (
          <p className="mt-4 text-sm text-jaggery/70">
            Reference:{" "}
            <code className="font-mono text-jaggery/70">{error.digest}</code>
          </p>
        )}

        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={reset}
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-jaggery text-cream px-7 py-4 label-caps text-[11px] hover:-translate-y-0.5 transition-transform"
          >
            <RotateCcw className="w-4 h-4" strokeWidth={1.75} />
            Try again
          </button>
          <Link
            href="/"
            className="group inline-flex items-center justify-center gap-2 rounded-full border border-jaggery/20 text-jaggery px-7 py-4 label-caps text-[11px] hover:border-jaggery/40 transition-colors"
          >
            Back to the shop
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.75} />
          </Link>
        </div>

        <p className="mt-10 text-sm text-jaggery/70">
          Still stuck?{" "}
          <Link href="/contact" className="underline underline-offset-4 hover:text-jaggery">
            Tell us what you were doing
          </Link>{" "}
          and we will fix it.
        </p>
      </div>
    </main>
  );
}
