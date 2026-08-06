import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE } from "./site";

/**
 * Shared social-card renderer.
 *
 * `opengraph-image` is a *per-route-segment* convention — a card at the app
 * root is not inherited by `/shop`, `/blog`, `/our-story` and friends. Those
 * pages also export their own `openGraph` block, and because Next replaces
 * (never merges) that object, they ended up advertising no `og:image` at all:
 * every share on WhatsApp, Messenger or X rendered as a bare text link. In
 * Nepal, where WhatsApp/Viber sharing is a primary discovery path for a shop,
 * that is a real loss of clicks.
 *
 * So each of those segments colocates a small `opengraph-image.tsx` that calls
 * this. Keeping the artwork in one place means the whole family stays visually
 * consistent instead of drifting card by card.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/** Brand palette, matched to the root card. */
const CREAM = "#F5EDE0";
const CREAM_WARM = "#FBEEDD";
const JAGGERY = "#3D2817";
const CARAMEL = "#B8763E";
const BODY = "#5A3B22";
const LEAF = "#0F5A2C";

/**
 * Read the MIME type from the file's own magic bytes, not its extension.
 *
 * Several images in `public/` are PNGs saved with a `.jpg` extension
 * (`products/jaggery-block.jpg`, `products/jaggery-cubes.jpg`). Trusting the
 * extension hands the renderer `data:image/jpeg` wrapping PNG bytes, which it
 * cannot decode — and it fails *silently*, dropping the photo and leaving a
 * blank half-card that still builds green. Sniffing is the only way to be sure.
 */
function sniffMime(buf: Buffer): string {
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47)
    return "image/png";
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf.subarray(0, 4).toString("ascii") === "RIFF" &&
      buf.subarray(8, 12).toString("ascii") === "WEBP")
    return "image/webp";
  if (buf.subarray(0, 6).toString("ascii").startsWith("GIF8")) return "image/gif";
  throw new Error(
    "Unrecognised image format for an OG card — expected PNG, JPEG, WebP or GIF.",
  );
}

export interface OgCardOptions {
  /** Small tracked-out line above the headline. */
  eyebrow: string;
  /** The headline. Keep it under ~40 characters so it stays on two lines. */
  title: string;
  /** One supporting sentence. */
  subtitle: string;
  /** Optional pill row along the bottom of the text column. */
  chips?: string[];
  /**
   * Public-relative path of the photo in the right-hand column
   * (e.g. "/hero.jpg"). Read off disk and inlined, because `next/og` has no
   * network access at build time.
   */
  image?: string;
}

export async function renderOgCard({
  eyebrow,
  title,
  subtitle,
  chips = [],
  image = "/hero.jpg",
}: OgCardOptions) {
  const file = await readFile(join(process.cwd(), "public", image.replace(/^\//, "")));
  const src = `data:${sniffMime(file)};base64,${file.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: CREAM,
          position: "relative",
        }}
      >
        {/* Warm bleed behind the photo, so the card doesn't read as two halves */}
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -160,
            width: 720,
            height: 720,
            borderRadius: 9999,
            background: CREAM_WARM,
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "72px 0 72px 72px",
            width: 700,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: 4,
              color: CARAMEL,
              fontWeight: 600,
              marginBottom: 28,
            }}
          >
            {eyebrow}
          </div>

          <div
            style={{
              display: "flex",
              // Long headlines step down a size so they never overflow the
              // column and clip mid-word.
              fontSize: title.length > 28 ? 62 : 78,
              lineHeight: 1.04,
              color: JAGGERY,
              fontWeight: 700,
              letterSpacing: -2,
              marginBottom: 26,
            }}
          >
            {title}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 30,
              lineHeight: 1.4,
              color: BODY,
              marginBottom: chips.length ? 40 : 0,
              maxWidth: 560,
            }}
          >
            {subtitle}
          </div>

          {chips.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {chips.map((chip) => (
                <div
                  key={chip}
                  style={{
                    display: "flex",
                    fontSize: 19,
                    color: LEAF,
                    background: "rgba(15, 90, 44, 0.09)",
                    border: "1px solid rgba(15, 90, 44, 0.18)",
                    borderRadius: 9999,
                    padding: "10px 20px",
                  }}
                >
                  {chip}
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 56,
          }}
        >
          <img
            src={src}
            alt=""
            width={400}
            height={400}
            style={{ width: 400, height: 400, objectFit: "cover", borderRadius: 40 }}
          />
        </div>

        {/* Footer rule + wordmark */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: 14,
            background: JAGGERY,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 42,
            left: 72,
            display: "flex",
            fontSize: 26,
            fontWeight: 600,
            color: JAGGERY,
            letterSpacing: 1,
          }}
        >
          {SITE.name}
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
