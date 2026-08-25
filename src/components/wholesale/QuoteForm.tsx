"use client";

import React, { useState } from "react";
import { Send, Check, Loader2, MessageCircle } from "lucide-react";
import { SITE } from "@/lib/site";

const PHONE = SITE.phoneDigits;
const EMAIL = SITE.email;
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/**
 * The wholesale quote request.
 *
 * /wholesale asks for six specific answers before it can quote — form,
 * quantity, date, destination, packing, documentation — and then offered only
 * a WhatsApp link with those six words pre-filled as placeholders. That put
 * the work of structuring the enquiry on the buyer, and it produced enquiries
 * that arrive missing the fields the page just finished explaining are needed.
 *
 * This asks for them as fields and posts to the same /enquiries endpoint the
 * contact form uses, typed B2B so it lands in the admin inbox alongside
 * everything else. The six answers are composed into `message` because the
 * backend Enquiry model has no per-field columns for them, and inventing a
 * schema migration for a form is a bigger change than this warrants.
 *
 * WhatsApp stays, for two reasons: it is how most B2B enquiries here actually
 * arrive, and if the API is unreachable a quote request must still reach a
 * person rather than vanishing into a failed fetch.
 */

const FORMS = [
  { value: "block", label: "Sakhar Block (1 kg discs)" },
  { value: "powder", label: "Sakhar Powder (250 g pouches)" },
  { value: "both", label: "Both" },
  { value: "unsure", label: "Not sure yet" },
] as const;

const PACKING = [
  { value: "retail", label: "Your retail packing" },
  { value: "bulk", label: "Plain bulk packing" },
  { value: "own-label", label: "Our own label" },
  { value: "unsure", label: "Want to discuss" },
] as const;

const BUYER_TYPES = [
  "Shop / kirana",
  "Cafe or tea house",
  "Sweet or mithai maker",
  "Chaku maker",
  "Bakery or restaurant",
  "Hotel",
  "Corporate gifting",
  "Reseller",
  "Other",
] as const;

type Quote = {
  name: string;
  business: string;
  buyerType: string;
  contact: string;
  form: string;
  quantity: string;
  neededBy: string;
  destination: string;
  packing: string;
  documentation: string;
  notes: string;
};

const EMPTY: Quote = {
  name: "",
  business: "",
  buyerType: BUYER_TYPES[0],
  contact: "",
  form: FORMS[0].value,
  quantity: "",
  neededBy: "",
  destination: "",
  packing: PACKING[0].value,
  documentation: "",
  notes: "",
};

const labelOf = <T extends { value: string; label: string }>(
  list: readonly T[],
  value: string,
) => list.find((x) => x.value === value)?.label ?? value;

/** The six answers, in the order the page asks for them. */
function compose(q: Quote): string {
  const lines = [
    `Wholesale quote request`,
    ``,
    `Business: ${q.business || "—"}${q.buyerType ? ` (${q.buyerType})` : ""}`,
    `Contact: ${q.name} · ${q.contact}`,
    ``,
    `1. Form: ${labelOf(FORMS, q.form)}`,
    `2. Quantity: ${q.quantity}`,
    `3. Needed by: ${q.neededBy || "not stated"}`,
    `4. Delivering to: ${q.destination}`,
    `5. Packing: ${labelOf(PACKING, q.packing)}`,
    `6. Documentation: ${q.documentation || "none stated"}`,
  ];
  if (q.notes.trim()) lines.push("", `Notes: ${q.notes.trim()}`);
  return lines.join("\n");
}

export default function QuoteForm() {
  const [q, setQ] = useState<Quote>(EMPTY);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [savedToInbox, setSavedToInbox] = useState(false);

  const update =
    (key: keyof Quote) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setQ((prev) => ({ ...prev, [key]: e.target.value }));

  const waHref = `https://wa.me/${PHONE}?text=${encodeURIComponent(compose(q))}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    let ok = false;
    try {
      const res = await fetch(`${API_BASE}/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: q.business ? `${q.name} (${q.business})` : q.name,
          contact: q.contact,
          type: "B2B",
          message: compose(q),
        }),
      });
      ok = res.ok;
    } catch {
      ok = false;
    }

    setSending(false);
    setSavedToInbox(ok);
    // A quote request must not vanish because a fetch failed.
    if (!ok) {
      window.open(waHref, "_blank", "noopener,noreferrer");
    }
    setSent(true);
  };

  if (sent) {
    return (
      <div className="rounded-2xl bg-ivory ring-1 ring-jaggery/8 px-6 sm:px-8 py-10 text-center">
        <div className="w-14 h-14 rounded-full bg-grove/10 text-grove flex items-center justify-center mx-auto mb-5">
          <Check className="w-7 h-7" strokeWidth={2} />
        </div>
        <h3 className="font-marker uppercase text-jaggery leading-[0.95] text-[clamp(1.4rem,3vw,2rem)]">
          Request received
        </h3>
        <p className="text-jaggery/75 text-body mt-4 max-w-md mx-auto">
          {savedToInbox
            ? "We have your six answers and will come back with a real figure and a real lead time, not a rate card."
            : "We have opened WhatsApp with your request ready to send — hit send and it reaches us."}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-full bg-jaggery text-cream label-caps px-6 py-3 hover:bg-grove transition-colors"
          >
            <MessageCircle className="w-4 h-4" strokeWidth={1.75} aria-hidden />
            Follow up on WhatsApp
          </a>
          <button
            type="button"
            onClick={() => {
              setSent(false);
              setQ(EMPTY);
            }}
            className="inline-flex items-center rounded-full border border-jaggery/20 text-jaggery label-caps px-6 py-3 hover:border-grove hover:text-grove transition-colors"
          >
            Send another
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-ivory ring-1 ring-jaggery/8 px-6 sm:px-8 py-8 sm:py-10"
    >
      <p className="font-marker uppercase text-jaggery text-[clamp(1.4rem,3vw,2rem)] leading-[1.05]">
        Request a quote
      </p>
      <p className="text-jaggery/75 text-body mt-3">
        Six answers and you will get a real number rather than a brochure.
        Everything here goes to the same inbox as our other enquiries.
      </p>

      <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Your name" htmlFor="q-name">
          <input
            id="q-name"
            type="text"
            required
            autoComplete="name"
            value={q.name}
            onChange={update("name")}
            className={INPUT}
          />
        </Field>

        <Field label="Business name" htmlFor="q-business" hint="Optional">
          <input
            id="q-business"
            type="text"
            autoComplete="organization"
            value={q.business}
            onChange={update("business")}
            className={INPUT}
          />
        </Field>

        <Field label="Email or phone" htmlFor="q-contact">
          <input
            id="q-contact"
            type="text"
            required
            value={q.contact}
            onChange={update("contact")}
            placeholder="So we can reply"
            className={INPUT}
          />
        </Field>

        <Field label="What kind of buyer are you?" htmlFor="q-buyer">
          <select
            id="q-buyer"
            value={q.buyerType}
            onChange={update("buyerType")}
            className={SELECT}
          >
            {BUYER_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>

        <Field label="1 · Which form?" htmlFor="q-form">
          <select id="q-form" value={q.form} onChange={update("form")} className={SELECT}>
            {FORMS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="2 · Quantity" htmlFor="q-quantity" hint="In kilos">
          <input
            id="q-quantity"
            type="text"
            required
            value={q.quantity}
            onChange={update("quantity")}
            placeholder="e.g. 50 kg, repeating monthly"
            className={INPUT}
          />
        </Field>

        <Field label="3 · Needed by" htmlFor="q-needed" hint="The date it must be in hand">
          <input
            id="q-needed"
            type="text"
            value={q.neededBy}
            onChange={update("neededBy")}
            placeholder="e.g. before Maghe Sankranti"
            className={INPUT}
          />
        </Field>

        <Field label="4 · Delivering to" htmlFor="q-destination">
          <input
            id="q-destination"
            type="text"
            required
            value={q.destination}
            onChange={update("destination")}
            placeholder="City or district"
            className={INPUT}
          />
        </Field>

        <Field label="5 · Packing" htmlFor="q-packing">
          <select id="q-packing" value={q.packing} onChange={update("packing")} className={SELECT}>
            {PACKING.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="6 · Documentation"
          htmlFor="q-docs"
          hint="Anything your business requires"
        >
          <input
            id="q-docs"
            type="text"
            value={q.documentation}
            onChange={update("documentation")}
            placeholder="e.g. VAT bill, lab report"
            className={INPUT}
          />
        </Field>
      </div>

      <div className="mt-5">
        <Field label="Anything else?" htmlFor="q-notes" hint="Optional">
          <textarea
            id="q-notes"
            rows={3}
            value={q.notes}
            onChange={update("notes")}
            className={`${INPUT} resize-none`}
          />
        </Field>
      </div>

      <div className="mt-7 flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          disabled={sending}
          className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-jaggery text-cream label-caps hover:bg-grove transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {sending ? (
            <>
              Sending…
              <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.75} aria-hidden />
            </>
          ) : (
            <>
              Send quote request
              <Send
                className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                strokeWidth={1.75}
                aria-hidden
              />
            </>
          )}
        </button>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full border border-jaggery/20 text-jaggery label-caps hover:bg-jaggery/[0.04] transition-colors"
        >
          <MessageCircle className="w-4 h-4" strokeWidth={1.75} aria-hidden />
          Send on WhatsApp instead
        </a>
      </div>

      <p className="mt-5 text-[13px] text-jaggery/70">
        Prefer email?{" "}
        <a
          href={`mailto:${EMAIL}?subject=${encodeURIComponent("Wholesale quote request")}`}
          className="text-grove font-medium underline underline-offset-2"
        >
          {EMAIL}
        </a>
      </p>
    </form>
  );
}

const INPUT =
  "w-full bg-white border border-jaggery/15 rounded-xl px-4 py-3 text-[15px] text-jaggery placeholder:text-jaggery/70 focus:outline-none focus:border-grove transition-colors";
const SELECT =
  "w-full bg-white border border-jaggery/15 rounded-xl px-4 py-3 text-[15px] text-jaggery focus:outline-none focus:border-grove transition-colors appearance-none cursor-pointer";

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="label-caps text-jaggery/70 block mb-2">
        {label}
        {hint && <span className="ml-2 normal-case tracking-normal text-jaggery/70">({hint})</span>}
      </label>
      {children}
    </div>
  );
}
