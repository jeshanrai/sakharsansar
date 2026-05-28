"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Banknote,
  Landmark,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Package,
  Sparkles,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Card, Pill } from "../_components/primitives";
import { STATUS_TONES, PAYMENT_TONES, type DashboardStats, type PaymentMethod } from "../_data/types";

const rs = (n: number) => `Rs. ${(n || 0).toLocaleString()}`;

const PAYMENT_COLOR: Record<PaymentMethod, string> = {
  CASH: "#4A5D3A",
  ONLINE: "#B8763E",
  CREDIT: "#C4623E",
};

const STATUS_COLOR: Record<string, string> = {
  PENDING: "#F59E0B",
  CONFIRMED: "#0EA5E9",
  SHIPPED: "#8B5CF6",
  DELIVERED: "#10B981",
  CANCELLED: "#F43F5E",
};

export default function OverviewPage({ adminName }: { adminName: string }) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [growthRange, setGrowthRange] = useState<"weekly" | "monthly">("monthly");
  const [growthData, setGrowthData] = useState<{ label: string; sales: number }[]>([]);

  const fetchStats = useCallback(async () => {
    const res = await apiFetch("/dashboard/stats");
    if (res.ok) setStats(await res.json());
  }, []);

  const fetchGrowth = useCallback(async (range: "weekly" | "monthly") => {
    const res = await apiFetch(`/dashboard/sales-chart?timeframe=${range}`);
    if (res.ok) setGrowthData(await res.json());
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchGrowth(growthRange);
  }, [growthRange, fetchGrowth]);

  if (!stats) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-44 rounded-3xl bg-white/60" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[0, 1, 2, 3].map((i) => <div key={i} className="h-28 rounded-2xl bg-white/60" />)}
        </div>
        <div className="h-72 rounded-2xl bg-white/60" />
      </div>
    );
  }

  const profitGrowth = stats.monthlyRevenue > 0
    ? ((stats.monthlyProfit - (stats.totalProfit - stats.monthlyProfit) / 5) / Math.max(1, Math.abs(stats.totalProfit - stats.monthlyProfit) / 5)) * 100
    : 0;
  const profitPositive = stats.monthlyProfit >= 0;

  const chartData = stats.monthlyChart.map((m) => ({ label: m.month, sales: m.revenue, expenses: m.expenses }));

  const paymentBreakdown = stats.salesByPaymentMethod.map((p) => ({
    name: p.paymentMethod.charAt(0) + p.paymentMethod.slice(1).toLowerCase(),
    value: p._sum.amount || 0,
    color: PAYMENT_COLOR[p.paymentMethod],
  }));

  const growthTotal = growthData.reduce((s, x) => s + x.sales, 0);
  const growthAvg = growthData.length ? Math.round(growthTotal / growthData.length) : 0;
  const firstVal = growthData[0]?.sales ?? 0;
  const lastVal = growthData[growthData.length - 1]?.sales ?? 0;
  const growthPct = firstVal > 0 ? ((lastVal - firstVal) / firstVal) * 100 : 0;
  const growthPositiveTrend = growthPct >= 0;

  return (
    <div className="space-y-6">
      {/* ── Hero greeting ─────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A1410] via-[#3D2817] to-[#5A3B22] p-6 sm:p-8 text-[#F5EDE0]">
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-gradient-to-br from-[#E8A857]/20 to-transparent blur-2xl" />
        <div className="absolute -left-8 -bottom-12 w-56 h-56 rounded-full bg-gradient-to-tr from-[#B8763E]/15 to-transparent blur-2xl" />
        <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8A857]/15 text-[#E8A857] text-[11px] tracking-[0.18em] uppercase mb-4">
              <Sparkles className="w-3 h-3" />
              <span>Studio · Today</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-[1.05] tracking-tight">
              Good morning,
              <br />
              <span className="italic text-[#E8A857]">{adminName?.split(" ")[0] || "friend"}</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[#F5EDE0]/70 leading-relaxed">
              You&apos;ve earned {rs(stats.monthlyProfit)} in profit this month from {stats.monthlySalesCount} sales. Keep going.
            </p>
          </div>
          <div className="flex gap-3 lg:gap-4">
            <MiniMetric label="This month's sales" value={rs(stats.monthlySales)} delta={`${stats.monthlySalesCount} txn`} positive />
            <MiniMetric label="Orders this month" value={String(stats.monthlyOrders)} delta={`${stats.totalOrders} total`} positive />
          </div>
        </div>
      </div>

      {/* ── Primary stat row ─────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="Total Sales"
          value={rs(stats.totalSales)}
          delta={`${stats.totalSalesCount} txn`}
          positive
          icon={TrendingUp}
          accent="emerald"
        />
        <StatCard
          label="Net Profit"
          value={rs(stats.totalProfit)}
          delta={profitPositive ? "Surplus" : "Deficit"}
          positive={profitPositive}
          icon={Activity}
          accent="amber"
        />
        <StatCard
          label="Expenses"
          value={rs(stats.totalExpenses)}
          delta={rs(stats.monthlyExpenses) + " this mo."}
          positive={false}
          icon={TrendingDown}
          accent="rose"
        />
        <StatCard
          label="Orders"
          value={String(stats.totalOrders)}
          delta={`${stats.monthlyOrders} this mo.`}
          positive
          icon={Package}
          accent="sky"
        />
      </div>

      {/* ── Cash position ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        <CashCard label="Cash in Hand" value={stats.cashInHand} icon={Banknote} tone="emerald" subtitle="From cash sales" />
        <CashCard label="Money in Bank" value={stats.moneyInBank} icon={Landmark} tone="sky" subtitle="Online payments" />
        <CashCard label="Credit (Receivable)" value={stats.creditAmount} icon={CreditCard} tone="orange" subtitle="Outstanding to collect" />
      </div>

      {/* ── Main chart + breakdown ────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        <Card className="lg:col-span-2 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[11px] tracking-[0.18em] uppercase text-[#B8763E] font-medium">Trend</p>
              <h3 className="font-serif text-xl text-[#1A1410] mt-1">Revenue vs Expenses</h3>
              <p className="text-[11px] text-[#1A1410]/45 mt-0.5">Last 6 months</p>
            </div>
          </div>

          <div className="h-64 sm:h-72 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#B8763E" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#B8763E" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C4623E" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#C4623E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,20,16,0.06)" vertical={false} />
                <XAxis dataKey="label" stroke="rgba(26,20,16,0.4)" style={{ fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} />
                <YAxis stroke="rgba(26,20,16,0.4)" style={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  cursor={{ stroke: "rgba(184,118,62,0.2)", strokeWidth: 2 }}
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid rgba(26,20,16,0.08)",
                    borderRadius: 12,
                    boxShadow: "0 10px 40px rgba(26,20,16,0.08)",
                    padding: "10px 14px",
                    fontSize: 12,
                  }}
                  formatter={(v) => rs(Number(v))}
                />
                <Area type="monotone" dataKey="sales" stroke="#B8763E" strokeWidth={2.5} fill="url(#salesG)" name="Revenue" />
                <Area type="monotone" dataKey="expenses" stroke="#C4623E" strokeWidth={2} fill="url(#expG)" name="Expenses" strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-4 mt-2 pl-2">
            <Legend swatch="bg-[#B8763E]" label="Revenue" />
            <Legend swatch="bg-[#C4623E]" label="Expenses" dashed />
          </div>
        </Card>

        {/* Order status donut */}
        <Card className="p-5 sm:p-6">
          <p className="text-[11px] tracking-[0.18em] uppercase text-[#B8763E] font-medium">Pipeline</p>
          <h3 className="font-serif text-xl text-[#1A1410] mt-1 mb-4">Orders by Status</h3>

          <div className="h-44 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.ordersByStatus.map((s) => ({
                    name: s.status,
                    value: s._count.id,
                    color: STATUS_COLOR[s.status],
                  }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {stats.ordersByStatus.map((s, i) => (
                    <Cell key={i} fill={STATUS_COLOR[s.status]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid rgba(26,20,16,0.08)",
                    borderRadius: 10,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="font-serif text-2xl text-[#1A1410]">{stats.totalOrders}</p>
              <p className="text-[10px] tracking-[0.18em] uppercase text-[#1A1410]/40 mt-0.5">Total</p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {stats.ordersByStatus.map((s) => (
              <div key={s.status} className="flex items-center justify-between text-xs">
                <Pill tone={STATUS_TONES[s.status]}>{s.status}</Pill>
                <span className="font-medium text-[#1A1410]">{s._count.id}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Payment + Activity rows ──────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Payment Method bar chart */}
        <Card className="p-5 sm:p-6">
          <p className="text-[11px] tracking-[0.18em] uppercase text-[#B8763E] font-medium">Channels</p>
          <h3 className="font-serif text-xl text-[#1A1410] mt-1 mb-4">Sales by Payment</h3>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paymentBreakdown} margin={{ top: 8, right: 0, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,20,16,0.06)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(26,20,16,0.4)" style={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis stroke="rgba(26,20,16,0.4)" style={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid rgba(26,20,16,0.08)",
                    borderRadius: 10,
                    fontSize: 12,
                  }}
                  formatter={(v) => rs(Number(v))}
                  cursor={{ fill: "rgba(184,118,62,0.05)" }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {paymentBreakdown.map((p, i) => (
                    <Cell key={i} fill={p.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent Orders */}
        <Card className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[11px] tracking-[0.18em] uppercase text-[#B8763E] font-medium">Live</p>
              <h3 className="font-serif text-xl text-[#1A1410] mt-1">Recent Orders</h3>
            </div>
          </div>
          <div className="space-y-3">
            {stats.recentOrders.length === 0 && <p className="text-sm text-[#1A1410]/40">No orders yet.</p>}
            {stats.recentOrders.map((o, i) => (
              <motion.div
                key={o.id}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center justify-between gap-3 pb-3 border-b border-[#1A1410]/5 last:border-0 last:pb-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[#1A1410] truncate">{o.customer}</p>
                  <p className="text-[11px] text-[#1A1410]/45 truncate">{o.product} · x{o.quantity}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-[#1A1410] tabular-nums">{rs(o.amount)}</p>
                  <Pill tone={STATUS_TONES[o.status]}>{o.status}</Pill>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Recent Sales */}
        <Card className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[11px] tracking-[0.18em] uppercase text-[#B8763E] font-medium">Live</p>
              <h3 className="font-serif text-xl text-[#1A1410] mt-1">Recent Sales</h3>
            </div>
          </div>
          <div className="space-y-3">
            {stats.recentSales.length === 0 && <p className="text-sm text-[#1A1410]/40">No sales yet.</p>}
            {stats.recentSales.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center justify-between gap-3 pb-3 border-b border-[#1A1410]/5 last:border-0 last:pb-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[#1A1410] truncate">{s.customer}</p>
                  <p className="text-[11px] text-[#1A1410]/45 truncate">{s.product} · x{s.quantity}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-emerald-600 tabular-nums">{rs(s.amount)}</p>
                  <Pill tone={PAYMENT_TONES[s.paymentMethod]}>{s.paymentMethod}</Pill>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Sales Growth Timeline ─────────────────────── */}
      <Card className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <p className="text-[11px] tracking-[0.18em] uppercase text-[#B8763E] font-medium">Momentum</p>
            <h3 className="font-serif text-xl sm:text-2xl text-[#1A1410] mt-1">Sales Growth Timeline</h3>
            <div className="flex flex-wrap items-center gap-4 mt-3">
              <div>
                <p className="text-[10px] tracking-[0.18em] uppercase text-[#1A1410]/45">Total</p>
                <p className="font-serif text-lg text-[#1A1410] tabular-nums mt-0.5">{rs(growthTotal)}</p>
              </div>
              <span className="w-px h-8 bg-[#1A1410]/10" />
              <div>
                <p className="text-[10px] tracking-[0.18em] uppercase text-[#1A1410]/45">Avg / period</p>
                <p className="font-serif text-lg text-[#1A1410] tabular-nums mt-0.5">{rs(growthAvg)}</p>
              </div>
              <span className="w-px h-8 bg-[#1A1410]/10" />
              <div>
                <p className="text-[10px] tracking-[0.18em] uppercase text-[#1A1410]/45">Trend</p>
                <p className={`font-serif text-lg tabular-nums mt-0.5 flex items-center gap-1 ${growthPositiveTrend ? "text-emerald-600" : "text-rose-500"}`}>
                  {growthPositiveTrend ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {growthPositiveTrend ? "+" : ""}{growthPct.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
          <div className="inline-flex items-center bg-[#FAF6EE] p-1 rounded-xl self-start">
            {(["weekly", "monthly"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setGrowthRange(r)}
                className={`px-3.5 h-8 rounded-lg text-xs font-medium capitalize transition-all ${
                  growthRange === r ? "bg-white text-[#1A1410] shadow-sm" : "text-[#1A1410]/50 hover:text-[#1A1410]"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="h-72 sm:h-80 -mx-2">
          {growthData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-[#1A1410]/40">No data yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData} margin={{ top: 12, right: 16, left: -6, bottom: 4 }}>
                <defs>
                  <linearGradient id="growthLine" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#9A5F2E" />
                    <stop offset="50%" stopColor="#B8763E" />
                    <stop offset="100%" stopColor="#E8A857" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,20,16,0.06)" vertical={false} />
                <XAxis
                  dataKey="label"
                  stroke="rgba(26,20,16,0.4)"
                  style={{ fontSize: 11, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                  padding={{ left: 12, right: 12 }}
                />
                <YAxis
                  stroke="rgba(26,20,16,0.4)"
                  style={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  cursor={{ stroke: "rgba(184,118,62,0.25)", strokeWidth: 2, strokeDasharray: "4 4" }}
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid rgba(26,20,16,0.08)",
                    borderRadius: 12,
                    boxShadow: "0 10px 40px rgba(26,20,16,0.08)",
                    padding: "10px 14px",
                    fontSize: 12,
                  }}
                  labelStyle={{ color: "#1A1410", fontWeight: 500, marginBottom: 4 }}
                  formatter={(v) => [rs(Number(v)), "Sales"]}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="url(#growthLine)"
                  strokeWidth={3}
                  dot={{ fill: "#B8763E", stroke: "#FFFFFF", strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 8, fill: "#1A1410", stroke: "#E8A857", strokeWidth: 3 }}
                  name="Sales"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>
    </div>
  );
}

/* ─── Mini metric inside hero ─── */
function MiniMetric({ label, value, delta, positive }: { label: string; value: string; delta: string; positive: boolean }) {
  return (
    <div className="flex-1 lg:flex-none lg:min-w-[150px] bg-[#F5EDE0]/8 backdrop-blur-sm border border-[#F5EDE0]/10 rounded-2xl p-3.5">
      <p className="text-[10px] tracking-[0.18em] uppercase text-[#F5EDE0]/55">{label}</p>
      <p className="font-serif text-xl sm:text-2xl text-[#F5EDE0] mt-1 tabular-nums">{value}</p>
      <p className={`text-[11px] mt-1 flex items-center gap-1 ${positive ? "text-emerald-300" : "text-rose-300"}`}>
        {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {delta}
      </p>
    </div>
  );
}

/* ─── Stat card ─── */
function StatCard({
  label,
  value,
  delta,
  positive,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
  icon: React.ComponentType<{ className?: string }>;
  accent: "emerald" | "amber" | "rose" | "sky";
}) {
  const accents: Record<string, string> = {
    emerald: "bg-emerald-500/10 text-emerald-600",
    amber: "bg-[#B8763E]/10 text-[#B8763E]",
    rose: "bg-rose-500/10 text-rose-600",
    sky: "bg-sky-500/10 text-sky-600",
  };
  return (
    <Card className="p-4 sm:p-5 relative overflow-hidden" hover>
      <div className="flex items-start justify-between">
        <p className="text-[11px] tracking-[0.16em] uppercase text-[#1A1410]/50 font-medium">{label}</p>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accents[accent]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="font-serif text-2xl sm:text-3xl text-[#1A1410] mt-2 tabular-nums tracking-tight leading-tight">
        {value}
      </p>
      <div className="flex items-end justify-between gap-2 mt-3">
        <span className={`inline-flex items-center gap-1 text-[11px] font-medium ${positive ? "text-emerald-600" : "text-rose-500"}`}>
          {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {delta}
        </span>
      </div>
    </Card>
  );
}

/* ─── Cash position card ─── */
function CashCard({
  label,
  value,
  icon: Icon,
  tone,
  subtitle,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  tone: "emerald" | "sky" | "orange";
  subtitle: string;
}) {
  const tones: Record<string, { iconBg: string; ring: string }> = {
    emerald: { iconBg: "bg-emerald-500", ring: "from-emerald-500/15" },
    sky: { iconBg: "bg-sky-500", ring: "from-sky-500/15" },
    orange: { iconBg: "bg-[#C4623E]", ring: "from-[#C4623E]/15" },
  };
  return (
    <Card className="p-5 sm:p-6 relative overflow-hidden" hover>
      <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-radial ${tones[tone].ring} to-transparent blur-2xl`} />
      <div className="relative flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-[11px] tracking-[0.18em] uppercase text-[#1A1410]/50 font-medium">{label}</p>
          <p className="font-serif text-2xl sm:text-[28px] text-[#1A1410] tabular-nums">{rs(value)}</p>
          <p className="text-xs text-[#1A1410]/45">{subtitle}</p>
        </div>
        <div className={`w-11 h-11 rounded-2xl ${tones[tone].iconBg} flex items-center justify-center shadow-lg shadow-black/10`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </Card>
  );
}

function Legend({ swatch, label, dashed }: { swatch: string; label: string; dashed?: boolean }) {
  return (
    <span className="flex items-center gap-2 text-xs text-[#1A1410]/55">
      <span className={`w-3 h-3 rounded-sm ${swatch} ${dashed ? "opacity-60" : ""}`} />
      {label}
    </span>
  );
}
