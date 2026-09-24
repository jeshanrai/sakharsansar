# Master Prompt v2 — Own Every Jaggery, Sakhar, Gud & Chaku Query in Nepal

> **Updated 24 September 2026 with real Google Search Console data (3 months) and Semrush keyword data.** This replaces the earlier version of this prompt.
> Paste into your coding/content agent with the repo open. Phases run in order. Phase 0 is a hard gate. Stop and report after every phase.

---

## ROLE AND MISSION

You are a senior Next.js engineer and Nepali market SEO strategist working on **SakharSansar** (`https://www.sakharsansar.com.np`).

**The business:** wood-fired organic jaggery from Sankhuwasabha, Koshi Province. Founded 2024 by Rashmita Bhandari, working with 42 farming families who have made sakhar this way for seven generations. Operating from Kapan, Kathmandu.

- **Delivery:** pan-Nepal. Directly inside the Kathmandu Valley; **outside the Valley via Nepal Can Move**, where SakharSansar is a **listed merchant**.
- **Social:** **#1 on TikTok for sakhar.** Facebook active. Instagram and YouTube accounts do not exist — never link them.
- **Products (confirm the full list in the repo):**
  - Sakhar Block, 1kg — Rs. 400
  - Sakhar Powder, 250g — Rs. 149
  - Mixed Dry Fruits, 100g — Rs. 299
  - Jaggery Candy — `/products/jaggery-candy` (new; **12.5% CTR, best on the site**)
  - Jaggery Cubes — `/products/jaggery-cubes` (new)
  - Date Palm Jaggery — `/products/date-palm-jaggery` (new)
- **B2B:** `/wholesale` — the only page beating its CTR benchmark.
- **Free shipping:** over Rs. 1,500. **Discount:** 10% over Rs. 1,500 with SAKHAR10. Both live in `lib/site-config.ts` only.

**Stack:** Next.js App Router, behind Cloudflare. Build-ID meta tag system in place. Current production build `501a0f57ebe2`.

**The mission:** every search in Nepal for **jaggery, sakhar, gud, chaku or khudo** — English, Roman Nepali or Devanagari — returns sakharsansar.com.np, and that traffic turns into retail orders, B2B enquiries and brand search.

**Why this is winnable:** Daraz, SY Bazzar, Sewapoint and PaisaBachau have domain authority but no real content. Semrush puts average keyword difficulty in this category at **23–25%** and CPC at **$0.00** — low competition in both organic and paid. `.com.np` is a country-code domain: it handicaps international ranking but gets a localisation boost in Nepal. International traffic is out of scope.

---

## WHAT THE DATA SAYS

### Search Console baseline (Web, 3 months to 24 Sep 2026)

| Metric | Value |
|---|---|
| Clicks | **17** |
| Impressions | **1,431** |
| CTR | **1.19%** |
| Nepal | 14 clicks (82% of clicks), 525 impressions (37%), **average position 4.35** |
| Outside Nepal | 3 clicks, 906 impressions (63%) — India 385 impr / 0 clicks, USA 236 / 0 |
| Mobile | 12 clicks, 996 impressions, position 6.06 |
| Desktop | 5 clicks, 420 impressions, position 20.71 |
| Recipe gallery | 169 impressions, **0 clicks**, position 8.25 |
| Product snippets | 39 impressions, 1 click, position 13.59 |

### The trend is already improving

| Period | Clicks | Impressions | CTR | Avg position |
|---|---|---|---|---|
| August (28 days) | 3 | 765 | 0.39% | 13.1 |
| September (21 days) | 14 | 666 | **2.10%** | **7.2** |
| Last 7 days | 8 | 206 | **3.9%** | — |

Fewer impressions, but far better quality: September ranks higher and converts better. Current run-rate is roughly **20 clicks a month**. Every target below is measured against that, not against the 3-month average.

### Two corrections to the earlier version of this prompt

1. **The site is indexed and ranks well.** Nepal average position is 4.35; the homepage is at 3.15, `/shop` at 4.56, the flagship product at 3.95. **The old Phase 0 indexation diagnosis is removed.** Do not spend time on crawl-budget theories.
2. **Structured data is implemented.** Recipe and Product rich results are appearing in Search Console. The remaining schema work is quality and click-through, not implementation.

### Where the impressions actually come from

Search Console names queries for 555 of the 1,431 impressions; the rest are anonymised. Grouped by theme:

| Query theme | Queries | Impressions | Share | Avg position | Clicks | Verdict |
|---|---|---|---|---|---|---|
| Bare "sakhar" (+ misspellings) | 3 | 203 | 37% | **2.5** | **0** | Intent trap — see below |
| **Chaku / Maghe Sankranti** | 6 | 146 | 26% | 8.1 | 0 | **Real Nepali demand, off-season** |
| Indian "sakhar/shakkar vs sugar" | 22 | 137 | 25% | 13.1 | 0 | Wrong audience |
| Generic "jaggery vs sugar" | 26 | 47 | 8% | 60.5 | 0 | Wrong audience, ranking badly |
| Nepal-qualified (sakhar in nepali, nepali sakhar, jaggery in nepal…) | 4 | 7 | 1% | **3.7** | 0 | **Ranks easily, almost no coverage** |
| Product terms (candy, cubes, block, date jaggery) | 6 | 6 | 1% | 7.7 | 0 | New lines, early demand |
| Jaggery in milk/tea | 3 | 5 | 1% | 9.8 | 0 | Page gets 335 impr overall |
| Gud | 1 | 2 | <1% | 9.5 | 0 | No page exists |

**The intent trap:** the site ranks **2.5 for "sakhar" with 203 impressions and zero clicks.** The neighbouring queries — *khadi sakhar vs sugar, shakkar vs sugar, sharkara or sugar, punjabi shakkar vs jaggery* — are Indian. In Marathi, "sakhar" means sugar and "khadi sakhar" means rock sugar. **Those searchers want crystal sugar, not Nepali jaggery.** Together with generic "jaggery vs sugar", these themes are **70% of named impressions and produce nothing.** Do not create content targeting them.

**The real signal:** chaku is 26% of named impressions *in August and September* — months before Maghe Sankranti. And every Nepal-qualified query ranks around position 3.7 with almost no content behind it.

### Pages: ranking well, not getting clicked

| Page | Position | Impr | Clicks | Expected clicks at that position |
|---|---|---|---|---|
| `/shop` | **4.56** | 155 | **1** | ~10 |
| `/blog/jaggery-tea-without-curdling` | 8.69 | **335** | **0** | ~9 |
| `/products/organic-jaggery-block` | **3.95** | 94 | **0** | ~8 |
| `/blog/chaku-recipe-maghe-sankranti` | 7.90 | 203 | **0** | ~7 |
| `/` | 3.15 | 140 | 8 | ~15 |
| `/blog/jaggery-vs-sugar` | 17.22 | 491 | 2 | ~6 |
| `/wholesale` | 6.76 | 50 | **3** | ~2 ✅ |
| `/products/jaggery-candy` | 5.25 | 8 | 1 | ✅ 12.5% CTR |
| `/products/date-palm-jaggery` | 10.24 | 21 | 0 | — |
| `/products/jaggery-cubes` | 14.27 | 11 | 0 | — |
| `/blog/sakhar-ra-chini` (Nepali) | 10 | **2** | 0 | Nepali layer isn't working |

**About 44 clicks a quarter are lost on pages that already rank.** Fixing click-through is the fastest win on the site and needs no new content.

### Semrush keyword data

| Cluster | Keywords | Total volume | Avg KD |
|---|---|---|---|
| **jaggery** | 105 | **5,080** | 23% |
| **sakhar** | 15 | **670** | 25% |

The jaggery cluster is **7.6× bigger** than the sakhar cluster the site is built on.

| Keyword | Volume | KD | Verdict |
|---|---|---|---|
| jaggery | 1,900 | 43% | Big, but Search Console shows bare "jaggery" pulls India/US. Don't chase it bare. |
| **jaggery in nepal** | **880** | **10%** | ⭐ **Best keyword available. No page targets it.** |
| **sakhar in english** | **320** | 27% | More searched than "sakhar" itself — a gateway query |
| sakhar | 260 | 23% | Core brand term, small, and intent-polluted by India |

**CPC is $0.00 on every keyword** — effectively no advertiser competition.

"jaggery in nepal" estimate: position 1 ≈ 246 clicks/month · top 3 ≈ 158 · position 5 ≈ 55. That's **8–12× the current monthly run-rate from one keyword.**

### Zero coverage today

No impressions at all for: **jaggery price nepal, buy jaggery online nepal, gud / गुड, sakhar price, sakhar near me, jaggery near me, wholesale jaggery nepal, thekua, yomari, sel roti.** No Devanagari queries at all.

---

## NON-NEGOTIABLE CONSTRAINTS

Read these before any work. Violating them costs more than the task is worth.

1. **Never fabricate data.** No invented ratings, reviews, review counts, SKUs, certifications, competitor prices or statistics. If a value is missing, write `TODO` and list it in your report. Fabricated rating markup earns a manual action that would destroy this project.

2. **Never publish a price you haven't verified this month.** Show a visible "last verified" date. The existing price article does this correctly.

3. **Preserve the voice.** Plain, first-person, specific, honest, willing to argue against the sale. The `/wholesale` page tells buyers not to print certification claims based on a supplier's website; the price article says "use less than you think you need." **This voice is the moat.** Generic health-blog filler ends the project.

4. **Do not weaken existing honest language.** The `/wholesale` section separating "chemical-free method" from "certification" stays exactly as written.

5. **No health claim without a primary source** — WHO, USDA, peer-reviewed. Where evidence is weak, say so plainly.

6. **Honest product origin.** The brand story is *cane* sakhar from Sankhuwasabha. **Date palm jaggery is not cane jaggery.** Its page must state its real origin and must not imply it comes from the Sankhuwasabha cane families unless the owner confirms that. Check candy and cubes the same way. Ask the owner; don't guess.

7. **Do not target Indian-intent or generic queries.** No new content aimed at bare "sakhar", "khadi sakhar", "shakkar", "sharkara" or generic "jaggery vs sugar". Every English title should be Nepal-qualified where it reads naturally.

8. **Never create two pages competing for the same keyword.** Merge or choose one, and report which.

9. **Do not change the visual design** unless a task says so. Hidden text uses `.sr-only`, never `display:none`.

10. **One PR per phase.** Stop and report after each, with the Search Console change since the last phase.

---

## PHASE 0 — FIX `/shop` AND DEPLOY INTEGRITY (HARD GATE)

**Indexation is confirmed healthy — do not re-diagnose it.** The gate is now `/shop`.

`/shop` has been stale for **five consecutive audit rounds**. Every page reports `x-build-id: 501a0f57ebe2`; **`/shop` reports no build-ID tag at all.** It ranks at **position 4.56 with 155 impressions and 1 click.**

Currently live on `/shop`:
- Fabricated ratings `4.6 (491)`, `4.8 (393)`, `4.5 (155)` — removed everywhere else
- `meta keywords`
- Old footer: "cooperative of 42 farming families", "since seven generations", dead Instagram and YouTube links, no Wholesale link
- Cart "Loading" string in server HTML
- No H1, about 30 words of copy, no breadcrumbs, no links to category pages
- None of the three new products

### 0.1 Diagnose — report before fixing

1. Is `/shop` in the smoke test's route list, or does the test use a hardcoded array? (Most likely cause.)
2. Does the smoke test **fail the deploy**, or only log?
3. What is the rendering mode of `app/shop/page.tsx` — `dynamic`, `revalidate`, `force-static`?
4. Is there a Cloudflare Cache Rule matching `/shop` exactly rather than `/shop/*`? Compare `cf-cache-status` and `age` headers on `/shop` and `/shop/blocks`.
5. Does the revalidation hook call `revalidatePath('/shop', 'page')`? The `'layout'` type silently misses it.

### 0.2 Fix

- Purge and rebuild. `/shop` must report the same build ID as every other page.
- Bring it to parity with `/shop/blocks`: H1, 250–350 words of intro copy, breadcrumbs, links to every category page, all six products, current footer, no ratings, no `meta keywords`, fixed-size cart skeleton instead of "Loading".
- **Retarget `/shop` toward "jaggery in nepal"** unless Phase 2.1 recommends otherwise. Suggested H1: `Buy Organic Jaggery in Nepal — Pure Sakhar from Sankhuwasabha`. Suggested title: `Jaggery in Nepal: Buy Pure Organic Sakhar Online | SakharSansar`.
- Rewrite the smoke test to **read every URL from `sitemap.xml`** and **exit non-zero** on any missing or mismatched build ID.
- **Prove it:** break one route on purpose, show the deploy failing, then fix it.

### 0.3 Owner tasks — flag these clearly, they outrank most code

- **Claim the Google Business Profile for Kapan, Kathmandu.** Unclaimed after five rounds. "Sakhar near me" and "jaggery near me" currently get zero impressions, and marketplaces don't compete in the Maps pack.
- **Confirm the Nepal Can Move merchant listing links to sakharsansar.com.np.** Likely the site's first real backlink.
- List on Daraz, SY Bazzar, Sewapoint and PaisaBachau.

**Gate:** nothing else ships until `/shop` reports the current build ID and the smoke test is proven.

---

## PHASE 1 — CLICK-THROUGH RECOVERY (fastest win, no new content)

About 44 clicks a quarter are lost on pages that already rank. Fix those first.

### 1.1 Rewrite titles and meta descriptions

For each page, pull its real queries from Search Console, then write a title that answers them in the searcher's own words. Log before and after for every change.

| Page | Position | Impr | Clicks | Direction |
|---|---|---|---|---|
| `/blog/jaggery-tea-without-curdling` | 8.69 | 335 | 0 | Put the answer in the title. Queries: "why milk curdled after adding jaggery", "does jaggery curdle milk", "how to add jaggery to milk without curdling". |
| `/blog/chaku-recipe-maghe-sankranti` | 7.90 | 203 | 0 | Add yield, time and "Maghe Sankranti 2027". |
| `/products/organic-jaggery-block` | 3.95 | 94 | 0 | Price, weight, free delivery over Rs. 1,500, pan-Nepal via Nepal Can Move — in the description. |
| `/` | 3.15 | 140 | 8 | Push from 5.7% toward 10%. |
| `/products/date-palm-jaggery` | 10.24 | 21 | 0 | Clear, honest origin in the title. |
| `/products/jaggery-cubes` | 14.27 | 11 | 0 | Match "jaggery cubes" and "white jaggery cubes". |

Titles 50–60 characters. Descriptions 70–160 characters, ending in punctuation, never cut mid-word.

### 1.2 Fix the Recipe gallery — 169 impressions, 0 clicks

Recipe results are picture-led, so a weak image means no clicks.
- Sharp, well-lit images in several aspect ratios (1:1, 4:3, 16:9) in `Recipe.image`
- Complete `prepTime`, `cookTime`, `totalTime`, `recipeYield`, `recipeCategory`, `recipeCuisine: Nepali`, `keywords`
- `nutrition` only where it can be honestly calculated
- No `aggregateRating` unless real ratings exist

### 1.3 Strengthen Product snippets — 39 impressions, 1 click

Every product gets complete Product + Offer schema: `price`, `priceCurrency: NPR`, `availability`, `priceValidUntil` (generated, one year ahead), `shippingDetails` (threshold from `site-config.ts`, pan-Nepal, handling 0–1 days, transit 1–5 days). Add `hasMerchantReturnPolicy` only if `/refund-policy` states a concrete window — otherwise flag it. **No `aggregateRating` until real reviews show on the page.**

### 1.4 Stop feeding the intent trap

Leave `/blog/jaggery-vs-sugar` live — it does no harm — but invest nothing more in it or in any Indian-intent query (constraint 7).

---

## PHASE 2 — THE VOCABULARY LAYER (the growth engine)

**The core problem: the site is built on the smaller word.** Semrush shows the jaggery cluster is 7.6× the sakhar cluster. Nepal uses five words:

| Word | Script | Who uses it | Evidence |
|---|---|---|---|
| **jaggery** | Roman | Urban, English-language searchers | **5,080/month cluster; "jaggery in nepal" 880, KD 10** |
| सख्खर / sakhar | Both | Eastern hills, Sankhuwasabha | 670/month cluster; bare term intent-polluted by India |
| **चाकु / chaku** | Both | Kathmandu Valley, Newar community | **26% of named impressions, off-season** |
| गुड / gud / gur | Both | Terai, Madhesh, much of Kathmandu | **Not yet measured** — 2 impressions only because no page exists |
| खुदो / khudo | Both | Widespread — liquid form | Not yet measured |

**Do not rename the brand.** Keep SakharSansar and keep "sakhar" as the product name. Build coverage around it, led by Nepal-qualified "jaggery".

### 2.1 "jaggery in nepal" — 880/month, KD 10. Top priority.

Decide between (a) retargeting `/shop`, which already ranks at 4.56 and is likely faster, or (b) a new `/jaggery` pillar. **Do not do both.** Report which you chose and why.

The page needs:
- "jaggery in Nepal" in the title, H1, first paragraph, and naturally in two or three subheadings
- What jaggery is, and its local names (sakhar, gud, chaku, khudo); hill vs Terai
- Every product, with price and link
- Delivery: inside the Valley directly, outside via Nepal Can Move, free over Rs. 1,500
- Current price range with a "last verified" date
- FAQ block plus FAQPage schema generated from the visible FAQ
- Links to the glossary, price article, wholesale and top articles

### 2.2 "sakhar in english" — 320/month

More searched than "sakhar" itself. The searcher knows the Nepali word and wants the English one — answer "jaggery" immediately, then explain and link to products. Build `/blog/sakhar-in-english` **or** make it the lead section of the glossary (2.3). Not both. Search Console already shows "sakhar in nepali" at position 1, so these are easy wins.

### 2.3 The glossary — write this early, it anchors everything

**`/blog/sakhar-gud-chaku-khudo-difference`**

Targets: *sakhar in english, sakhar vs gud, gud ra sakhar ko farak, chaku vs sakhar, khudo ke ho, jaggery meaning in nepali*

The definitive explanation of all five terms: what each means, who uses which, whether they're the same product, and what to buy for which purpose. Nobody in Nepal has written this. Publish the Nepali version at `/ne/blog/sakhar-gud-chaku-khudo-farak` at the same time.

### 2.4 Price article — strengthen, don't duplicate

Retitle the existing `/blog/sakhar-price-in-nepal` to something like `Jaggery (Sakhar) Price in Nepal 2026` and add jaggery and gud wording naturally. **Do not create a separate jaggery-price or gud-price article** unless the existing one genuinely can't cover both; if you do split, report why.

### 2.5 `/gud` pillar — ON HOLD until volume is measured

The earlier version of this prompt made `/gud` the first build. The data doesn't support that yet: Semrush hasn't been run for gud / गुड. **Build `/gud` only after the owner supplies gud volume.** If it's meaningful, build it (800–1,200 words, fair to Terai gud, types, verified prices, adulteration checks, FAQ schema). If it's low, skip it and cover gud inside the glossary.

### 2.6 Retrofit existing pages

Add "jaggery" — and "gud" where it reads naturally — to titles, H1s, meta descriptions and body copy of the homepage, category pages, product pages and existing articles. **Never keyword-stuff.** If a word doesn't fit the sentence, leave it out.

### 2.7 Build the full keyword map before going further

Once the owner sends the full 105-keyword jaggery list and 15-keyword sakhar list, map every keyword to exactly one URL and report the map before building anything beyond 2.1–2.6.

---

## PHASE 3 — SEASONAL (deadline-driven, do not defer)

Festival content should publish at least eight weeks before the spike. Today is 24 September 2026.

| Festival | When | Product tie | Publish by | Status |
|---|---|---|---|---|
| **Chhath** | Late Oct–early Nov | **Thekua, made with gud** | **Immediately** | ❌ Missing — late, publish anyway |
| **Tihar** | Late Oct–Nov | Sel roti with gud/sakhar | **Immediately** | ❌ Missing |
| **Yomari Punhi** | December | **Chaku + sesame filling** | **Early October** | ❌ Missing |
| **Maghe Sankranti** | 14–15 Jan 2027 | Chaku, til laddu, sakhar | Live — strengthen | ⚠️ Chaku at 8.1 → **top 3 by 1 Jan** |
| Shree Panchami | Jan–Feb | Sweets | November | ❌ |

### 3.1 Thekua / Chhath — most urgent

**`/blog/thekua-recipe-chhath`** and `/ne/blog/thekua-banaune-tarika`. Thekua is made with gud and is central to Chhath, which is enormous in the Terai, Madhesh and among Kathmandu's Madhesi community. Recipe schema, which form to use and why, how much to buy for a household, ritual significance handled respectfully.

### 3.2 Sel roti — Tihar

**`/blog/sel-roti-sakhar`** with Recipe schema.

### 3.3 Yomari — Kathmandu Valley

**`/blog/yomari-chaku-recipe`** and `/ne/blog/yomari-chaku`. Yomari Punhi is a Newar festival in December and **the filling is chaku and sesame** — your core delivery market, with no competition. Recipe, why chaku, how much to buy, cultural context handled accurately. Don't claim heritage the brand doesn't have.

### 3.4 Chaku to the top 3 by 1 January

Chaku already draws 26% of named impressions off-season, at position 8.1. January will spike.
- Build the `/chaku` pillar (Phase 4)
- Strengthen `/blog/chaku-recipe-maghe-sankranti`: better images, FAQ schema, internal links from every related page
- Build `/wholesale/chaku` for B2B chaku buyers ahead of January
- Owner decision: sell chaku as a product if supply allows

**Owner research:** Tokha, in Kathmandu, is historically associated with chaku making and is near Kapan. Verify; if true, it's a local content, supplier and PR angle.

---

## PHASE 4 — PILLAR PAGES

Each pillar: 800–1,200 words, product links, FAQ with schema, links to every related article, and every related article linking back.

| URL | Targets | Status |
|---|---|---|
| Phase 2.1 page (`/shop` or `/jaggery`) | jaggery in nepal, organic jaggery nepal, jaggery online nepal | **Build first** |
| `/chaku` | chaku, चाकु, chaku price, chaku online, maghe sankranti chaku | **Build — data-backed** |
| `/gud` | gud, गुड, gur, gud price nepal | On hold (2.5) |
| `/khudo` | khudo, खुदो, liquid jaggery | On hold until volume measured |

`/shop` serves as the sakhar pillar. **Never create two pages competing for the same term.**

---

## PHASE 5 — LOCAL / DELIVERY PAGES

"Near me" and city queries currently get zero impressions, and marketplaces barely compete on local intent.

Build `/delivery/[city]` for Kathmandu, Lalitpur, Bhaktapur, Pokhara, Biratnagar, Butwal, Dharan and Birgunj.

- **Name Nepal Can Move for outside-Valley delivery.** It's a real trust signal.
- **Ask the owner for real delivery times and charges per city** before writing. Don't guess.
- Each page needs genuinely different copy: delivery method, time and charge, areas served, city-specific FAQ. **If you can't write 200 genuinely distinct words for a city, don't build that page.**
- `LocalBusiness` schema with `geo`, `openingHoursSpecification` (Sun–Fri 9:00–18:00 NPT), `areaServed`, `currenciesAccepted: NPR`.
- Add a Nepal Can Move delivery badge to `/shop`, product pages and these pages.

---

## PHASE 6 — NEPALI COMMERCIAL LAYER

The Nepali layer isn't working: `sakhar-ra-chini` has **2 impressions** in three months and no Devanagari query appears in Search Console. One reason is that Nepali content dead-ends — the nav says पसल but links to the English `/shop`.

Build in order:
1. `/ne` homepage
2. `/ne/shop`
3. `/ne/products/[slug]` — **all six products**
4. `/ne/wholesale`
5. **A visible language switcher** in the header, keeping the reader on the equivalent page where one exists
6. `/ne/blog` index

Then fix: breadcrumb root reads गृहपृष्ठ, not "Home"; translate the author bio (currently English under a Devanagari byline) and the closing call-to-action block; link Nepali articles to Nepali counterparts; remove Nepali cards from the English `/blog` index; `<html lang="ne">` and `og:locale: ne_NP` on Nepali pages.

**hreflang:** reciprocal `en-NP` ↔ `ne-NP` pairs generated from the routing config, plus `x-default` on English. Emit an alternate only when the counterpart exists.

Mark any translation you're unsure about so a native speaker can check it.

---

## PHASE 7 — PAGES FOR THE NEW PRODUCTS

`jaggery-candy` (12.5% CTR, best on the site), `date-palm-jaggery` (21 impressions) and `jaggery-cubes` (11 impressions) are already earning impressions for "jaggery candy", "jaggery cubes", "white jaggery cubes" and "date jaggery".

**Ask the owner first** where each is made and how. Then give each a full page: description, weight, price, uses, storage, delivery, complete Product + Offer schema, honest origin (constraint 6). Add them to `/shop`, the Phase 2.1 page, relevant category pages and the sitemap.

---

## PHASE 8 — COVERAGE BUILDOUT

Target: 60–80 indexed URLs. Publish about two a week. **Order by the keyword map from 2.7 once it exists**; until then, use this order. Titles use Nepal-qualified "jaggery" wording where natural.

### Nepali informational (no competition found yet)
गुड खाने फाइदा · गुड र सख्खर बीचको फरक · गुड कसरी बनाइन्छ · चाकु कसरी बनाउने · गुड मधुमेह रोगीका लागि · सख्खर गर्भावस्थामा · खुदो के हो · नक्कली गुड कसरी चिन्ने

### English / Roman Nepali
jaggery benefits (gud khane faida) · how to eat sakhar · is jaggery good for diabetes · how to identify pure jaggery in Nepal · jaggery for cough and cold · jaggery in winter · jaggery for children · jaggery in pregnancy · how to store jaggery in monsoon

### Recipes (Recipe schema, multi-ratio images)
gud ko halwa · gud ko roti · khir with jaggery · gud ko achar · sakhar with dhido · sakhar with curd · peanut chikki

### Comparisons (Nepal-framed, never generic)
gud vs misri · organic vs regular jaggery in Nepal · chaku vs sakhar

---

## PHASE 9 — BRAND, OFF-PAGE AND PAID

**Agent tasks:**
- Add the TikTok and Facebook profiles to `Organization.sameAs`; never Instagram or YouTube
- Embed the best TikToks on relevant articles with `VideoObject` schema
- Build linkable tools: an interactive jaggery purity test (from the existing seven-tests article) and a jaggery quantity/cost calculator
- Build a `/press` kit with downloadable photos
- Fix outstanding sitewide items: `/favourites` link showing "/favourites" as its text; footer social links with raw URLs as text (add `aria-label`s); **no H1 on `/wholesale`**; `/blog` H1 that just says "Blog"; the "Sakhar 101" tag with no category page; the announcement bar rendered 8× in server HTML; `/wholesale` using the generic OG image; `noindex` on favourites, cart and checkout

**Owner tasks:**
- Google Business Profile (Phase 0.3)
- **TikTok → Google:** you're #1 on TikTok but it isn't showing up as Google brand searches. Put "SakharSansar" and the website in bio and captions; occasionally ask viewers to search "SakharSansar" on Google. Branded search helps rankings and separates you from the similarly named ShareSansar.
- **Google Ads test:** CPC is $0.00 on every keyword. A small daily budget on "jaggery in nepal", "jaggery price nepal" and "buy jaggery online nepal" buys traffic now, and the search-terms report is free keyword research.
- Marketplaces, PaisaBachau, directories with identical name/address/phone
- B2B outreach to chaku makers and cafés before January, using `/wholesale` and `/wholesale/chaku`

---

## PER-PAGE-TYPE SPECIFICATIONS

### Every page
- Exactly one non-empty `<h1>`, under 70 characters, unique sitewide; no skipped heading levels
- Unique title (50–60 chars) and meta description (70–160 chars, ending in punctuation, never truncated)
- Canonical exactly matching the served URL
- OG image with `og:image:type`, dimensions and unique alt; `og:locale` matching the page language (`en_NP` / `ne_NP`)
- Visible breadcrumbs + `BreadcrumbList` schema (except home)
- `x-build-id` meta tag
- In `sitemap.xml` with a real `lastmod`
- No `meta keywords`

### Pillar pages
`CollectionPage` or `ItemList` schema · FAQPage generated from the visible FAQ · links to every related article and product

### Articles
`BlogPosting` with `author` as a `Person` linked to `/about/rashmita-bhandari` · `datePublished`, `dateModified`, `articleSection`, `inLanguage` · visible "last updated" on price or policy content · 2–4 contextual internal links with descriptive anchor text · FAQPage where there's a FAQ

### Recipes
`Recipe` schema with images in 1:1, 4:3 and 16:9 · `recipeIngredient`, `recipeInstructions`, `prepTime`, `cookTime`, `totalTime`, `recipeYield`, `recipeCuisine: Nepali` · quantities in grams and local measures · which product form to use and how much to buy

### Product and category pages
`Product` + `Offer` with `priceCurrency: NPR`, `availability`, `priceValidUntil`, `shippingDetails` from `site-config.ts` · honest origin · **no `aggregateRating` until real reviews show on the page**

### Delivery pages
`LocalBusiness` + `areaServed` · Nepal Can Move named for outside-Valley delivery · genuinely unique copy

---

## VOICE RULES

The content is the moat. Enforce these in review:

**Do:** write first person and specific · name the trade-off · cite primary sources · admit what you don't know · give the number, the date and the source · argue against the sale where it's honest to.

**Don't:** use "unlock", "elevate", "game-changer", "in today's world" · stack em-dashes for effect · write "not X, but Y" constructions · open with a rhetorical question · claim health benefits without evidence · disparage Terai gud or competitors · pad to a word count · keyword-stuff.

**The test:** would Rashmita say this out loud to a customer standing in front of her? If not, rewrite it.

---

## AUTOMATED ENFORCEMENT

Extend `scripts/seo-audit.mjs` to crawl every sitemap URL and fail CI on:

- Any page with a missing or mismatched `x-build-id`
- Not exactly one non-empty h1, or skipped heading levels
- Duplicate titles, H1s or meta descriptions
- Meta description outside 70–160 chars or not ending in punctuation
- Canonical not matching the served URL
- Invalid JSON-LD, unresolved `@id` references, or schema price not matching the price on the page
- `aggregateRating` on a page with no visible reviews
- Anchor text that is a URL or begins with `/`
- hreflang alternates that 404 or don't point back
- Sitemap URLs more than three clicks from the homepage
- Banned text: `12,000`, `since seven generations`, `cooperative of 42`, a hardcoded `Rs. 2,000` threshold, `instagram.com/sakharsansar`, `youtube.com/@sakharsansar`, any phone number or shipping figure outside `site-config.ts`

---

## MEASUREMENT

Re-export Search Console at 30, 60 and 90 days. Compare against the **September run-rate**, not the 3-month average.

| Metric | Baseline | 90-day target |
|---|---|---|
| Clicks per month | ~20 (Sept run-rate) | **120+** |
| CTR | 2.1% (Sept), 3.9% (last 7 days) | **4%+** |
| Nepal average position | 4.35 | Hold under 5 |
| Nepal share of impressions | 37% | **60%+** |
| `/shop` CTR | 0.65% | **6%+** |
| Recipe gallery CTR | 0% | 2%+ |
| "jaggery in nepal" | not ranking | **Top 5** |
| "sakhar in english" | not ranking | **Top 3** |
| "chaku" | position 8.1 | **Top 3 by 1 January** |
| Queries with impressions | ~73 | 150+ |
| Devanagari queries | 0 | Any |

Phase 1 alone should roughly double monthly clicks. "jaggery in nepal" in the top 3 would add an estimated ~158 clicks a month.

---

## OPEN QUESTIONS — THE OWNER MUST ANSWER; THE AGENT MUST NOT GUESS

1. The **full Semrush lists**: all 105 jaggery and 15 sakhar keywords with volume, KD and intent
2. Which **Semrush database** was used: Nepal, India or Global?
3. **Gud / गुड volume** — `/gud` stays on hold until this arrives
4. **Chaku, khudo and Devanagari** term volumes (सख्खर, गुड, चाकु)
5. **Conversions:** did any of the 17 clicks become orders or B2B enquiries? If `/wholesale` produced an enquiry, B2B moves up the plan
6. The **Nepal Can Move** listing URL, and whether it links to the site
7. **Origin and method** for date palm jaggery, jaggery candy and jaggery cubes
8. **Delivery times and charges** per city
9. **Current batch/harvest date** for the Sakhar Block (the page still says November 2025)
10. **Return policy terms**: window in days, who pays return shipping
11. What **certifications, registrations, lab reports or PAN** actually exist
12. Can you sell **chaku** as a product before January?

---

## REPORTING

After each phase:

1. **What changed** — with file paths
2. **What I couldn't do** — and why
3. **TODOs for the owner** — every value guessed or flagged, cross-referenced to the open questions
4. **Evidence** — `seo:audit` output, Rich Results Test, smoke-test proof, before/after titles, screenshots showing the design unchanged
5. **Decisions made** — for example `/shop` vs `/jaggery`, any merged articles
6. **Coverage count** — URLs live against the 60–80 target
7. **Search Console change** — clicks, impressions, CTR and position since the previous phase

---

## THE THING THAT DECIDES WHETHER THIS WORKS

The earlier version of this prompt said everything depended on whether Google was crawling the site. **The data answered that: it is.** Nepal average position is 4.35.

What decides it now is two things:

1. **Whether ranking turns into clicks.** Pages at positions 3.95 and 4.56 getting zero or one click is the fastest thing to fix, and it costs nothing but better titles, snippets and images.
2. **Whether you rank for the words Nepal actually searches.** Seventy percent of named impressions today come from Indian and generic queries that will never buy. "jaggery in nepal" alone is 880 searches a month at difficulty 10, and no page targets it yet.

Fix click-through, then aim at Nepal-qualified jaggery and chaku. The content is already good enough. It's pointed at the wrong searchers.
