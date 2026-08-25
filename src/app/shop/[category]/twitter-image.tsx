export {
  default,
  alt,
  size,
  contentType,
  generateStaticParams,
} from "./opengraph-image";

/**
 * Declared here rather than re-exported alongside the rest — route segment
 * config has to be a literal in the file that owns the route, and Next cannot
 * follow it through a re-export. See blog/[slug]/twitter-image.tsx.
 */
export const dynamicParams = false;
