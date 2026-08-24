export {
  default,
  alt,
  size,
  contentType,
  generateStaticParams,
} from "./opengraph-image";

/**
 * Declared here rather than re-exported alongside the rest.
 *
 * Route segment config has to be a literal in the file that owns the route:
 * Next cannot follow it through a re-export, and says so at build time before
 * silently falling back to the default. Re-exporting it would leave this
 * route answering 200 for slugs the opengraph route 404s, which is the exact
 * hole this is here to close.
 */
export const dynamicParams = false;
