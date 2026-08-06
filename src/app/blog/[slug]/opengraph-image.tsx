import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { posts as blogData } from "@/lib/blog";
import { SITE } from "@/lib/site";

/** Per-post social card — the headline is the thing that earns the click. */
export const alt = "SakharSansar Journal: stories from Sankhuwasabha";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return blogData.map((post) => ({ slug: post.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogData.find((p) => p.slug === slug) ?? blogData[0];

  const file = await readFile(join(process.cwd(), "public", post.image));
  const src = `data:image/jpeg;base64,${file.toString("base64")}`;

  const published = new Date(post.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
        }}
      >
        <img
          src={src}
          alt=""
          width={1200}
          height={630}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            objectFit: "cover",
          }}
        />
        {/* Scrim — headline legibility over an arbitrary photo.
            Sized explicitly rather than with `inset: 0`, which Satori does not
            resolve into a width/height, leaving the overlay collapsed. */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            display: "flex",
            background:
              "linear-gradient(90deg, rgba(20,12,5,0.95) 0%, rgba(20,12,5,0.90) 50%, rgba(20,12,5,0.55) 100%)",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "72px",
            width: 860,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 20,
              letterSpacing: 4,
              color: "#E8A857",
              fontWeight: 600,
              marginBottom: 28,
            }}
          >
            {(post.tags[0] ?? "JOURNAL").toUpperCase()} · {published.toUpperCase()}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 64,
              lineHeight: 1.08,
              color: "#FAF6EE",
              fontWeight: 700,
              letterSpacing: -1.5,
              marginBottom: 28,
            }}
          >
            {post.title}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 26,
              lineHeight: 1.45,
              color: "rgba(250, 246, 238, 0.82)",
              maxWidth: 700,
            }}
          >
            {post.description.length > 140
              ? `${post.description.slice(0, 140).trimEnd()}…`
              : post.description}
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 44,
              fontSize: 22,
              fontWeight: 600,
              color: "#FAF6EE",
              letterSpacing: 1,
            }}
          >
            {SITE.name} Journal
          </div>
        </div>
      </div>
    ),
    size,
  );
}
