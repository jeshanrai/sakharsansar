"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export default function NewsletterForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <form
      className="flex flex-col gap-4 self-end w-full"
      onSubmit={handleSubmit}
    >
      <label htmlFor="footer-email" className="label-caps text-cream/50">
        Your email
      </label>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:items-stretch border-b border-cream/30 focus-within:border-cream transition-colors pb-3">
        <input
          id="footer-email"
          type="email"
          placeholder="hello@yourdomain.com"
          required
          disabled={submitted}
          className="flex-1 bg-transparent text-cream placeholder:text-cream/30 text-lg font-serif outline-none py-2 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={submitted}
          className="group inline-flex items-center justify-center gap-3 label-caps text-cream hover:text-honey transition-colors py-2 self-start sm:self-auto disabled:text-honey"
        >
          {submitted ? (
            <>
              Subscribed
              <Check className="w-4 h-4" strokeWidth={1.5} />
            </>
          ) : (
            <>
              Subscribe
              <ArrowRight
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                strokeWidth={1.5}
              />
            </>
          )}
        </button>
      </div>
      <p className="text-meta text-cream/45">
        {submitted
          ? "Thank you — your first letter from the Himalayas is on its way."
          : "No spam. Unsubscribe with a single click."}
      </p>
    </form>
  );
}
