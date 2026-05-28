"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Plus, Trash2, Search, Receipt, Calendar, Tag } from "lucide-react";
import { apiFetch } from "@/lib/api";
import {
  Card,
  SectionHeading,
  Button,
  Modal,
  Input,
  Select,
  Textarea,
  ConfirmDialog,
  EmptyState,
} from "../_components/primitives";
import { EXPENSE_CATEGORIES, CATEGORY_COLORS, type Expense } from "../_data/types";

const rs = (n: number) => `Rs. ${(n || 0).toLocaleString()}`;

export default function ExpensesPage({ onToast }: { onToast: (msg: string) => void }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [confirmDel, setConfirmDel] = useState<Expense | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: EXPENSE_CATEGORIES[0],
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const fetchExpenses = useCallback(async (p: number, cat: string) => {
    setLoading(true);
    const qs = new URLSearchParams({ page: String(p), limit: "10" });
    if (cat !== "ALL") qs.set("category", cat);
    const res = await apiFetch(`/expenses?${qs.toString()}`);
    if (res.ok) {
      const data = await res.json();
      setExpenses(data.expenses || []);
      setTotalPages(data.totalPages || 1);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchExpenses(page, category);
  }, [page, category, fetchExpenses]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await apiFetch("/expenses", {
      method: "POST",
      body: JSON.stringify({ ...form, amount: Number(form.amount) }),
    });
    setSubmitting(false);
    if (res.ok) {
      onToast("Expense added");
      setFormOpen(false);
      setForm({
        title: "",
        amount: "",
        category: EXPENSE_CATEGORIES[0],
        description: "",
        date: new Date().toISOString().split("T")[0],
      });
      setPage(1);
      fetchExpenses(1, category);
    } else {
      onToast("Save failed");
    }
  };

  const remove = async () => {
    if (!confirmDel) return;
    const id = confirmDel.id;
    setConfirmDel(null);
    const res = await apiFetch(`/expenses/${id}`, { method: "DELETE" });
    if (res.ok) {
      onToast("Expense deleted");
      fetchExpenses(page, category);
    } else {
      onToast("Delete failed");
    }
  };

  const filtered = useMemo(() => {
    if (!search) return expenses;
    const q = search.toLowerCase();
    return expenses.filter((e) => e.title.toLowerCase().includes(q) || e.category.toLowerCase().includes(q));
  }, [expenses, search]);

  const breakdown = useMemo(() => {
    const byCat: Record<string, number> = {};
    expenses.forEach((e) => {
      byCat[e.category] = (byCat[e.category] || 0) + e.amount;
    });
    return Object.entries(byCat)
      .map(([name, value]) => ({ name, value, color: CATEGORY_COLORS[name] || "#1A1410" }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  const pageTotal = expenses.reduce((s, x) => s + x.amount, 0);
  const thisMonth = expenses
    .filter((e) => new Date(e.date).getMonth() === new Date().getMonth())
    .reduce((s, x) => s + x.amount, 0);

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Outflow"
        title="Expenses"
        description="Materials, packaging, logistics — track every rupee leaving the workshop."
        action={
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="w-4 h-4" /> Add Expense
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        <Card className="p-5 sm:p-6 lg:col-span-1">
          <p className="text-[11px] tracking-[0.18em] uppercase text-[#1A1410]/45 font-medium">Page Total</p>
          <p className="font-serif text-3xl sm:text-4xl text-[#1A1410] mt-2 tabular-nums">{rs(pageTotal)}</p>
          <p className="text-xs text-[#1A1410]/45 mt-2">From the {expenses.length} expenses shown</p>
          <div className="mt-5 pt-5 border-t border-[#1A1410]/5">
            <p className="text-[11px] tracking-[0.18em] uppercase text-[#1A1410]/45 font-medium">This Month (page)</p>
            <p className="font-serif text-xl sm:text-2xl text-rose-500 mt-1 tabular-nums">{rs(thisMonth)}</p>
          </div>
        </Card>

        <Card className="p-5 sm:p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[11px] tracking-[0.18em] uppercase text-[#B8763E] font-medium">Categories</p>
              <h3 className="font-serif text-xl text-[#1A1410] mt-1">Spend Breakdown</h3>
            </div>
          </div>
          {breakdown.length === 0 ? (
            <p className="text-sm text-[#1A1410]/40 py-8 text-center">No data yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
              <div className="h-44 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={breakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {breakdown.map((b, i) => (
                        <Cell key={i} fill={b.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v) => rs(Number(v))}
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        border: "1px solid rgba(26,20,16,0.08)",
                        borderRadius: 10,
                        fontSize: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {breakdown.map((b) => (
                  <div key={b.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: b.color }} />
                      <span className="text-[#1A1410]/70 truncate">{b.name}</span>
                    </div>
                    <span className="font-medium text-[#1A1410] tabular-nums shrink-0">{rs(b.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      <Card className="p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1410]/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search this page…"
            className="w-full h-10 pl-10 pr-3 rounded-xl bg-[#FAF6EE] border border-[#1A1410]/8 text-sm placeholder:text-[#1A1410]/30 focus:outline-none focus:border-[#B8763E]/50 focus:ring-2 focus:ring-[#B8763E]/15 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1">
          <Tag className="w-4 h-4 text-[#1A1410]/40 shrink-0" />
          {["ALL", ...EXPENSE_CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => {
                setCategory(c);
                setPage(1);
              }}
              className={`h-9 px-3 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                category === c ? "bg-[#1A1410] text-[#FAF6EE]" : "bg-[#FAF6EE] text-[#1A1410]/55 hover:text-[#1A1410]"
              }`}
            >
              {c === "ALL" ? "All" : c}
            </button>
          ))}
        </div>
      </Card>

      <Card className="hidden md:block overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#FAF6EE] border-b border-[#1A1410]/6">
                <Th>Title</Th>
                <Th>Category</Th>
                <Th className="text-right">Amount</Th>
                <Th>Date</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((exp) => (
                <motion.tr
                  key={exp.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-[#1A1410]/5 last:border-0 hover:bg-[#FAF6EE]/50 transition-colors"
                >
                  <td className="px-5 py-4">
                    <p className="font-medium text-[#1A1410]">{exp.title}</p>
                    {exp.description && <p className="text-[11px] text-[#1A1410]/45 mt-0.5">{exp.description}</p>}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
                      style={{
                        backgroundColor: `${CATEGORY_COLORS[exp.category] || "#1A1410"}15`,
                        color: CATEGORY_COLORS[exp.category] || "#1A1410",
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: CATEGORY_COLORS[exp.category] || "#1A1410" }}
                      />
                      {exp.category}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right font-semibold text-rose-500 tabular-nums">−{rs(exp.amount)}</td>
                  <td className="px-5 py-4 text-[#1A1410]/45 text-xs">{new Date(exp.date).toLocaleDateString()}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => setConfirmDel(exp)}
                        className="h-8 w-8 rounded-lg bg-[#FAF6EE] text-[#1A1410]/60 hover:text-rose-500 hover:bg-rose-50 transition-colors flex items-center justify-center"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {loading && <div className="p-8 text-center text-sm text-[#1A1410]/40">Loading…</div>}
        {!loading && filtered.length === 0 && <EmptyState icon={Receipt} title="No expenses" message="Add your first expense to get started." />}
        {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPage={setPage} />}
      </Card>

      <div className="md:hidden space-y-3">
        {loading ? (
          <Card><div className="p-6 text-center text-sm text-[#1A1410]/40">Loading…</div></Card>
        ) : filtered.length === 0 ? (
          <Card><EmptyState icon={Receipt} title="No expenses" message="Tap + to record one." /></Card>
        ) : (
          filtered.map((exp) => (
            <motion.div key={exp.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-[#1A1410] truncate">{exp.title}</p>
                    {exp.description && <p className="text-[11px] text-[#1A1410]/50 truncate mt-0.5">{exp.description}</p>}
                    <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px]">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium"
                        style={{
                          backgroundColor: `${CATEGORY_COLORS[exp.category] || "#1A1410"}15`,
                          color: CATEGORY_COLORS[exp.category] || "#1A1410",
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[exp.category] || "#1A1410" }} />
                        {exp.category}
                      </span>
                      <span className="text-[#1A1410]/45 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {new Date(exp.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="font-semibold text-rose-500 tabular-nums text-sm">−{rs(exp.amount)}</p>
                    <button
                      onClick={() => setConfirmDel(exp)}
                      className="h-8 w-8 rounded-lg bg-[#FAF6EE] text-rose-500 flex items-center justify-center"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
        {totalPages > 1 && (
          <Card>
            <Pagination page={page} totalPages={totalPages} onPage={setPage} />
          </Card>
        )}
      </div>

      <button
        onClick={() => setFormOpen(true)}
        className="md:hidden fixed bottom-24 right-4 h-14 w-14 rounded-2xl bg-gradient-to-br from-[#B8763E] to-[#9A5F2E] text-white shadow-2xl shadow-[#B8763E]/30 flex items-center justify-center z-20 active:scale-95 transition-transform"
      >
        <Plus className="w-5 h-5" />
      </button>

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title="New Expense">
        <form onSubmit={submit} className="space-y-4">
          <Input
            label="Title"
            required
            placeholder="e.g. Sugarcane batch — Sankhuwasabha"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Amount (Rs.)"
              type="number"
              required
              placeholder="0"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
            <Select
              label="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          </div>
          <Textarea
            label="Description (optional)"
            rows={2}
            placeholder="Any notes…"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <Input
            label="Date"
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <div className="flex gap-2.5 pt-2">
            <Button variant="secondary" type="button" onClick={() => setFormOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={submitting}>
              {submitting ? "Saving…" : "Add Expense"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirmDel}
        onClose={() => setConfirmDel(null)}
        onConfirm={remove}
        title="Delete expense?"
        message={`Remove "${confirmDel?.title}"? This cannot be undone.`}
        variant="danger"
        confirmLabel="Delete"
      />
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`text-left px-5 py-3 font-medium text-[11px] tracking-[0.14em] uppercase text-[#1A1410]/50 ${className}`}>
      {children}
    </th>
  );
}

function Pagination({ page, totalPages, onPage }: { page: number; totalPages: number; onPage: (p: number) => void }) {
  return (
    <div className="flex items-center justify-between gap-2 p-4 border-t border-[#1A1410]/5">
      <button
        onClick={() => onPage(Math.max(1, page - 1))}
        disabled={page === 1}
        className="h-9 px-3 rounded-lg text-xs font-medium bg-[#FAF6EE] text-[#1A1410]/70 disabled:opacity-40 hover:bg-[#1A1410]/5 transition-colors"
      >
        Previous
      </button>
      <span className="text-xs text-[#1A1410]/50">
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => onPage(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="h-9 px-3 rounded-lg text-xs font-medium bg-[#FAF6EE] text-[#1A1410]/70 disabled:opacity-40 hover:bg-[#1A1410]/5 transition-colors"
      >
        Next
      </button>
    </div>
  );
}
