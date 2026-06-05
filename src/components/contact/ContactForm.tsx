"use client";

import React, { useState } from "react";
import { Send, Check } from "lucide-react";

const PHONE = "9779860149199";
const EMAIL = "hello@sakharsansar.com";

const INQUIRY_TYPES = [
  "Home order (B2C)",
  "Wholesale / Bulk (B2B)",
  "Gifting & hampers",
  "Partnership / Reseller",
  "Something else",
] as const;

function compose(fields: { name: string; contact: string; type: string; message: string }) {
  return (
    `Namaste SakharSansar 🙏\n\n` +
    `Name: ${fields.name}\n` +
    `Contact: ${fields.contact}\n` +
    `Enquiry: ${fields.type}\n\n` +
    `${fields.message}`
  );
}

/**
 * Contact enquiry form. No backend dependency — it composes the enquiry and
 * hands off to WhatsApp (the channel used across the site) with an email
 * fallback, so a message always reaches a real person.
 */
export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    contact: "",
    type: INQUIRY_TYPES[0] as string,
    message: "",
  });
  const [sent, setSent] = useState(false);

  const update = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = compose(form);
    const waHref = `https://wa.me/${PHONE}?text=${encodeURIComponent(body)}`;
    window.open(waHref, "_blank", "noopener,noreferrer");
    setSent(true);
  };

  const mailtoHref =
    `mailto:${EMAIL}` +
    `?subject=${encodeURIComponent(`Enquiry · ${form.type}`)}` +
    `&body=${encodeURIComponent(compose(form))}`;

  if (sent) {
    return (
      <div className="rounded-[1.75rem] bg-ivory text-jaggery px-7 sm:px-10 py-12 shadow-2xl shadow-grove-deep/30 text-center">
        <div className="w-16 h-16 rounded-full bg-grove/10 text-grove flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8" strokeWidth={2} />
        </div>
        <h3 className="font-marker uppercase text-jaggery leading-[0.95] text-[clamp(1.5rem,3vw,2rem)]">
          Almost there!
        </h3>
        <p className="text-jaggery/75 text-body mt-4 max-w-md mx-auto">
          We&rsquo;ve opened WhatsApp with your enquiry ready to send — just hit send and
          we&rsquo;ll reply soon. WhatsApp didn&rsquo;t open?{" "}
          <a href={mailtoHref} className="text-grove font-medium underline underline-offset-2">
            Email us instead
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-8 inline-flex items-center justify-center px-6 py-3 rounded-full border border-jaggery/20 text-jaggery label-caps hover:border-grove hover:text-grove transition-colors"
        >
          Edit enquiry
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[1.75rem] bg-ivory text-jaggery px-7 sm:px-10 py-9 sm:py-11 shadow-2xl shadow-grove-deep/30 flex flex-col gap-6"
    >
      <Field label="Your name">
        <input
          type="text"
          required
          value={form.name}
          onChange={update("name")}
          placeholder="e.g. Anjali Shrestha"
          className="w-full bg-white border border-jaggery/15 rounded-xl px-4 py-3 text-[15px] text-jaggery placeholder:text-jaggery/40 focus:outline-none focus:border-grove transition-colors"
        />
      </Field>

      <Field label="Email or phone">
        <input
          type="text"
          required
          value={form.contact}
          onChange={update("contact")}
          placeholder="So we can reply"
          className="w-full bg-white border border-jaggery/15 rounded-xl px-4 py-3 text-[15px] text-jaggery placeholder:text-jaggery/40 focus:outline-none focus:border-grove transition-colors"
        />
      </Field>

      <Field label="What's it about?">
        <select value={form.type} onChange={update("type")} className="w-full bg-white border border-jaggery/15 rounded-xl px-4 py-3 text-[15px] text-jaggery focus:outline-none focus:border-grove transition-colors appearance-none cursor-pointer">
          {INQUIRY_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Your message">
        <textarea
          required
          rows={4}
          value={form.message}
          onChange={update("message")}
          placeholder="Tell us what you need — quantities, timelines, anything."
          className="w-full bg-white border border-jaggery/15 rounded-xl px-4 py-3 text-[15px] text-jaggery placeholder:text-jaggery/40 focus:outline-none focus:border-grove transition-colors resize-none"
        />
      </Field>

      <button
        type="submit"
        className="group mt-1 inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-jaggery text-cream label-caps hover:bg-jaggery-soft transition-colors"
      >
        Send enquiry
        <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={1.75} />
      </button>

      <p className="text-center text-[13px] text-jaggery/50">
        Prefer email?{" "}
        <a href={mailtoHref} className="text-grove font-medium underline underline-offset-2">
          {EMAIL}
        </a>
      </p>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="label-caps text-jaggery/55">{label}</span>
      {children}
    </label>
  );
}
