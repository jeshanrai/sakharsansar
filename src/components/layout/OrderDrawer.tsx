"use client";

import React, { useState, useEffect } from 'react';
import { X, CheckCircle } from 'lucide-react';
import data from "@/data/content.json";
import JaggeryLoader from "../ui/JaggeryLoader";

export const openOrderDrawer = (productName?: string) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open-order-drawer', { detail: { productName } }));
  }
};

export default function OrderDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    quantity: "1",
  });

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.productName) {
        setSelectedProduct(customEvent.detail.productName);
      }
      setIsOpen(true);
      setIsSubmitted(false);
      document.body.style.overflow = 'hidden';
    };

    window.addEventListener('open-order-drawer', handleOpen);
    return () => window.removeEventListener('open-order-drawer', handleOpen);
  }, []);

  const closeDrawer = () => {
    setIsOpen(false);
    document.body.style.overflow = 'auto';
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 z-[90] transition-opacity duration-300"
        onClick={closeDrawer}
      />
      
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isSubmitted ? "Order confirmed" : "Place your order"}
        className={`fixed right-0 top-0 h-full w-full sm:w-[500px] bg-[#F4F1ED] z-[100] transform transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col`}
      >
        <div className="flex justify-between items-center p-6 sm:p-10 border-b border-black/10 bg-white">
          <h2 className="font-poppins text-xl font-medium tracking-[0.1em] uppercase text-black">
            {isSubmitted ? "Order Confirmed" : "Place Order"}
          </h2>
          <button onClick={closeDrawer} className="text-black/50 hover:text-black transition-colors">
            <X className="w-6 h-6" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-10 flex flex-col">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <JaggeryLoader />
            </div>
          ) : isSubmitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in duration-500">
              <CheckCircle className="w-16 h-16 text-black" strokeWidth={1} />
              <h3 className="font-poppins text-2xl font-medium tracking-[0.1em] uppercase text-black">Thank You</h3>
              <p className="text-black/60 text-sm tracking-widest leading-loose">
                Your order for {formData.quantity}x {selectedProduct || "Jaggery"} has been received. <br/><br/>We will contact you at {formData.phone} shortly to arrange delivery.
              </p>
              <button 
                onClick={closeDrawer}
                className="mt-8 px-8 py-4 bg-black text-white text-[10px] font-semibold tracking-[0.2em] uppercase hover:bg-black/80 transition-colors"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-semibold tracking-[0.2em] text-black/50 uppercase">Select Product</label>
                <select 
                  className="w-full bg-white border border-black/10 px-4 py-3 text-sm focus:border-black outline-none font-poppins text-black transition-colors"
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  required
                >
                  <option value="" disabled>Choose a product</option>
                  {data.products.map((p: any) => (
                    <option key={p.name} value={p.name}>{p.name} - {p.price}</option>
                  ))}
                  <option value="Custom Order">Custom / Bulk Order</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-semibold tracking-[0.2em] text-black/50 uppercase">Quantity</label>
                <div className="flex border border-black/10 bg-white">
                  {['1', '2', '3', '5', '10'].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setFormData({...formData, quantity: num})}
                      className={`flex-1 py-3 text-sm font-poppins transition-colors border-r last:border-r-0 border-black/10 ${formData.quantity === num ? 'bg-black text-white' : 'text-black hover:bg-black/5'}`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-semibold tracking-[0.2em] text-black/50 uppercase">Full Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-white border border-black/10 px-4 py-3 text-sm focus:border-black outline-none text-black transition-colors"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Your Name"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-semibold tracking-[0.2em] text-black/50 uppercase">Phone Number</label>
                <input 
                  type="tel" 
                  required
                  className="w-full bg-white border border-black/10 px-4 py-3 text-sm focus:border-black outline-none text-black transition-colors"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+977"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-semibold tracking-[0.2em] text-black/50 uppercase">Delivery Address</label>
                <textarea 
                  required
                  rows={3}
                  className="w-full bg-white border border-black/10 px-4 py-3 text-sm focus:border-black outline-none text-black transition-colors resize-none"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="City, Street, House No."
                />
              </div>

              <button 
                type="submit" 
                className="mt-4 w-full py-4 bg-black text-white text-[10px] font-semibold tracking-[0.2em] uppercase hover:bg-black/80 transition-colors"
              >
                Complete Order
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
