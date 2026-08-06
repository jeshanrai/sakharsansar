import content from "@/data/content.json";
import { SITE, absoluteUrl } from "./site";

/**
 * Structured-data builders.
 *
 * Everything here emits schema.org JSON-LD from the same data the pages
 * render, so the markup can never drift from what a visitor actually sees —
 * which is exactly what Google penalises. Entities are given stable `@id`
 * values and cross-referenced, so crawlers merge the Organization mentioned
 * on eight different pages into one node in their knowledge graph instead of
 * eight competing ones.
 */

export const ORG_ID = absoluteUrl("/#organization");
export const WEBSITE_ID = absoluteUrl("/#website");

type Json = Record<string, unknown>;

/** Read the real catalogue range rather than hardcoding one that goes stale. */
function catalogPriceRange(): string {
  const prices = content.products
    .map((p) => Number.parseInt(p.price.replace(/[^0-9]/g, ""), 10))
    .filter((n) => !Number.isNaN(n));
  if (prices.length === 0) return "NPR";
  return `Rs. ${Math.min(...prices)} - Rs. ${Math.max(...prices)}`;
}

/**
 * The publisher node. Emitted once, sitewide, from the root layout.
 *
 * Multi-typed on purpose. The business is one entity — an online store that
 * is also a real place in Sankhuwasabha — and giving it one `@id` under all
 * three types keeps the store signals and the local signals attached to the
 * same node instead of splitting them across competing entities.
 */
export function organizationLd(): Json {
  return {
    "@type": ["Organization", "OnlineStore", "LocalBusiness"],
    "@id": ORG_ID,
    name: SITE.name,
    alternateName: [...SITE.alternateNames],
    url: SITE.url,
    logo: {
      "@type": "ImageObject",
      "@id": absoluteUrl("/#logo"),
      url: absoluteUrl("/logo-mark.webp"),
      width: 240,
      height: 240,
      caption: SITE.name,
    },
    image: { "@id": absoluteUrl("/#logo") },
    description: SITE.description,
    slogan: SITE.tagline,
    foundingDate: SITE.foundingYear,
    email: SITE.email,
    telephone: SITE.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.address.locality,
      addressRegion: SITE.address.region,
      addressCountry: SITE.address.country,
    },
    areaServed: { "@type": "Country", name: "Nepal" },
    priceRange: catalogPriceRange(),
    currenciesAccepted: "NPR",
    knowsAbout: [
      "organic jaggery",
      "sakhar",
      "gur",
      "wood-fired jaggery",
      "unrefined sugarcane products",
      "Sankhuwasabha agriculture",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: SITE.phone,
        email: SITE.email,
        areaServed: "NP",
        availableLanguage: ["en", "ne"],
      },
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: SITE.phone,
        email: SITE.email,
        areaServed: "NP",
        availableLanguage: ["en", "ne"],
      },
    ],
    sameAs: [...SITE.social],
  };
}

/** The site node — tells crawlers the whole domain is one publication. */
export function websiteLd(): Json {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    publisher: { "@id": ORG_ID },
    inLanguage: SITE.lang,
  };
}

/** Sitewide graph: one script, two linked entities. */
export function siteGraphLd(): Json {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationLd(), websiteLd()],
  };
}

/**
 * Breadcrumbs. Google shows these in place of the raw URL in results, so
 * every page below the root gets one. Pass paths, not absolute URLs.
 */
export function breadcrumbLd(
  trail: { name: string; path: string }[],
): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map(
      (crumb, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: crumb.name,
        item: absoluteUrl(crumb.path),
      }),
    ),
  };
}

/** FAQ rich result. Only ever call this with questions the page also renders. */
export function faqLd(faqs: { q: string; a: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/**
 * Shipping terms, transcribed from /shipping-policy. Kathmandu Valley is the
 * slowest of the two named regions (3–5 days) and "other locations" runs to
 * 10, so the advertised transit window is 2–10 business days.
 */
function shippingDetailsLd(): Json {
  return {
    "@type": "OfferShippingDetails",
    shippingDestination: {
      "@type": "DefinedRegion",
      addressCountry: "NP",
    },
    deliveryTime: {
      "@type": "ShippingDeliveryTime",
      handlingTime: {
        "@type": "QuantitativeValue",
        minValue: 1,
        maxValue: 2,
        unitCode: "DAY",
      },
      transitTime: {
        "@type": "QuantitativeValue",
        minValue: 2,
        maxValue: 10,
        unitCode: "DAY",
      },
      businessDays: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "https://schema.org/Sunday",
          "https://schema.org/Monday",
          "https://schema.org/Tuesday",
          "https://schema.org/Wednesday",
          "https://schema.org/Thursday",
          "https://schema.org/Friday",
        ],
      },
    },
  };
}

/** Return terms, transcribed from /refund-policy: 48 hours, by mail, free. */
function returnPolicyLd(): Json {
  return {
    "@type": "MerchantReturnPolicy",
    applicableCountry: "NP",
    returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: 2,
    returnMethod: "https://schema.org/ReturnByMail",
    returnFees: "https://schema.org/FreeReturn",
    merchantReturnLink: absoluteUrl("/refund-policy"),
  };
}

export interface ProductLike {
  slug: string;
  name: string;
  price: string;
  weight: string;
  image: string;
  description: string;
  longDescription?: string;
  category?: string;
  ingredients?: string;
}

/**
 * "Rs. 500" → "500", "Rs. 1,500" → "1500".
 *
 * Note the first matched number is taken rather than stripping non-digits:
 * the "." in the "Rs." prefix would otherwise survive as a leading decimal
 * point and produce a price of ".500".
 */
function parsePrice(price: string): string {
  const match = price.replace(/,/g, "").match(/\d+(?:\.\d+)?/);
  return match ? match[0] : "";
}

/**
 * Parse the human-readable size string ("1kg", "500g", "750ml") into a UN/CEFACT
 * unit code. Products come in both mass and volume, and mislabelling a 750ml
 * bottle as 750 kilograms is the kind of thing that gets an offer disqualified
 * from Merchant listings — so volumes go to `size`, not `weight`.
 */
function parseAmount(
  amount: string,
): { property: "weight" | "size"; node: Json } | undefined {
  const match = amount.match(/(\d+(?:\.\d+)?)\s*(kg|g|ml|l)\b/i);
  if (!match) return undefined;

  const value = Number.parseFloat(match[1]);
  const unitCode = { kg: "KGM", g: "GRM", ml: "MLT", l: "LTR" }[
    match[2].toLowerCase()
  ];
  if (!unitCode) return undefined;

  return {
    property: unitCode === "KGM" || unitCode === "GRM" ? "weight" : "size",
    node: { "@type": "QuantitativeValue", value, unitCode },
  };
}

/**
 * Offers need a `priceValidUntil` for the Product rich result. The site is
 * statically generated, so this is stamped at build time — a year out, which
 * is re-stamped on every deploy.
 */
function priceValidUntil(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().split("T")[0];
}

export function productLd(product: ProductLike): Json {
  const url = absoluteUrl(`/products/${product.slug}`);
  const amount = parseAmount(product.weight);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.name,
    description: product.longDescription ?? product.description,
    image: absoluteUrl(product.image),
    url,
    sku: product.slug,
    category: product.category,
    brand: { "@type": "Brand", name: SITE.name },
    manufacturer: { "@id": ORG_ID },
    countryOfOrigin: { "@type": "Country", name: "Nepal" },
    ...(product.ingredients
      ? {
          additionalProperty: {
            "@type": "PropertyValue",
            name: "Ingredients",
            value: product.ingredients,
          },
        }
      : {}),
    ...(amount ? { [amount.property]: amount.node } : {}),
    offers: {
      "@type": "Offer",
      url,
      price: parsePrice(product.price),
      priceCurrency: "NPR",
      priceValidUntil: priceValidUntil(),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": ORG_ID },
      shippingDetails: shippingDetailsLd(),
      hasMerchantReturnPolicy: returnPolicyLd(),
    },
  };
}

/**
 * A plain WebPage node, for pages whose content has no richer type.
 *
 * The policy pages had only the sitewide graph on them, so crawlers saw the
 * publisher but nothing describing the page itself. That matters more than it
 * looks for a shop: Google cross-checks the shipping and return terms in a
 * product's Offer against the pages that state them, and an unidentified page
 * is a weaker corroboration than a named one.
 */
export function webPageLd(opts: {
  name: string;
  path: string;
  description: string;
  /** ISO date the terms last changed, when the page states one. */
  dateModified?: string;
}): Json {
  const url = absoluteUrl(opts.path);
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: opts.name,
    description: opts.description,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    inLanguage: SITE.lang,
    ...(opts.dateModified ? { dateModified: opts.dateModified } : {}),
  };
}

/** Collection pages (shop, blog index) rank better with an explicit ItemList. */
export function itemListLd(
  name: string,
  items: { name: string; path: string }[],
): Json {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}
