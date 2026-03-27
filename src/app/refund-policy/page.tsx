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
      <main className="pt-32 pb-20 px-6 bg-white min-h-screen">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-poppins text-3xl sm:text-4xl font-medium uppercase tracking-[0.1em] text-[#2C1500] mb-4">Refund &amp; Returns</h1>
          <p className="text-sm text-[#2C1500]/50 mb-12">Last updated: March 27, 2026</p>

          <div className="prose prose-sm max-w-none text-[#2C1500]/80 space-y-8 [&_h2]:font-poppins [&_h2]:text-lg [&_h2]:font-medium [&_h2]:uppercase [&_h2]:tracking-widest [&_h2]:text-[#2C1500] [&_h2]:mb-3 [&_p]:leading-relaxed [&_p]:tracking-wide">
            <section>
              <h2>Return Eligibility</h2>
              <p>Due to the perishable nature of our products, we accept returns only if the product is damaged during transit, the wrong item was delivered, or the product is defective. Return requests must be made within 48 hours of delivery.</p>
            </section>

            <section>
              <h2>How to Request a Return</h2>
              <p>Contact us at <a href="mailto:hello@sakharsansar.com" className="text-[#C17A2A] underline">hello@sakharsansar.com</a> with your order number and photos of the damaged or incorrect product. Our team will review and respond within 24 hours.</p>
            </section>

            <section>
              <h2>Refund Process</h2>
              <p>Once your return is approved, we will issue a full refund to your original payment method within 5–7 business days. You will receive a confirmation email once the refund has been processed.</p>
            </section>

            <section>
              <h2>Exchanges</h2>
              <p>If you received a damaged or wrong item, we will ship a replacement at no additional cost. Exchanges are subject to product availability.</p>
            </section>

            <section>
              <h2>Non-Returnable Items</h2>
              <p>Products that have been opened, partially consumed, or returned after 48 hours of delivery are not eligible for refund or exchange.</p>
            </section>

            <section>
              <h2>Contact</h2>
              <p>For any refund or return inquiries, email us at <a href="mailto:hello@sakharsansar.com" className="text-[#C17A2A] underline">hello@sakharsansar.com</a> or call +977-0000000000.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
