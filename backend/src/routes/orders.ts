import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { sendOrderNotification, sendCustomerUpdate, type CustomerUpdate } from "../lib/mailer";
import { seasonFromQuery, rangeOf } from "../lib/seasons";
import { closedYearRefusal } from "../lib/owner";

import { OrderStatus, PaymentMethod, type Order } from "@prisma/client";

const router = Router();

const PRODUCT_IMAGE = /^\/products\/[\w.-]+\.(jpe?g|png|webp)$/i;
// A payment screenshot, compressed in the browser. ~1.4 MB of base64 ≈ 1 MB image.
const PROOF_IMAGE = /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/;
const MAX_PROOF_CHARS = 1_400_000;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Fire-and-forget email to the customer. Never throws, never blocks the response. */
function notifyCustomer(kind: CustomerUpdate, order: Order) {
  void sendCustomerUpdate(kind, {
    id: order.id,
    createdAt: order.createdAt,
    customer: order.customer,
    email: order.email,
    phone: order.phone,
    address: order.address,
    product: order.product,
    quantity: order.quantity,
    amount: order.amount,
    paymentMethod: order.paymentMethod,
    paymentRef: order.paymentRef,
  });
}

// POST /api/orders — public (from frontend order form)
router.post("/", async (req: Request, res: Response): Promise<void> => {
  const {
    customer, phone, address, product, quantity, amount,
    subtotal, discountCode, discount, freeDelivery, unitPrice, weight, image,
    email, paymentMethod, paymentRef, paymentProof,
  } = req.body ?? {};

  if (!customer || !phone || !address || !product || !quantity) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  // Public endpoint: clamp what the storefront sends, as /enquiries does. The
  // drawer caps quantity at 99; anything outside 1–99 did not come from it.
  const qty = Math.trunc(Number(quantity));
  if (!Number.isFinite(qty) || qty < 1 || qty > 99) {
    res.status(400).json({ error: "Invalid quantity" });
    return;
  }
  const money = (v: unknown) => Math.max(0, Math.round(Number(v) || 0));

  const method = paymentMethod === "FONEPAY" ? "FONEPAY" : "COD";
  const cleanEmail = typeof email === "string" && EMAIL.test(email.trim()) ? email.trim().slice(0, 200) : null;
  const ref = typeof paymentRef === "string" ? paymentRef.trim().slice(0, 100) : "";
  const proof =
    typeof paymentProof === "string" && paymentProof.length <= MAX_PROOF_CHARS && PROOF_IMAGE.test(paymentProof)
      ? paymentProof
      : null;
  if (typeof paymentProof === "string" && paymentProof && !proof) {
    res.status(400).json({ error: "Payment screenshot is too large or not an image" });
    return;
  }
  if (method === "FONEPAY") {
    // We need something to match against the statement, and somewhere to say
    // it was verified.
    if (!ref && !proof) {
      res.status(400).json({ error: "Enter the transaction ID or attach the payment screenshot" });
      return;
    }
    if (!cleanEmail) {
      res.status(400).json({ error: "An email is needed for online payments" });
      return;
    }
    if (money(amount) <= 0) {
      res.status(400).json({ error: "Custom orders are priced on the call: choose cash on delivery" });
      return;
    }
  }

  const order = await prisma.order.create({
    data: {
      customer: String(customer).slice(0, 200),
      phone: String(phone).slice(0, 40),
      address: String(address).slice(0, 1000),
      product: String(product).slice(0, 200),
      quantity: qty,
      amount: money(amount),
      email: cleanEmail,
      paymentMethod: method,
      paymentStatus: method === "FONEPAY" ? "PENDING" : "NOT_REQUIRED",
      paymentRef: ref || null,
      paymentProof: proof,
    },
  });

  // Notify the shop inbox. Fire-and-forget: the mailer never throws, so a mail
  // hiccup can't fail the order the customer just placed. The discount and
  // delivery terms are not stored on the order (no column for them yet), so the
  // email is where the shop sees what the customer was quoted.
  void sendOrderNotification({
    id: order.id,
    createdAt: order.createdAt,
    customer: order.customer,
    phone: order.phone,
    address: order.address,
    product: order.product,
    quantity: order.quantity,
    amount: order.amount,
    subtotal: money(subtotal),
    discountCode: discountCode ? String(discountCode).slice(0, 40) : null,
    discount: money(discount),
    freeDelivery: freeDelivery === true,
    unitPrice: money(unitPrice),
    weight: weight ? String(weight).slice(0, 20) : null,
    // Only our own product photos: this lands in an <img> in the shop's inbox.
    image: typeof image === "string" && PRODUCT_IMAGE.test(image) ? image : null,
    email: order.email,
    paymentMethod: order.paymentMethod,
    paymentRef: order.paymentRef,
    paymentProof: order.paymentProof,
  });
  notifyCustomer("placed", order);

  // Don't echo the screenshot back to the browser that just sent it.
  const { paymentProof: _proof, ...publicOrder } = order;
  res.status(201).json(publicOrder);
});

// GET /api/orders — protected (dashboard)
router.get("/", requireAuth, async (req: Request, res: Response): Promise<void> => {
  const { status, season: seasonParam, page = "1", limit = "20" } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const { season, error } = await seasonFromQuery(seasonParam);
  if (error) {
    res.status(400).json({ error });
    return;
  }

  const where: Record<string, unknown> = { deletedAt: null };
  if (season) where.createdAt = rangeOf(season);
  if (status) {
    where.status = status as OrderStatus;
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: Number(limit),
      // Screenshots are large; the list only says whether one exists, and the
      // dashboard fetches it from /:id/proof when someone opens it.
      omit: { paymentProof: true },
    }),
    prisma.order.count({ where }),
  ]);

  const withProof = new Set(
    (await prisma.order.findMany({
      where: { id: { in: orders.map((o) => o.id) }, paymentProof: { not: null } },
      select: { id: true },
    })).map((o) => o.id),
  );

  res.json({ orders: orders.map((o) => ({ ...o, hasProof: withProof.has(o.id) })), total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
});

// PATCH /api/orders/:id — protected (update status). Open to every admin in
// every year: an order placed just before a year closed still has to be
// confirmed and delivered.
router.patch("/:id", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const id = req.params.id as string;
  const { status } = req.body ?? {};

  if (!Object.values(OrderStatus).includes(status)) {
    res.status(400).json({ error: "Invalid status" });
    return;
  }
  const before = await prisma.order.findFirst({ where: { id, deletedAt: null }, select: { status: true } });
  if (!before) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  const order = await prisma.order.update({
    where: { id },
    data: { status, updatedBy: req.adminId },
    omit: { paymentProof: true },
  });

  // Tell the customer when the order moves forward. CONFIRMED only for cash
  // orders: a Fonepay order is confirmed by the "payment verified" email.
  if (before.status !== order.status) {
    if (order.status === "SHIPPED") notifyCustomer("shipped", order as Order);
    else if (order.status === "DELIVERED") notifyCustomer("delivered", order as Order);
    else if (order.status === "CONFIRMED" && order.paymentMethod === "COD") notifyCustomer("confirmed", order as Order);
  }

  res.json(order);
});

// GET /api/orders/:id/proof — protected. The payment screenshot, as a data URL.
router.get("/:id/proof", requireAuth, async (req: Request, res: Response): Promise<void> => {
  const order = await prisma.order.findFirst({
    where: { id: req.params.id as string, deletedAt: null },
    select: { paymentProof: true },
  });
  if (!order?.paymentProof) {
    res.status(404).json({ error: "No screenshot on this order" });
    return;
  }
  res.json({ proof: order.paymentProof });
});

// PATCH /api/orders/:id/payment — protected. An admin checked the Fonepay
// statement: { action: "verify" | "reject" }. Verifying also confirms a pending
// order. Either way the customer is emailed.
router.patch("/:id/payment", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const id = req.params.id as string;
  const { action } = req.body ?? {};
  if (action !== "verify" && action !== "reject") {
    res.status(400).json({ error: "action must be verify or reject" });
    return;
  }

  const existing = await prisma.order.findFirst({ where: { id, deletedAt: null }, omit: { paymentProof: true } });
  if (!existing) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  if (existing.paymentMethod !== "FONEPAY") {
    res.status(400).json({ error: "This is a cash-on-delivery order" });
    return;
  }

  const verify = action === "verify";
  const order = await prisma.order.update({
    where: { id },
    data: verify
      ? {
          paymentStatus: "VERIFIED",
          paymentVerifiedAt: new Date(),
          paymentVerifiedBy: req.adminId,
          status: existing.status === "PENDING" ? "CONFIRMED" : existing.status,
          updatedBy: req.adminId,
        }
      : { paymentStatus: "REJECTED", paymentVerifiedAt: null, paymentVerifiedBy: null, updatedBy: req.adminId },
    omit: { paymentProof: true },
  });

  if (existing.paymentStatus !== order.paymentStatus) {
    notifyCustomer(verify ? "payment_verified" : "payment_rejected", order as Order);
  }
  res.json(order);
});

// POST /api/orders/:id/sale — protected. Records the order in the sales book
// (dated today) and links the two so the same order can't be counted twice.
router.post("/:id/sale", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const id = req.params.id as string;
  const { paymentMethod } = req.body ?? {};

  if (!Object.values(PaymentMethod).includes(paymentMethod)) {
    res.status(400).json({ error: "Choose a payment method" });
    return;
  }

  const order = await prisma.order.findFirst({ where: { id, deletedAt: null } });
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  if (order.saleId) {
    res.status(409).json({ error: "This order is already in sales" });
    return;
  }
  if (order.status === "CANCELLED") {
    res.status(400).json({ error: "A cancelled order can't be moved to sales" });
    return;
  }
  if (order.paymentMethod === "FONEPAY" && order.paymentStatus !== "VERIFIED") {
    res.status(400).json({ error: "Verify the Fonepay payment before recording the sale" });
    return;
  }

  const date = new Date();
  const refusal = await closedYearRefusal(req.adminId, [date]);
  if (refusal) {
    res.status(403).json({ error: refusal });
    return;
  }

  try {
    const sale = await prisma.$transaction(async (tx) => {
      const created = await tx.sale.create({
        data: {
          customer: order.customer,
          phone: order.phone || null,
          product: order.product,
          quantity: order.quantity,
          amount: order.amount,
          paymentMethod: paymentMethod as PaymentMethod,
          description: `From order #${order.id.slice(-6).toUpperCase()} · ${order.address}`.slice(0, 1000),
          date,
          createdBy: req.adminId,
        },
      });
      // Guarded on saleId: null so two clicks at once can't both link a sale.
      const linked = await tx.order.updateMany({
        where: { id, saleId: null },
        data: { saleId: created.id, updatedBy: req.adminId },
      });
      if (linked.count === 0) throw new Error("ALREADY_MOVED");
      return created;
    });
    res.status(201).json(sale);
  } catch (e) {
    if (e instanceof Error && e.message === "ALREADY_MOVED") {
      res.status(409).json({ error: "This order is already in sales" });
      return;
    }
    throw e;
  }
});

// DELETE /api/orders/:id — soft delete
router.delete("/:id", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const id = req.params.id as string;
  const existing = await prisma.order.findFirst({ where: { id, deletedAt: null }, select: { createdAt: true } });
  if (!existing) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  const refusal = await closedYearRefusal(req.adminId, [existing.createdAt]);
  if (refusal) {
    res.status(403).json({ error: refusal });
    return;
  }
  await prisma.order.update({
    where: { id },
    data: { deletedAt: new Date(), deletedBy: req.adminId },
  });
  res.json({ success: true });
});

export default router;
