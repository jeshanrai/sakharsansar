import Link from "next/link";
import { ChevronRight } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbLd } from "@/lib/seo";

/**
 * The breadcrumb trail, rendered once and described once.
 *
 * The visible `<nav>` and the `BreadcrumbList` used to be written separately
 * on every page that had them — the same trail typed out twice, in two
 * languages, a hundred lines apart. They agreed, but only because somebody
 * kept them agreeing, and Google treats a trail in the markup that the page
 * does not actually show as a reason to distrust the markup.
 *
 * Here they are one argument. `trail` names the path below the home page, in
 * order; "Home" is prepended by the schema builder and by the markup below,
 * so no caller writes it.
 *
 * The last crumb is the page itself: no link, `aria-current="page"`, and it
 * truncates rather than wrapping, because a product name on a narrow phone is
 * the one that overflows.
 */
export interface Crumb {
  name: string;
  path: string;
}

export default function Breadcrumbs({
  trail,
  className = "mb-5",
}: {
  trail: Crumb[];
  /** Spacing is the page's business, not the component's. */
  className?: string;
}) {
  const links: Crumb[] = [{ name: "Home", path: "/" }, ...trail];
  const last = links.length - 1;

  return (
    <>
      <JsonLd data={breadcrumbLd(trail)} />
      <nav aria-label="Breadcrumb" className={className}>
        <ol className="flex items-center gap-2 label-caps text-jaggery/70 min-w-0">
          {links.map((crumb, i) => (
            <li key={crumb.path} className={i === last ? "text-grove truncate" : "shrink-0"}>
              {i === last ? (
                <span aria-current="page">{crumb.name}</span>
              ) : (
                <>
                  <Link href={crumb.path} className="hover:text-grove transition-colors">
                    {crumb.name}
                  </Link>
                  <ChevronRight
                    className="inline w-3 h-3 shrink-0 text-jaggery/30 ml-2 -mt-px"
                    strokeWidth={2.5}
                    aria-hidden
                  />
                </>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
