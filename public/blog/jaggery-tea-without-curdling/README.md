# Photographs for "Sakhar Chiya: How to Make Jaggery Tea Without Curdling the Milk"

This is the most *shootable* article on the site and the one most likely to earn
links and shares, because the failure it describes is visible. A photograph of a
split pan next to a smooth glass explains the whole page in one frame, which is
what makes it travel.

It is also the article to cut into Reels and TikToks. The method is five steps
and forty seconds of footage.

## How the slots work

Five files in total: the hero, named in `src/data/blog.json`, and four figure
slots named in the article body. A body slot whose file is **not** in this
folder simply doesn't render — the article ships without it, and the photo
appears on the next build the moment the file lands here under the exact
filename below. No code or content changes needed.

The hero is the exception: it is read at build time to generate the social card,
so a file must always exist at that path.

Dimensions are read from the file itself, so any size or orientation works.

## Shot list

| # | Where | Filename | What to shoot |
|---|-------|----------|---------------|
| 1 | Hero | `jaggery-tea-sakhar-chiya-nepal.jpg` | One glass of finished sakhar chiya, smooth, steam still rising, plain background. **Abstract placeholder in place — replace.** |
| 2 | Top of the article | `jaggery-tea-curdled-vs-smooth.jpg` | **The money shot.** Two identical glasses side by side: one curdled and grainy, one smooth. Same milk, same sakhar, same light. |
| 3 | "The method that works" | `how-to-make-jaggery-tea-steps-nepal.jpg` | The five steps as one graphic or a four-up grid: decoction, sakhar off the heat, milk going in, finished glass |
| 4 | "Which form dissolves best" | `jaggery-forms-for-tea-powder-cubes-block.jpg` | Powder, cubes and a grated block in one frame, each in a small dish, clearly distinguishable |
| 5 | "Ginger, cardamom, masala" | `masala-jaggery-tea-ginger-cardamom.jpg` | Masala chiya with crushed ginger and cracked cardamom visible beside the glass |

## Shot #2 is the one that earns the links

Deliberately ruin a pan for this. Drop a lump of sakhar into hard-boiling milk,
let it split properly, and pour it into a glass identical to the good one.

- Both glasses in the **same frame, same light**, so nobody can claim it is a
  trick of the photograph.
- The curds must be legible at thumbnail size. Shoot close.
- Put the logo and `sakharsansar.com.np` in a corner — this is the image that
  gets lifted into other people's recipe posts, and the credit is the link.

## Video, while you have the stove on

Shoot the method vertically at the same time. The five steps in the article map
directly onto a 40-second Reel, and the hook is already written: drop the lump
into boiling milk, show it split, then show the right order. Post it with a link
back to this article.

## Before uploading

- Shoot in **natural light**, near a window. Not under a yellow bulb.
- Compress every file **below 200 KB**. Page speed is a ranking factor and
  photos are the usual culprit.
- Keep the filenames exactly as above, hyphenated. Never `IMG_2043.jpg`.
- `next.config.ts` serves images with a one-year immutable cache. If you replace
  a photo later, either give it a new filename or expect returning visitors to
  keep seeing the old one until their cache clears.

Alt text for each is already written into the article — no need to supply it.
