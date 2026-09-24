# The journal: house style and production rules

Read this before writing or commissioning any post for `/blog`.

It is the brief from *SakharSansar Blog Production Prompts v2*, corrected
against how this repository actually works. Where the two disagree, this file
is right, because the original was written without seeing the code.

---

## Where posts live

**Not** `content/blog/<slug>.md`. There is no markdown pipeline and no
frontmatter. Posts are objects in `src/data/blog.json`, and the fields are
typed in `src/lib/blog.ts`. Adding an object there is the whole publishing
step: the nav, the index, the sitemap, the RSS feed, `llms.txt` and the social
card all pick it up on the next build.

## Do not hand-write JSON-LD

The original brief asks for a `## JSON-LD` block at the end of each article.
Do not do that. Structured data on this site is **derived from the rendered
prose** (`src/lib/article.ts`), specifically so schema can never promise Google
a heading the page does not show. What you get automatically:

| Schema | Comes from |
|--------|-----------|
| `BlogPosting` + `BreadcrumbList` | every post |
| `FAQPage` | the `### ` questions under a `## Frequently Asked Questions` heading (or `## बारम्बार सोधिने प्रश्नहरू`) |
| `HowTo` | `## Test 1: …` style headings, plus the `howTo` field for supplies and tools |
| `Recipe` | a `## Ingredients` bullet list and `### ` steps under `## Method`, switched on by the `recipe` field |

If a post needs schema none of that covers, add a builder to `src/lib/seo.ts`
and derive its inputs from the parsed blocks. Never write a literal into the
article body.

## The article format

A small subset of markdown. Anything outside it renders as a paragraph.

```
## H2                      Section. Anchored, used by schema.
### H3                     Sub-section, and FAQ questions.
> text                     The answer box. One per post, right after the intro.
- item / 1. item           Lists. Every line in the block must be an item.
[label](/path)             Link. Non-"/" hrefs open in a new tab as citations.
**bold**  *italic*
![alt](/path.jpg "caption")   Figure, on its own line.
:::table Caption           First row is the header. Cells split on |.
row | row | row
:::
:::compare                 Verdict pairs, label | text.
:::
```

Two things worth knowing:

- **A figure whose file is missing simply does not render.** Write the figure
  lines for photographs you have not shot yet; they appear on the build after
  the file lands in `public/blog/<slug>/`. Keep a `README.md` shot list in
  that folder, as every post does.
- **Do not write "Scroll the table sideways".** `ArticleBody` already prints
  it under every table.

## House voice

Reverse-engineered from the published posts. Match it closely.

- Open with a real moment, not a definition. A hand hovering between two jars
  at seven in the morning. A shop counter. A fire lit at four.
- Then a bolded answer paragraph in a `>` block. Complete and honest, 40 to 60
  words.
- First person plural, as producers. "We make sakhar for a living." "We have
  stood over the kadhai." Authority comes from doing the work.
- **Say the thing that costs the sale.** Every article needs at least one
  sentence a normal seller would cut. "Eat less of it. That includes ours."
  This is the signature of the brand and the reason people trust it.
- Use both vocabularies in the same breath: sakhar and jaggery, chini and
  sugar, chiya and tea. This is how one page ranks for the Nepali and the
  English query without keyword stuffing.
- Short sentences. Plain words. **No em dashes.** No hype adjectives. Never
  open with Moreover or Furthermore. No emoji.
- After any table of figures, a bolded "Where these numbers come from"
  paragraph naming the sources with links.
- Close with a verdict, then a quiet product link, then one human line.

## Hard rules

1. **Never invent a number.** Not a price, a mineral value, a calorie count, a
   review count, a farmer's name or a year. Where a figure is needed and not
   known, write around it and say plainly that it has not been measured. The
   published posts already do this and it reads as strength, not weakness.
2. **Health claims.** Sakhar does not detox the liver, cure anaemia, purify
   blood, aid digestion or help weight loss. It is a sweetener, not a
   medicine. Label traditional and Ayurvedic claims as such. Anything touching
   diabetes links to `/blog/is-jaggery-safe-for-diabetics` and defers to a
   doctor.
3. **Internal links, minimum 5.** At least two to product pages, at least two
   to other posts, at least one to `/our-story`. Descriptive anchors only.
   Only URLs that exist.
4. **External links, 3 to 5**, from the approved list below.
5. **Keyword placement.** Primary keyword in the H1, the first 100 words, one
   H2, the meta title, the meta description, the slug and one image alt. One
   primary keyword per article.
6. **Structure.** Paragraphs of 2 to 4 sentences. An H2 every 250 to 350
   words, phrased as questions people type. 6 to 8 FAQs.
7. **Nepali terms.** First use gives Devanagari and Romanised: sakhar (सख्खर,
   also spelled sakhkhar). Nepali readers search in both scripts, so both must
   physically appear.
8. **`seoTitle` at most 60 characters. `description` 140 to 155** for English.
   For Nepali, aim shorter, around 110 to 130: Google truncates the snippet by
   pixel width and Devanagari sets much wider than Latin, so 150 Devanagari
   characters gets cut off.

## Before writing: check for overlap

Two pages targeting one query split the signal and usually means neither
ranks. Check any new keyword against what is already published:

| Slug | Owns |
|------|------|
| `himalayan-jaggery-sankhuwasabha` | Sankhuwasabha sakhar, hill vs Terai, what sakhar is, sakhar vs gud / khudo / chaku (the vocabulary section). **The pillar.** A separate glossary post was considered on 24 Sep 2026 and rejected: it would compete with this and with `sakhar-in-english`. |
| `sakhar-in-english` | jaggery in Nepali, sakhar in English / Hindi / Marathi, what is jaggery |
| `/sakhar-price` (a page, not a post) | price, cost per kg, what you pay per cup |
| `jaggery-vs-sugar` | the honest comparison, jaggery nutrition, calories, minerals, GI |
| `jaggery-health-claims-truth` | jaggery benefits, sakhar benefits, is jaggery good for health |
| `jaggery-powder-vs-block` | powder vs block |
| `how-to-store-jaggery-sakhar` | storage, going sticky, shelf life |
| `how-to-identify-pure-jaggery-sakhar` | purity, adulteration, the 7 home tests |
| `is-jaggery-safe-for-diabetics` | diabetes and all GI claims |
| `jaggery-tea-without-curdling` | sakhar chiya method |
| `chaku-recipe-maghe-sankranti` | chaku, Maghe Sankranti |
| `thekua-recipe-chhath` | thekua, Chhath prasad |
| `sel-roti-sakhar` | sel roti with jaggery, Tihar |
| `yomari-chaku-recipe` | yomari, Yomari Punhi, chaku as a filling |
| `sakhar-kheer-recipe` | jaggery kheer, gud kheer, kheer curdling |
| `suji-haluwa-sakhar` | suji halwa with jaggery, haluwa |
| `jaggery-for-children` | jaggery for kids and babies, how much sugar for children |
| `gud-ko-roti` | gud ko roti, jaggery roti, stuffed jaggery roti |
| `aanp-ko-guliyo-achar` | mango achar with jaggery, gud ko achar |
| `how-to-eat-sakhar` | how to eat / use jaggery, sakhar with dahi, dhido, roti; jaggery instead of sugar in cooking |
| `wholesale-jaggery-nepal` | bulk, B2B, supply |
| `sakhar-khane-faida` | benefits, in Nepali (pair of `jaggery-health-claims-truth`) |
| `sakhar-ra-chini` | sakhar vs sugar, in Nepali |
| `sakhar-kasari-chinne` | purity, in Nepali |

"jaggery", "jaggery in Nepal" and "jaggery powder" belong to the homepage and
the powder product page, not to a post. "Buy jaggery online (in Nepal)" belongs
to `/shop`.

If a published post already covers the query, stop. If it is thin on the
topic, update it rather than adding a page beside it.

## Publishing in two languages

A Nepali post covering the same ground as an English one is a **translation
pair**, not a duplicate. Set `lang: "ne"` on the Nepali post and
`translationOf` on **both** halves, pointing at each other. The page turns
that into reciprocal hreflang, which is what stops Google picking one and
discarding the other.

`lang` also drives `inLanguage` in the schema and the `lang` attribute on the
rendered article, so do not skip it. Write genuinely in Nepali, not a
translation of an English draft, and have a native speaker read it before it
goes live.

## The products, and only these three

```
Sakhar Block, 1kg ........ Rs. 400/kg  /products/organic-jaggery-block
Sakhar Powder, 250g ...... Rs. 149     /products/jaggery-powder
Mixed Dry Fruits, 100g ... Rs. 299     /products/mixed-dry-fruits
```

We do not sell khudo or chaku. Never imply we do. Where an article covers
chaku, the path is that chaku is made *from* sakhar blocks, so the block is
the ingredient, and there is no chaku call to action.

## Every URL that exists

`/` `/shop` `/products/organic-jaggery-block` `/products/jaggery-powder`
`/products/mixed-dry-fruits` `/our-story` `/blog` `/blog/<slug>` `/contact`
`/favourites` `/shipping-policy` `/refund-policy` `/privacy-policy` `/terms`

Never invent one. Retired slugs are 301'd in `next.config.ts`; if a new post
ever reuses one of those slugs, delete its redirect entry first or the
redirect will shadow the post.

## Borrowed photographs

Where we have no photograph of our own, a hero may use an openly licensed
image from Wikimedia Commons (CC0, CC BY or CC BY-SA only). Set `imageCredit`
on the post so the credit renders under the hero, crop it into
`<name>-16x9.jpg`, `-4x3.jpg` and `-1x1.jpg`, and list all three in
`recipe.images` on a recipe post. Never imply it is our kitchen: the `note`
says so. Replace it with our own shot as soon as one exists.

## Approved external sources

| Source | URL |
|--------|-----|
| USDA FoodData Central, granulated sugar | https://fdc.nal.usda.gov/portal-data/external/169655 |
| Sugar Tech review of non-centrifugal sugar | https://pmc.ncbi.nlm.nih.gov/articles/PMC8314846/ |
| WHO guideline on sugars intake | https://www.who.int/publications/i/item/9789241549028 |
| WHO, the 25 g figure | https://www.who.int/news/item/04-03-2015-who-calls-on-countries-to-reduce-sugars-intake-among-adults-and-children |
| Wikipedia, non-centrifugal cane sugar | https://en.wikipedia.org/wiki/Non-centrifugal_cane_sugar |
| Wikipedia, Kolhapur jaggery | https://en.wikipedia.org/wiki/Kolhapur_jaggery |
| All India Radio, Tokha chaku | https://www.newsonair.gov.in/kathmandu-streets-full-oof-fragrance-of-freshly-cookled-jaggery-for-maghe-sankranti |
| ClinicalTrials.gov, jaggery GI trial | https://clinicaltrials.gov/study/NCT07015814 |
| WHO guideline on complementary feeding, 6–23 months (2023) | https://www.who.int/publications/i/item/9789240081864 |

All eight resolved when last checked (24 August 2026). If one dies, say so
rather than substituting an unapproved source.

Note on Kolhapur: the Wikipedia article gives two different dates for the GI
award, 2014 and 2021, in adjacent paragraphs. Do not print a year for it.

## The part no prompt can produce

The published posts are good because someone who has actually stood over the
kadhai wrote them, and was willing to say the part that costs the sale.

Add two or three sentences of first-hand detail to every draft before it goes
live: the month the cane comes in, what a bad batch looks like, what the fire
smells like at four in the morning. That is the part no competitor and no
model can copy, and it is increasingly the part search engines are built to
find.
