import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

// All expense routes are protected
router.use(requireAuth);

// GET /api/expenses
router.get("/", async (req: AuthRequest, res: Response): Promise<void> => {
  const { category, page = "1", limit = "20" } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const where: Record<string, unknown> = { deletedAt: null };
  if (category && category !== "All") {
    where.category = category as string;
  }

  const [expenses, total] = await Promise.all([
    prisma.expense.findMany({
      where,
      orderBy: { date: "desc" },
      skip,
      take: Number(limit),
    }),
    prisma.expense.count({ where }),
  ]);

  res.json({ expenses, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
});

// POST /api/expenses
router.post("/", async (req: AuthRequest, res: Response): Promise<void> => {
  const { title, amount, category, description, date } = req.body;

  if (!title || amount === undefined || !category) {
    res.status(400).json({ error: "Title, amount, and category required" });
    return;
  }

  const expense = await prisma.expense.create({
    data: {
      title,
      amount: Number(amount),
      category,
      description: description || null,
      date: date ? new Date(date) : new Date(),
      createdBy: req.adminId,
    },
  });

  res.status(201).json(expense);
});

// DELETE /api/expenses/:id — soft delete
router.delete("/:id", async (req: AuthRequest, res: Response): Promise<void> => {
  const id = req.params.id as string;
  await prisma.expense.update({
    where: { id },
    data: { deletedAt: new Date(), deletedBy: req.adminId },
  });
  res.json({ success: true });
});

export default router;
