import { Metadata } from "next";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { formatPostDate } from "@/lib/blog";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { webPageLd } from "@/lib/seo";
import { alternates, openGraph, DEFAULT_OG_IMAGE } from "@/lib/metadata";
import { COMMERCE, DELIVERY, formatRs } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: "Learn about SakharSansar shipping methods, delivery times, and charges across Nepal.",
  alternates: alternates({ canonical: "/shipping-policy" }),
  openGraph: openGraph({
    title: "Shipping Policy | SakharSansar",
    description: "Learn about SakharSansar shipping methods, delivery times, and charges across Nepal.",
    url: "/shipping-policy",
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  }),
};

/**
 * The date these terms last changed.
 *
 * One constant, because the page printed "March 27, 2026" as prose while the
 * WebPage schema separately declared "2026-03-27" — the same fact written
 * twice, and only the second one is what Google reads. Editing the policy and
 * updating the visible line would have left the markup claiming the old date,
 * which is worse than no date at all.
 */
const LAST_UPDATED = "2026-03-27";

export default function ShippingPolicyPage() {
  const pageJsonLd = webPageLd({
    name: "Shipping Policy",
    path: "/shipping-policy",
    description:
      "Learn about SakharSansar shipping methods, delivery times, and charges across Nepal.",
    dateModified: LAST_UPDATED,
  });

  return (
    <>
      <JsonLd data={pageJsonLd} />

      <main className="pt-36 pb-24 px-6 bg-[#FBF4E8] min-h-screen">
        <div className="max-w-3xl mx-auto">
          <Breadcrumbs trail={[{ name: "Shipping Policy", path: "/shipping-policy" }]} className="mb-6" />
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-[#C17A2A] mb-4">Delivery</p>
          <h1 className="font-poppins text-4xl sm:text-5xl font-bold text-[#2C1500] mb-3">Shipping Policy</h1>
          <p className="text-base text-[#2C1500]/50 mb-14">
            Last updated:{" "}
            <time dateTime={LAST_UPDATED}>{formatPostDate(LAST_UPDATED)}</time>
          </p>

          <div className="space-y-10">
            <section className="bg-white rounded-2xl p-8 sm:p-10">
              <h2 className="font-poppins text-xl sm:text-2xl font-semibold text-[#2C1500] mb-4">Delivery Coverage</h2>
              <p className="text-base sm:text-lg text-[#2C1500]/70 leading-[1.8]">We deliver across Nepal. Inside the Kathmandu Valley we bring your order ourselves, from Kapan. Everywhere outside the Valley, orders travel with {DELIVERY.outsideValleyCarrier}, where we are a listed merchant, and you get their tracking.</p>
            </section>

            <section className="bg-white rounded-2xl p-8 sm:p-10">
              <h2 className="font-poppins text-xl sm:text-2xl font-semibold text-[#2C1500] mb-4">Processing Time</h2>
              <p className="text-base sm:text-lg text-[#2C1500]/70 leading-[1.8]">Orders are processed within 1–2 business days after confirmation. You will receive a notification once your order has been dispatched.</p>
            </section>

            <section className="bg-white rounded-2xl p-8 sm:p-10">
              <h2 className="font-poppins text-xl sm:text-2xl font-semibold text-[#2C1500] mb-4">Estimated Delivery Times</h2>
              <div className="space-y-3 text-base sm:text-lg text-[#2C1500]/70 leading-[1.8]">
                <div className="flex justify-between items-center py-3 border-b border-[#2C1500]/10">
                  <span>Kathmandu Valley</span>
                  <span className="font-medium text-[#2C1500]">3–5 business days</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-[#2C1500]/10">
                  <span>Major cities (Koshi Province)</span>
                  <span className="font-medium text-[#2C1500]">2–4 business days</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span>Other locations</span>
                  <span className="font-medium text-[#2C1500]">5–10 business days</span>
                </div>
              </div>
              <p className="text-sm text-[#2C1500]/50 mt-4">Delivery times may vary due to weather conditions or remote locations.</p>
            </section>

            <section className="bg-white rounded-2xl p-8 sm:p-10">
              <h2 className="font-poppins text-xl sm:text-2xl font-semibold text-[#2C1500] mb-4">Shipping Charges</h2>
              <p className="text-base sm:text-lg text-[#2C1500]/70 leading-[1.8]">Shipping charges are calculated at checkout based on your delivery location and order weight. <strong className="text-[#2C1500]">Orders above {formatRs(COMMERCE.freeShippingThreshold)} qualify for free shipping</strong> within Nepal.</p>
            </section>

            <section className="bg-white rounded-2xl p-8 sm:p-10">
              <h2 className="font-poppins text-xl sm:text-2xl font-semibold text-[#2C1500] mb-4">Order Tracking</h2>
              <p className="text-base sm:text-lg text-[#2C1500]/70 leading-[1.8]">Once your order is shipped, you will receive a tracking number via SMS or email. You can use this to track your delivery status.</p>
            </section>

            <section className="bg-white rounded-2xl p-8 sm:p-10">
              <h2 className="font-poppins text-xl sm:text-2xl font-semibold text-[#2C1500] mb-4">Damaged or Lost Shipments</h2>
              <p className="text-base sm:text-lg text-[#2C1500]/70 leading-[1.8]">If your order arrives damaged or is lost in transit, please contact us within 48 hours of the expected delivery date at <a href="mailto:sakharsansar@gmail.com" className="text-[#C17A2A] font-medium underline underline-offset-4">sakharsansar@gmail.com</a>. We will arrange a replacement or refund.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
