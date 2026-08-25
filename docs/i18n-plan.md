# Nepali on sakharsansar.com.np: a technical plan

**Status: proposal. Nothing here is implemented.** This is Phase 4 of the SEO
overhaul, and Phase 4 was scoped as a plan rather than a build so the routing
decision gets made deliberately — it is the one choice here that is expensive
to reverse.

Written against the repository as it stands after Phase 3.

---

## Why

The site is entirely English on a `.com.np` domain selling a Nepali product to
Nepali buyers. A meaningful share of the commercial searches for it happen in
Nepali or Romanised Nepali — *सख्खर*, *गुड*, *सख्खरको फाइदा*, *sakhar ko faida* —
and we currently rank for none of them except by accident.

We are not starting from zero. Three articles are already written in Nepali and
carry `lang: "ne"`:

| Slug | Pairs with |
|---|---|
| `sakhar-ra-chini` | `jaggery-vs-sugar` |
| `sakhar-kasari-chinne` | `how-to-identify-pure-jaggery-sakhar` |
| `sakhar-khane-faida` | *(none — original, no English version)* |

They already emit reciprocal `hreflang` and appear in the sitemap with
`xhtml:link` alternates. So the question is not whether to serve Nepali; it is
whether to keep doing it post-by-post or to make it a property of the site.

### Two things to fix regardless of which option is chosen

Both are small and both are wrong today:

1. **The language codes disagree with each other.** The pairs emit
   `hreflang="ne"` on one side and `hreflang="en-NP"` on the other. Google
   accepts both forms, but a bare `ne` and a regional `en-NP` in the same pair
   is the kind of inconsistency that gets an annotation ignored. Pick
   `ne-NP` ↔ `en-NP` and use it everywhere.
2. **There is no `x-default`.** With none, Google chooses which version to show
   a user outside both buckets. We should choose.

---

## 1. Routing: `/ne/...` sub-path

**Recommendation: locale sub-path, English un-prefixed.**

```
/                     → English (no prefix, canonical today, URLs unchanged)
/ne/                  → Nepali
/shop  ↔  /ne/shop
/products/organic-jaggery-block  ↔  /ne/products/organic-jaggery-block
```

### Why not the alternatives

**Subdomain (`ne.sakharsansar.com.np`).** Splits authority across two hosts.
The whole reason `lib/site.ts` is strict about one canonical host is that we
already lost signal to the apex/www split once. Doing it deliberately for a
second language, on a domain with this little authority to spare, is the worst
of the three.

**ccTLD.** Not applicable — `.com.np` *is* the country domain. There is nowhere
to go.

**Cookie or `Accept-Language` switching on the same URL.** One URL serving two
languages is uncrawlable by construction: Googlebot crawls from the US with no
cookie and sees only English, so the Nepali content effectively does not exist.
This is the option that looks cheapest and is actually a dead end.

**Sub-path wins** because it keeps every signal on one host, gives each
translation a real URL, needs no DNS work, and — importantly for us — leaves
all current English URLs exactly where they are. No redirects, nothing to
re-earn.

### Do not prefix English

Next's `localePrefix: "as-needed"` equivalent. Moving `/shop` to `/en/shop`
would 301 every URL on the site, including the ones Phase 1 and 2 just finished
cleaning up, and buy nothing. English stays at the root and is the `x-default`.

---

## 2. Library: `next-intl`

Not currently installed. `next-intl` is the right choice over the alternatives
because it is built for the App Router specifically and does the two things we
need that a bare context provider does not: it works in Server Components (so
translated pages stay static, which matters — see below), and it centralises
the routing config that the `hreflang` generation has to read from.

### The constraint that actually matters: everything here is static

Every route in this project prerenders. `next build` reports 35 static/SSG
pages and no SSR. That is not incidental — it is why the site is fast enough to
serve from a CDN and why Phase 3's numbers are achievable at all.

So the integration has to preserve full static generation:

- `[locale]` as a dynamic segment with `generateStaticParams()` returning every
  locale, so each locale × route pair is prerendered at build time.
- Messages loaded in a Server Component via `getMessages()`, not through a
  client provider wrapping the tree. A client provider would drag translated
  strings into the client bundle and push work back to hydration — the exact
  problem Phase 3 spent its effort undoing on the shop grid.
- `setRequestLocale()` in each layout/page so the locale is known statically
  rather than inferred from a request.

Expected shape:

```
src/app/
  [locale]/
    layout.tsx          ← setRequestLocale, <html lang>, per-locale metadata
    page.tsx
    shop/…
    products/[slug]/…
    blog/…
  layout.tsx            ← root, unchanged where possible
```

**Middleware caveat.** `next-intl`'s middleware handles locale detection and
redirects. It runs on every request, which on a fully static site is a new
runtime cost where there was none. Configure its `matcher` narrowly — exclude
`/_next`, `/api`, and every static asset — or skip detection entirely and rely
on an explicit language switcher. For a site this size, an explicit switcher is
defensible and cheaper.

---

## 3. `hreflang`, generated from the routing config

The rule that matters: **never hand-write a pair.** Reciprocal annotations are
only honoured when both sides agree, and hand-maintained pairs drift the moment
someone renames a slug. `src/lib/metadata.ts` already centralises `alternates`
for exactly this reason; the locale map extends that.

Every page emits:

```html
<link rel="alternate" hreflang="en-NP" href="https://www.sakharsansar.com.np/shop" />
<link rel="alternate" hreflang="ne-NP" href="https://www.sakharsansar.com.np/ne/shop" />
<link rel="alternate" hreflang="x-default" href="https://www.sakharsansar.com.np/shop" />
```

- `x-default` → the English URL. Most non-Nepali traffic reads English.
- Self-referencing: each page lists itself as well as its counterpart.
- **Only emit a pair where the translation actually exists.** An annotation
  pointing at a page that 404s, or at an untranslated English page, is worse
  than none. `sakhar-khane-faida` has no English version and must emit no pair
  at all — as it correctly does today.

The existing per-post `translationOf` mechanism in `src/lib/blog.ts` is the
right model and should survive: article translations are editorial pairings,
not mechanical route mirrors, and one Nepali post has no English twin.

---

## 4. Per-locale `<html lang>` and `og:locale`

Both are single lines once the locale is in scope, and both are currently
hardcoded from `SITE.lang` in `src/app/layout.tsx`:

| | English | Nepali |
|---|---|---|
| `<html lang>` | `en-NP` | `ne-NP` |
| `og:locale` | `en_NP` | `ne_NP` |
| `og:locale:alternate` | `ne_NP` | `en_NP` |

`SITE.lang` and `SITE.ogLocale` become per-locale lookups rather than
constants. Everything downstream — the JSON-LD `inLanguage`, the RSS feed's
language, `/llms.txt` — reads from the same place and follows automatically.

---

## 5. Devanagari fonts

**Mostly already done, and Phase 3 fixed the part that was broken.**

`Tiro_Devanagari_Hindi` is loaded via `next/font` with the `devanagari` and
`latin` subsets, self-hosted, `display: swap`. Phase 3 added a `:lang(ne)` rule
so it actually applies to Nepali text — before that it was serving one
decorative span while the three Nepali articles fell back to whatever the OS
had.

What still needs doing at locale scale:

- **Load it only where it is used.** With a whole Nepali site, the Devanagari
  face becomes critical on `/ne/*` and near-dead weight on English routes.
  Declare it in the `[locale]` layout rather than the root, so English pages do
  not carry a font they touch once.
- **Keep the Latin subset.** Nepali copy is full of inline Latin — prices,
  `WHO`, URLs, `SakharSansar` itself. Dropping it makes those characters fall
  back mid-sentence, which looks worse than the bytes are worth.
- **Weight 400 only.** Tiro has no bold. Any `font-bold` on Devanagari text
  will be synthesised by the browser and look wrong; either accept it or pick a
  second face for headings. Worth deciding before translating headings.

---

## 6. Translation workflow

The honest constraint: **one person writes everything on this site**, and the
writing is its main asset. Anything that produces bulk machine-translated
Nepali will be worse than the English it came from and will damage the thing
that is working.

Proposal:

- **UI strings** — roughly 39 hardcoded strings across `src/components/`
  (nav labels, buttons, form labels, the promo bar). These are short, factual,
  and safe to translate once and review. They become
  `messages/en.json` / `messages/ne.json`.
- **Product data** — `src/data/content.json`. Add a `ne` block per product
  rather than a parallel file, so a product and its translation cannot drift
  apart. Needs a real translator: this is sales copy and tasting notes.
- **Articles** — stay in `src/data/blog.json` with `lang` and `translationOf`,
  exactly as now. Translated selectively and deliberately, never in bulk. An
  article that only exists in English simply has no Nepali counterpart, and
  that is a legitimate state.
- **Policy pages** — legal copy. Translate last, and have someone confirm which
  language governs in a dispute before publishing a second version.
- **Keeping in sync** — extend `scripts/check-meta-descriptions.mjs` into a
  general content check that fails the build when a locale is missing a UI key,
  or when a `translationOf` points at a slug that no longer exists. The
  meta-description guard already proved the pattern works.

---

## 7. Sitemap

`src/app/sitemap.ts` already emits `xhtml:link` alternates for the three paired
articles — the mechanism exists and needs generalising:

- Every URL appears once per locale.
- Each entry carries `alternates.languages` for every locale it exists in.
- `x-default` included.
- Entries generated from the same locale/route config that generates the
  `hreflang` tags, so the two can never disagree.

Current output is 34 URLs. A fully mirrored site would be roughly 60–65.

---

## 8. Effort and rollout order

Rough, and the translation line is the one that will move:

| Work | Estimate |
|---|---|
| `next-intl` install, `[locale]` restructure, static params, middleware | 2–3 days |
| Extract ~39 UI strings, wire message files | 1 day |
| `hreflang` + `og:locale` + `<html lang>` from routing config | half a day |
| Sitemap generalisation | half a day |
| Devanagari font scoping | 2 hours |
| Build-time locale completeness check | half a day |
| **Translation (human, reviewed)** | **the real cost — depends entirely on scope** |

**Rollout order.** Ship in this sequence, and measure before widening:

1. **Fix the two `hreflang` defects now** (`ne-NP`/`en-NP` consistency,
   `x-default`). Independent of everything else, ~1 hour, improves what already
   exists.
2. **Homepage + `/shop` + the three product pages.** The commercial core. Enough
   to find out whether Nepali traffic converts before translating 10 articles.
3. **The three existing Nepali articles move under `/ne/`**, with 301s from
   their current `/blog/` URLs. They have earned something; it should follow
   them.
4. **Top three English articles** by traffic once there is data.
5. Everything else, or nothing else, depending on step 2.

Steps 1–3 are the ones with a clear return. Do not commit to step 5 up front.

---

## What could go wrong

- **A half-translated site is worse than an English one.** A `/ne/` page that
  is 80% English reads as broken and will be judged as thin. Translate whole
  pages or do not route to them.
- **The middleware undoes Phase 3.** A per-request middleware on a fully static
  site is a real regression if its matcher is loose. Measure LCP after wiring
  it, against the numbers in the Phase 3 report.
- **Romanised Nepali has no locale.** *"sakhar ko faida"* is typed in Latin
  script by people who want Nepali content. No `hreflang` value covers it;
  it is won with page copy, not routing. Worth remembering that a chunk of the
  target queries are not solved by any of the above.
