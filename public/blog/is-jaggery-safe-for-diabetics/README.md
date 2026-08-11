# Photographs for "Is Sakhar Safe for Diabetics? An Honest Answer"

This is the highest-intent article on the site. Somebody searching *"is jaggery
safe for diabetics"* is deciding whether to feed something to a parent, and the
page answers **no**. The photography has to match that tone: plain, measured,
unsentimental. No glowing hero shots of jaggery on a wooden board with sunlight
through it, which is the visual language of "this is good for you".

## How the slots work

Four files in total: the hero, named in `src/data/blog.json`, and three figure
slots named in the article body. A body slot whose file is **not** in this
folder simply doesn't render — the article ships without it, and the photo
appears on the next build the moment the file lands here under the exact
filename below. No code or content changes needed.

The hero is the exception: it is read at build time to generate the social
card, so a file must always exist at that path.

Dimensions are read from the file itself, so any size or orientation works.

## Shot list

| # | Where | Filename | What to shoot |
|---|-------|----------|---------------|
| 1 | Hero | `is-jaggery-safe-for-diabetics-nepal.jpg` | A block of dark hill sakhar on a plain surface, cool daylight, nothing styled around it. **Abstract placeholder in place — replace.** |
| 2 | Under the table | `jaggery-blood-sugar-chart-nepal.jpg` | The comparison table redrawn as a shareable graphic. See the note below. |
| 3 | "What sakhar actually is" | `jaggery-sucrose-content-close-up.jpg` | A block broken open, shot close, so the crystalline sugar structure is visible |
| 4 | "One small piece after dal bhat" | `jaggery-portion-diabetes-nepal.jpg` | A small piece of sakhar on a digital kitchen scale reading about 5 g, beside a cup of tea. The reading must be legible. |

## The comparison graphic (#2) is the important one

It is the only image on the page worth paying a designer for, because it is what
gets screenshotted into family WhatsApp groups — which is exactly where the
"jaggery is diabetic-friendly" claim spreads in the first place.

- Redraw the **same rows** the HTML table shows. The table is what Google reads
  and may lift into a result; the graphic is what people forward. They must agree.
- The "Safe swap for someone with diabetes: No / No / No" row is the payload.
  Design the graphic around that line.
- Readable on a phone at arm's length. Big type, no clutter.
- Put the logo and `sakharsansar.com.np` in a corner. The image will travel far
  past the site, and the URL is what brings the reader back.

## Tone rules for this article specifically

- **No medical props.** Do not stage a glucometer, test strips, insulin pens or
  a stethoscope next to the jaggery. It implies a clinical claim the article
  spends 2,700 words refusing to make, and it is the kind of image that gets a
  health page demoted rather than ranked.
- The scale in shot #4 is fine — it is a kitchen object, not a medical one.
- No smiling elderly models. Nobody in this article is being reassured.

## Before uploading

- Shoot in **natural light**, near a window. Not under a yellow bulb.
- Compress every file **below 200 KB**. Page speed is a ranking factor and
  photos are the usual culprit.
- Keep the filenames exactly as above, hyphenated. Never `IMG_2043.jpg`.
- `next.config.ts` serves images with a one-year immutable cache. If you replace
  a photo later, either give it a new filename or expect returning visitors to
  keep seeing the old one until their cache clears.

Alt text for each is already written into the article — no need to supply it.
