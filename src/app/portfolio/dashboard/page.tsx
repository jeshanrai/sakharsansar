"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { apiFetch } from "@/lib/api";
import {
  DollarSign,
  Package,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  LogOut,
  Plus,
  Trash2,
  ChevronDown,
  BarChart3,
  Receipt,
  ClipboardList,
  X,
  AlertTriangle,
  CreditCard,
  Banknote,
  Landmark,
  ShoppingCart,
  Edit3,
} from "lucide-react";

interface DashboardStats {
  totalOrders: number;
  monthlyOrders: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalQuantitySold: number;
  monthlyQuantitySold: number;
  totalExpenses: number;
  monthlyExpenses: number;
  totalProfit: number;
  monthlyProfit: number;
  recentOrders: Order[];
  recentExpenses: Expense[];
  ordersByStatus: { status: string; _count: { id: number } }[];
  monthlyChart: { month: string; revenue: number; expenses: number }[];
  // Sales data
  totalSales: number;
  monthlySales: number;
  totalSalesCount: number;
  monthlySalesCount: number;
  cashInHand: number;
  moneyInBank: number;
  creditAmount: number;
  recentSales: Sale[];
  salesByPaymentMethod: { paymentMethod: string; _sum: { amount: number }; _count: { id: number } }[];
}

interface Order {
  id: string;
  customer: string;
  phone: string;
  address: string;
  product: string;
  quantity: number;
  amount: number;
  status: string;
  createdAt: string;
}

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  description: string | null;
  date: string;
}

interface Sale {
  id: string;
  customer: string;
  phone: string | null;
  product: string;
  quantity: number;
  amount: number;
  paymentMethod: string;
  description: string | null;
  date: string;
  createdAt: string;
  updatedAt: string;
  createdByAdmin?: { name: string } | null;
  updatedByAdmin?: { name: string } | null;
}

type Tab = "overview" | "orders" | "expenses" | "sales";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const PAYMENT_COLORS: Record<string, string> = {
  CASH: "bg-green-100 text-green-700",
  ONLINE: "bg-blue-100 text-blue-700",
  CREDIT: "bg-orange-100 text-orange-700",
};

const EXPENSE_CATEGORIES = ["Raw Materials", "Packaging", "Logistics", "Marketing", "Operations", "Labor", "Other"];

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersTotal, setOrdersTotal] = useState(0);
  const [ordersPage, setOrdersPage] = useState(1);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expensesTotal, setExpensesTotal] = useState(0);
  const [expensesPage, setExpensesPage] = useState(1);
  const [sales, setSales] = useState<Sale[]>([]);
  const [salesTotal, setSalesTotal] = useState(0);
  const [salesPage, setSalesPage] = useState(1);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("");

  // Confirmation dialog
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    variant: "danger" | "warning" | "info";
    onConfirm: () => void;
  }>({ open: false, title: "", message: "", variant: "warning", onConfirm: () => {} });

  const showConfirm = (title: string, message: string, variant: "danger" | "warning" | "info", onConfirm: () => void) => {
    setConfirmDialog({ open: true, title, message, variant, onConfirm });
  };

  const closeConfirm = () => setConfirmDialog((prev) => ({ ...prev, open: false }));

  // Expense form
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    title: "",
    amount: "",
    category: "Raw Materials",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  // Sale form
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [editingSaleId, setEditingSaleId] = useState<string | null>(null);
  const [saleForm, setSaleForm] = useState({
    customer: "",
    phone: "",
    product: "",
    quantity: "1",
    amount: "",
    paymentMethod: "CASH",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  // Check auth
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/portfolio");
      return;
    }
    apiFetch("/auth/me")
      .then(async (res) => {
        if (!res.ok) {
          router.replace("/portfolio");
          return;
        }
        const data = await res.json();
        setAdminName(data.name);
      })
      .catch(() => router.replace("/portfolio"));
  }, [router]);

  const fetchStats = useCallback(async () => {
    const res = await apiFetch("/dashboard/stats");
    if (res.ok) setStats(await res.json());
  }, []);

  const fetchOrders = useCallback(async (page: number) => {
    const res = await apiFetch(`/orders?page=${page}&limit=10`);
    if (res.ok) {
      const data = await res.json();
      setOrders(data.orders);
      setOrdersTotal(data.totalPages);
    }
  }, []);

  const fetchExpenses = useCallback(async (page: number) => {
    const res = await apiFetch(`/expenses?page=${page}&limit=10`);
    if (res.ok) {
      const data = await res.json();
      setExpenses(data.expenses);
      setExpensesTotal(data.totalPages);
    }
  }, []);

  const fetchSales = useCallback(async (page: number) => {
    const res = await apiFetch(`/sales?page=${page}&limit=10`);
    if (res.ok) {
      const data = await res.json();
      setSales(data.sales);
      setSalesTotal(data.totalPages);
    }
  }, []);

  useEffect(() => {
    Promise.all([fetchStats(), fetchOrders(1), fetchExpenses(1), fetchSales(1)]).finally(() => setLoading(false));
  }, [fetchStats, fetchOrders, fetchExpenses, fetchSales]);

  const updateOrderStatus = (id: string, newStatus: string, currentStatus: string) => {
    if (newStatus === currentStatus) return;
    showConfirm(
      "Update Order Status",
      `Change order status from "${currentStatus}" to "${newStatus}"?`,
      newStatus === "CANCELLED" ? "danger" : "warning",
      async () => {
        await apiFetch(`/orders/${id}`, { method: "PATCH", body: JSON.stringify({ status: newStatus }) });
        fetchOrders(ordersPage);
        fetchStats();
        closeConfirm();
      }
    );
  };

  const deleteExpense = (id: string, title: string) => {
    showConfirm(
      "Delete Expense",
      `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      "danger",
      async () => {
        await apiFetch(`/expenses/${id}`, { method: "DELETE" });
        fetchExpenses(expensesPage);
        fetchStats();
        closeConfirm();
      }
    );
  };

  const addExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiFetch("/expenses", {
      method: "POST",
      body: JSON.stringify({ ...expenseForm, amount: Number(expenseForm.amount) }),
    });
    setShowExpenseForm(false);
    setExpenseForm({ title: "", amount: "", category: "Raw Materials", description: "", date: new Date().toISOString().split("T")[0] });
    fetchExpenses(1);
    setExpensesPage(1);
    fetchStats();
  };

  const openSaleForm = (sale?: Sale) => {
    if (sale) {
      setEditingSaleId(sale.id);
      setSaleForm({
        customer: sale.customer,
        phone: sale.phone || "",
        product: sale.product,
        quantity: String(sale.quantity),
        amount: String(sale.amount),
        paymentMethod: sale.paymentMethod,
        description: sale.description || "",
        date: new Date(sale.date).toISOString().split("T")[0],
      });
    } else {
      setEditingSaleId(null);
      setSaleForm({ customer: "", phone: "", product: "", quantity: "1", amount: "", paymentMethod: "CASH", description: "", date: new Date().toISOString().split("T")[0] });
    }
    setShowSaleForm(true);
  };

  const submitSale = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...saleForm, quantity: Number(saleForm.quantity), amount: Number(saleForm.amount) };

    if (editingSaleId) {
      await apiFetch(`/sales/${editingSaleId}`, { method: "PATCH", body: JSON.stringify(payload) });
    } else {
      await apiFetch("/sales", { method: "POST", body: JSON.stringify(payload) });
    }

    setShowSaleForm(false);
    setEditingSaleId(null);
    fetchSales(1);
    setSalesPage(1);
    fetchStats();
  };

  const deleteSale = (id: string, customer: string) => {
    showConfirm(
      "Delete Sale",
      `Are you sure you want to delete the sale to "${customer}"? This action cannot be undone.`,
      "danger",
      async () => {
        await apiFetch(`/sales/${id}`, { method: "DELETE" });
        fetchSales(salesPage);
        fetchStats();
        closeConfirm();
      }
    );
  };

  const handleLogout = () => {
    showConfirm(
      "Logout",
      "Are you sure you want to log out of the dashboard?",
      "info",
      () => {
        localStorage.removeItem("token");
        router.push("/portfolio");
      }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F1ED] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C17A2A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const maxChartValue = stats ? Math.max(...stats.monthlyChart.map((m) => Math.max(m.revenue, m.expenses)), 1) : 1;

  return (
    <div className="min-h-screen bg-[#F4F1ED]">
      {/* Header */}
      <header className="bg-white border-b border-black/5 sticky top-0 z-30">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/company-logo.svg" alt="SakharSansar" width={40} height={40} className="h-10 w-10" />
            <div>
              <h1 className="font-poppins font-bold text-lg text-[#2C1500] leading-tight">Dashboard</h1>
              <p className="text-xs text-[#2C1500]/40">Welcome, {adminName}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-[#2C1500]/60 hover:text-red-500 transition-colors">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-black/5">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 flex gap-1">
          {([
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "orders", label: "Orders", icon: ClipboardList },
            { id: "sales", label: "Sales", icon: ShoppingCart },
            { id: "expenses", label: "Expenses", icon: Receipt },
          ] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-all ${
                activeTab === tab.id
                  ? "border-[#C17A2A] text-[#C17A2A]"
                  : "border-transparent text-[#2C1500]/40 hover:text-[#2C1500]/70"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && stats && (
          <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard icon={DollarSign} label="Total Revenue" value={`Rs. ${stats.totalSales.toLocaleString()}`} sub={`Rs. ${stats.monthlySales.toLocaleString()} this month`} color="bg-green-500" />
              <StatCard icon={TrendingUp} label="Total Profit" value={`Rs. ${stats.totalProfit.toLocaleString()}`} sub={`Rs. ${stats.monthlyProfit.toLocaleString()} this month`} color={stats.totalProfit >= 0 ? "bg-emerald-500" : "bg-red-500"} />
              <StatCard icon={TrendingDown} label="Total Expenses" value={`Rs. ${stats.totalExpenses.toLocaleString()}`} sub={`Rs. ${stats.monthlyExpenses.toLocaleString()} this month`} color="bg-red-500" />
            </div>

            {/* Money Breakdown: Cash, Bank, Credit */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow border-l-4 border-green-500">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold tracking-wider text-[#2C1500]/40 uppercase">Cash in Hand</p>
                    <p className="font-poppins text-xl sm:text-2xl font-bold text-[#2C1500]">Rs. {stats.cashInHand.toLocaleString()}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
                    <Banknote className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-xs text-[#2C1500]/40 mt-3">From cash sales</p>
              </div>
              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow border-l-4 border-blue-500">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold tracking-wider text-[#2C1500]/40 uppercase">Money in Bank</p>
                    <p className="font-poppins text-xl sm:text-2xl font-bold text-[#2C1500]">Rs. {stats.moneyInBank.toLocaleString()}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                    <Landmark className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-xs text-[#2C1500]/40 mt-3">From online payments</p>
              </div>
              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow border-l-4 border-orange-500">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold tracking-wider text-[#2C1500]/40 uppercase">Credit (Receivable)</p>
                    <p className="font-poppins text-xl sm:text-2xl font-bold text-[#2C1500]">Rs. {stats.creditAmount.toLocaleString()}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-xs text-[#2C1500]/40 mt-3">Outstanding credit sales</p>
              </div>
            </div>

            {/* Total Sales Card */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={ShoppingCart} label="Total Sales" value={`Rs. ${stats.totalSales.toLocaleString()}`} sub={`Rs. ${stats.monthlySales.toLocaleString()} this month`} color="bg-indigo-500" />
              <StatCard icon={Package} label="Sales Count" value={`${stats.totalSalesCount}`} sub={`${stats.monthlySalesCount} this month`} color="bg-violet-500" />
            </div>

            {/* Chart + Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Revenue vs Expenses Chart */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-poppins font-semibold text-[#2C1500] mb-6">Revenue vs Expenses (6 Months)</h3>
                <div className="flex items-end gap-3 h-52">
                  {stats.monthlyChart.map((m) => (
                    <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex gap-1 items-end h-40">
                        <div
                          className="flex-1 bg-[#C17A2A] rounded-t-md transition-all min-h-[4px]"
                          style={{ height: `${(m.revenue / maxChartValue) * 100}%` }}
                          title={`Revenue: Rs. ${m.revenue.toLocaleString()}`}
                        />
                        <div
                          className="flex-1 bg-red-400 rounded-t-md transition-all min-h-[4px]"
                          style={{ height: `${(m.expenses / maxChartValue) * 100}%` }}
                          title={`Expenses: Rs. ${m.expenses.toLocaleString()}`}
                        />
                      </div>
                      <span className="text-[10px] text-[#2C1500]/40 font-medium">{m.month}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-6 mt-4 text-xs text-[#2C1500]/50">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#C17A2A]" /> Revenue</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-400" /> Expenses</span>
                </div>
              </div>

              {/* Order Status Breakdown */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-poppins font-semibold text-[#2C1500] mb-6">Orders by Status</h3>
                <div className="space-y-3">
                  {stats.ordersByStatus.map((s) => (
                    <div key={s.status} className="flex items-center justify-between">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_COLORS[s.status] || "bg-gray-100 text-gray-600"}`}>
                        {s.status}
                      </span>
                      <span className="font-poppins font-bold text-[#2C1500]">{s._count.id}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-black/5">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#2C1500]/50">Total Orders</span>
                    <span className="font-poppins font-bold text-[#2C1500]">{stats.totalOrders}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Orders */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-poppins font-semibold text-[#2C1500]">Recent Orders</h3>
                  <button onClick={() => setActiveTab("orders")} className="text-xs text-[#C17A2A] font-semibold hover:underline">View All</button>
                </div>
                <div className="space-y-3">
                  {stats.recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between py-2 border-b border-black/5 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-[#2C1500]">{order.customer}</p>
                        <p className="text-xs text-[#2C1500]/40">{order.product} x{order.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-[#2C1500]">Rs. {order.amount.toLocaleString()}</p>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status]}`}>{order.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Sales */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-poppins font-semibold text-[#2C1500]">Recent Sales</h3>
                  <button onClick={() => setActiveTab("sales")} className="text-xs text-[#C17A2A] font-semibold hover:underline">View All</button>
                </div>
                <div className="space-y-3">
                  {stats.recentSales.map((sale) => (
                    <div key={sale.id} className="flex items-center justify-between py-2 border-b border-black/5 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-[#2C1500]">{sale.customer}</p>
                        <p className="text-xs text-[#2C1500]/40">{sale.product} x{sale.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-green-600">Rs. {sale.amount.toLocaleString()}</p>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${PAYMENT_COLORS[sale.paymentMethod]}`}>{sale.paymentMethod}</span>
                      </div>
                    </div>
                  ))}
                  {stats.recentSales.length === 0 && (
                    <p className="text-sm text-[#2C1500]/30 text-center py-4">No sales yet</p>
                  )}
                </div>
              </div>

              {/* Recent Expenses */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-poppins font-semibold text-[#2C1500]">Recent Expenses</h3>
                  <button onClick={() => setActiveTab("expenses")} className="text-xs text-[#C17A2A] font-semibold hover:underline">View All</button>
                </div>
                <div className="space-y-3">
                  {stats.recentExpenses.map((exp) => (
                    <div key={exp.id} className="flex items-center justify-between py-2 border-b border-black/5 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-[#2C1500]">{exp.title}</p>
                        <p className="text-xs text-[#2C1500]/40">{exp.category}</p>
                      </div>
                      <p className="text-sm font-bold text-red-500">-Rs. {exp.amount.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-black/5">
              <h3 className="font-poppins font-semibold text-lg text-[#2C1500]">All Orders</h3>
              <p className="text-sm text-[#2C1500]/40 mt-1">Manage and track customer orders</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F4F1ED]">
                    <th className="text-left px-6 py-3 font-semibold text-[#2C1500]/60 text-xs uppercase tracking-wider">Customer</th>
                    <th className="text-left px-6 py-3 font-semibold text-[#2C1500]/60 text-xs uppercase tracking-wider">Product</th>
                    <th className="text-left px-6 py-3 font-semibold text-[#2C1500]/60 text-xs uppercase tracking-wider">Qty</th>
                    <th className="text-left px-6 py-3 font-semibold text-[#2C1500]/60 text-xs uppercase tracking-wider">Amount</th>
                    <th className="text-left px-6 py-3 font-semibold text-[#2C1500]/60 text-xs uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-3 font-semibold text-[#2C1500]/60 text-xs uppercase tracking-wider">Date</th>
                    <th className="text-left px-6 py-3 font-semibold text-[#2C1500]/60 text-xs uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-black/5 hover:bg-[#F4F1ED]/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-[#2C1500]">{order.customer}</p>
                        <p className="text-xs text-[#2C1500]/40">{order.phone}</p>
                      </td>
                      <td className="px-6 py-4 text-[#2C1500]">{order.product}</td>
                      <td className="px-6 py-4 text-[#2C1500]">{order.quantity}</td>
                      <td className="px-6 py-4 font-semibold text-[#2C1500]">Rs. {order.amount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <div className="relative inline-block">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value, order.status)}
                            className={`appearance-none text-xs font-semibold px-3 py-1.5 pr-7 rounded-full cursor-pointer outline-none ${STATUS_COLORS[order.status]}`}
                          >
                            {["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"].map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-50" />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#2C1500]/50 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-[#2C1500]/30">{order.address.slice(0, 20)}...</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            {ordersTotal > 1 && (
              <div className="flex items-center justify-center gap-2 p-4 border-t border-black/5">
                {Array.from({ length: ordersTotal }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => { setOrdersPage(i + 1); fetchOrders(i + 1); }}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                      ordersPage === i + 1 ? "bg-[#C17A2A] text-white" : "text-[#2C1500]/50 hover:bg-[#C17A2A]/10"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SALES TAB */}
        {activeTab === "sales" && (
          <div className="space-y-6">
            {/* Add Sale */}
            <div className="flex justify-end">
              <button
                onClick={() => openSaleForm()}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#C17A2A] text-white text-sm font-semibold rounded-xl hover:bg-[#A8671F] transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Sale
              </button>
            </div>

            {/* Sale Form Modal */}
            {showSaleForm && (
              <>
                <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setShowSaleForm(false)} />
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl p-8 z-50 shadow-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-poppins font-semibold text-lg text-[#2C1500]">{editingSaleId ? "Edit Sale" : "New Sale"}</h3>
                    <button onClick={() => setShowSaleForm(false)} className="text-[#2C1500]/30 hover:text-[#2C1500]">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <form onSubmit={submitSale} className="flex flex-col gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Customer name"
                      value={saleForm.customer}
                      onChange={(e) => setSaleForm({ ...saleForm, customer: e.target.value })}
                      className="w-full bg-[#F4F1ED] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-[#C17A2A]/30"
                    />
                    <input
                      type="text"
                      placeholder="Phone (optional)"
                      value={saleForm.phone}
                      onChange={(e) => setSaleForm({ ...saleForm, phone: e.target.value })}
                      className="w-full bg-[#F4F1ED] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-[#C17A2A]/30"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Product"
                      value={saleForm.product}
                      onChange={(e) => setSaleForm({ ...saleForm, product: e.target.value })}
                      className="w-full bg-[#F4F1ED] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-[#C17A2A]/30"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="number"
                        required
                        min="1"
                        placeholder="Quantity"
                        value={saleForm.quantity}
                        onChange={(e) => setSaleForm({ ...saleForm, quantity: e.target.value })}
                        className="w-full bg-[#F4F1ED] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-[#C17A2A]/30"
                      />
                      <input
                        type="number"
                        required
                        placeholder="Amount (Rs.)"
                        value={saleForm.amount}
                        onChange={(e) => setSaleForm({ ...saleForm, amount: e.target.value })}
                        className="w-full bg-[#F4F1ED] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-[#C17A2A]/30"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#2C1500]/50 uppercase tracking-wider mb-2 block">Payment Method</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(["CASH", "ONLINE", "CREDIT"] as const).map((method) => (
                          <button
                            key={method}
                            type="button"
                            onClick={() => setSaleForm({ ...saleForm, paymentMethod: method })}
                            className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${
                              saleForm.paymentMethod === method
                                ? method === "CASH" ? "bg-green-500 text-white" : method === "ONLINE" ? "bg-blue-500 text-white" : "bg-orange-500 text-white"
                                : "bg-[#F4F1ED] text-[#2C1500]/60 hover:bg-[#eae5dd]"
                            }`}
                          >
                            {method}
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea
                      placeholder="Description (optional)"
                      rows={2}
                      value={saleForm.description}
                      onChange={(e) => setSaleForm({ ...saleForm, description: e.target.value })}
                      className="w-full bg-[#F4F1ED] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-[#C17A2A]/30 resize-none"
                    />
                    <input
                      type="date"
                      value={saleForm.date}
                      onChange={(e) => setSaleForm({ ...saleForm, date: e.target.value })}
                      className="w-full bg-[#F4F1ED] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-[#C17A2A]/30"
                    />
                    <button type="submit" className="w-full py-3 bg-[#C17A2A] text-white font-semibold rounded-xl hover:bg-[#A8671F] transition-colors">
                      {editingSaleId ? "Update Sale" : "Add Sale"}
                    </button>
                  </form>
                </div>
              </>
            )}

            {/* Sales Table */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-black/5">
                <h3 className="font-poppins font-semibold text-lg text-[#2C1500]">All Sales</h3>
                <p className="text-sm text-[#2C1500]/40 mt-1">Track sales by payment method</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F4F1ED]">
                      <th className="text-left px-6 py-3 font-semibold text-[#2C1500]/60 text-xs uppercase tracking-wider">Customer</th>
                      <th className="text-left px-6 py-3 font-semibold text-[#2C1500]/60 text-xs uppercase tracking-wider">Product</th>
                      <th className="text-left px-6 py-3 font-semibold text-[#2C1500]/60 text-xs uppercase tracking-wider">Qty</th>
                      <th className="text-left px-6 py-3 font-semibold text-[#2C1500]/60 text-xs uppercase tracking-wider">Amount</th>
                      <th className="text-left px-6 py-3 font-semibold text-[#2C1500]/60 text-xs uppercase tracking-wider">Payment</th>
                      <th className="text-left px-6 py-3 font-semibold text-[#2C1500]/60 text-xs uppercase tracking-wider">Date</th>
                      <th className="text-left px-6 py-3 font-semibold text-[#2C1500]/60 text-xs uppercase tracking-wider">By</th>
                      <th className="text-left px-6 py-3 font-semibold text-[#2C1500]/60 text-xs uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.map((sale) => (
                      <tr key={sale.id} className="border-b border-black/5 hover:bg-[#F4F1ED]/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-medium text-[#2C1500]">{sale.customer}</p>
                          {sale.phone && <p className="text-xs text-[#2C1500]/40">{sale.phone}</p>}
                        </td>
                        <td className="px-6 py-4 text-[#2C1500]">{sale.product}</td>
                        <td className="px-6 py-4 text-[#2C1500]">{sale.quantity}</td>
                        <td className="px-6 py-4 font-semibold text-green-600">Rs. {sale.amount.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${PAYMENT_COLORS[sale.paymentMethod]}`}>
                            {sale.paymentMethod}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[#2C1500]/50 text-xs">{new Date(sale.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <p className="text-xs text-[#2C1500]/40">{sale.createdByAdmin?.name || "—"}</p>
                          {sale.updatedByAdmin && (
                            <p className="text-[10px] text-[#2C1500]/30">edited by {sale.updatedByAdmin.name}</p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button onClick={() => openSaleForm(sale)} className="text-blue-400 hover:text-blue-600 transition-colors">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button onClick={() => deleteSale(sale.id, sale.customer)} className="text-red-400 hover:text-red-600 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {salesTotal > 1 && (
                <div className="flex items-center justify-center gap-2 p-4 border-t border-black/5">
                  {Array.from({ length: salesTotal }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => { setSalesPage(i + 1); fetchSales(i + 1); }}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                        salesPage === i + 1 ? "bg-[#C17A2A] text-white" : "text-[#2C1500]/50 hover:bg-[#C17A2A]/10"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* EXPENSES TAB */}
        {activeTab === "expenses" && (
          <div className="space-y-6">
            {/* Add Expense */}
            <div className="flex justify-end">
              <button
                onClick={() => setShowExpenseForm(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#C17A2A] text-white text-sm font-semibold rounded-xl hover:bg-[#A8671F] transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Expense
              </button>
            </div>

            {/* Expense Form Modal */}
            {showExpenseForm && (
              <>
                <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setShowExpenseForm(false)} />
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl p-8 z-50 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-poppins font-semibold text-lg text-[#2C1500]">New Expense</h3>
                    <button onClick={() => setShowExpenseForm(false)} className="text-[#2C1500]/30 hover:text-[#2C1500]">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <form onSubmit={addExpense} className="flex flex-col gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Expense title"
                      value={expenseForm.title}
                      onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                      className="w-full bg-[#F4F1ED] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-[#C17A2A]/30"
                    />
                    <input
                      type="number"
                      required
                      placeholder="Amount (Rs.)"
                      value={expenseForm.amount}
                      onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                      className="w-full bg-[#F4F1ED] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-[#C17A2A]/30"
                    />
                    <select
                      value={expenseForm.category}
                      onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                      className="w-full bg-[#F4F1ED] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-[#C17A2A]/30"
                    >
                      {EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <textarea
                      placeholder="Description (optional)"
                      rows={2}
                      value={expenseForm.description}
                      onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                      className="w-full bg-[#F4F1ED] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-[#C17A2A]/30 resize-none"
                    />
                    <input
                      type="date"
                      value={expenseForm.date}
                      onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                      className="w-full bg-[#F4F1ED] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-[#C17A2A]/30"
                    />
                    <button type="submit" className="w-full py-3 bg-[#C17A2A] text-white font-semibold rounded-xl hover:bg-[#A8671F] transition-colors">
                      Add Expense
                    </button>
                  </form>
                </div>
              </>
            )}

            {/* Expenses Table */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-black/5">
                <h3 className="font-poppins font-semibold text-lg text-[#2C1500]">All Expenses</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F4F1ED]">
                      <th className="text-left px-6 py-3 font-semibold text-[#2C1500]/60 text-xs uppercase tracking-wider">Title</th>
                      <th className="text-left px-6 py-3 font-semibold text-[#2C1500]/60 text-xs uppercase tracking-wider">Category</th>
                      <th className="text-left px-6 py-3 font-semibold text-[#2C1500]/60 text-xs uppercase tracking-wider">Amount</th>
                      <th className="text-left px-6 py-3 font-semibold text-[#2C1500]/60 text-xs uppercase tracking-wider">Date</th>
                      <th className="text-left px-6 py-3 font-semibold text-[#2C1500]/60 text-xs uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((exp) => (
                      <tr key={exp.id} className="border-b border-black/5 hover:bg-[#F4F1ED]/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-medium text-[#2C1500]">{exp.title}</p>
                          {exp.description && <p className="text-xs text-[#2C1500]/40 mt-0.5">{exp.description}</p>}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#F4F1ED] text-[#2C1500]/70">{exp.category}</span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-red-500">Rs. {exp.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 text-[#2C1500]/50 text-xs">{new Date(exp.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <button onClick={() => deleteExpense(exp.id, exp.title)} className="text-red-400 hover:text-red-600 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {expensesTotal > 1 && (
                <div className="flex items-center justify-center gap-2 p-4 border-t border-black/5">
                  {Array.from({ length: expensesTotal }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => { setExpensesPage(i + 1); fetchExpenses(i + 1); }}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                        expensesPage === i + 1 ? "bg-[#C17A2A] text-white" : "text-[#2C1500]/50 hover:bg-[#C17A2A]/10"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Confirmation Dialog */}
      {confirmDialog.open && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm" onClick={closeConfirm} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-2xl p-6 z-[70] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                confirmDialog.variant === "danger" ? "bg-red-100" :
                confirmDialog.variant === "warning" ? "bg-yellow-100" : "bg-blue-100"
              }`}>
                <AlertTriangle className={`w-6 h-6 ${
                  confirmDialog.variant === "danger" ? "text-red-500" :
                  confirmDialog.variant === "warning" ? "text-yellow-600" : "text-blue-500"
                }`} />
              </div>
              <h3 className="font-poppins font-semibold text-lg text-[#2C1500] mb-2">{confirmDialog.title}</h3>
              <p className="text-sm text-[#2C1500]/60 leading-relaxed mb-6">{confirmDialog.message}</p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={closeConfirm}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-[#2C1500]/70 bg-[#F4F1ED] hover:bg-[#eae5dd] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDialog.onConfirm}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors ${
                    confirmDialog.variant === "danger" ? "bg-red-500 hover:bg-red-600" :
                    confirmDialog.variant === "warning" ? "bg-[#C17A2A] hover:bg-[#A8671F]" : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold tracking-wider text-[#2C1500]/40 uppercase">{label}</p>
          <p className="font-poppins text-xl sm:text-2xl font-bold text-[#2C1500]">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <p className="text-xs text-[#2C1500]/40 mt-3">{sub}</p>
    </div>
  );
}
