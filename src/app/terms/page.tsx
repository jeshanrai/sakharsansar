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
      <main className="pt-36 pb-24 px-6 bg-[#FBF4E8] min-h-screen">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-[#C17A2A] mb-4">Legal</p>
          <h1 className="font-poppins text-4xl sm:text-5xl font-bold text-[#2C1500] mb-3">Terms &amp; Conditions</h1>
          <p className="text-base text-[#2C1500]/50 mb-14">Last updated: March 27, 2026</p>

          <div className="space-y-10">
            <section className="bg-white rounded-2xl p-8 sm:p-10">
              <h2 className="font-poppins text-xl sm:text-2xl font-semibold text-[#2C1500] mb-4">Acceptance of Terms</h2>
              <p className="text-base sm:text-lg text-[#2C1500]/70 leading-[1.8]">By accessing and using sakharsansar.com, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our website or purchase our products.</p>
            </section>

            <section className="bg-white rounded-2xl p-8 sm:p-10">
              <h2 className="font-poppins text-xl sm:text-2xl font-semibold text-[#2C1500] mb-4">Products &amp; Pricing</h2>
              <p className="text-base sm:text-lg text-[#2C1500]/70 leading-[1.8]">All product descriptions and prices are listed in Nepali Rupees (NPR) and are subject to change without notice. We make every effort to display accurate product images and descriptions, but slight variations in color and appearance may occur due to the handcrafted nature of our jaggery.</p>
            </section>

            <section className="bg-white rounded-2xl p-8 sm:p-10">
              <h2 className="font-poppins text-xl sm:text-2xl font-semibold text-[#2C1500] mb-4">Orders &amp; Payment</h2>
              <p className="text-base sm:text-lg text-[#2C1500]/70 leading-[1.8]">By placing an order, you confirm that the information provided is accurate and that you are authorized to use the chosen payment method. We reserve the right to cancel orders due to pricing errors, stock unavailability, or suspected fraudulent activity.</p>
            </section>

            <section className="bg-white rounded-2xl p-8 sm:p-10">
              <h2 className="font-poppins text-xl sm:text-2xl font-semibold text-[#2C1500] mb-4">Intellectual Property</h2>
              <p className="text-base sm:text-lg text-[#2C1500]/70 leading-[1.8]">All content on this website — including text, images, logos, and design — is the property of SakharSansar and is protected by applicable intellectual property laws. Reproduction or distribution without written consent is prohibited.</p>
            </section>

            <section className="bg-white rounded-2xl p-8 sm:p-10">
              <h2 className="font-poppins text-xl sm:text-2xl font-semibold text-[#2C1500] mb-4">Limitation of Liability</h2>
              <p className="text-base sm:text-lg text-[#2C1500]/70 leading-[1.8]">SakharSansar shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website. Our total liability shall not exceed the amount paid for the specific product in question.</p>
            </section>

            <section className="bg-white rounded-2xl p-8 sm:p-10">
              <h2 className="font-poppins text-xl sm:text-2xl font-semibold text-[#2C1500] mb-4">Governing Law</h2>
              <p className="text-base sm:text-lg text-[#2C1500]/70 leading-[1.8]">These terms are governed by the laws of Nepal. Any disputes shall be subject to the exclusive jurisdiction of the courts in Koshi Province, Nepal.</p>
            </section>

            <section className="bg-white rounded-2xl p-8 sm:p-10">
              <h2 className="font-poppins text-xl sm:text-2xl font-semibold text-[#2C1500] mb-4">Contact</h2>
              <p className="text-base sm:text-lg text-[#2C1500]/70 leading-[1.8]">For questions regarding these terms, reach us at <a href="mailto:hello@sakharsansar.com" className="text-[#C17A2A] font-medium underline underline-offset-4">hello@sakharsansar.com</a>.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
