/**
 * Single source of truth for the site's public identity.
 *
 * The canonical host is the www subdomain of our official .com.np domain.
 * Every canonical link, sitemap entry, feed URL and JSON-LD `@id` must agree
 * on it — if some pages say `sakharsansar.com.np` and others say
 * `www.sakharsansar.com.np`, search engines treat them as two different sites
 * and split the ranking signals between them.
 *
 * Non-canonical hosts (the bare apex, the old .com, the Vercel URL) should be
 * 301-redirected here at the DNS/hosting layer.
 */
export const SITE_URL = "https://www.sakharsansar.com.np";

/** Hosts that must 301 to SITE_URL. Kept here so the backend CORS list and any
 *  future redirect config read from the same place. */
export const LEGACY_HOSTS = [
  "https://sakharsansar.com.np",
  "https://sakharsansar.com",
  "https://www.sakharsansar.com",
  "https://sakharsansar.vercel.app",
] as const;

export const SITE = {
  url: SITE_URL,
  name: "SakharSansar",
  alternateNames: ["Sakhar Sansar", "सखर संसार", "Sakhar"],
  tagline: "Pure, Chemical-Free Jaggery from Sankhuwasabha",
  description:
    "100% organic Sakhar (Himalayan jaggery). Wood-fired, chemical-free, direct from Sankhuwasabha farmers. Premium pure gur shipped pan-Nepal.",
  email: "sakharsansar@gmail.com",
  phone: "+977-9860149199",
  /** Digits-only, for wa.me and tel: links. */
  phoneDigits: "9779860149199",
  /** BCP-47 for <html lang>; the underscore form is what Open Graph wants. */
  lang: "en-NP",
  ogLocale: "en_NP",
  foundingYear: "2024",
  /** Where the business can be reached — office and dispatch point. */
  address: {
    street: "Kapan",
    locality: "Kathmandu",
    region: "Bagmati Province",
    country: "NP",
  },
  /** Where the jaggery is actually made. Kept apart from `address` so the
   *  farm story and the contactable address never get conflated. */
  origin: {
    locality: "Sankhuwasabha",
    region: "Koshi Province",
  },
  social: [
    "https://facebook.com/sakharsansar",
    "https://instagram.com/sakharsansar",
    "https://tiktok.com/@sakharsansar",
    "https://youtube.com/@sakharsansar",
  ],
} as const;

/**
 * The commercial terms the storefront quotes back to the customer.
 *
 * These were previously written out longhand wherever they appeared — the
 * promo bar, /shipping-policy and /llms.txt each carried their own copy of the
 * free-shipping figure. They agreed, but only by luck: nothing connected them,
 * so the first person to run a promotion would have moved one and left the
 * other two contradicting it. A shop that advertises two different thresholds
 * is a shop that argues with its own customers at checkout.
 *
 * `formatRs` is here rather than at each call site so the thousands separator
 * is decided once. "Rs. 1500" and "Rs. 1,500" on the same page look like two
 * different numbers to a reader skimming.
 */
export const COMMERCE = {
  /** Order value above which delivery is free, in NPR. */
  freeShippingThreshold: 1500,
  discountCode: "SAKHAR10",
  discountPercent: 10,
  /** Order value the discount code needs to clear, in NPR. */
  discountMinimum: 1500,
} as const;

/** 1500 -> "Rs. 1,500". Nepali grouping is 3-digit up to 5 figures, which is
 *  where every number we quote sits, so plain en-US grouping is correct here. */
export function formatRs(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-US")}`;
}

/**
 * Turn a site-relative path into an absolute URL.
 * JSON-LD has no `metadataBase` equivalent — every URL inside it must be
 * absolute — so schema builders route through here.
 */
export function absoluteUrl(path = "/"): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  // "/" maps to the bare origin so schema URLs match the home page's
  // canonical exactly — a trailing slash there reads as a different URL.
  if (path === "/" || path === "") return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
