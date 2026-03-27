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
      <main className="pt-32 pb-20 px-6 bg-white min-h-screen">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-poppins text-3xl sm:text-4xl font-medium uppercase tracking-[0.1em] text-[#2C1500] mb-4">Privacy Policy</h1>
          <p className="text-sm text-[#2C1500]/50 mb-12">Last updated: March 27, 2026</p>

          <div className="prose prose-sm max-w-none text-[#2C1500]/80 space-y-8 [&_h2]:font-poppins [&_h2]:text-lg [&_h2]:font-medium [&_h2]:uppercase [&_h2]:tracking-widest [&_h2]:text-[#2C1500] [&_h2]:mb-3 [&_p]:leading-relaxed [&_p]:tracking-wide">
            <section>
              <h2>Information We Collect</h2>
              <p>When you place an order or interact with our website, we may collect your name, email address, phone number, shipping address, and payment information. We also collect browsing data such as IP address, browser type, and pages visited through cookies and similar technologies.</p>
            </section>

            <section>
              <h2>How We Use Your Information</h2>
              <p>We use your information to process and fulfill orders, communicate order updates, improve our website experience, send promotional offers (only with your consent), and comply with legal obligations.</p>
            </section>

            <section>
              <h2>Information Sharing</h2>
              <p>We do not sell or rent your personal data. We may share information with trusted third-party service providers (payment processors, shipping partners) strictly to fulfill your orders. These providers are contractually bound to protect your data.</p>
            </section>

            <section>
              <h2>Cookies</h2>
              <p>Our website uses cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can manage cookie preferences through your browser settings.</p>
            </section>

            <section>
              <h2>Data Security</h2>
              <p>We implement industry-standard security measures to protect your personal information. However, no method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.</p>
            </section>

            <section>
              <h2>Your Rights</h2>
              <p>You have the right to access, correct, or delete your personal data. You may also opt out of marketing communications at any time by contacting us at hello@sakharsansar.com.</p>
            </section>

            <section>
              <h2>Contact Us</h2>
              <p>If you have questions about this Privacy Policy, please contact us at <a href="mailto:hello@sakharsansar.com" className="text-[#C17A2A] underline">hello@sakharsansar.com</a>.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
