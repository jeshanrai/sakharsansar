import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import data from "@/data/content.json";
import { SITE } from "@/lib/site";

/**
 * Per-product social card. A shared brand image on a product link tells a
 * buyer nothing; this shows the actual jar, its name and its price, which is
 * what makes a shared link convert.
 */
export const alt = "SakharSansar product: pure Himalayan jaggery";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return data.products.map((product) => ({ slug: product.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product =
    data.products.find((p) => p.slug === slug) ?? data.products[0];

  const file = await readFile(join(process.cwd(), "public", product.image));
  const src = `data:image/jpeg;base64,${file.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#FAF6EE",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 520,
            height: "100%",
          }}
        >
          <img
            src={src}
            alt=""
            width={520}
            height={630}
            style={{ width: 520, height: 630, objectFit: "cover" }}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            padding: "72px 64px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 20,
              letterSpacing: 4,
              color: "#B8763E",
              fontWeight: 600,
              marginBottom: 24,
            }}
          >
            {product.category.toUpperCase()}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 62,
              lineHeight: 1.06,
              color: "#3D2817",
              fontWeight: 700,
              letterSpacing: -1.5,
              marginBottom: 24,
            }}
          >
            {product.name}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 26,
              lineHeight: 1.45,
              color: "#5A3B22",
              marginBottom: 36,
            }}
          >
            {product.description}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                display: "flex",
                fontSize: 44,
                fontWeight: 700,
                color: "#3D2817",
              }}
            >
              {product.price}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 22,
                color: "#5A3B22",
                border: "1px solid rgba(61, 40, 23, 0.22)",
                borderRadius: 9999,
                padding: "8px 20px",
              }}
            >
              {product.weight}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 44,
              fontSize: 22,
              fontWeight: 600,
              color: "#0F5A2C",
              letterSpacing: 1,
            }}
          >
            {SITE.name} · 100% Organic · Sankhuwasabha
          </div>
        </div>
      </div>
    ),
    size,
  );
}
