import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { isOwner } from "../lib/owner";
import {
  getSeasons,
  currentSeason,
  rangeOf,
  closeCurrentSeason,
  reopenPreviousSeason,
  type Season,
} from "../lib/seasons";

const router = Router();
router.use(requireAuth);

/** The season-stats card for one year. */
async function summarise(season: Season) {
  const range = rangeOf(season);
  const [sales, expenses, orders, topProduct] = await Promise.all([
    prisma.sale.aggregate({ where: { deletedAt: null, date: range }, _sum: { amount: true }, _count: true }),
    prisma.expense.aggregate({ where: { deletedAt: null, date: range }, _sum: { amount: true }, _count: true }),
    prisma.order.aggregate({ where: { deletedAt: null, createdAt: range }, _sum: { amount: true }, _count: true }),
    prisma.sale.groupBy({
      by: ["product"],
      where: { deletedAt: null, date: range },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 1,
    }),
  ]);
  const salesTotal = sales._sum.amount || 0;
  const expensesTotal = expenses._sum.amount || 0;
  return {
    ...season,
    sales: salesTotal,
    salesCount: sales._count,
    expenses: expensesTotal,
    expensesCount: expenses._count,
    orders: orders._count,
    orderRevenue: orders._sum.amount || 0,
    profit: salesTotal - expensesTotal,
    topProduct: topProduct[0] ? { name: topProduct[0].product, quantity: topProduct[0]._sum.quantity || 0 } : null,
  };
}

// GET /api/seasons — every year (no totals), for the picker
router.get("/", async (req: AuthRequest, res: Response): Promise<void> => {
  const [seasons, owner] = await Promise.all([getSeasons(), isOwner(req.adminId)]);
  res.json({ seasons, current: currentSeason(seasons).number, isOwner: owner });
});

// GET /api/seasons/summary — every year with its totals, newest first
router.get("/summary", async (_req: AuthRequest, res: Response): Promise<void> => {
  const seasons = await getSeasons();
  const summaries = await Promise.all([...seasons].reverse().map(summarise));
  res.json(summaries);
});

// POST /api/seasons/close — owner only. Body { confirm: "YEAR <next>" }.
// The confirm text names the year being started, so a double tap or a stale
// tab cannot close two years in a row.
router.post("/close", async (req: AuthRequest, res: Response): Promise<void> => {
  if (!(await isOwner(req.adminId))) {
    res.status(403).json({ error: "Only the owner can start a new year." });
    return;
  }
  const next = currentSeason(await getSeasons()).number + 1;
  if (String(req.body?.confirm ?? "").trim().toUpperCase() !== `YEAR ${next}`) {
    res.status(400).json({ error: `Type YEAR ${next} to confirm.` });
    return;
  }
  try {
    const seasons = await closeCurrentSeason(req.adminId);
    res.json({ seasons, current: currentSeason(seasons).number });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Could not start the new year. If this is a new deploy, run `npx prisma migrate deploy` on the backend.",
    });
  }
});

// POST /api/seasons/reopen — owner only. Undoes the last close.
// Body { confirm: "YEAR <current>" }: the year being removed.
router.post("/reopen", async (req: AuthRequest, res: Response): Promise<void> => {
  if (!(await isOwner(req.adminId))) {
    res.status(403).json({ error: "Only the owner can reopen a year." });
    return;
  }
  const current = currentSeason(await getSeasons()).number;
  if (current === 1) {
    res.status(400).json({ error: "Year 1 is the only year; there is nothing to reopen." });
    return;
  }
  if (String(req.body?.confirm ?? "").trim().toUpperCase() !== `YEAR ${current}`) {
    res.status(400).json({ error: `Type YEAR ${current} to confirm.` });
    return;
  }
  const seasons = await reopenPreviousSeason(req.adminId);
  res.json({ seasons, current: currentSeason(seasons).number });
});

export default router;
