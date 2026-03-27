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
      <main className="pt-36 pb-24 px-6 bg-[#FBF4E8] min-h-screen">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-[#C17A2A] mb-4">Delivery</p>
          <h1 className="font-poppins text-4xl sm:text-5xl font-bold text-[#2C1500] mb-3">Shipping Policy</h1>
          <p className="text-base text-[#2C1500]/50 mb-14">Last updated: March 27, 2026</p>

          <div className="space-y-10">
            <section className="bg-white rounded-2xl p-8 sm:p-10">
              <h2 className="font-poppins text-xl sm:text-2xl font-semibold text-[#2C1500] mb-4">Delivery Coverage</h2>
              <p className="text-base sm:text-lg text-[#2C1500]/70 leading-[1.8]">We currently ship across Nepal. Orders are dispatched directly from Sankhuwasabha to ensure maximum freshness. Major cities including Kathmandu, Biratnagar, Dharan, and Itahari typically receive faster delivery.</p>
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
              <p className="text-base sm:text-lg text-[#2C1500]/70 leading-[1.8]">Shipping charges are calculated at checkout based on your delivery location and order weight. <strong className="text-[#2C1500]">Orders above Rs. 1,500 qualify for free shipping</strong> within Nepal.</p>
            </section>

            <section className="bg-white rounded-2xl p-8 sm:p-10">
              <h2 className="font-poppins text-xl sm:text-2xl font-semibold text-[#2C1500] mb-4">Order Tracking</h2>
              <p className="text-base sm:text-lg text-[#2C1500]/70 leading-[1.8]">Once your order is shipped, you will receive a tracking number via SMS or email. You can use this to track your delivery status.</p>
            </section>

            <section className="bg-white rounded-2xl p-8 sm:p-10">
              <h2 className="font-poppins text-xl sm:text-2xl font-semibold text-[#2C1500] mb-4">Damaged or Lost Shipments</h2>
              <p className="text-base sm:text-lg text-[#2C1500]/70 leading-[1.8]">If your order arrives damaged or is lost in transit, please contact us within 48 hours of the expected delivery date at <a href="mailto:hello@sakharsansar.com" className="text-[#C17A2A] font-medium underline underline-offset-4">hello@sakharsansar.com</a>. We will arrange a replacement or refund.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
