# Our Story — team photos

Drop these portrait/photo files here, then open
`src/components/sections/FarmersSection.tsx` and set `TEAM_PHOTOS_READY = true`.
Until then the gallery reuses an existing photo so nothing 404s.

| File | Used by | What it is | Tips |
|------|---------|-----------|------|
| `lead.jpg` | "Meet the makers" main image | Wide hero shot of the cooperative / lead maker | ~5:4, landscape, 1600px wide+ |
| `member-1.jpg` | Portrait — Ram Bahadur (Master fire-tender) | Vertical portrait | 3:4, ~1000×1333 |
| `member-2.jpg` | Portrait — Anita Rai (Harvest & cane lead) | Vertical portrait | 3:4 |
| `member-3.jpg` | Portrait — Dhan Kumari (Mould & finishing) | Vertical portrait | 3:4 |
| `member-4.jpg` | Portrait — Bishnu Tamang (Packing & dispatch) | Vertical portrait | 3:4 |

Names/roles live in the `team` array in `FarmersSection.tsx` — edit, add, or
remove rows there to match your real team.
