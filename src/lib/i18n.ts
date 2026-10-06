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

const DEVANAGARI_DIGITS = "०१२३४५६७८९";

/**
 * 1500 → "१,५००" in Nepali, "1,500" in English.
 *
 * The Nepali form is built by hand rather than with `toLocaleString("ne-NP")`.
 * That depends on the locale data the runtime ships, and they differ: Node
 * renders Devanagari digits, while Chromium builds with a trimmed ICU (Android
 * Chrome among them) return "1,500". The promo bar is prerendered by one and
 * hydrated by the other, so every /ne page failed hydration and React threw
 * away the server HTML for it and rendered again in the browser. Same output
 * as Node's ne-NP, lakh grouping included: 150000 → "१,५०,०००".
 */
export function formatNumber(n: number, locale: Locale): string {
  if (locale !== "ne") return n.toLocaleString("en-US");
  const [int, frac] = Math.abs(n).toString().split(".");
  // South Asian grouping: the last three digits, then pairs.
  const grouped =
    int.length <= 3
      ? int
      : `${int.slice(0, -3).replace(/\B(?=(\d{2})+$)/g, ",")},${int.slice(-3)}`;
  const text = (n < 0 ? "-" : "") + grouped + (frac ? `.${frac}` : "");
  return text.replace(/\d/g, (d) => DEVANAGARI_DIGITS[Number(d)]);
}

/** The site quotes money as "Rs. 1,500" / "रु. १,५००". */
export function formatMoney(n: number, locale: Locale): string {
  return locale === "ne" ? `रु. ${formatNumber(n, "ne")}` : `Rs. ${formatNumber(n, "en")}`;
}

/**
 * A price, as a shop shows it: "Rs. 400" / "रु. 400".
 *
 * Latin digits in both languages, unlike `formatMoney`. Nepali shops write
 * prices this way (Daraz, SastoDeal), and Google checks a Product's offer
 * price against the digits visible on the page; "४००" is a number a reader
 * understands and a price-matching crawler may not.
 */
export function formatPrice(n: number, locale: Locale): string {
  return `${locale === "ne" ? "रु." : "Rs."} ${n.toLocaleString("en-US")}`;
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
    "Every block and pouch is made in Sankhuwasabha and delivered to your door. No middleman, no shortcuts.",
  ctaButton: "Shop the harvest",
  // ── Buying: the product page button and the order drawer. The drawer is
  //    the last step before a sale, and a Nepali shopper who has read a whole
  //    product page in Nepali should not meet "Continue to Delivery" there.
  buyAddToOrder: "Add to Order",
  buySaveFav: "Save to favourites",
  buyRemoveFav: "Remove from favourites",
  drawerTitle: "Place Order",
  drawerTitleDone: "Order Confirmed",
  drawerAria: "Place your order",
  drawerAriaDone: "Order confirmed",
  drawerStepOrder: "Order",
  drawerStepDelivery: "Delivery",
  drawerClose: "Close",
  drawerSelect: "Select Product",
  drawerChoose: "Choose a product",
  drawerCustom: "Custom / Bulk Order",
  drawerCustomShort: "Custom Order",
  drawerPricingOnCall: "Pricing confirmed on call",
  drawerEach: "each",
  drawerQuantity: "Quantity",
  drawerDecrease: "Decrease quantity",
  drawerIncrease: "Increase quantity",
  drawerTotal: "Order Total",
  drawerContinue: "Continue to Delivery",
  drawerName: "Full Name",
  drawerNamePh: "Your Name",
  drawerPhone: "Phone Number",
  drawerPhoneInvalid: "Enter a valid phone number",
  drawerAddress: "Delivery Address",
  drawerAddressPh: "City, Street, House No.",
  drawerCallNote: "We'll call you to confirm your order and delivery details.",
  drawerCallNoteCustom: "Pricing for custom/bulk orders is confirmed on the call.",
  drawerCallNoteCharges: "Delivery charges (if any) are confirmed on the call.",
  drawerError: "We couldn't place your order just now. Please check your connection and try again, or call us directly.",
  drawerBack: "Back",
  drawerRequest: "Request Order",
  drawerPlace: "Place Order",
  drawerConfirmed: "Order Confirmed!",
  drawerRowProduct: "Product",
  drawerRowTotal: "Total",
  drawerRowName: "Name",
  drawerRowPhone: "Phone",
  drawerRowAddress: "Address",
  drawerThanks: "Thank you for your order, {name}! We will contact you at {phone} shortly to confirm delivery details.",
  drawerKeepShopping: "Continue Shopping",
  drawerCode: "Discount Code",
  drawerCodePh: "e.g. SAKHAR10",
  drawerCodeApply: "Apply",
  drawerCodeRemove: "Remove",
  drawerCodeApplied: `${COMMERCE.discountPercent}% off applied`,
  drawerCodeInvalid: "That code isn't valid.",
  drawerCodeBelowMin: "This code works on orders of {min} or more. Add {more} to use it.",
  drawerSubtotal: "Subtotal",
  drawerDiscount: "Discount",
  drawerDelivery: "Delivery",
  drawerDeliveryFree: "Free",
  drawerDeliveryOnCall: "Confirmed on call",
  drawerToFree: "Add {more} more for free delivery.",
  drawerFreeNote: "Delivery is free on this order.",
  drawerRef: "Order Ref",
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
    "हरेक ढिक्का र पोका सङ्खुवासभामा बन्छ र तपाईंको घरसम्म पुग्छ। बिचौलिया छैन, छोटो बाटो छैन।",
  ctaButton: "सख्खर किन्नुहोस्",
  // ── Buying. NOTE FOR REVIEW: every line below is new.
  buyAddToOrder: "अर्डरमा थप्नुहोस्",
  buySaveFav: "मन पर्नेमा राख्नुहोस्",
  buyRemoveFav: "मन पर्नेबाट हटाउनुहोस्",
  drawerTitle: "अर्डर गर्नुहोस्",
  drawerTitleDone: "अर्डर पक्का भयो",
  drawerAria: "आफ्नो अर्डर गर्नुहोस्",
  drawerAriaDone: "अर्डर पक्का भयो",
  drawerStepOrder: "अर्डर",
  drawerStepDelivery: "डेलिभरी",
  drawerClose: "बन्द गर्नुहोस्",
  drawerSelect: "सामान छान्नुहोस्",
  drawerChoose: "एउटा सामान छान्नुहोस्",
  drawerCustom: "विशेष / थोक अर्डर",
  drawerCustomShort: "विशेष अर्डर",
  drawerPricingOnCall: "मूल्य फोनमा पक्का गरिन्छ",
  drawerEach: "प्रति वटा",
  drawerQuantity: "परिमाण",
  drawerDecrease: "परिमाण घटाउनुहोस्",
  drawerIncrease: "परिमाण बढाउनुहोस्",
  drawerTotal: "जम्मा रकम",
  drawerContinue: "डेलिभरी विवरणमा जानुहोस्",
  drawerName: "पूरा नाम",
  drawerNamePh: "तपाईंको नाम",
  drawerPhone: "फोन नम्बर",
  drawerPhoneInvalid: "सही फोन नम्बर लेख्नुहोस्",
  drawerAddress: "डेलिभरी ठेगाना",
  drawerAddressPh: "सहर, टोल, घर नम्बर",
  drawerCallNote: "अर्डर र डेलिभरी विवरण पक्का गर्न हामी तपाईंलाई फोन गर्छौँ।",
  drawerCallNoteCustom: "विशेष वा थोक अर्डरको मूल्य फोनमै पक्का गरिन्छ।",
  drawerCallNoteCharges: "डेलिभरी शुल्क (लाग्ने भए) फोनमै पक्का गरिन्छ।",
  drawerError: "अहिले अर्डर पठाउन सकिएन। इन्टरनेट जाँचेर फेरि प्रयास गर्नुहोस्, वा हामीलाई सिधै फोन गर्नुहोस्।",
  drawerBack: "पछाडि",
  drawerRequest: "अर्डर अनुरोध गर्नुहोस्",
  drawerPlace: "अर्डर पठाउनुहोस्",
  drawerConfirmed: "अर्डर पक्का भयो!",
  drawerRowProduct: "सामान",
  drawerRowTotal: "जम्मा",
  drawerRowName: "नाम",
  drawerRowPhone: "फोन",
  drawerRowAddress: "ठेगाना",
  drawerThanks: "अर्डरका लागि धन्यवाद, {name}! डेलिभरी विवरण पक्का गर्न हामी छिट्टै {phone} मा सम्पर्क गर्नेछौँ।",
  drawerKeepShopping: "किनमेल जारी राख्नुहोस्",
  drawerCode: "छुट कोड",
  drawerCodePh: "जस्तै SAKHAR10",
  drawerCodeApply: "लगाउनुहोस्",
  drawerCodeRemove: "हटाउनुहोस्",
  drawerCodeApplied: `${formatNumber(COMMERCE.discountPercent, "ne")}% छुट लाग्यो`,
  drawerCodeInvalid: "यो कोड मिलेन।",
  drawerCodeBelowMin: "यो कोड {min} वा बढीको अर्डरमा लाग्छ। प्रयोग गर्न {more} थप्नुहोस्।",
  drawerSubtotal: "उप-जम्मा",
  drawerDiscount: "छुट",
  drawerDelivery: "डेलिभरी",
  drawerDeliveryFree: "निःशुल्क",
  drawerDeliveryOnCall: "फोनमा पक्का गरिन्छ",
  drawerToFree: "निःशुल्क डेलिभरीका लागि {more} थप्नुहोस्।",
  drawerFreeNote: "यो अर्डरमा डेलिभरी निःशुल्क छ।",
  drawerRef: "अर्डर नम्बर",
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

/**
 * Product names in Nepali, keyed by the English name.
 *
 * Keyed by name rather than slug because the order drawer and the backend
 * both identify a product by its English name; that stays the value that is
 * submitted, and only the label a Nepali shopper reads changes.
 * NOTE FOR REVIEW.
 */
const PRODUCT_NAMES_NE: Record<string, string> = {
  "Sankhuwasabha Sakhar Block": "सङ्खुवासभा सख्खर ढिक्का",
  "Sankhuwasabha Sakhar Powder": "सङ्खुवासभा सख्खर धुलो",
  "Mixed Dry Fruits": "सख्खर लगाएको मिश्रित सुकामेवा",
};

export function productName(name: string, locale: Locale): string {
  return locale === "ne" ? (PRODUCT_NAMES_NE[name] ?? name) : name;
}

export function tagLabel(tag: string, locale: Locale): string {
  return locale === "ne" ? (TAG_LABELS[tag] ?? tag) : tag;
}

/** The dictionary for a locale. `const m = t(locale); m.navShop`. */
export function t(locale: Locale): Messages {
  return MESSAGES[locale];
}
