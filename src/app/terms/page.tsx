import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Terms & Conditions | SakharSansar",
  description: "Read the terms and conditions governing the use of SakharSansar products and services.",
};

export default function TermsPage() {
  return (
    <>
      <header><Navbar /></header>
      <main className="pt-32 pb-20 px-6 bg-white min-h-screen">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-poppins text-3xl sm:text-4xl font-medium uppercase tracking-[0.1em] text-[#2C1500] mb-4">Terms &amp; Conditions</h1>
          <p className="text-sm text-[#2C1500]/50 mb-12">Last updated: March 27, 2026</p>

          <div className="prose prose-sm max-w-none text-[#2C1500]/80 space-y-8 [&_h2]:font-poppins [&_h2]:text-lg [&_h2]:font-medium [&_h2]:uppercase [&_h2]:tracking-widest [&_h2]:text-[#2C1500] [&_h2]:mb-3 [&_p]:leading-relaxed [&_p]:tracking-wide">
            <section>
              <h2>Acceptance of Terms</h2>
              <p>By accessing and using sakharsansar.com, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our website or purchase our products.</p>
            </section>

            <section>
              <h2>Products &amp; Pricing</h2>
              <p>All product descriptions and prices are listed in Nepali Rupees (NPR) and are subject to change without notice. We make every effort to display accurate product images and descriptions, but slight variations in color and appearance may occur due to the handcrafted nature of our jaggery.</p>
            </section>

            <section>
              <h2>Orders &amp; Payment</h2>
              <p>By placing an order, you confirm that the information provided is accurate and that you are authorized to use the chosen payment method. We reserve the right to cancel orders due to pricing errors, stock unavailability, or suspected fraudulent activity.</p>
            </section>

            <section>
              <h2>Intellectual Property</h2>
              <p>All content on this website — including text, images, logos, and design — is the property of SakharSansar and is protected by applicable intellectual property laws. Reproduction or distribution without written consent is prohibited.</p>
            </section>

            <section>
              <h2>Limitation of Liability</h2>
              <p>SakharSansar shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website. Our total liability shall not exceed the amount paid for the specific product in question.</p>
            </section>

            <section>
              <h2>Governing Law</h2>
              <p>These terms are governed by the laws of Nepal. Any disputes shall be subject to the exclusive jurisdiction of the courts in Koshi Province, Nepal.</p>
            </section>

            <section>
              <h2>Contact</h2>
              <p>For questions regarding these terms, reach us at <a href="mailto:hello@sakharsansar.com" className="text-[#C17A2A] underline">hello@sakharsansar.com</a>.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
