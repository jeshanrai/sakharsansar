/**
 * The identifier of the build that produced this HTML.
 *
 * Every page stamps it into <head>. Without it there is no way to tell from
 * outside whether a route is serving the current deploy or a cached copy of an
 * older one — which is exactly the question a stale-content report asks, and
 * exactly the question nobody could answer here. Two routes reporting two
 * different values is proof of a split; one value across every route is proof
 * there isn't one.
 *
 * Read on the server at prerender time, so it is baked into the static HTML
 * rather than looked up per request. `VERCEL_GIT_COMMIT_SHA` is a system
 * variable Vercel sets during every build with no dashboard configuration
 * needed; `GITHUB_SHA` covers a build run from Actions instead; `BUILD_ID` is
 * the manual override for anywhere else.
 *
 * Twelve characters is long enough to be unambiguous and short enough to read
 * in a diff of two page sources.
 */
export const BUILD_ID = (
  process.env.VERCEL_GIT_COMMIT_SHA ||
  process.env.GITHUB_SHA ||
  process.env.BUILD_ID ||
  "dev"
).slice(0, 12);
