<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Writing for the journal

Anything that adds or edits a post under `/blog` follows
`docs/blog-house-style.md`: where posts live, the article format, the house
voice, the rules on invented numbers and health claims, and the keyword map
of what is already published. Read it before writing.

# Where the site's facts live

There is no `lib/site-config.ts`; older briefs that mention it mean these:

- `src/lib/site.ts`: the single source for business facts. `SITE` (name,
  URL, email, phone, address, founding year), `STORY` (the canonical origin
  sentence), `COMMERCE` (free-shipping threshold, discount code and minimum),
  `DELIVERY` (the carrier outside the Valley), plus `formatRs` and
  `absoluteUrl`. Never hardcode a phone number or shipping figure elsewhere;
  read it from here. `npm run check:claims` fails the build on a hardcoded
  phone number, the retired Rs. 2,000 threshold and retired origin claims.
- `src/lib/seo.ts`: every JSON-LD builder: organization, website,
  breadcrumbs, FAQ, HowTo, Recipe, Product + Offer (with shipping details and
  return policy transcribed from /shipping-policy and /refund-policy), video,
  ItemList. No `aggregateRating` anywhere.
- `src/data/content.json`: product records (price, weight, `seoTitle`,
  `metaDescription`). Product prices live here, not in `site.ts`.
