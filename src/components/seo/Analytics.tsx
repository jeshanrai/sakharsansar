import Script from "next/script";
import { GA_MEASUREMENT_ID } from "@/lib/site";
import { INTERNAL_TRAFFIC_KEY } from "@/lib/internal-traffic";

/**
 * Google Analytics 4 (gtag.js) for the whole site.
 *
 * Two scripts, in the order Google requires: the loader, then the inline
 * bootstrap that defines `dataLayer`/`gtag` and configures the stream. Both
 * run with next/script's default `afterInteractive` strategy — analytics must
 * not sit in front of hydration, and a pageview a few hundred milliseconds
 * late is still the same pageview.
 *
 * Client-side route changes are not re-`config`-ed here on purpose. GA4's
 * enhanced measurement listens to History API changes and counts them as
 * pageviews; firing our own as well would double-count every navigation.
 * If enhanced measurement is ever turned off in the GA admin, this is the
 * place that has to grow a route listener.
 *
 * Renders nothing outside production builds so local `next dev` traffic never
 * lands in the property. `next build && next start` does report, which is how
 * to smoke-test the tag before deploying.
 */
export default function Analytics() {
  if (process.env.NODE_ENV !== "production") return null;

  return (
    <>
      {/*
        `lazyOnload`, not the default `afterInteractive`.

        gtag.js is 168 KB — the single largest download on any page here, larger
        than every font and every photograph — and on a throttled mobile
        connection it competes for bandwidth with the LCP image while it does.
        Deferring it to the browser's idle time takes it out of that contest
        entirely. The cost is that a visitor who leaves within the first second
        or two may not be counted; the benefit is that fewer of them leave.
      */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="lazyOnload"
      />
      {/*
        The owner is not a customer. `ga-disable-<id>` is GA's own opt-out and
        must be set before `config` runs, so it goes first in the bootstrap:
        off on the admin portal always, and off everywhere in a browser that
        has signed in to it (see lib/internal-traffic.ts for the key).
      */}
      <Script id="ga4-init" strategy="lazyOnload">
        {`try {
  if (location.pathname.indexOf('/portfolio') === 0 ||
      localStorage.getItem('${INTERNAL_TRAFFIC_KEY}') === '1') {
    window['ga-disable-${GA_MEASUREMENT_ID}'] = true;
  }
} catch (e) {}
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
      </Script>
    </>
  );
}
