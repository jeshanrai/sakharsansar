/**
 * Renders a JSON-LD block into the server-rendered HTML.
 *
 * Deliberately a plain <script> and not next/script: the client strategies
 * inject the tag after hydration, which Googlebot tolerates but most AI and
 * answer-engine crawlers — the ones that never run JS — do not. Structured
 * data has to be in the first byte of HTML to be worth having.
 */
export default function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // Escaping "<" stops a stray "</script>" inside the data from closing
      // the tag early; JSON parsers read the < escape identically.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
