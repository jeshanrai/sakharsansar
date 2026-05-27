import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

// GET /api/dashboard/stats
router.get("/stats", async (_req: Request, res: Response): Promise<void> => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const activeSaleFilter = { deletedAt: null };
  const activeExpenseFilter = { deletedAt: null };

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
    // Sales data
    totalSalesAgg,
    monthlySalesAgg,
    salesByCash,
    salesByOnline,
    salesByCredit,
    recentSales,
    salesByPaymentMethod,
  ] = await Promise.all([
    prisma.order.count({ where: { deletedAt: null } }),
    prisma.order.count({ where: { createdAt: { gte: startOfMonth }, deletedAt: null } }),
    prisma.order.findMany({ where: { deletedAt: null }, select: { amount: true, quantity: true } }),
    prisma.order.findMany({
      where: { createdAt: { gte: startOfMonth }, deletedAt: null },
      select: { amount: true, quantity: true },
    }),
    prisma.expense.aggregate({ where: activeExpenseFilter, _sum: { amount: true } }),
    prisma.expense.aggregate({
      where: { date: { gte: startOfMonth }, ...activeExpenseFilter },
      _sum: { amount: true },
    }),
    prisma.order.findMany({ where: { deletedAt: null }, orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.expense.findMany({ where: activeExpenseFilter, orderBy: { date: "desc" }, take: 5 }),
    prisma.order.groupBy({ by: ["status"], where: { deletedAt: null }, _count: { id: true } }),
    // Sales aggregations
    prisma.sale.aggregate({ where: activeSaleFilter, _sum: { amount: true }, _count: true }),
    prisma.sale.aggregate({
      where: { date: { gte: startOfMonth }, ...activeSaleFilter },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.sale.aggregate({ where: { paymentMethod: "CASH", ...activeSaleFilter }, _sum: { amount: true } }),
    prisma.sale.aggregate({ where: { paymentMethod: "ONLINE", ...activeSaleFilter }, _sum: { amount: true } }),
    prisma.sale.aggregate({ where: { paymentMethod: "CREDIT", ...activeSaleFilter }, _sum: { amount: true } }),
    prisma.sale.findMany({
      where: activeSaleFilter,
      orderBy: { date: "desc" },
      take: 5,
      include: { createdByAdmin: { select: { name: true } } },
    }),
    prisma.sale.groupBy({ by: ["paymentMethod"], where: activeSaleFilter, _sum: { amount: true }, _count: { id: true } }),
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

  const totalSalesAmount = totalSalesAgg._sum.amount || 0;
  const monthlySalesAmount = monthlySalesAgg._sum.amount || 0;
  const cashInHand = salesByCash._sum.amount || 0;
  const moneyInBank = salesByOnline._sum.amount || 0;
  const creditAmount = salesByCredit._sum.amount || 0;

  res.json({
    totalOrders,
    monthlyOrders,
    totalRevenue,
    monthlyRevenue,
    totalQuantitySold,
    monthlyQuantitySold,
    totalExpenses: totalExpenseAmount,
    monthlyExpenses: monthlyExpenseAmount,
    totalProfit: totalSalesAmount - totalExpenseAmount,
    monthlyProfit: monthlySalesAmount - monthlyExpenseAmount,
    recentOrders,
    recentExpenses,
    ordersByStatus,
    monthlyChart,
    // Sales data
    totalSales: totalSalesAmount,
    monthlySales: monthlySalesAmount,
    totalSalesCount: totalSalesAgg._count,
    monthlySalesCount: monthlySalesAgg._count,
    cashInHand,
    moneyInBank,
    creditAmount,
    recentSales,
    salesByPaymentMethod,
  });
});

// GET /api/dashboard/users-stats
router.get("/users-stats", async (_req: Request, res: Response): Promise<void> => {
  const activeSaleFilter = { deletedAt: null };
  const activeExpenseFilter = { deletedAt: null };

  // Get all admins with their sales and expenses
  const admins = await prisma.admin.findMany({
    select: { id: true, name: true, email: true },
  });

  const userStats = await Promise.all(
    admins.map(async (admin) => {
      const [salesData, expensesData] = await Promise.all([
        prisma.sale.aggregate({
          where: { createdBy: admin.id, ...activeSaleFilter },
          _sum: { amount: true },
          _count: true,
        }),
        prisma.expense.aggregate({
          where: { createdBy: admin.id, ...activeExpenseFilter },
          _sum: { amount: true },
          _count: true,
        }),
      ]);

      return {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        totalSales: salesData._sum.amount || 0,
        totalSalesCount: salesData._count,
        totalExpenses: expensesData._sum.amount || 0,
        totalExpensesCount: expensesData._count,
      };
    })
  );

  res.json(userStats);
});

// GET /api/dashboard/sales-chart
router.get("/sales-chart", async (_req: Request, res: Response): Promise<void> => {
  const { timeframe = "monthly" } = _req.query;
  const now = new Date();
  const activeSaleFilter = { deletedAt: null };

  let chartData: { label: string; sales: number }[] = [];

  if (timeframe === "weekly") {
    // Get last 12 weeks of sales data
    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() - i * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);

      const weeklySales = await prisma.sale.aggregate({
        where: {
          date: { gte: weekStart, lt: weekEnd },
          ...activeSaleFilter,
        },
        _sum: { amount: true },
      });

      const weekLabel = `Week ${Math.floor((now.getTime() - weekStart.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1}`;
      chartData.push({
        label: weekLabel,
        sales: weeklySales._sum.amount || 0,
      });
    }
  } else {
    // Get last 12 months of sales data
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      const monthlySales = await prisma.sale.aggregate({
        where: {
          date: { gte: date, lt: nextMonth },
          ...activeSaleFilter,
        },
        _sum: { amount: true },
      });

      chartData.push({
        label: date.toLocaleString("default", { month: "short" }),
        sales: monthlySales._sum.amount || 0,
      });
    }
  }

  res.json(chartData);
});

export default router;
