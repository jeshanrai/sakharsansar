"use client";

import { useState } from "react";
import {
  costPerCup,
  GRAMS_PER_CUP_DEFAULT,
  GRAMS_PER_CUP_MAX,
  GRAMS_PER_CUP_MIN,
  WHO_DAILY_FREE_SUGAR_G,
  type CatalogueReference,
} from "@/lib/cost-per-cup";
import { formatRs } from "@/lib/site";

/**
 * The interactive half. The worked example and every constant it uses are
 * rendered by the page around this, so a reader without JavaScript still gets
 * the arithmetic and the answer for our own block.
 *
 * Rupees are shown to two decimals because the answer is between one and three
 * of them, and rounding to whole rupees would make every strength look the
 * same. The article publishes "about Rs. 1.60" and "Rs. 2.00" for the same
 * reason.
 */
export default function CostPerCupCalculator({
  references,
}: {
  references: CatalogueReference[];
}) {
  const ourBlock = references[0];
  const [pricePerKg, setPricePerKg] = useState(ourBlock?.pricePerKg ?? 400);
  const [gramsPerCup, setGramsPerCup] = useState(GRAMS_PER_CUP_DEFAULT);

  const { cupsPerKg, perCup, cupsToDailyLimit } = costPerCup(pricePerKg, gramsPerCup);

  return (
    <div className="mt-9 rounded-2xl border border-jaggery/12 bg-ivory px-5 sm:px-8 py-7">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
        <div>
          <label
            htmlFor="price-per-kg"
            className="label-caps text-jaggery/70 block mb-2.5"
          >
            Price per kilo (Rs.)
          </label>
          <input
            id="price-per-kg"
            type="number"
            min={1}
            max={5000}
            step={10}
            value={pricePerKg}
            onChange={(e) => setPricePerKg(Math.max(1, Number(e.target.value) || 0))}
            className="w-full rounded-xl border border-jaggery/20 bg-cream px-4 py-3 text-jaggery text-[17px] font-display font-bold tabular-nums focus:border-grove focus:outline-none"
          />
          <p className="mt-2.5 text-[13px] text-jaggery/60">
            Whatever you pay, or are about to. Ours is prefilled.
          </p>
        </div>

        <div>
          <label
            htmlFor="grams-per-cup"
            className="label-caps text-jaggery/70 block mb-2.5"
          >
            Sakhar per cup: {gramsPerCup} g
          </label>
          <input
            id="grams-per-cup"
            type="range"
            min={GRAMS_PER_CUP_MIN}
            max={GRAMS_PER_CUP_MAX}
            step={1}
            value={gramsPerCup}
            onChange={(e) => setGramsPerCup(Number(e.target.value))}
            className="w-full accent-grove h-11"
          />
          <p className="mt-2.5 text-[13px] text-jaggery/60">
            A level teaspoon of grated sakhar is about 4 to 5 g. Most people use
            one to one and a half.
          </p>
        </div>
      </div>

      <div
        aria-live="polite"
        className="mt-8 pt-7 border-t border-jaggery/12 grid grid-cols-1 sm:grid-cols-3 gap-6"
      >
        <Figure label="Cost per cup" value={`Rs. ${perCup.toFixed(2)}`} />
        <Figure label="Cups from a kilo" value={String(Math.round(cupsPerKg))} />
        <Figure
          label={`Cups to ${WHO_DAILY_FREE_SUGAR_G} g of sugar`}
          value={cupsToDailyLimit.toFixed(1)}
        />
      </div>

      {references.length > 1 && (
        <div className="mt-8 pt-7 border-t border-jaggery/12">
          <p className="label-caps text-jaggery/70 mb-3.5">Ours, per kilo</p>
          <div className="flex flex-wrap gap-2.5">
            {references.map((r) => (
              <button
                key={r.slug}
                type="button"
                onClick={() => setPricePerKg(r.pricePerKg)}
                className={`rounded-full border px-4 py-2 text-[13px] transition-colors ${
                  pricePerKg === r.pricePerKg
                    ? "border-grove bg-grove/10 text-jaggery"
                    : "border-jaggery/20 text-jaggery/75 hover:border-grove/60"
                }`}
              >
                {r.name}
                <span className="text-jaggery/55">
                  {" "}
                  · {formatRs(r.pricePerKg)}/kg
                </span>
              </button>
            ))}
          </div>
          {/* The powder is roughly 50% more per kilo than the block. Saying so
              here, on our own calculator, is the same thing the price article
              does — and it is the reason to trust the number above it. */}
          <p className="mt-3.5 text-[13px] text-jaggery/60">
            The powder costs more per kilo than the block because it is the same
            sakhar with a step added and a smaller pack. If you use a lot of it,
            buy the block and grate it.
          </p>
        </div>
      )}
    </div>
  );
}

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="label-caps text-jaggery/60 mb-1.5">{label}</p>
      <p className="font-display font-bold text-jaggery text-[28px] sm:text-[32px] leading-none tabular-nums">
        {value}
      </p>
    </div>
  );
}
