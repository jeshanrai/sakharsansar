"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ShoppingCart,
  Receipt,
  TrendingUp,
  TrendingDown,
  Mail,
  Calendar,
  Tag,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import {
  PAYMENT_TONES,
  CATEGORY_COLORS,
  type Sale,
  type Expense,
  type UserRow,
} from "../_data/types";
import { Pill } from "./primitives";

const rs = (n: number) => `Rs. ${(n || 0).toLocaleString()}`;

const initialsOf = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

type Tab = "sales" | "expenses";

interface Props {
  user: UserRow | null;
  open: boolean;
  onClose: () => void;
}

export default function UserDetailDrawer({ user, open, onClose }: Props) {
  const [tab, setTab] = useState<Tab>("sales");
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);

  // Reset to sales tab whenever a new user is opened
  useEffect(() => {
    if (open) setTab("sales");
  }, [open, user?.id]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const loadData = useCallback(async (id: string) => {
    setLoading(true);
    setSales([]);
    setExpenses([]);
    try {
      const [sRes, eRes] = await Promise.all([
        apiFetch(`/sales?createdBy=${encodeURIComponent(id)}&limit=100`),
        apiFetch(`/expenses?createdBy=${encodeURIComponent(id)}&limit=100`),
      ]);
      if (sRes.ok) {
        const data = await sRes.json();
        setSales(data.sales || []);
      }
      if (eRes.ok) {
        const data = await eRes.json();
        setExpenses(data.expenses || []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open && user?.id) {
      loadData(user.id);
    }
  }, [open, user?.id, loadData]);

  return (
    <AnimatePresence>
      {open && user && (
        <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label={`${user.name} details`}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#1A1410]/50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
            className="absolute right-0 top-0 bottom-0 w-full sm:w-[480px] max-w-[92vw] bg-[#FAF6EE] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <header className="px-6 pt-6 pb-5 border-b border-[#1A1410]/8">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#E8A857]/25 to-[#B8763E]/25 flex items-center justify-center text-[#B8763E] font-semibold shrink-0">
                    {initialsOf(user.name)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-serif text-lg text-[#1A1410] truncate">{user.name}</h3>
                    <p className="text-[11px] text-[#1A1410]/55 flex items-center gap-1 mt-0.5 truncate">
                      <Mail className="w-3 h-3 shrink-0" />
                      {user.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="h-9 w-9 rounded-xl bg-white text-[#1A1410]/55 hover:text-[#1A1410] hover:bg-[#1A1410]/5 flex items-center justify-center shrink-0 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-emerald-50 rounded-xl p-3.5">
                  <div className="flex items-center gap-1.5 text-emerald-700">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <p className="text-[10px] tracking-[0.16em] uppercase font-medium">Sales</p>
                  </div>
                  <p className="font-serif text-xl text-emerald-700 mt-1.5 tabular-nums">{rs(user.totalSales)}</p>
                  <p className="text-[11px] text-emerald-700/60 mt-0.5">
                    {user.totalSalesCount} transactions
                  </p>
                </div>
                <div className="bg-rose-50 rounded-xl p-3.5">
                  <div className="flex items-center gap-1.5 text-rose-700">
                    <TrendingDown className="w-3.5 h-3.5" />
                    <p className="text-[10px] tracking-[0.16em] uppercase font-medium">Expenses</p>
                  </div>
                  <p className="font-serif text-xl text-rose-700 mt-1.5 tabular-nums">{rs(user.totalExpenses)}</p>
                  <p className="text-[11px] text-rose-700/60 mt-0.5">{user.totalExpensesCount} entries</p>
                </div>
              </div>

              {/* Tab toggle */}
              <div className="mt-5 inline-flex p-1 rounded-xl bg-white/70 border border-[#1A1410]/8 w-full">
                <TabButton active={tab === "sales"} onClick={() => setTab("sales")} count={user.totalSalesCount}>
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Sales
                </TabButton>
                <TabButton active={tab === "expenses"} onClick={() => setTab("expenses")} count={user.totalExpensesCount}>
                  <Receipt className="w-3.5 h-3.5" />
                  Expenses
                </TabButton>
              </div>
            </header>

            {/* List body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {loading ? (
                <LoadingList />
              ) : tab === "sales" ? (
                <SalesList sales={sales} />
              ) : (
                <ExpensesList expenses={expenses} />
              )}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ─── Tab button ─── */
function TabButton({
  active,
  onClick,
  count,
  children,
}: {
  active: boolean;
  onClick: () => void;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 inline-flex items-center justify-center gap-2 h-9 rounded-lg text-[12px] font-semibold tracking-tight transition-colors ${
        active ? "bg-[#1A1410] text-[#FAF6EE]" : "text-[#1A1410]/60 hover:text-[#1A1410]"
      }`}
    >
      {children}
      <span
        className={`text-[10px] tabular-nums ${active ? "text-[#FAF6EE]/55" : "text-[#1A1410]/35"}`}
      >
        {count}
      </span>
    </button>
  );
}

/* ─── Loading skeleton ─── */
function LoadingList() {
  return (
    <div className="space-y-2.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="h-16 rounded-xl bg-white/70 animate-pulse" />
      ))}
    </div>
  );
}

/* ─── Sales list ─── */
function SalesList({ sales }: { sales: Sale[] }) {
  if (sales.length === 0) {
    return (
      <EmptyHint icon={ShoppingCart} text="No sales recorded by this user yet." />
    );
  }
  return (
    <ul className="space-y-2.5">
      {sales.map((sale, i) => (
        <motion.li
          key={sale.id}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: Math.min(i * 0.02, 0.15) }}
          className="bg-white rounded-xl p-3.5 border border-[#1A1410]/5"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="font-medium text-[#1A1410] truncate text-sm">{sale.customer}</p>
              <p className="text-[11px] text-[#1A1410]/55 truncate mt-0.5">
                {sale.product} · ×{sale.quantity}
              </p>
              <p className="text-[10px] text-[#1A1410]/40 flex items-center gap-1 mt-1.5">
                <Calendar className="w-3 h-3" />
                {new Date(sale.date).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
              <p className="font-semibold text-emerald-600 tabular-nums text-sm">{rs(sale.amount)}</p>
              <Pill tone={PAYMENT_TONES[sale.paymentMethod]}>{sale.paymentMethod}</Pill>
            </div>
          </div>
        </motion.li>
      ))}
    </ul>
  );
}

/* ─── Expenses list ─── */
function ExpensesList({ expenses }: { expenses: Expense[] }) {
  if (expenses.length === 0) {
    return (
      <EmptyHint icon={Receipt} text="No expenses recorded by this user yet." />
    );
  }
  return (
    <ul className="space-y-2.5">
      {expenses.map((exp, i) => {
        const tone = CATEGORY_COLORS[exp.category] || "#1A1410";
        return (
          <motion.li
            key={exp.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.02, 0.15) }}
            className="bg-white rounded-xl p-3.5 border border-[#1A1410]/5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-[#1A1410] truncate text-sm">{exp.title}</p>
                {exp.description && (
                  <p className="text-[11px] text-[#1A1410]/55 truncate mt-0.5">{exp.description}</p>
                )}
                <div className="flex items-center gap-3 mt-1.5">
                  <span
                    className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide"
                    style={{ color: tone }}
                  >
                    <Tag className="w-3 h-3" />
                    {exp.category}
                  </span>
                  <span className="text-[10px] text-[#1A1410]/40 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(exp.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <p className="font-semibold text-rose-500 tabular-nums text-sm shrink-0">
                −{rs(exp.amount)}
              </p>
            </div>
          </motion.li>
        );
      })}
    </ul>
  );
}

/* ─── Empty hint ─── */
function EmptyHint({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}) {
  return (
    <div className="py-14 text-center">
      <div className="w-12 h-12 mx-auto rounded-2xl bg-white flex items-center justify-center text-[#1A1410]/30 mb-3">
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-sm text-[#1A1410]/55">{text}</p>
    </div>
  );
}
