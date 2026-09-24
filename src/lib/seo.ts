import { localizedHref } from "./locale-paths";
import content from "@/data/content.json";
import { AUTHOR, AUTHOR_ID } from "./author";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "./hreflang";
import { t } from "./i18n";
import { SITE, absoluteUrl } from "./site";

/**
 * Structured-data builders.
 *
 * Everything here emits schema.org JSON-LD from the same data the pages
 * render, so the markup can never drift from what a visitor actually sees —
 * which is exactly what Google penalises. Entities are given stable `@id`
 * values and cross-referenced, so crawlers merge the Organization mentioned
 * on every product page into one node in their knowledge graph instead of a
 * set of competing ones.
 */

export const ORG_ID = absoluteUrl("/#organization");
export const WEBSITE_ID = absoluteUrl("/#website");

type Json = Record<string, unknown>;

/**
 * The `@id` of the node a page's own schema gives its subject.
 *
 * Exported so a collection page can point its `ItemList` entries at the same
 * node the detail page defines, rather than naming a bare URL. A `ListItem`
 * with only a `url` is a link; a `ListItem` whose `item` resolves to the
 * `Product` node is a statement that this list contains that product, which is
 * what lets the shop page corroborate the product pages instead of sitting
 * beside them.
 */
export const productNodeId = (slug: string) =>
  `${absoluteUrl(`/products/${slug}`)}#product`;
export const postNodeId = (path: string) => `${absoluteUrl(path)}#post`;

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
 * is also a real place in Kapan, Kathmandu — and giving it one `@id` under all
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
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.locality,
      addressRegion: SITE.address.region,
      addressCountry: SITE.address.country,
    },
    areaServed: { "@type": "Country", name: "Nepal" },
    // When the business is reachable, from the same place /contact reads it.
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [...SITE.hours.days],
      opens: SITE.hours.opens,
      closes: SITE.hours.closes,
    },
    // The Person node lives on her page; this is the edge that makes the
    // business and the woman making the sakhar one connected pair of entities
    // rather than two. It used to be written the wrong way round — the Person
    // node carried `founder: {@id: organization}`, which reads "Rashmita was
    // founded by SakharSansar". `founder` is a property of Organization; a
    // Person has no such property, so the claim the site actually wanted to
    // make was never being made.
    founder: { "@id": AUTHOR_ID },
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
    sameAs: SITE.social.map((s) => s.href),
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
    // Both, not just the default. The site publishes natively-written Nepali
    // articles under /ne; declaring only en-NP told crawlers the Devanagari
    // pages were the same publication speaking a language it does not have.
    inLanguage: [LOCALES.en.hreflang, LOCALES.ne.hreflang],
  };
}

/**
 * The founder, as a stub.
 *
 * The full `Person` — bio, portrait, expertise — is emitted on her own page and
 * in every post's byline. This is the minimum needed for `Organization.founder`
 * to resolve into a real node on the other thirty-odd pages, so a crawler that
 * never reaches /about/rashmita-bhandari still merges the reference instead of
 * dropping it. Same `@id`, so the two are one entity, and the fuller node wins
 * wherever it appears.
 */
function founderStubLd(): Json {
  return {
    "@type": "Person",
    "@id": AUTHOR_ID,
    name: AUTHOR.name,
    url: absoluteUrl(AUTHOR.path),
    worksFor: { "@id": ORG_ID },
  };
}

/** Sitewide graph: one script, three linked entities. */
export function siteGraphLd(): Json {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationLd(), websiteLd(), founderStubLd()],
  };
}

/**
 * Breadcrumbs. Google shows these in place of the raw URL in results, so
 * every page below the root gets one. Pass paths, not absolute URLs.
 */
export function breadcrumbLd(
  trail: { name: string; path: string }[],
  /**
   * The language the trail is read in. The root crumb was the literal string
   * "Home" on every page including the Nepali articles, so a Devanagari
   * article opened with an English breadcrumb — and said so twice, once in the
   * markup and once in this schema. The rest of the trail is passed in already
   * translated by the caller; only the root is ours to name.
   */
  locale: Locale = DEFAULT_LOCALE,
): Json {
  // The root is the home page in the trail's own language: /ne for Nepali,
  // now that it exists.
  const home = { name: t(locale).crumbHome, path: localizedHref("/", locale) };
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [home, ...trail].map(
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
 * A procedure the page teaches, step by step.
 *
 * Google retired the HowTo *rich result* in 2023, so this no longer draws an
 * illustrated block in the SERP. It is still worth emitting: the markup names
 * the steps, their order and their photographs in a form answer engines and
 * LLM crawlers read directly, and this site is already written for them (see
 * /llms.txt). `steps` come straight out of the parsed article, so the schema
 * can only ever describe headings the page actually renders.
 */
export function howToLd(opts: {
  name: string;
  description: string;
  /** Path of the page teaching it — steps are anchored inside it. */
  path: string;
  image?: string;
  /** ISO 8601 duration, e.g. "PT10M". */
  totalTime?: string;
  /** Consumables the reader needs. */
  supplies?: string[];
  /** Reusable equipment the reader needs. */
  tools?: string[];
  steps: { name: string; text: string; anchor: string; image?: string }[];
}): Json {
  const url = absoluteUrl(opts.path);
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${url}#howto`,
    name: opts.name,
    description: opts.description,
    inLanguage: SITE.lang,
    ...(opts.image ? { image: absoluteUrl(opts.image) } : {}),
    ...(opts.totalTime ? { totalTime: opts.totalTime } : {}),
    ...(opts.supplies?.length
      ? {
          supply: opts.supplies.map((name) => ({
            "@type": "HowToSupply",
            name,
          })),
        }
      : {}),
    ...(opts.tools?.length
      ? { tool: opts.tools.map((name) => ({ "@type": "HowToTool", name })) }
      : {}),
    step: opts.steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.name,
      text: step.text,
      url: `${url}#${step.anchor}`,
      ...(step.image ? { image: absoluteUrl(step.image) } : {}),
    })),
  };
}

/**
 * Recipe rich result.
 *
 * Worth its own builder rather than a HowTo because Recipe is the only schema
 * type eligible for the image carousel at the top of a recipe SERP, which is
 * where nearly all the clicks on a query like "chaku recipe" go.
 *
 * `nutrition` is deliberately not a parameter. We have not had anything lab
 * tested, and a guessed calorie count is exactly the kind of invented number
 * this codebase refuses elsewhere. Google shows the card fine without it.
 */
export function recipeLd(opts: {
  name: string;
  description: string;
  /** Path of the page carrying the recipe — steps are anchored inside it. */
  path: string;
  image?: string;
  /** The same photograph cropped 16:9, 4:3 and 1:1. Google picks the crop
   *  that fits the slot it is filling; given one ratio, it crops for us, and
   *  usually through the middle of the dish. Replaces `image` when present. */
  images?: string[];
  author: string;
  datePublished: string;
  dateModified?: string;
  /** ISO 8601 durations, e.g. "PT20M". */
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  recipeYield?: string;
  recipeCategory?: string;
  recipeCuisine?: string;
  keywords?: string[];
  ingredients: string[];
  steps: { name: string; text: string; anchor: string; image?: string }[];
  inLanguage?: string;
}): Json {
  const url = absoluteUrl(opts.path);
  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    "@id": `${url}#recipe`,
    name: opts.name,
    description: opts.description,
    url,
    inLanguage: opts.inLanguage ?? SITE.lang,
    ...(opts.images?.length
      ? { image: opts.images.map((src) => absoluteUrl(src)) }
      : opts.image
        ? { image: absoluteUrl(opts.image) }
        : {}),
    author: { "@type": "Person", name: opts.author, worksFor: { "@id": ORG_ID } },
    publisher: { "@id": ORG_ID },
    datePublished: opts.datePublished,
    ...(opts.dateModified ? { dateModified: opts.dateModified } : {}),
    ...(opts.prepTime ? { prepTime: opts.prepTime } : {}),
    ...(opts.cookTime ? { cookTime: opts.cookTime } : {}),
    ...(opts.totalTime ? { totalTime: opts.totalTime } : {}),
    ...(opts.recipeYield ? { recipeYield: opts.recipeYield } : {}),
    ...(opts.recipeCategory ? { recipeCategory: opts.recipeCategory } : {}),
    ...(opts.recipeCuisine ? { recipeCuisine: opts.recipeCuisine } : {}),
    ...(opts.keywords?.length ? { keywords: opts.keywords.join(", ") } : {}),
    recipeIngredient: opts.ingredients,
    recipeInstructions: opts.steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.name,
      text: step.text,
      url: `${url}#${step.anchor}`,
      ...(step.image ? { image: absoluteUrl(step.image) } : {}),
    })),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
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

/**
 * Return terms, transcribed from /refund-policy.
 *
 * The window is the 48 hours the page states, expressed in days.
 *
 * `returnMethod` was `ReturnByMail`, which the policy does not describe. Read
 * it again: the customer emails an order number and photographs, and an
 * approved claim is refunded or replaced. Nothing is ever posted back — these
 * are perishable food products, and asking someone to mail a damaged block of
 * jaggery across Nepal would cost more than the block. `KeepProduct` is what
 * the page actually says, and Merchant Center cross-checks the two.
 *
 * `FreeReturn` stays and is now unambiguous: with nothing to send back, the
 * customer pays no return shipping, which is the question that property
 * answers.
 */
function returnPolicyLd(): Json {
  return {
    "@type": "MerchantReturnPolicy",
    applicableCountry: "NP",
    returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: 2,
    returnMethod: "https://schema.org/KeepProduct",
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
export function parsePrice(price: string): string {
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

export function productLd(
  product: ProductLike,
  /**
   * For the Nepali product pages: their own URL and language. The node then
   * describes the /ne/ page in Nepali, under that page's own @id, rather than
   * restating the English node with a second, contradicting name.
   */
  opts?: { path?: string; inLanguage?: string },
): Json {
  const url = absoluteUrl(opts?.path ?? `/products/${product.slug}`);
  const amount = parseAmount(product.weight);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    ...(opts?.inLanguage ? { inLanguage: opts.inLanguage } : {}),
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
 * One of our own TikToks, embedded on a page.
 *
 * The upload date is not guessed: a TikTok video ID carries its creation time
 * in its top 32 bits, so it is read from the ID. The thumbnail is our copy
 * under public/, because TikTok's thumbnail URLs are signed and expire, and
 * a VideoObject whose image 404s is dropped from video results.
 */
export function videoLd(video: {
  tiktokId: string;
  title: string;
  description: string;
  thumbnail: string;
}): Json {
  const created = new Date(Number(BigInt(video.tiktokId) >> BigInt(32)) * 1000);
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.description,
    thumbnailUrl: absoluteUrl(video.thumbnail),
    uploadDate: created.toISOString(),
    embedUrl: `https://www.tiktok.com/player/v1/${video.tiktokId}`,
    url: `https://www.tiktok.com/@sakharsansar/video/${video.tiktokId}`,
    publisher: { "@id": ORG_ID },
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
  /** BCP-47. Defaults to the site language; the /ne/ pages pass "ne-NP". */
  inLanguage?: string;
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
    inLanguage: opts.inLanguage ?? SITE.lang,
    ...(opts.dateModified ? { dateModified: opts.dateModified } : {}),
  };
}

/**
 * Collection pages (shop, categories, journal hubs) rank better with an
 * explicit ItemList.
 *
 * Pass `id` — from `productNodeId` / `postNodeId` — wherever the listed thing
 * has a node of its own on its detail page. Without it a `ListItem` says only
 * "there is a link here called X"; with it, the entry resolves to the very
 * `Product` or `BlogPosting` the other page describes, and the two pages stop
 * being separate mentions of the same thing.
 */
export function itemListLd(
  name: string,
  items: { name: string; path: string; id?: string }[],
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
      ...(item.id ? { item: { "@id": item.id } } : {}),
    })),
  };
}
