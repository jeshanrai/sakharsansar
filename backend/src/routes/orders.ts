import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import { requireAuth } from "../middleware/auth";

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

  const where = status ? { status: status as string } : {};

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: where as Parameters<typeof prisma.order.findMany>[0]["where"],
      orderBy: { createdAt: "desc" },
      skip,
      take: Number(limit),
    }),
    prisma.order.count({ where: where as Parameters<typeof prisma.order.count>[0]["where"] }),
  ]);

  res.json({ orders, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
});

// PATCH /api/orders/:id — protected (update status)
router.patch("/:id", requireAuth, async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;

  const order = await prisma.order.update({
    where: { id },
    data: { status },
  });

  res.json(order);
});

// DELETE /api/orders/:id — protected
router.delete("/:id", requireAuth, async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  await prisma.order.delete({ where: { id } });
  res.json({ success: true });
});

export default router;
