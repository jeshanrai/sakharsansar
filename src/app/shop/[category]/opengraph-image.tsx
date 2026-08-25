import { notFound } from "next/navigation";
import { CATEGORIES, findCategory, productsIn } from "@/lib/categories";
import { renderOgCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

/**
 * A card per shop category.
 *
 * These three routes previously advertised no `og:image` at all — not a
 * fallback, nothing — so /shop/blocks, /shop/powder and /shop/dry-fruits
 * shared as a bare text link everywhere they were posted. They are the pages
 * built to catch "jaggery powder Nepal" and the like, which makes them the
 * ones most likely to be shared into a Viber or WhatsApp group.
 *
 * `alt` here is the segment-wide fallback and describes no particular
 * category, which is why generateMetadata on the page names the card
 * explicitly with the category's own alt text instead. It is kept because Next
 * requires the export.
 */
export const alt = "SakharSansar: wood-fired sakhar from Sankhuwasabha";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Only the three real categories; anything else 404s before this runs, which
 *  is what page.tsx in this segment already does. */
export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = findCategory(category);
  if (!cat) notFound();

  // The first product in the category, so each card shows the thing it sells
  // rather than the same hero three times.
  const [product] = productsIn(cat.name);

  return renderOgCard({
    eyebrow: `SHOP · ${cat.name.toUpperCase()}`,
    title: cat.heading,
    subtitle: cat.description,
    chips: ["Chemical Free", "Wood-Fired", "Ships Pan-Nepal"],
    image: product?.image,
  });
}
