import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { sendOrderNotification } from "../lib/mailer";

import { OrderStatus } from "@prisma/client";

const router = Router();

const PRODUCT_IMAGE = /^\/products\/[\w.-]+\.(jpe?g|png|webp)$/i;

// POST /api/orders — public (from frontend order form)
router.post("/", async (req: Request, res: Response): Promise<void> => {
  const {
    customer, phone, address, product, quantity, amount,
    subtotal, discountCode, discount, freeDelivery, unitPrice, weight, image,
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

  const order = await prisma.order.create({
    data: {
      customer: String(customer).slice(0, 200),
      phone: String(phone).slice(0, 40),
      address: String(address).slice(0, 1000),
      product: String(product).slice(0, 200),
      quantity: qty,
      amount: money(amount),
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
  });

  res.status(201).json(order);
});

// GET /api/orders — protected (dashboard)
router.get("/", requireAuth, async (req: Request, res: Response): Promise<void> => {
  const { status, page = "1", limit = "20" } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const where: Record<string, unknown> = { deletedAt: null };
  if (status) {
    where.status = status as OrderStatus;
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: Number(limit),
    }),
    prisma.order.count({ where }),
  ]);

  res.json({ orders, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
});

// PATCH /api/orders/:id — protected (update status)
router.patch("/:id", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const id = req.params.id as string;
  const { status } = req.body;

  const order = await prisma.order.update({
    where: { id },
    data: { status, updatedBy: req.adminId },
  });

  res.json(order);
});

// DELETE /api/orders/:id — soft delete
router.delete("/:id", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const id = req.params.id as string;
  await prisma.order.update({
    where: { id },
    data: { deletedAt: new Date(), deletedBy: req.adminId },
  });
  res.json({ success: true });
});

export default router;
