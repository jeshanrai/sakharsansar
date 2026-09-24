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
  tagline: "Sankhuwasabha Sakhar (सखर) — Pure and Chemical-Free",
  description:
    "Sankhuwasabha Sakhar (सखर): 100% organic Himalayan jaggery, wood-fired and chemical-free, direct from our farmers. Pure gur shipped pan-Nepal.",
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
  /**
   * When someone can actually reach us, as rendered on /contact
   * ("Sun–Fri · 9am – 6pm NPT"). Written once here so the page and the
   * LocalBusiness markup cannot state different hours — Google cross-checks
   * the two, and a business whose schema disagrees with its own contact page
   * loses the panel rather than gaining one.
   *
   * Nepal's working week runs Sunday to Friday; Saturday is the weekend, which
   * is why Saturday is absent rather than forgotten.
   */
  hours: {
    days: [
      "https://schema.org/Sunday",
      "https://schema.org/Monday",
      "https://schema.org/Tuesday",
      "https://schema.org/Wednesday",
      "https://schema.org/Thursday",
      "https://schema.org/Friday",
    ],
    opens: "09:00",
    closes: "18:00",
  },
  /** Where the jaggery is actually made. Kept apart from `address` so the
   *  farm story and the contactable address never get conflated. */
  origin: {
    locality: "Sankhuwasabha",
    region: "Koshi Province",
  },
  /** The accounts the brand actually runs. Every on-page follow link and the
   *  `sameAs` in JSON-LD read from here — a profile listed that nobody posts
   *  to is a dead link to a visitor and an unverifiable claim to a crawler. */
  social: [
    { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61574743737954" },
    { label: "TikTok", href: "https://www.tiktok.com/@sakharsansar" },
  ],
} as const;

/**
 * The GA4 measurement ID for the `sakharsansar` web stream (property stream
 * 15494414844). Not a secret — it ships in the page source of every tagged
 * site — so it lives here beside the rest of the site's identity rather than
 * in env, where an unset variable would silently stop all measurement.
 */
export const GA_MEASUREMENT_ID = "G-GTTK37319Z";

/**
 * The origin story, in one place.
 *
 * The site used to tell two incompatible versions of it. The footer, /contact
 * and /our-story described "a cooperative of 42 farming families" working
 * "since seven generations"; the Meet the Maker section and the author bio on
 * all eleven blog posts said Rashmita "pours every block herself", "one pair
 * of hands", and founded the business in 2024. Both cannot be true, and a food
 * brand whose whole argument is honesty cannot afford to be caught choosing.
 *
 * The reconciliation, confirmed with the owner: the business is hers and was
 * founded in 2024; she makes the sakhar; the 42 households across six villages
 * grow and supply the cane, and have made it this way for seven generations.
 * The generations belong to the families and the craft, not to the company.
 *
 * `summary` is the canonical sentence. Prose elsewhere may be longer, but it
 * must not contradict this.
 */
export const STORY = {
  founded: "2024",
  households: 42,
  villages: 6,
  generations: "seven",
  summary:
    "Founded in 2024 by Rashmita Bhandari, working with 42 farming families in Sankhuwasabha who have made sakhar this way for seven generations.",
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

/**
 * Who carries an order, by where it is going. Inside the Kathmandu Valley we
 * deliver ourselves from Kapan; everything outside it goes with Nepal Can
 * Move, where we are a listed merchant. Named once here so the shipping page,
 * the shop and the product FAQs cannot disagree about it.
 */
export const DELIVERY = {
  outsideValleyCarrier: "Nepal Can Move",
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
