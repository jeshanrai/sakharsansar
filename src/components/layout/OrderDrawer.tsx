"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, CheckCircle, Minus, Plus, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import Image from "next/image";
import data from "@/data/content.json";
import JaggeryLoader from "../ui/JaggeryLoader";

export const openOrderDrawer = (productName?: string) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open-order-drawer', { detail: { productName } }));
  }
};

type Product = { name: string; price: string; weight?: string; image?: string };
const PRODUCTS = data.products as Product[];
const CUSTOM = "Custom Order";

const parsePrice = (s?: string) => (s ? parseInt(s.replace(/[^0-9]/g, ""), 10) || 0 : 0);
const rs = (n: number) => `Rs. ${n.toLocaleString()}`;

type Step = "order" | "delivery";

export default function OrderDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [show, setShow] = useState(false); // drives the slide/fade transition
  const [step, setStep] = useState<Step>("order");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", address: "" });
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const product = PRODUCTS.find((p) => p.name === selectedProduct);
  const isCustom = selectedProduct === CUSTOM;
  const unitPrice = parsePrice(product?.price);
  const lineTotal = unitPrice * quantity;

  const phoneValid = /\d{7,}/.test(formData.phone.replace(/\D/g, ""));
  const detailsValid = formData.name.trim() !== "" && phoneValid && formData.address.trim() !== "";

  const resetState = useCallback(() => {
    setStep("order");
    setSelectedProduct("");
    setQuantity(1);
    setIsSubmitted(false);
    setIsLoading(false);
    setError(null);
    setTouched(false);
    setFormData({ name: "", phone: "", address: "" });
  }, []);

  const closeDrawer = useCallback(() => {
    setShow(false);
    document.body.style.overflow = 'auto';
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      setIsOpen(false);
      resetState();
    }, 450);
  }, [resetState]);

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (closeTimer.current) clearTimeout(closeTimer.current);
      resetState();
      if (customEvent.detail?.productName) {
        setSelectedProduct(customEvent.detail.productName);
      }
      setIsOpen(true);
      document.body.style.overflow = 'hidden';
      // Next frame: flip `show` so the panel slides in from off-screen.
      requestAnimationFrame(() => requestAnimationFrame(() => setShow(true)));
    };

    window.addEventListener('open-order-drawer', handleOpen);
    return () => window.removeEventListener('open-order-drawer', handleOpen);
  }, [resetState]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeDrawer]);

  if (!isOpen) return null;

  const goToDelivery = () => {
    if (!selectedProduct) return;
    setStep("delivery");
    setError(null);
  };

  const submitOrder = async () => {
    setTouched(true);
    if (!detailsValid) return;
    setIsLoading(true);
    setError(null);

    const amount = lineTotal;
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    let backendOk = false;
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: formData.name,
          phone: formData.phone,
          address: formData.address,
          product: selectedProduct || "Custom Order",
          quantity,
          amount,
        }),
      });
      backendOk = res.ok;
    } catch {
      backendOk = false;
    }

    // Google Form backup — fire-and-forget (no-cors gives no readable response).
    const googleFormUrl =
      "https://docs.google.com/forms/d/e/1FAIpQLSdR-DgALi4vB1TjYrcqS9f6RBx-DpSTnSk9BxJ6y4hpteOmqA/formResponse";
    const params = new URLSearchParams();
    params.append("entry.396614209", formData.name);
    params.append("entry.597621673", formData.phone);
    params.append("entry.1534389057", formData.address);
    params.append("entry.1575432690", String(quantity));
    params.append("entry.1497466413", selectedProduct || "");
    params.append("entry.1057130625", "");

    let backupOk = false;
    try {
      await fetch(googleFormUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });
      backupOk = true;
    } catch {
      backupOk = false;
    }

    setIsLoading(false);
    if (backendOk || backupOk) {
      setIsSubmitted(true);
    } else {
      setError("We couldn't place your order just now. Please check your connection and try again, or call us directly.");
    }
  };

  return (
    <>
      <div
        onClick={closeDrawer}
        className={`fixed inset-0 bg-black/40 z-[90] transition-opacity duration-500 ${show ? "opacity-100" : "opacity-0"}`}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={isSubmitted ? "Order confirmed" : "Place your order"}
        className={`fixed right-0 top-0 h-full w-full sm:w-[500px] bg-[#F4F1ED] z-[100] transform transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col ${
          show ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 sm:px-10 sm:py-7 border-b border-black/10 bg-white">
          <div>
            <h2 className="font-poppins text-xl font-medium tracking-[0.1em] uppercase text-black">
              {isSubmitted ? "Order Confirmed" : "Place Order"}
            </h2>
            {!isSubmitted && (
              <div className="mt-2 flex items-center gap-2">
                <StepDot active={step === "order"} done={step === "delivery"} label="Order" />
                <span className="w-6 h-px bg-black/15" />
                <StepDot active={step === "delivery"} done={false} label="Delivery" />
              </div>
            )}
          </div>
          <button onClick={closeDrawer} aria-label="Close" className="text-black/50 hover:text-black transition-colors">
            <X className="w-6 h-6" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <JaggeryLoader />
            </div>
          ) : isSubmitted ? (
            <SuccessView
              product={selectedProduct || "Jaggery"}
              quantity={quantity}
              total={isCustom ? null : lineTotal}
              name={formData.name}
              phone={formData.phone}
              address={formData.address}
              onClose={closeDrawer}
            />
          ) : step === "order" ? (
            /* ───── Step 1: Order ───── */
            <div className="p-6 sm:p-10 flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-semibold tracking-[0.2em] text-black/50 uppercase">Select Product</label>
                <select
                  className="w-full bg-white border border-black/10 px-4 py-3 text-sm focus:border-black outline-none font-poppins text-black transition-colors"
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  required
                >
                  <option value="" disabled>Choose a product</option>
                  {PRODUCTS.map((p) => (
                    <option key={p.name} value={p.name}>{p.name} — {p.price}</option>
                  ))}
                  <option value={CUSTOM}>Custom / Bulk Order</option>
                </select>
              </div>

              {/* Selected product card */}
              {selectedProduct && (
                <div className="bg-white border border-black/10 p-4 flex gap-4 items-center animate-in fade-in duration-300">
                  <div className="relative w-20 h-20 shrink-0 bg-[#F4F1ED] overflow-hidden">
                    {product?.image ? (
                      <Image src={product.image} alt={selectedProduct} fill className="object-cover" sizes="80px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-black/30 text-[10px] tracking-[0.15em] uppercase text-center px-2">
                        Custom Order
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-poppins text-sm font-medium text-black truncate">{selectedProduct}</p>
                    {isCustom ? (
                      <p className="text-xs text-black/50 mt-1">Pricing confirmed on call</p>
                    ) : (
                      <p className="text-xs text-black/50 mt-1">
                        {rs(unitPrice)} {product?.weight ? `· ${product.weight}` : ""} each
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Quantity stepper */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-semibold tracking-[0.2em] text-black/50 uppercase">Quantity</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-black/10 bg-white">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                      className="w-12 h-12 flex items-center justify-center text-black hover:bg-black/5 disabled:opacity-30 transition-colors"
                    >
                      <Minus className="w-4 h-4" strokeWidth={2} />
                    </button>
                    <span className="w-14 text-center font-poppins text-base font-medium text-black tabular-nums">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                      aria-label="Increase quantity"
                      className="w-12 h-12 flex items-center justify-center text-black hover:bg-black/5 transition-colors"
                    >
                      <Plus className="w-4 h-4" strokeWidth={2} />
                    </button>
                  </div>
                  <div className="flex gap-1.5">
                    {[1, 3, 5, 10].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setQuantity(n)}
                        className={`w-9 h-9 text-xs font-poppins transition-colors ${
                          quantity === n ? "bg-black text-white" : "bg-white border border-black/10 text-black hover:bg-black/5"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live total */}
              {selectedProduct && !isCustom && (
                <div className="flex items-center justify-between border-t border-black/10 pt-5">
                  <span className="text-[10px] font-semibold tracking-[0.2em] text-black/50 uppercase">Order Total</span>
                  <span className="font-poppins text-2xl font-medium text-[#C17A2A]">{rs(lineTotal)}</span>
                </div>
              )}

              <button
                type="button"
                onClick={goToDelivery}
                disabled={!selectedProduct}
                className="group w-full py-4 bg-black text-white text-[10px] font-semibold tracking-[0.2em] uppercase hover:bg-black/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Continue to Delivery
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
              </button>
            </div>
          ) : (
            /* ───── Step 2: Delivery ───── */
            <form
              onSubmit={(e) => { e.preventDefault(); submitOrder(); }}
              className="p-6 sm:p-10 flex flex-col gap-7"
            >
              {/* Compact order summary */}
              <div className="bg-white border border-black/10 px-4 py-3 flex items-center justify-between text-sm">
                <span className="text-black/60">
                  <span className="font-medium text-black">{quantity}×</span> {selectedProduct}
                </span>
                {!isCustom && <span className="font-medium text-[#C17A2A]">{rs(lineTotal)}</span>}
              </div>

              <Field label="Full Name">
                <input
                  type="text"
                  required
                  className="w-full bg-white border border-black/10 px-4 py-3 text-sm focus:border-black outline-none text-black transition-colors"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your Name"
                />
              </Field>

              <Field label="Phone Number" error={touched && !phoneValid ? "Enter a valid phone number" : undefined}>
                <input
                  type="tel"
                  required
                  className={`w-full bg-white border px-4 py-3 text-sm outline-none text-black transition-colors ${
                    touched && !phoneValid ? "border-red-400 focus:border-red-500" : "border-black/10 focus:border-black"
                  }`}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="98XXXXXXXX"
                />
              </Field>

              <Field label="Delivery Address">
                <textarea
                  required
                  rows={3}
                  className="w-full bg-white border border-black/10 px-4 py-3 text-sm focus:border-black outline-none text-black transition-colors resize-none"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="City, Street, House No."
                />
              </Field>

              <p className="text-xs text-black/45 leading-relaxed -mt-2">
                We&apos;ll call you to confirm your order and delivery details. {isCustom ? "Pricing for custom/bulk orders is confirmed on the call." : "Delivery charges (if any) are confirmed on the call."}
              </p>

              {error && (
                <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={2} />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => { setStep("order"); setError(null); }}
                  className="group inline-flex items-center justify-center gap-2 px-6 py-4 bg-white border border-black/15 text-black text-[10px] font-semibold tracking-[0.2em] uppercase hover:bg-black/5 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" strokeWidth={2} />
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 bg-black text-white text-[10px] font-semibold tracking-[0.2em] uppercase hover:bg-black/80 transition-colors"
                >
                  {isCustom ? "Request Order" : `Place Order · ${rs(lineTotal)}`}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

function StepDot({ active, done, label }: { active: boolean; done: boolean; label: string }) {
  return (
    <span
      className={`text-[10px] font-semibold tracking-[0.15em] uppercase transition-colors ${
        active ? "text-black" : done ? "text-[#C17A2A]" : "text-black/30"
      }`}
    >
      {label}
    </span>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-semibold tracking-[0.2em] text-black/50 uppercase">{label}</label>
      {children}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}

function SuccessView({
  product,
  quantity,
  total,
  name,
  phone,
  address,
  onClose,
}: {
  product: string;
  quantity: number;
  total: number | null;
  name: string;
  phone: string;
  address: string;
  onClose: () => void;
}) {
  return (
    <div className="p-6 sm:p-10 min-h-full flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in duration-500">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
        <CheckCircle className="w-12 h-12 text-green-600" strokeWidth={1.5} />
      </div>
      <h3 className="font-poppins text-2xl font-medium tracking-[0.1em] uppercase text-black">Order Confirmed!</h3>
      <div className="bg-white rounded-lg p-5 w-full text-left space-y-3 border border-black/10">
        <Row label="Product" value={product} />
        <Row label="Quantity" value={String(quantity)} />
        {total !== null && <Row label="Total" value={rs(total)} highlight />}
        <Row label="Name" value={name} />
        <Row label="Phone" value={phone} />
        <Row label="Address" value={address} wrap />
      </div>
      <p className="text-black/60 text-sm leading-relaxed">
        Thank you for your order, <span className="font-medium text-black">{name}</span>! We will contact you at{" "}
        <span className="font-medium text-black">{phone}</span> shortly to confirm delivery details.
      </p>
      <button
        onClick={onClose}
        className="mt-2 w-full py-4 bg-black text-white text-[10px] font-semibold tracking-[0.2em] uppercase hover:bg-black/80 transition-colors"
      >
        Continue Shopping
      </button>
    </div>
  );
}

function Row({ label, value, highlight, wrap }: { label: string; value: string; highlight?: boolean; wrap?: boolean }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-black/50">{label}</span>
      <span className={`font-medium ${highlight ? "text-[#C17A2A]" : "text-black"} ${wrap ? "text-right max-w-[60%]" : ""}`}>
        {value}
      </span>
    </div>
  );
}
