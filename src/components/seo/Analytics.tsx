import Script from "next/script";
import { GA_MEASUREMENT_ID } from "@/lib/site";

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
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script id="ga4-init">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
      </Script>
    </>
  );
}
