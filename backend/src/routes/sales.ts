import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { PaymentMethod } from "@prisma/client";

const router = Router();

// All sales routes are protected
router.use(requireAuth);

// GET /api/sales
router.get("/", async (req: AuthRequest, res: Response): Promise<void> => {
  const { paymentMethod, page = "1", limit = "20" } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const where: Record<string, unknown> = { deletedAt: null };
  if (paymentMethod && paymentMethod !== "All") {
    where.paymentMethod = paymentMethod as PaymentMethod;
  }

  const [sales, total] = await Promise.all([
    prisma.sale.findMany({
      where,
      orderBy: { date: "desc" },
      skip,
      take: Number(limit),
      include: {
        createdByAdmin: { select: { name: true } },
        updatedByAdmin: { select: { name: true } },
      },
    }),
    prisma.sale.count({ where }),
  ]);

  res.json({ sales, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
});

// POST /api/sales
router.post("/", async (req: AuthRequest, res: Response): Promise<void> => {
  const { customer, phone, product, quantity, amount, paymentMethod, description, date } = req.body;

  if (!customer || !product || !quantity || amount === undefined || !paymentMethod) {
    res.status(400).json({ error: "Customer, product, quantity, amount, and payment method are required" });
    return;
  }

  const sale = await prisma.sale.create({
    data: {
      customer,
      phone: phone || null,
      product,
      quantity: Number(quantity),
      amount: Number(amount),
      paymentMethod: paymentMethod as PaymentMethod,
      description: description || null,
      date: date ? new Date(date) : new Date(),
      createdBy: req.adminId,
    },
  });

  res.status(201).json(sale);
});

// PATCH /api/sales/:id
router.patch("/:id", async (req: AuthRequest, res: Response): Promise<void> => {
  const id = req.params.id as string;
  const { customer, phone, product, quantity, amount, paymentMethod, description, date } = req.body;

  const data: Record<string, unknown> = { updatedBy: req.adminId };
  if (customer !== undefined) data.customer = customer;
  if (phone !== undefined) data.phone = phone;
  if (product !== undefined) data.product = product;
  if (quantity !== undefined) data.quantity = Number(quantity);
  if (amount !== undefined) data.amount = Number(amount);
  if (paymentMethod !== undefined) data.paymentMethod = paymentMethod;
  if (description !== undefined) data.description = description;
  if (date !== undefined) data.date = new Date(date);

  const sale = await prisma.sale.update({
    where: { id },
    data,
  });

  res.json(sale);
});

// DELETE /api/sales/:id — soft delete
router.delete("/:id", async (req: AuthRequest, res: Response): Promise<void> => {
  const id = req.params.id as string;

  await prisma.sale.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      deletedBy: req.adminId,
    },
  });

  res.json({ success: true });
});

export default router;
