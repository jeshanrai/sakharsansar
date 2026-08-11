# Off-page SEO: the keyword map, and how to actually earn links

The two new journal posts ship with everything that can be done *inside* the
repo: schema, canonicals, meta, internal links, cited sources. None of that
creates a backlink. Backlinks are earned off the site, by a person, and this
file is the plan for that half.

Read the blocking section first. Three of those four items are worth more than
any link you will earn in the next six months, and one of them is currently
losing you links you have already earned.

---

## 0. Blocking — do these before any outreach

| # | Action | Why it matters |
|---|--------|----------------|
| 1 | **Claim `https://www.sakharsansar.com.np` in [Google Search Console](https://search.google.com/search-console)**, then set `GOOGLE_SITE_VERIFICATION` in the host environment and redeploy | The tag is already wired in `src/app/layout.tsx` and stays off until the env var exists. Without Search Console you cannot see which links you have, which queries you rank for, or whether the new posts were indexed. |
| 2 | Submit `https://www.sakharsansar.com.np/sitemap.xml` in Search Console | The sitemap is generated and already includes both new posts. Submitting it is what starts the crawl. |
| 3 | **Verify the legacy hosts 301 to the canonical host** | `src/lib/site.ts` lists four non-canonical hosts (`sakharsansar.com.np` bare apex, `.com`, `www.com`, the Vercel URL). Any link pointing at one of those passes value only if it 301s. If they don't redirect, every backlink you earn to the wrong host is a link you worked for and did not receive. Check each one in a browser. |
| 4 | Add the site to [Bing Webmaster Tools](https://www.bing.com/webmasters) | Small in Nepal for search share, but Bing's index is what ChatGPT search reads. `robots.ts` already welcomes `OAI-SearchBot`, `PerplexityBot` and `ClaudeBot`; being in Bing's index is the other half. |

---

## 1. The keyword map

One page owns one query. This is what stops two of your own articles competing
for the same result, which is what was happening before this round: the
comparison post carried a "Can Diabetics Eat Sakhar?" section that has now been
shortened to a pointer.

Keep this table honest as you add posts. If a new draft's primary keyword is
already in the *owns* column, it is a section of the existing post, not a new one.

| Page | Owns (primary) | Also targets | Deliberately does **not** target |
|------|----------------|--------------|----------------------------------|
| `/blog/is-jaggery-safe-for-diabetics` | is jaggery safe for diabetics | jaggery for diabetes, gur for diabetes, jaggery glycemic index, diabetic jaggery, jaggery blood sugar, sugar-free jaggery | jaggery vs sugar |
| `/blog/jaggery-tea-without-curdling` | how to make jaggery tea without curdling | jaggery tea, sakhar chiya, gud ki chai, why milk curdles with jaggery, jaggery in milk, how much jaggery per cup | jaggery health benefits |
| `/blog/jaggery-vs-sugar` | jaggery vs sugar | sakhar vs chini, is jaggery healthier than sugar, jaggery calories, jaggery vs brown sugar | is jaggery safe for diabetics *(now handed to the post above)* |
| `/blog/how-to-identify-pure-jaggery-sakhar` | how to identify pure jaggery | jaggery purity test, fake jaggery, adulterated jaggery, pure gur test at home | jaggery nutrition |
| `/shop`, `/products/*` | buy jaggery Nepal, organic jaggery Nepal, jaggery price Nepal | per-product terms | any informational query — those belong to the journal |

**The Nepali-language gap.** Nothing on the site targets Devanagari queries
(सखर, चाकु, गुड, चिनी रोग). That is real, unclaimed search volume with almost no
competition. It is a bigger opportunity than any single backlink, but it is a
separate project: a Nepali post is a translation *plus* `hreflang`, not a
machine translation dropped into `blog.json`.

---

## 2. What the site already does, so you don't pay anyone to "fix" it

Nepali SEO agencies will offer to sell you most of this. It is done:

- Full schema graph — `Organization` + `OnlineStore` + `LocalBusiness` under one
  `@id`, `WebSite`, `BreadcrumbList`, `BlogPosting` with a named human author,
  `FAQPage` derived from the rendered prose, `Product` with shipping and return
  terms.
- Canonical URLs on every page, one canonical host, no duplicate-host split.
- Per-post Open Graph cards rendered at a true 1200×630 with the headline burnt in.
- Dynamic sitemap with image entries, RSS feed, `llms.txt` for answer engines.
- `robots.txt` explicitly welcoming AI and search crawlers, admin portal excluded.
- Four-post internal cluster, cross-linked in both directions, with related posts
  now ranked by shared tags rather than file order.

What none of it does is make another website link to you. That is section 3.

---

## 3. Tier 0 — citations you control (this week, ~3 hours total)

Not links in the ranking sense — most carry `nofollow` — but they establish the
business as one consistent entity, which is what makes the `LocalBusiness`
schema believable.

**The rule: name, address and phone must match `src/lib/site.ts` character for
character, everywhere.** "SakharSansar", Kapan, Kathmandu, Bagmati Province,
+977-9860149199. Not "Sakhar Sansar Pvt Ltd", not a second mobile number.

| Target | Notes |
|--------|-------|
| **Google Business Profile** | The single highest-value listing for a Kathmandu business. Drives Maps, brand search and the knowledge panel. Do this one first. |
| Bing Places | Ten minutes, feeds Bing/Copilot. |
| Facebook, Instagram, TikTok, YouTube | These four are already claimed as `sameAs` in the Organization schema (`src/lib/site.ts`). If any of those profiles does not exist or does not link back to the site, the schema is asserting something a crawler can't confirm — either create them or remove them from the array. |
| Daraz, Bhatbhateni, BigMart, Salesberry, Amazon seller pages | Mostly nofollow, but they are brand citations and real revenue. Make sure each carries the website URL where the platform allows it. |
| Nepali business directories | nepalyp.com and similar. Low value each, cheap to do, harmless. Do not buy a "500 directory submissions" package — see section 7. |

---

## 4. Tier 1 — shoot the graphics, because they are the actual link bait

Nobody links to a wall of text. They link to a picture that settles an argument.

Four images are already named, sized and alt-texted in the articles; each folder's
`README.md` carries the brief. They render automatically the moment the file lands.

| Image | Article | Why it earns links |
|-------|---------|--------------------|
| `jaggery-tea-curdled-vs-smooth.jpg` | Jaggery tea | Two glasses, one split, one smooth. This is the most linkable image on the whole site — it proves a claim in one frame and recipe writers will lift it. |
| `jaggery-blood-sugar-chart-nepal.jpg` | Diabetics | The "No / No / No" row is the payload. Forwards into exactly the family WhatsApp groups where the opposite claim spreads. |
| `jaggery-vs-sugar-chart-nepal.jpg` | Jaggery vs sugar | Already briefed, still unshot. |
| `7-tests-pure-jaggery-checklist.jpg` | Purity | Save-to-phone shopping checklist. |

Put the logo and `sakharsansar.com.np` in a corner of each. The image travels
further than the page; the URL is what brings the reader back, and it is what
makes an uncredited reuse into a citation you can politely ask to have linked.

**Also shoot the tea method vertically while the stove is on.** The five steps
are a 40-second Reel with the hook already written: drop a lump into boiling
milk, show it split, then show the right order. Video is where Nepali food
audiences actually are, and it is the cheapest traffic in this plan.

---

## 5. Tier 2 — who to actually approach

Ordered by how likely they are to say yes.

**a. Nepali food creators and recipe bloggers.** The jaggery tea post is the
pitch. You are not asking for a link; you are offering a fix for a problem their
audience complains about in the comments, plus the photograph that proves it.
Ask them to credit the article if they use the image.

**b. Nepali diaspora communities.** r/Nepal, and the Nepali Facebook groups in
Australia, the US, the UK and the Gulf. "Where do I get real gud" is asked in
these constantly. Answer the question properly, link only when it is genuinely
the answer, and never with a fresh account. One helpful comment a week beats
twenty drops.

**c. Nepali news and lifestyle desks.** Kathmandu Post, Onlinekhabar, Setopati,
Nepali Times, Republica. Health and food desks. See section 6 — you have a real
story, not a product pitch.

**d. Agriculture, cooperative and NGO coverage.** Forty-two farming families
across six villages in Sankhuwasabha, paid above market for chemical-free cane,
is exactly the kind of thing that gets written up by agricultural journalism,
cooperative federations and development organisations. These are the highest-
authority links available to this business, and the story already exists on
`/our-story`.

**e. Nepali diabetes and health organisations.** Only with the diabetes article,
and only framed as "a producer publishing an honest warning". Do not pitch these
as a product.

---

## 6. The one genuinely newsworthy angle

> **A jaggery producer has published an article telling people with diabetes not
> to buy jaggery.**

That is a story. Every other seller in the market is claiming the opposite, and
a producer arguing against their own sales is the kind of reversal an editor
will run. It is also the only pitch here that a journalist would use unprompted.

It works *because* the article is honest. The moment anything on the site claims
jaggery cures, cleanses or reverses anything, this angle dies and the E-E-A-T
that carries a health page dies with it.

**Pitch, roughly 120 words, to a health or food desk:**

> Subject: A jaggery producer telling diabetics not to buy jaggery
>
> I make sakhar in Sankhuwasabha and sell it across Nepal. Last week I published
> an article telling people with diabetes that our product is not safe for them
> and not to accept it as a Dashain gift.
>
> Every shop in the market sells jaggery as diabetic-friendly. It is 70 to 85
> percent sucrose. Nepal's own nationwide survey found 8.5 percent of adults over
> 20 living with diabetes and only half of them aware of it, and those are the
> people being sold "sugar-free gur".
>
> The article is here: [link]. Happy to talk on the record, and happy to be
> quoted saying it costs us sales, because it does.

---

## 7. What not to do

- **Do not buy links.** Paid links, guest-post networks and PBNs violate
  [Google's link spam policies](https://developers.google.com/search/docs/essentials/spam-policies#link-spam).
  The cheap Nepali packages are the easiest kind to detect, because the same
  footprints sell to everyone.
- **No mass directory submissions.** "500 directories" is a footprint, not a
  strategy.
- **No comment or forum drops.** They are nofollow, they annoy the community you
  need, and r/Nepal will ban the account.
- **Vary your anchor text.** If every incoming link says "organic jaggery Nepal",
  that pattern is itself the signal. Brand name and bare URLs are healthy.
- **Do not add health claims to win a link.** Every claim on the site has to
  survive the same standard the diabetes article sets, or the article is worthless.

---

## 8. Measurement and upkeep

**Track in Search Console, monthly:**

- Impressions and position for the primary keywords in section 1. Position 40 → 15
  is progress even with zero clicks; wait for it before rewriting anything.
- The *Links* report, for what actually landed.
- Coverage, to confirm all four posts are indexed and none are "Discovered –
  currently not indexed".

**Upkeep, every six months:**

- **Re-verify every outbound citation.** This is not optional on health content.
  One already broke: USDA moved FoodData Central's detail pages and the old
  `/food-details/<id>/nutrients` URL now 404s. It was fixed in this round; the
  next one will break the same way.
- Two links on the purity post (`dftqc.gov.np`, `fssai.gov.in`) refused automated
  checks during this round — a firewall, most likely, not a dead page. **Open
  both in a browser and confirm.**
- Re-read the diabetes post against current guidance and bump `updated` in
  `blog.json` when anything changes. `dateModified` is a freshness signal and
  the page displays "Updated <date>" to readers, which is the point of doing it.
