import { COMMERCE } from "./site";
import type { Locale } from "./hreflang";

/**
 * The UI strings, in both languages.
 *
 * The three Nepali articles are written natively and read well, and then every
 * word around them was in English: the nav said Home / Shop / Our Story, the
 * promo bar advertised "Flat 10% off", the byline said "Written by", and the
 * footer ran to eleven English links. A Devanagari article inside English
 * furniture reads as a translation someone abandoned halfway, which is exactly
 * the impression the writing is there to avoid.
 *
 * Deliberately not `next-intl`, and deliberately not a `[locale]` restructure.
 * docs/i18n-plan.md makes the case for both — and makes it conditional on
 * there being Nepali versions of the main routes to justify them. There are
 * not, yet. This is the part that can be done now without a dependency, a
 * middleware on a fully static site, or moving thirty-five route directories:
 * a typed dictionary, read by the components that already know the path.
 *
 * Flat keys on purpose. `Messages` is derived from the English set, so leaving
 * a key out of `ne` is a compile error rather than a string that renders as
 * itself at runtime — which is the failure this kind of file usually ships.
 *
 * NOTE FOR REVIEW: these are UI labels, not prose. docs/i18n-plan.md is
 * explicit that body copy, product descriptions and policy pages need a native
 * writer and must not be bulk-translated. Nothing here is body copy. A native
 * speaker should still read the list once.
 */

/** 1500 → "१,५००" in Nepali, "1,500" in English. */
export function formatNumber(n: number, locale: Locale): string {
  return n.toLocaleString(locale === "ne" ? "ne-NP" : "en-US");
}

/** The site quotes money as "Rs. 1,500" / "रु. १,५००". */
export function formatMoney(n: number, locale: Locale): string {
  return locale === "ne" ? `रु. ${formatNumber(n, "ne")}` : `Rs. ${formatNumber(n, "en")}`;
}

/**
 * Which language a path is served in.
 *
 * The only Nepali routes are under /ne. Everything else is English, including
 * the root — English is un-prefixed and stays that way, because prefixing it
 * would 301 every URL on the site to buy nothing (docs/i18n-plan.md §1).
 */
export function localeFromPath(pathname: string | null | undefined): Locale {
  return pathname === "/ne" || pathname?.startsWith("/ne/") ? "ne" : "en";
}

const en = {
  // ── Navigation
  navHome: "Home",
  navShop: "Shop",
  navStory: "Our Story",
  navJournal: "Blogs",
  navContact: "Contact",
  navWholesale: "Wholesale",
  navPrice: "Sakhar Price",
  navFavourites: "Favourites",
  navCart: "View Cart",
  navMenuOpen: "Open menu",
  navMenuClose: "Close menu",

  // ── Language switcher
  langSwitchToNe: "नेपालीमा पढ्नुहोस्",
  langSwitchToEn: "Read in English",
  langLabel: "Language",

  // ── Promo bar
  promoDiscount: `Flat ${COMMERCE.discountPercent}% off on pure sakhar above ${formatMoney(COMMERCE.discountMinimum, "en")} with code`,
  promoOrganic: "100% organic sakhar · No chemicals · Direct from farmers",
  promoShipping: `Free shipping pan-Nepal on orders above ${formatMoney(COMMERCE.freeShippingThreshold, "en")}`,
  promoWoodFired: "Wood-fired sakhar from Sankhuwasabha · Packed when you order",

  // ── Article chrome
  articleReadTime: "min read",
  articleShortAnswer: "The short answer",
  articleScrollTable: "Scroll the table sideways →",
  articleWrittenBy: "Written by",
  articleShare: "Share this story",
  articleMoreFrom: "More from the Journal",
  articleKeepReading: "Keep reading",
  articleReadArticle: "Read article",
  articleUpdated: "Last updated",

  // ── Footer
  footerExplore: "Explore",
  footerHelp: "Help",
  footerLegal: "Legal",
  footerShippingPolicy: "Shipping Policy",
  footerRefundPolicy: "Refund Policy",
  footerPrivacyPolicy: "Privacy Policy",
  footerTerms: "Terms",
  footerContactUs: "Contact Us",
  footerPress: "Press",
  footerHome: "SakharSansar home",
  footerRights: "Crafted in the Himalayas.",
  footerMadeIn: "Made in",

  // ── Breadcrumbs
  crumbHome: "Home",
  crumbJournal: "Journal",

  // ── Closing CTA band on an article. Short, factual, and the same claim the
  //    rest of the site makes — which is what makes it safe to translate here
  //    rather than treat as body copy.
  ctaEyebrow: "From page to pantry",
  ctaHeading: "Now, taste the story",
  ctaBody:
    "Every block, powder and pour ships directly from Sankhuwasabha to your home. No middleman, no shortcuts.",
  ctaButton: "Shop the harvest",
} as const;

/** Every key in `en`, required. A missing one will not compile. */
type Messages = { readonly [K in keyof typeof en]: string };

const ne: Messages = {
  // ── Navigation
  navHome: "गृहपृष्ठ",
  navShop: "पसल",
  navStory: "हाम्रो कथा",
  navJournal: "जर्नल",
  navContact: "सम्पर्क",
  navWholesale: "थोक",
  navPrice: "सखर मूल्य",
  navFavourites: "मन पर्ने",
  navCart: "कार्ट हेर्नुहोस्",
  navMenuOpen: "मेनु खोल्नुहोस्",
  navMenuClose: "मेनु बन्द गर्नुहोस्",

  // ── Language switcher. Each names the language it goes *to*, in that
  //    language — the one convention every language switcher shares, because
  //    a reader who cannot read the current page can still read the offer.
  langSwitchToNe: "नेपालीमा पढ्नुहोस्",
  langSwitchToEn: "Read in English",
  langLabel: "भाषा",

  // ── Promo bar. Devanagari numerals, matching the articles: they write
  //    १०, २५, १०० in prose and keep Latin digits only for citations.
  promoDiscount: `${formatNumber(COMMERCE.discountMinimum, "ne")} रुपैयाँमाथिको शुद्ध सख्खरमा ${formatNumber(COMMERCE.discountPercent, "ne")}% छुट, कोड`,
  promoOrganic: "१००% अर्गानिक सख्खर · कुनै रसायन छैन · सिधै किसानबाट",
  promoShipping: `${formatMoney(COMMERCE.freeShippingThreshold, "ne")} माथिको अर्डरमा नेपालभरि निःशुल्क ढुवानी`,
  promoWoodFired: "सङ्खुवासभाको दाउराको आगोमा बनेको सख्खर · अर्डर आएपछि प्याक गरिन्छ",

  // ── Article chrome
  articleReadTime: "मिनेट पढ्न",
  articleShortAnswer: "छोटो उत्तर",
  articleScrollTable: "तालिका छेउतिर सार्नुहोस् →",
  articleWrittenBy: "लेखक",
  articleShare: "यो लेख सेयर गर्नुहोस्",
  articleMoreFrom: "जर्नलबाट थप",
  articleKeepReading: "अझै पढ्नुहोस्",
  articleReadArticle: "लेख पढ्नुहोस्",
  articleUpdated: "अन्तिम अद्यावधिक",

  // ── Footer
  footerExplore: "हेर्नुहोस्",
  footerHelp: "सहयोग",
  footerLegal: "कानुनी",
  footerShippingPolicy: "ढुवानी नीति",
  footerRefundPolicy: "फिर्ता नीति",
  footerPrivacyPolicy: "गोपनीयता नीति",
  footerTerms: "सर्तहरू",
  footerContactUs: "सम्पर्क गर्नुहोस्",
  footerPress: "प्रेस",
  footerHome: "सखर संसार गृहपृष्ठ",
  footerRights: "हिमालमा बनेको।",
  footerMadeIn: "बनेको ठाउँ",

  // ── Breadcrumbs
  crumbHome: "गृहपृष्ठ",
  crumbJournal: "जर्नल",

  // ── Closing CTA band. The English sat untranslated under three Devanagari
  //    articles — the last thing a Nepali reader saw before being asked to buy.
  ctaEyebrow: "लेखबाट भान्सासम्म",
  ctaHeading: "अब स्वाद लिनुहोस्",
  ctaBody:
    "हरेक ढिक्का र धुलो सिधै सङ्खुवासभाबाट तपाईंको घरसम्म पुग्छ। बिचौलिया छैन, छोटो बाटो छैन।",
  ctaButton: "सख्खर किन्नुहोस्",
};

const MESSAGES: Record<Locale, Messages> = { en, ne };

/**
 * Display labels for the journal's tags.
 *
 * The tag itself stays English in blog.json and stays the key everywhere — it
 * is what `blogCategorySlug` derives /blog/category/comparison from, and what
 * `relatedPosts` scores on. Only the label a reader sees is translated, so the
 * Nepali articles stop showing "Comparison · Nutrition · Sakhar 101" under a
 * Devanagari headline while the routing underneath is untouched.
 *
 * A tag with no Nepali label falls through to the English one rather than
 * rendering a key — a new tag should look untranslated, not broken.
 */
const TAG_LABELS: Record<string, string> = {
  "Buying Guide": "किन्ने सल्लाह",
  Comparison: "तुलना",
  Health: "स्वास्थ्य",
  "How-To": "कसरी गर्ने",
  "Jaggery Purity": "सख्खरको शुद्धता",
  Nutrition: "पोषण",
  Recipes: "परिकार",
  "Sakhar 101": "सख्खर आधारभूत",
};

export function tagLabel(tag: string, locale: Locale): string {
  return locale === "ne" ? (TAG_LABELS[tag] ?? tag) : tag;
}

/** The dictionary for a locale. `const m = t(locale); m.navShop`. */
export function t(locale: Locale): Messages {
  return MESSAGES[locale];
}
