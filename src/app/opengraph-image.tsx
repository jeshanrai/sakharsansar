import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE } from "@/lib/site";

/**
 * Sitewide social card, generated at build time.
 *
 * Replaces the old `/hero.jpg` reference, which was a 640×640 square being
 * advertised to Facebook/X/WhatsApp as 1200×630 — every share was rendering
 * cropped or falling back to a small-format card. This is the real aspect
 * ratio, with the brand's own type and palette.
 */
export const alt =
  "SakharSansar: 100% organic, wood-fired Himalayan jaggery from Sankhuwasabha, Nepal";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const hero = await readFile(join(process.cwd(), "public/hero.jpg"));
  const heroSrc = `data:image/jpeg;base64,${hero.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#F5EDE0",
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
            background: "#FBEEDD",
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
              color: "#B8763E",
              fontWeight: 600,
              marginBottom: 28,
            }}
          >
            SANKHUWASABHA · NEPAL
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 78,
              lineHeight: 1.04,
              color: "#3D2817",
              fontWeight: 700,
              letterSpacing: -2,
              marginBottom: 26,
            }}
          >
            100% Organic Sakhar
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 30,
              lineHeight: 1.4,
              color: "#5A3B22",
              marginBottom: 40,
              maxWidth: 560,
            }}
          >
            Wood-fired Himalayan jaggery, chemical-free, direct from farmers.
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {["Chemical Free", "Wood-Fired", "Ships Pan-Nepal"].map((chip) => (
              <div
                key={chip}
                style={{
                  display: "flex",
                  fontSize: 19,
                  color: "#0F5A2C",
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
            src={heroSrc}
            alt=""
            width={400}
            height={400}
            style={{
              width: 400,
              height: 400,
              objectFit: "cover",
              borderRadius: 40,
            }}
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
            background: "#3D2817",
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
            color: "#3D2817",
            letterSpacing: 1,
          }}
        >
          {SITE.name}
        </div>
      </div>
    ),
    size,
  );
}
