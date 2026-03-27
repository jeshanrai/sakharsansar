import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Refund & Returns Policy | SakharSansar",
  description: "Understand SakharSansar's refund and return policy for jaggery products.",
};

export default function RefundPolicyPage() {
  return (
    <>
      <header><Navbar /></header>
      <main className="pt-36 pb-24 px-6 bg-[#FBF4E8] min-h-screen">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-[#C17A2A] mb-4">Support</p>
          <h1 className="font-poppins text-4xl sm:text-5xl font-bold text-[#2C1500] mb-3">Refund &amp; Returns</h1>
          <p className="text-base text-[#2C1500]/50 mb-14">Last updated: March 27, 2026</p>

          <div className="space-y-10">
            <section className="bg-white rounded-2xl p-8 sm:p-10">
              <h2 className="font-poppins text-xl sm:text-2xl font-semibold text-[#2C1500] mb-4">Return Eligibility</h2>
              <p className="text-base sm:text-lg text-[#2C1500]/70 leading-[1.8]">Due to the perishable nature of our products, we accept returns only if the product is damaged during transit, the wrong item was delivered, or the product is defective. Return requests must be made within <strong className="text-[#2C1500]">48 hours</strong> of delivery.</p>
            </section>

            <section className="bg-white rounded-2xl p-8 sm:p-10">
              <h2 className="font-poppins text-xl sm:text-2xl font-semibold text-[#2C1500] mb-4">How to Request a Return</h2>
              <p className="text-base sm:text-lg text-[#2C1500]/70 leading-[1.8]">Contact us at <a href="mailto:hello@sakharsansar.com" className="text-[#C17A2A] font-medium underline underline-offset-4">hello@sakharsansar.com</a> with your order number and photos of the damaged or incorrect product. Our team will review and respond within 24 hours.</p>
            </section>

            <section className="bg-white rounded-2xl p-8 sm:p-10">
              <h2 className="font-poppins text-xl sm:text-2xl font-semibold text-[#2C1500] mb-4">Refund Process</h2>
              <p className="text-base sm:text-lg text-[#2C1500]/70 leading-[1.8]">Once your return is approved, we will issue a full refund to your original payment method within <strong className="text-[#2C1500]">5–7 business days</strong>. You will receive a confirmation email once the refund has been processed.</p>
            </section>

            <section className="bg-white rounded-2xl p-8 sm:p-10">
              <h2 className="font-poppins text-xl sm:text-2xl font-semibold text-[#2C1500] mb-4">Exchanges</h2>
              <p className="text-base sm:text-lg text-[#2C1500]/70 leading-[1.8]">If you received a damaged or wrong item, we will ship a replacement at no additional cost. Exchanges are subject to product availability.</p>
            </section>

            <section className="bg-white rounded-2xl p-8 sm:p-10">
              <h2 className="font-poppins text-xl sm:text-2xl font-semibold text-[#2C1500] mb-4">Non-Returnable Items</h2>
              <p className="text-base sm:text-lg text-[#2C1500]/70 leading-[1.8]">Products that have been opened, partially consumed, or returned after 48 hours of delivery are not eligible for refund or exchange.</p>
            </section>

            <section className="bg-white rounded-2xl p-8 sm:p-10">
              <h2 className="font-poppins text-xl sm:text-2xl font-semibold text-[#2C1500] mb-4">Contact</h2>
              <p className="text-base sm:text-lg text-[#2C1500]/70 leading-[1.8]">For any refund or return inquiries, email us at <a href="mailto:hello@sakharsansar.com" className="text-[#C17A2A] font-medium underline underline-offset-4">hello@sakharsansar.com</a> or call +977-0000000000.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
