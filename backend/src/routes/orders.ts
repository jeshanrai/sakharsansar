import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import { requireAuth, AuthRequest } from "../middleware/auth";

import { OrderStatus } from "@prisma/client";

const router = Router();

// POST /api/orders — public (from frontend order form)
router.post("/", async (req: Request, res: Response): Promise<void> => {
  const { customer, phone, address, product, quantity, amount } = req.body;

  if (!customer || !phone || !address || !product || !quantity) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const order = await prisma.order.create({
    data: {
      customer,
      phone,
      address,
      product,
      quantity: Number(quantity),
      amount: Number(amount) || 0,
    },
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
