import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Shipping Policy | SakharSansar",
  description: "Learn about SakharSansar shipping methods, delivery times, and charges across Nepal.",
};

export default function ShippingPolicyPage() {
  return (
    <>
      <header><Navbar /></header>
      <main className="pt-32 pb-20 px-6 bg-white min-h-screen">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-poppins text-3xl sm:text-4xl font-medium uppercase tracking-[0.1em] text-[#2C1500] mb-4">Shipping Policy</h1>
          <p className="text-sm text-[#2C1500]/50 mb-12">Last updated: March 27, 2026</p>

          <div className="prose prose-sm max-w-none text-[#2C1500]/80 space-y-8 [&_h2]:font-poppins [&_h2]:text-lg [&_h2]:font-medium [&_h2]:uppercase [&_h2]:tracking-widest [&_h2]:text-[#2C1500] [&_h2]:mb-3 [&_p]:leading-relaxed [&_p]:tracking-wide">
            <section>
              <h2>Delivery Coverage</h2>
              <p>We currently ship across Nepal. Orders are dispatched directly from Sankhuwasabha to ensure maximum freshness. Major cities including Kathmandu, Biratnagar, Dharan, and Itahari typically receive faster delivery.</p>
            </section>

            <section>
              <h2>Processing Time</h2>
              <p>Orders are processed within 1–2 business days after confirmation. You will receive a notification once your order has been dispatched.</p>
            </section>

            <section>
              <h2>Estimated Delivery Times</h2>
              <p>Kathmandu Valley: 3–5 business days. Major cities (Koshi Province): 2–4 business days. Other locations: 5–10 business days. Delivery times may vary due to weather conditions or remote locations.</p>
            </section>

            <section>
              <h2>Shipping Charges</h2>
              <p>Shipping charges are calculated at checkout based on your delivery location and order weight. Orders above Rs. 1,500 qualify for free shipping within Nepal.</p>
            </section>

            <section>
              <h2>Order Tracking</h2>
              <p>Once your order is shipped, you will receive a tracking number via SMS or email. You can use this to track your delivery status.</p>
            </section>

            <section>
              <h2>Damaged or Lost Shipments</h2>
              <p>If your order arrives damaged or is lost in transit, please contact us within 48 hours of the expected delivery date at <a href="mailto:hello@sakharsansar.com" className="text-[#C17A2A] underline">hello@sakharsansar.com</a>. We will arrange a replacement or refund.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
