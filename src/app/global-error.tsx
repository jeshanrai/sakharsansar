"use client";

import { useEffect } from "react";

/**
 * Root error boundary — the last line of defence.
 *
 * `error.tsx` sits inside the root layout, so it cannot catch an error thrown
 * *by* that layout: fonts, providers, the nav. When that happens Next unmounts
 * everything and renders this file instead, which is why it has to supply its
 * own <html> and <body>.
 *
 * That also means none of the app's CSS is guaranteed to be present. The
 * styling here is inline on purpose: a global error page that depends on a
 * stylesheet is a global error page that renders as unstyled text on the one
 * occasion it is needed.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          background: "#F5EDE0",
          color: "#3D2817",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        <div style={{ maxWidth: "34rem", textAlign: "center" }}>
          <p
            style={{
              margin: 0,
              fontSize: "0.6875rem",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              opacity: 0.55,
            }}
          >
            Something went wrong
          </p>
          <h1
            style={{
              margin: "0.75rem 0 0",
              fontSize: "clamp(1.75rem, 5vw, 2.75rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            SakharSansar is having a moment
          </h1>
          <p
            style={{
              margin: "1.25rem 0 0",
              fontSize: "1.0625rem",
              lineHeight: 1.7,
              opacity: 0.7,
            }}
          >
            The site failed to load properly. This is on our side. Reloading
            usually fixes it.
          </p>

          {error.digest && (
            <p style={{ margin: "1rem 0 0", fontSize: "0.875rem", opacity: 0.45 }}>
              Reference: <code style={{ fontFamily: "ui-monospace, monospace" }}>{error.digest}</code>
            </p>
          )}

          <div
            style={{
              marginTop: "2rem",
              display: "flex",
              gap: "0.75rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={reset}
              style={{
                cursor: "pointer",
                border: "none",
                borderRadius: "9999px",
                padding: "0.9rem 1.75rem",
                background: "#3D2817",
                color: "#F5EDE0",
                fontSize: "0.6875rem",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              Try again
            </button>
            {/* Deliberately a plain <a>, not next/link. This boundary only
                renders when the root layout has already failed, so the client
                router is part of what may be broken. A hard navigation is the
                one thing guaranteed to work. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                borderRadius: "9999px",
                padding: "0.9rem 1.75rem",
                border: "1px solid rgba(61,40,23,0.25)",
                color: "#3D2817",
                textDecoration: "none",
                fontSize: "0.6875rem",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              Reload the site
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
