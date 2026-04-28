# SakharSansar — Editorial Redesign Changelog

## Typography pass (follow-up)

A focused second pass to bring the type system fully in line with the brief.

**Fonts (`src/app/layout.tsx`)**
- `Fraunces` switched to its **variable** axis (`weight: "variable"`) and the
  `SOFT` + `WONK` stylistic axes are now loaded — usable via the new
  `.font-soft` / `.font-wonk` utilities to soften terminals on hero display
  text. The `opsz` (optical-sizing) axis is enabled globally via
  `font-optical-sizing: auto`, so contrast adapts to size.
- Added **Tiro Devanagari Hindi** as a third font for Nepali/Sanskrit accents
  (`सखर संसार`, `मिठो`, `उत्सव`, `आरोग्य`). Previously Devanagari was
  falling back to system Mangal/Nirmala UI on Windows — not editorial. Tiro
  is John Hudson's editorial Devanagari serif, designed to pair with Latin
  serifs of similar warmth.
- Inter weights pinned to `400 / 500 / 600` only — body uses 400, emphasis
  uses 500. No more accidental light-weight body copy.

**Type system (`src/app/globals.css`)**
- Added a fluid editorial scale via `clamp()`: `text-display`, `text-h1`,
  `text-h2`, `text-h3`, `text-h4`, `text-lede`, `text-body`, `text-meta`,
  `text-caption`, `text-eyebrow`. Each carries its own line-height token so
  rhythm stays consistent without per-component tweaks.
- Tracking tokens: `--tracking-display: -0.018em`, `--tracking-tight`,
  `--tracking-caps: 0.22em`. Replaces the inline `tracking-[-0.01em]`
  arbitrary values that were sprinkled through components.
- Default `h1`–`h4` now inherit Fraunces, weight 400, balanced wrapping.
- Body default lifted from 16px to **17px** (`--text-body`) with a
  `1.7` line-height — more editorial, less app-like.
- Numeric defaults: oldstyle, proportional figures globally (`text feels
  written, not invoiced`); `.nums-price` / `.nums-tabular` opt-in to lining
  tabular figures for prices and weights.
- Added `font-feature-settings: "calt", "liga", "kern"` and
  `text-rendering: optimizeLegibility` at the root.
- New utilities: `.font-devanagari`, `.pull-quote` (italic Fraunces, fluid
  size, balanced wrap), `.has-dropcap` (4.25em first letter, used on the
  Origin Story, Story chapters, and Blog detail leads), `.nums-oldstyle`.

**Component sweep**
- Replaced ~25 hard-coded `text-4xl/5xl/6xl/lg/xl` heading values across
  Hero, Origin Story, Products, Process, Ways to Savor, Testimonials,
  Find Us, Story (page), Story Chapters, Story CTA, Farmers, Footer
  newsletter, Product Detail, Shop header, Blog index, Blog detail with the
  new fluid `text-display`/`text-h1`/`text-h2`/`text-h3`/`text-h4`/`text-lede`
  utilities.
- Eliminated `font-light` (300) on body copy — replaced with default 400 —
  per the brief's "weight 400 for body, 500 for emphasis." The italic forms
  inside headlines keep `font-light` for warm contrast against the 400
  roman.
- All Devanagari spans (Navbar wordmark, Hero eyebrow, Footer brand,
  WaysToEnjoy `मिठो/उत्सव/आरोग्य`, mobile menu accent) now use
  `font-devanagari` instead of Latin Fraunces.
- Hero + Story hero + Shop "The Collection" + Blog "Letters from
  Sankhuwasabha" headlines now apply `.font-soft` so Fraunces' SOFT axis
  rounds the terminals on display sizes — the warmest possible reading
  of the typeface, the way Yolélé treats its display type.
- Origin Story, every Our Story chapter, and the first paragraph of each
  blog post now carry `.has-dropcap` for editorial first-paragraph treatment.
- All testimonial blockquotes use the new `.pull-quote` utility for
  consistent italic-serif voice.
- Prices, weights, and the harvest-date badge now use `.nums-price` so
  digits sit on a tabular grid (no jitter on filter changes or hover state
  swaps).
- The Process section's `01–04` step numbers and chapter eyebrows use
  oldstyle figures via `.nums-oldstyle` for an "editorial date-line" feel.

**Build**
- `npx next build` → all 25 routes compile and prerender. Variable Fraunces
  with two extra axes adds ~12 KB to the font payload but reduces total
  weight files loaded (one variable file instead of four static files).

---

## Initial redesign

A Yolélé-inspired, heritage-first redesign of the customer-facing site. Admin
routes (`/portfolio/**`, `/feed`) are intentionally untouched.

## Design system

**`src/app/globals.css`**
- New palette tokens: `--color-jaggery` `#3D2817`, `--color-caramel`
  `#B8763E`, `--color-honey` `#E8A857`, `--color-cream` `#F5EDE0`,
  `--color-ivory` `#FAF6EE`, `--color-beige` `#D9C4A3`, `--color-forest`
  `#4A5D3A`, `--color-terracotta` `#C4623E`, `--color-ink` `#1A1410`. Legacy
  `earth-*` tokens kept as aliases.
- Added `.paper-grain` utility (SVG turbulence, ~4% opacity overlay) for warm
  texture on cream surfaces.
- Added `.label-caps` editorial utility (small caps + 0.22em tracking).
- Added `.text-balance`, `.text-pretty`, `prefers-reduced-motion` support, and a
  selection color matched to the palette.

**`src/app/layout.tsx`**
- Swapped Poppins for **Fraunces** (warm display serif) as the heading font;
  Inter remains as body sans. Both self-hosted via `next/font/google` with
  `display: "swap"`.
- Body now defaults to cream background + jaggery text.

## Shared layout

**`Navbar.tsx`** — fully rewrote.
- Editorial wordmark: Devnagari `सखर संसार` line + serif "SakharSansar".
- Transparent over hero, switches to cream + blur on scroll.
- Outline ghost CTA `Order` instead of solid pill.
- Full-screen mobile overlay with oversized serif links and Devnagari accent
  copy.
- New `Journal` link replaces `Blog` for editorial tone.

**`Footer.tsx`** — fully rewrote.
- Deep-jaggery background with cream type, paper-grain overlay.
- New "Letters from the Himalayas" newsletter section (extracted into
  `NewsletterForm.tsx` client component for proper RSC boundaries).
- 4-column layout: Brand · Shop · Learn · Contact.
- Devnagari script accent above wordmark.
- Reduced socials to Instagram + Facebook (per brief).

**`NewsletterForm.tsx`** *(new)* — client component handling submit + success
state for the newsletter form.

**`OrderDrawer.tsx`** — left untouched (existing functionality preserved).

## Homepage (`src/app/page.tsx`)

New section order, all sections rebuilt:

1. **HeroSection** — full-bleed 88vh hero with warm vignette gradient, Devnagari
   eyebrow line, oversized Fraunces headline ("Sweetness from the Roof of the
   World"), single editorial CTA (`Discover the Harvest`), secondary text-link
   to story, vertical "Scroll" cue.
2. **OriginStorySection** *(new)* — asymmetric 7/5 split, Sankhuwasabha image
   with location label overlay, italic pull quote with caramel rule, link to
   full story.
3. **ProductsSection** — editorial 4-up showcase. Cream/ivory cards, large
   `aspect-[4/5]` images, serif name + understated weight/price, hover reveal
   "View Product" overlay. Replaces the previous 8-product e-commerce grid;
   adds a "View the full collection" link to `/shop`.
4. **ProcessSection** — deep-brown background with cream text and paper grain.
   Four steps (Harvest → Wood-Fire → Hand-Mould → Pack) with Lucide icons,
   season hints, and a connecting hairline on desktop.
5. **WaysToEnjoySection** *(new content)* — magazine 3-column grid with Nepali
   words (मिठो / उत्सव / आरोग्य) overlaid on imagery. Morning chiya, sel roti,
   Ayurvedic ritual.
6. **TestimonialsSection** — single large italic-serif quote with auto-rotate
   (7s), customer initial avatar, dot navigation, prev/next arrows.
7. **TrustBanner** — slim forest-green band, italic-serif numerals + label-caps
   badges (replacing previous icon pills).
8. **FindUsSection** — editorial header, partner logos in grayscale row with
   hairline borders top + bottom.

Removed from homepage: TrustBanner moved below testimonials, old
`HighlightsSection`, `BlogHighlightSection`, `CtaSection` no longer rendered
(files left in place, unimported).

## Product detail (`src/app/products/[slug]/page.tsx`)

- Full editorial rewrite. 7/5 split (image / info), with sticky image column on
  desktop.
- "Harvested in November 2025" badge overlaid on the image.
- Serif name, italic poetic short description, understated price/weight pair.
- Full-width brown CTA via updated `ProductActions.tsx`.
- New `ProductDetailSections.tsx` *(client)* expandable accordion: Tasting
  Notes, How to Use, Sourcing & Process, Storage & Shelf Life. First section
  open by default.
- "Pairs Well With" section: 3 related products, editorial card style.
- "Stories from Sankhuwasabha" CTA to journal.
- Forest-green accents on trust strip (Leaf / ShieldCheck / Truck).

## Shop / Product Listing (`src/components/shop/ShopContent.tsx`)

- New editorial header: "The Collection" eyebrow + "Eight expressions of one
  cane." headline with poetic subhead.
- Sidebar filters re-skinned: serif labels, hairline borders, radio-dot price
  selectors, label-caps section headers.
- Card grid re-skinned to match homepage editorial cards (`aspect-[4/5]`,
  serif name, italic category badge, "View →" microcopy).
- Empty state and `Reset filters` use the new outlined pill style.

## Our Story (`src/app/our-story/page.tsx`)

Fully rewritten as a chaptered editorial narrative.

- **`StorySection.tsx`** — 88vh cinematic hero with deep-jaggery vignette and
  oversized headline ("Seven generations of slow sweetness").
- **`StoryChaptersSection.tsx`** *(new)* — four chapters (The Land · The
  Farmers · The Craft · The Promise), alternating left/right asymmetric
  layouts. Each chapter has eyebrow, large serif title, body copy, and an
  italic pull quote on a caramel rule.
- **`FarmersSection.tsx`** — rewritten. Deep brown surface with cream text. 3-up
  grid of farmer profile cards: village, name, "years on the fire", italic
  quote.
- **`StoryCtaSection.tsx`** *(new)* — closing "Taste the story" CTA with single
  brown pill linking to `/shop`.

## Blog (`src/app/blog/page.tsx`, `src/app/blog/[slug]/page.tsx`)

- Index: editorial header "Letters from Sankhuwasabha", featured post in 7/5
  split with large image, secondary posts in 2-column grid. Tag pill replaced
  with caramel label-caps + dot separator + date.
- Detail: serif headline + italic deck, 16/9 hero image, drop cap on first
  paragraph, hairline-divided share row, palette migrated to jaggery/cream.
- Removed `FaqsSection` import (was orphaned at the bottom of the index).

## Performance & accessibility

- All hero/featured imagery uses `priority` + explicit `sizes`; below-the-fold
  uses `loading="lazy"` and `aspect-ratio` to prevent CLS.
- Below-the-fold homepage sections continue to be `dynamic()` imported.
- Added `prefers-reduced-motion` global override (animations + scroll behavior
  collapse to ~0).
- Form selection / focus colors meet WCAG AA on the new cream/jaggery pairing.
- All icon-only buttons have `aria-label` and proper `aria-expanded` on the
  expandable sections.
- Mobile hamburger overlay locks body scroll and uses 44×44+ touch targets.

## Build / typecheck

- `npx tsc --noEmit` → clean.
- `npx next build` → all 25 routes compile and prerender successfully (Next
  16.2.1, Turbopack, React 19).

## Files added

- `src/components/sections/OriginStorySection.tsx`
- `src/components/sections/StoryChaptersSection.tsx`
- `src/components/sections/StoryCtaSection.tsx`
- `src/components/product/ProductDetailSections.tsx`
- `src/components/layout/NewsletterForm.tsx`

## Files left in place but no longer imported

These remain in the repo (so the diff stays scoped) but are unreferenced:
- `src/components/sections/CtaSection.tsx`
- `src/components/sections/HighlightsSection.tsx`
- `src/components/sections/BlogHighlightSection.tsx`
- `src/components/sections/FaqsSection.tsx`
- `src/components/sections/BenefitsSection.tsx`
- `src/components/sections/ComparisonSection.tsx`
- `src/components/ui/OrderButton.tsx`

Safe to delete in a follow-up PR.

## Out of scope for this round

- Policy pages (`/privacy-policy`, `/terms`, `/shipping-policy`,
  `/refund-policy`) — still on the legacy palette; trivial to migrate when
  desired.
- Photography — current images (`/herobg.png`, `/products/*.jpg`,
  `/farmers/farmer1.jpg`) are reused. The brief's recommended "still-life
  paintings" photography must be sourced separately.
- Subscription, Gift Box configurator, Harvest Calendar (called out as
  "improvements over Yolélé") — these are net-new features that need data
  modeling and were not implemented in this redesign pass.
- Admin (`/portfolio/**`) and `/feed` route — intentionally untouched per
  brief.
