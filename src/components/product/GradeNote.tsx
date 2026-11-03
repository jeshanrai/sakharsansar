import Link from "next/link";
import type { Locale } from "@/lib/hreflang";
import { formatPrice } from "@/lib/i18n";
import { MARKET } from "@/lib/site";

/**
 * The line that sits under a sakhar price.
 *
 * Rs. 400 reads as expensive to anyone who does not know that Kathmandu
 * shops sell sakhar in three grades, and the answer to that hesitation is
 * on /sakhar-price. This puts the market's own price ladder next to ours
 * and one tap from the argument for it, rather than leaving the buyer to
 * find the price page themselves.
 *
 * The Gulmi figure is read from MARKET, with its source; Terai gets no
 * figure because we have not checked one. There is no Nepali price page,
 * so the Nepali line links the English section.
 */
export default function GradeNote({
  locale = "en",
  className = "",
}: {
  locale?: Locale;
  className?: string;
}) {
  const gulmi = formatPrice(MARKET.gulmiPerKg, locale);
  const link = "text-grove underline underline-offset-4 hover:text-jaggery transition-colors";

  return (
    <p className={`text-[14px] text-jaggery/70 leading-relaxed ${className}`}>
      {locale === "ne" ? (
        <>
          सङ्खुवासभाको सख्खर। गुल्मीको सख्खर किलोको करिब {gulmi} मा र
          तराईको गुड त्योभन्दा सस्तोमा बिक्छ।{" "}
          <Link href={MARKET.worthItPath} hrefLang="en" className={link}>
            मूल्यमा फरक किन छ, यहाँ पढ्नुहोस्।
          </Link>
        </>
      ) : (
        <>
          Sankhuwasabha grade. Gulmi sakhar sells for about {gulmi} a kilo
          and Terai gud for less.{" "}
          <Link href={MARKET.worthItPath} className={link}>
            Here is what the difference buys.
          </Link>
        </>
      )}
    </p>
  );
}
