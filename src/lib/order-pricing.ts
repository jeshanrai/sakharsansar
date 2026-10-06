import { COMMERCE } from "@/lib/site";

/**
 * What an order costs, worked out once.
 *
 * The promo bar promises a discount code "at checkout" and every product page
 * promises free delivery over the threshold, so the drawer has to honour both
 * with the same figures from COMMERCE that the promises were written from.
 *
 * Thresholds are inclusive: an order of exactly Rs. 1,500 qualifies. "Above
 * Rs. 1,500" read strictly would turn away the customer who did the sum to
 * land on it, and that is the argument at the door nobody wants to have.
 *
 * Delivery outside the threshold is not priced here: it depends on where the
 * parcel is going and is confirmed on the call, as the shipping policy says.
 */
export type OrderPricing = {
  subtotal: number;
  /** The code as applied, upper-cased, or null when none applies. */
  discountCode: string | null;
  discount: number;
  total: number;
  freeDelivery: boolean;
  /** How much more would unlock free delivery; 0 once it is free. */
  toFreeDelivery: number;
};

export type CodeStatus = "none" | "applied" | "invalid" | "below-minimum";

export function normaliseCode(code: string): string {
  return code.trim().toUpperCase();
}

export function codeStatus(code: string, subtotal: number): CodeStatus {
  const c = normaliseCode(code);
  if (!c) return "none";
  if (c !== COMMERCE.discountCode) return "invalid";
  if (subtotal < COMMERCE.discountMinimum) return "below-minimum";
  return "applied";
}

export function priceOrder(subtotal: number, code = ""): OrderPricing {
  const applied = codeStatus(code, subtotal) === "applied";
  const discount = applied ? Math.round((subtotal * COMMERCE.discountPercent) / 100) : 0;
  const total = subtotal - discount;
  // Free delivery is judged before the discount. Both thresholds sit at the
  // same figure, so judging it after would mean typing the code on a
  // Rs. 1,500 order costs the customer their free delivery.
  const freeDelivery = subtotal >= COMMERCE.freeShippingThreshold;
  return {
    subtotal,
    discountCode: applied ? COMMERCE.discountCode : null,
    discount,
    total,
    freeDelivery,
    toFreeDelivery: freeDelivery ? 0 : COMMERCE.freeShippingThreshold - subtotal,
  };
}

/** The short reference a customer can read out on the phone: the tail of the
 *  order's id. The dashboard shows the same one, so both ends can find it. */
export function orderRef(id: string): string {
  return id.slice(-6).toUpperCase();
}
