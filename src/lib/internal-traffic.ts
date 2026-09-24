/**
 * Keeps the owner out of the customer analytics.
 *
 * GA was counting every dashboard session as a site visit, and every time the
 * owner checked a product page it counted that too, so the numbers the shop is
 * judged by included the one person who is never going to buy. A browser that
 * has signed in to the admin is marked here, and the GA bootstrap in
 * `components/seo/Analytics.tsx` reads the same key and switches GA off.
 *
 * Set only after a successful /auth/me, never on merely visiting /portfolio:
 * a customer who lands on the login page is still a customer.
 *
 * To be counted again on a device, clear this site's data in the browser.
 */
export const INTERNAL_TRAFFIC_KEY = "ss_internal";

export function markInternalTraffic() {
  try {
    localStorage.setItem(INTERNAL_TRAFFIC_KEY, "1");
  } catch {
    // Private mode or blocked storage: /portfolio is still excluded by path.
  }
}
