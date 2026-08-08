# Photographs for "Sakhar vs Sugar: Which Is Actually Better for Daily Use?"

This article is written to be **shared**, not just read — the comparison graphic
below is the thing that travels on Facebook and WhatsApp with your brand in the
corner. Everything else on the page is words; that one image is the reach.

## How the slots work

The article body names all six files. A slot whose file is **not** in this
folder simply doesn't render — the article ships without it, and the photo
appears on the next build the moment the file lands here under the exact
filename below. No code or content changes needed.

Dimensions are read from the file itself, so any size or orientation works.

## Shot list

| # | Where | Filename | What to shoot |
|---|-------|----------|---------------|
| 1 | Hero | `jaggery-vs-sugar-comparison.jpg` | A block of dark hill sakhar beside a bowl of white sugar, same light, same surface. **Placeholder in place — replace.** |
| 2 | Under the table | `jaggery-vs-sugar-chart-nepal.jpg` | The comparison table redrawn as a shareable graphic. See the note below. |
| 3 | "What actually makes sakhar different" | `jaggery-tea-vs-sugar-tea.jpg` | Two identical cups of chiya, one sweetened with sakhar, one with sugar |
| 4 | "Sakhar vs brown sugar vs honey" | `jaggery-vs-brown-sugar-vs-honey.jpg` | Sakhar, brown sugar and honey together in one frame |
| 5 | "How much sakhar per day" | `how-much-jaggery-per-day.jpg` | A measured spoon of sakhar — one honest daily portion, not a heap |
| 6 | "How to replace sugar with sakhar" | `jaggery-substitute-for-sugar-cooking.jpg` | Sakhar dissolving in tea, mid-stir |

Alt text for each is already written into the article — no need to supply it.

## The comparison graphic (#2) is the important one

It is the highest-value image on the page, and the only one worth paying a
designer for. Rules:

- Redraw the **same rows** the HTML table shows. The table is what Google reads
  and may feature; the graphic is what people screenshot. They must agree.
- Readable on a phone held at arm's length. Two columns, big type, no clutter.
- Put the logo and `sakharsansar.com.np` in a corner. That is the whole point —
  the image circulates far past the site, and the URL is what brings it back.
- Keep the honest framing. A graphic that oversells contradicts the article and
  wastes the reason people are sharing it in the first place.

## Before uploading

- Shoot in **natural light**, near a window. Not under a yellow bulb.
- Compress every file **below 200 KB**. Page speed is a ranking factor and
  photos are the usual culprit.
- Keep the filenames exactly as above, hyphenated. Never `IMG_2043.jpg`.
- `next.config.ts` serves images with a one-year immutable cache. If you replace
  a photo later, either give it a new filename or expect returning visitors to
  keep seeing the old one until their cache clears.
