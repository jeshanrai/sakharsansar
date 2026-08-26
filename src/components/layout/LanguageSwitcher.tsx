"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Languages } from "lucide-react";
import { localeFromPath, t } from "@/lib/i18n";

/**
 * The language switcher.
 *
 * There was none anywhere on the site. The only way from an English article to
 * its Nepali translation was a link at the foot of the Nepali one — the wrong
 * direction, below the fold, on the page you had already found.
 *
 * Two rules, both from docs/i18n-plan.md:
 *
 *   1. **Only offer a counterpart that exists.** Three articles are translated,
 *      and one of them — `sakhar-khane-faida` — has no English version at all.
 *      Sending a reader to a 404, or quietly to the home page when they asked
 *      for *this* page in another language, is worse than not offering. Where
 *      there is nothing to switch to, nothing renders.
 *   2. **Name the destination language in that language.** Somebody who cannot
 *      read the page they are on can still read the offer.
 *
 * `translations` is a path → path map built on the server (see
 * `translationPaths` in @/lib/blog) and handed down. Looking it up here from
 * `posts` instead would pull every article's body into the client bundle for
 * the sake of three short strings.
 */
export default function LanguageSwitcher({
  translations,
  className = "",
}: {
  translations: Record<string, string>;
  className?: string;
}) {
  const pathname = usePathname() ?? "/";
  const counterpart = translations[pathname];
  if (!counterpart) return null;

  const locale = localeFromPath(pathname);
  const m = t(locale);

  return (
    <Link
      href={counterpart}
      // A translation is a different document in a different language, and
      // saying so is what lets assistive tech switch pronunciation and search
      // engines read this as a translation link rather than a related one.
      hrefLang={locale === "ne" ? "en-NP" : "ne-NP"}
      lang={locale === "ne" ? "en" : "ne"}
      className={`inline-flex items-center gap-1.5 label-caps text-jaggery/70 hover:text-grove transition-colors ${className}`}
    >
      <Languages className="w-3.5 h-3.5 shrink-0" strokeWidth={1.8} aria-hidden />
      {locale === "ne" ? m.langSwitchToEn : m.langSwitchToNe}
    </Link>
  );
}
