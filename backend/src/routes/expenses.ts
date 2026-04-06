import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import { requireAuth } from "../middleware/auth";

const router = Router();

// All expense routes are protected
router.use(requireAuth);

// GET /api/expenses
router.get("/", async (req: Request, res: Response): Promise<void> => {
  const { category, page = "1", limit = "20" } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const where = category && category !== "All" ? { category: category as string } : undefined;

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
router.post("/", async (req: Request, res: Response): Promise<void> => {
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
    },
  });

  res.status(201).json(expense);
});

// DELETE /api/expenses/:id
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id as string;
  await prisma.expense.delete({ where: { id } });
  res.json({ success: true });
});

export default router;
