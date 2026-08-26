"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, X, RotateCcw, ArrowRight } from "lucide-react";
import type { PurityTest } from "@/lib/purity-test";

/**
 * The interactive half of the purity test.
 *
 * Everything a crawler or a reader without JavaScript needs is rendered by the
 * page around this, in full, as prose. This adds the one thing prose cannot:
 * somewhere to put the answers while you are standing at the kitchen counter
 * with a wet glass and a piece of jaggery, and a verdict at the end that takes
 * all seven together rather than making you hold them in your head.
 *
 * `answers` holds only what has been recorded so far. Skipping is a first-class
 * option — several tests need iodine or daylight, and a tool that demands all
 * seven before it says anything is a tool people abandon at test four.
 */
type Answer = "pure" | "adulterated";

export default function PurityTestRunner({
  tests,
  verdicts,
}: {
  tests: PurityTest[];
  /** Precomputed on the server, keyed by number of failures. */
  verdicts: Record<number, { heading: string; body: string }>;
}) {
  const [answers, setAnswers] = useState<Record<string, Answer>>({});

  const answered = Object.keys(answers).length;
  const failed = Object.values(answers).filter((a) => a === "adulterated").length;
  const verdict = verdicts[failed];

  return (
    <div className="mt-10">
      <ol className="space-y-5">
        {tests.map((test) => {
          const answer = answers[test.number];
          return (
            <li
              key={test.number}
              className="rounded-2xl border border-jaggery/12 bg-ivory px-5 sm:px-7 py-6"
            >
              <div className="flex items-baseline gap-3">
                <span className="label-caps text-caramel-deep shrink-0">
                  Test {test.number}
                </span>
                <h3 className="font-display font-bold text-jaggery text-[17px] sm:text-[19px] leading-snug">
                  {test.name}
                </h3>
              </div>

              <p className="mt-3 text-jaggery/75 text-body">{test.instruction}</p>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  aria-pressed={answer === "pure"}
                  onClick={() =>
                    setAnswers((a) => ({ ...a, [test.number]: "pure" }))
                  }
                  className={`text-left rounded-xl border px-4 py-3.5 transition-colors ${
                    answer === "pure"
                      ? "border-grove bg-grove/10 text-jaggery"
                      : "border-jaggery/15 hover:border-grove/60 text-jaggery/80"
                  }`}
                >
                  <span className="flex items-center gap-2 label-caps text-grove mb-1.5">
                    <Check className="w-3.5 h-3.5" strokeWidth={2.5} aria-hidden />
                    Mine did this
                  </span>
                  {test.pure}
                </button>

                <button
                  type="button"
                  aria-pressed={answer === "adulterated"}
                  onClick={() =>
                    setAnswers((a) => ({ ...a, [test.number]: "adulterated" }))
                  }
                  className={`text-left rounded-xl border px-4 py-3.5 transition-colors ${
                    answer === "adulterated"
                      ? "border-terracotta bg-terracotta/10 text-jaggery"
                      : "border-jaggery/15 hover:border-terracotta/60 text-jaggery/80"
                  }`}
                >
                  <span className="flex items-center gap-2 label-caps text-terracotta mb-1.5">
                    <X className="w-3.5 h-3.5" strokeWidth={2.5} aria-hidden />
                    Mine did this
                  </span>
                  {test.adulterated}
                </button>
              </div>

              <p className="mt-3.5 text-[13px] text-jaggery/60">
                Not sure, or no iodine to hand?{" "}
                <Link
                  href={`/blog/how-to-identify-pure-jaggery-sakhar#${test.anchor}`}
                  className="text-grove underline underline-offset-4 hover:text-jaggery transition-colors"
                >
                  read this test in full
                </Link>{" "}
                and skip it for now.
              </p>
            </li>
          );
        })}
      </ol>

      {/* The verdict appears once anything has been recorded, and updates as
          more is. Waiting for all seven would strand anyone without iodine. */}
      <div
        aria-live="polite"
        className="mt-9 rounded-2xl border border-jaggery/12 bg-cream px-5 sm:px-7 py-7"
      >
        {answered === 0 ? (
          <p className="text-jaggery/70 text-body">
            Record a result above and the reading appears here. You do not need
            all seven. Most people run the water test and the colour test and
            already know more than they did.
          </p>
        ) : (
          <>
            <h2 className="font-serif text-h4 text-jaggery">{verdict.heading}</h2>
            <p className="mt-3 text-jaggery/75 text-body">{verdict.body}</p>
            <p className="mt-4 text-[13px] text-jaggery/60">
              Based on {answered} of {tests.length} tests recorded.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setAnswers({})}
                className="inline-flex items-center gap-2 rounded-full border border-jaggery/20 px-5 py-2.5 label-caps text-jaggery/75 hover:border-jaggery/45 hover:text-jaggery transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" strokeWidth={2} aria-hidden />
                Start again
              </button>
              <Link
                href="/blog/how-to-identify-pure-jaggery-sakhar"
                className="inline-flex items-center gap-2 rounded-full bg-jaggery text-cream px-6 py-3 label-caps hover:bg-grove transition-colors"
              >
                Read the full guide
                <ArrowRight className="w-4 h-4" strokeWidth={2} aria-hidden />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
