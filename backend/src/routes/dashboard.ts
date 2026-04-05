import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

// GET /api/dashboard/stats
router.get("/stats", async (_req: Request, res: Response): Promise<void> => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalOrders,
    monthlyOrders,
    allOrders,
    monthlyOrdersForRevenue,
    totalExpenses,
    monthlyExpenses,
    recentOrders,
    recentExpenses,
    ordersByStatus,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.order.findMany({ select: { amount: true, quantity: true } }),
    prisma.order.findMany({
      where: { createdAt: { gte: startOfMonth } },
      select: { amount: true, quantity: true },
    }),
    prisma.expense.aggregate({ _sum: { amount: true } }),
    prisma.expense.aggregate({
      where: { date: { gte: startOfMonth } },
      _sum: { amount: true },
    }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.expense.findMany({ orderBy: { date: "desc" }, take: 5 }),
    prisma.order.groupBy({ by: ["status"], _count: { id: true } }),
  ]);

  const totalRevenue = allOrders.reduce((sum, o) => sum + o.amount, 0);
  const totalQuantitySold = allOrders.reduce((sum, o) => sum + o.quantity, 0);
  const monthlyRevenue = monthlyOrdersForRevenue.reduce((sum, o) => sum + o.amount, 0);
  const monthlyQuantitySold = monthlyOrdersForRevenue.reduce((sum, o) => sum + o.quantity, 0);
  const totalExpenseAmount = totalExpenses._sum.amount || 0;
  const monthlyExpenseAmount = monthlyExpenses._sum.amount || 0;

  // Monthly revenue for chart (last 6 months)
  const monthlyChart = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const monthOrders = await prisma.order.findMany({
      where: { createdAt: { gte: date, lt: nextMonth } },
      select: { amount: true },
    });
    const monthExpenses = await prisma.expense.aggregate({
      where: { date: { gte: date, lt: nextMonth } },
      _sum: { amount: true },
    });
    monthlyChart.push({
      month: date.toLocaleString("default", { month: "short" }),
      revenue: monthOrders.reduce((sum, o) => sum + o.amount, 0),
      expenses: monthExpenses._sum.amount || 0,
    });
  }

  res.json({
    totalOrders,
    monthlyOrders,
    totalRevenue,
    monthlyRevenue,
    totalQuantitySold,
    monthlyQuantitySold,
    totalExpenses: totalExpenseAmount,
    monthlyExpenses: monthlyExpenseAmount,
    totalProfit: totalRevenue - totalExpenseAmount,
    monthlyProfit: monthlyRevenue - monthlyExpenseAmount,
    recentOrders,
    recentExpenses,
    ordersByStatus,
    monthlyChart,
  });
});

export default router;
