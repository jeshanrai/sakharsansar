/**
 * Cloudflare "Email Address Obfuscation" markers.
 *
 * With that Scrape Shield setting on, Cloudflare rewrites every email address
 * it finds in served HTML (the footer's mailto: on every page, the address in
 * the policy pages) into a link to /cdn-cgi/l/email-protection#…, plus a
 * script that decodes it in the browser. A crawler does not run the script, so
 * it follows that href and gets a 404. Semrush's 4 Nov 2026 audit counted it
 * as 71 broken internal links, one per page.
 *
 * Cloudflare skips anything between `<!--email_off-->` and `<!--/email_off-->`.
 * React cannot render a comment node, so each marker is emitted as the inner
 * HTML of an empty, hidden span. The root layout wraps the whole body in one
 * pair, so every email on every page, present or future, is covered.
 * `npm run check:links` fails the build on an email address outside the pair.
 */
export const EMAIL_OFF_OPEN = "<!--email_off-->";
export const EMAIL_OFF_CLOSE = "<!--/email_off-->";

export function EmailOffStart() {
  return <span hidden dangerouslySetInnerHTML={{ __html: EMAIL_OFF_OPEN }} />;
}

export function EmailOffEnd() {
  return <span hidden dangerouslySetInnerHTML={{ __html: EMAIL_OFF_CLOSE }} />;
}
