# Our Story — video assets

Drop these self-hosted video files here. Until they exist, each player shows a
poster still, so the page is never broken.

| File | Used by | What it is | Tips |
|------|---------|-----------|------|
| `farm-loop.mp4` | StoryWelcomeSection ("Nice to meet us") | Short, **silent**, looping farm/valley clip. Autoplays muted. | 8–20s, 1080p, ~4:3 crop, keep under ~6 MB (it autoplays). No audio needed. |
| `making-process.mp4` | StoryProcessSection ("How it's made") | The full **making film** (cane → wood-fire → mould → pack). Click-to-play with sound. | 16:9, 1080p, compressed H.264. A minute or two is fine; it only loads on click. |

Posters: the players currently reuse `/hero.jpg` and `/farmers/farmer1.jpg`.
To use dedicated stills, add `farm-poster.jpg` / `making-poster.jpg` here and
update the `poster=` prop in the two sections.

Encoding hint (ffmpeg):
```
ffmpeg -i input.mov -vf "scale=1920:-2" -c:v libx264 -crf 24 -preset slow -an farm-loop.mp4
```
(`-an` drops audio — use it for the silent farm loop only.)
