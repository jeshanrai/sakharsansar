import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | SakharSansar",
  description: "Learn how SakharSansar collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <header><Navbar /></header>
      <main className="pt-36 pb-24 px-6 bg-[#FBF4E8] min-h-screen">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-[#C17A2A] mb-4">Legal</p>
          <h1 className="font-poppins text-4xl sm:text-5xl font-bold text-[#2C1500] mb-3">Privacy Policy</h1>
          <p className="text-base text-[#2C1500]/50 mb-14">Last updated: March 27, 2026</p>

          <div className="space-y-10">
            <section className="bg-white rounded-2xl p-8 sm:p-10">
              <h2 className="font-poppins text-xl sm:text-2xl font-semibold text-[#2C1500] mb-4">Information We Collect</h2>
              <p className="text-base sm:text-lg text-[#2C1500]/70 leading-[1.8]">When you place an order or interact with our website, we may collect your name, email address, phone number, shipping address, and payment information. We also collect browsing data such as IP address, browser type, and pages visited through cookies and similar technologies.</p>
            </section>

            <section className="bg-white rounded-2xl p-8 sm:p-10">
              <h2 className="font-poppins text-xl sm:text-2xl font-semibold text-[#2C1500] mb-4">How We Use Your Information</h2>
              <p className="text-base sm:text-lg text-[#2C1500]/70 leading-[1.8]">We use your information to process and fulfill orders, communicate order updates, improve our website experience, send promotional offers (only with your consent), and comply with legal obligations.</p>
            </section>

            <section className="bg-white rounded-2xl p-8 sm:p-10">
              <h2 className="font-poppins text-xl sm:text-2xl font-semibold text-[#2C1500] mb-4">Information Sharing</h2>
              <p className="text-base sm:text-lg text-[#2C1500]/70 leading-[1.8]">We do not sell or rent your personal data. We may share information with trusted third-party service providers (payment processors, shipping partners) strictly to fulfill your orders. These providers are contractually bound to protect your data.</p>
            </section>

            <section className="bg-white rounded-2xl p-8 sm:p-10">
              <h2 className="font-poppins text-xl sm:text-2xl font-semibold text-[#2C1500] mb-4">Cookies</h2>
              <p className="text-base sm:text-lg text-[#2C1500]/70 leading-[1.8]">Our website uses cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can manage cookie preferences through your browser settings.</p>
            </section>

            <section className="bg-white rounded-2xl p-8 sm:p-10">
              <h2 className="font-poppins text-xl sm:text-2xl font-semibold text-[#2C1500] mb-4">Data Security</h2>
              <p className="text-base sm:text-lg text-[#2C1500]/70 leading-[1.8]">We implement industry-standard security measures to protect your personal information. However, no method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.</p>
            </section>

            <section className="bg-white rounded-2xl p-8 sm:p-10">
              <h2 className="font-poppins text-xl sm:text-2xl font-semibold text-[#2C1500] mb-4">Your Rights</h2>
              <p className="text-base sm:text-lg text-[#2C1500]/70 leading-[1.8]">You have the right to access, correct, or delete your personal data. You may also opt out of marketing communications at any time by contacting us at hello@sakharsansar.com.</p>
            </section>

            <section className="bg-white rounded-2xl p-8 sm:p-10">
              <h2 className="font-poppins text-xl sm:text-2xl font-semibold text-[#2C1500] mb-4">Contact Us</h2>
              <p className="text-base sm:text-lg text-[#2C1500]/70 leading-[1.8]">If you have questions about this Privacy Policy, please contact us at <a href="mailto:hello@sakharsansar.com" className="text-[#C17A2A] font-medium underline underline-offset-4">hello@sakharsansar.com</a>.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
