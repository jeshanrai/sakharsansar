import type { Metadata } from "next";

// Admin portal — keep it out of search engines entirely.
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
