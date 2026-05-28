"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Edit3, Trash2, Search, ShoppingCart, Banknote, Landmark, CreditCard } from "lucide-react";
import { apiFetch } from "@/lib/api";
import {
  Card,
  SectionHeading,
  Button,
  Pill,
  Modal,
  Input,
  Textarea,
  ConfirmDialog,
  EmptyState,
} from "../_components/primitives";
import { PAYMENT_TONES, type Sale, type PaymentMethod } from "../_data/types";

const rs = (n: number) => `Rs. ${(n || 0).toLocaleString()}`;

const PM_ICONS: Record<PaymentMethod, React.ComponentType<{ className?: string }>> = {
  CASH: Banknote,
  ONLINE: Landmark,
  CREDIT: CreditCard,
};

export default function SalesPage({ onToast }: { onToast: (msg: string) => void }) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | PaymentMethod>("ALL");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Sale | null>(null);
  const [confirmDel, setConfirmDel] = useState<Sale | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    customer: "",
    phone: "",
    product: "",
    quantity: "1",
    amount: "",
    paymentMethod: "CASH" as PaymentMethod,
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const fetchSales = useCallback(async (p: number, pm: "ALL" | PaymentMethod) => {
    setLoading(true);
    const qs = new URLSearchParams({ page: String(p), limit: "10" });
    if (pm !== "ALL") qs.set("paymentMethod", pm);
    const res = await apiFetch(`/sales?${qs.toString()}`);
    if (res.ok) {
      const data = await res.json();
      setSales(data.sales || []);
      setTotalPages(data.totalPages || 1);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSales(page, filter);
  }, [page, filter, fetchSales]);

  const openForm = (sale?: Sale) => {
    if (sale) {
      setEditing(sale);
      setForm({
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
      setEditing(null);
      setForm({
        customer: "",
        phone: "",
        product: "",
        quantity: "1",
        amount: "",
        paymentMethod: "CASH",
        description: "",
        date: new Date().toISOString().split("T")[0],
      });
    }
    setFormOpen(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = { ...form, quantity: Number(form.quantity), amount: Number(form.amount) };
    const res = editing
      ? await apiFetch(`/sales/${editing.id}`, { method: "PATCH", body: JSON.stringify(payload) })
      : await apiFetch("/sales", { method: "POST", body: JSON.stringify(payload) });
    setSubmitting(false);
    if (res.ok) {
      onToast(editing ? "Sale updated" : "Sale recorded");
      setFormOpen(false);
      setPage(1);
      fetchSales(1, filter);
    } else {
      onToast("Save failed");
    }
  };

  const remove = async () => {
    if (!confirmDel) return;
    const id = confirmDel.id;
    setConfirmDel(null);
    const res = await apiFetch(`/sales/${id}`, { method: "DELETE" });
    if (res.ok) {
      onToast("Sale deleted");
      fetchSales(page, filter);
    } else {
      onToast("Delete failed");
    }
  };

  const filtered = useMemo(() => {
    if (!search) return sales;
    const q = search.toLowerCase();
    return sales.filter((s) => s.customer.toLowerCase().includes(q) || s.product.toLowerCase().includes(q));
  }, [sales, search]);

  const totals = useMemo(() => {
    const cash = sales.filter((s) => s.paymentMethod === "CASH").reduce((s, x) => s + x.amount, 0);
    const online = sales.filter((s) => s.paymentMethod === "ONLINE").reduce((s, x) => s + x.amount, 0);
    const credit = sales.filter((s) => s.paymentMethod === "CREDIT").reduce((s, x) => s + x.amount, 0);
    return { cash, online, credit, all: cash + online + credit };
  }, [sales]);

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Daily Log"
        title="Sales"
        description="Every in-store sale, repeat order, and walk-in — captured here."
        action={
          <Button onClick={() => openForm()}>
            <Plus className="w-4 h-4" /> Record Sale
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPI label="Page Total" value={rs(totals.all)} />
        <KPI label="Cash" value={rs(totals.cash)} tone="emerald" icon={Banknote} />
        <KPI label="Online" value={rs(totals.online)} tone="sky" icon={Landmark} />
        <KPI label="Credit" value={rs(totals.credit)} tone="orange" icon={CreditCard} />
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
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {(["ALL", "CASH", "ONLINE", "CREDIT"] as const).map((p) => (
            <button
              key={p}
              onClick={() => {
                setFilter(p);
                setPage(1);
              }}
              className={`h-9 px-3.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                filter === p ? "bg-[#1A1410] text-[#FAF6EE]" : "bg-[#FAF6EE] text-[#1A1410]/55 hover:text-[#1A1410]"
              }`}
            >
              {p === "ALL" ? "All" : p.charAt(0) + p.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </Card>

      <Card className="hidden md:block overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#FAF6EE] border-b border-[#1A1410]/6">
                <Th>Customer</Th>
                <Th>Product</Th>
                <Th className="text-center">Qty</Th>
                <Th className="text-right">Amount</Th>
                <Th>Payment</Th>
                <Th>Date</Th>
                <Th>By</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((sale) => (
                <motion.tr
                  key={sale.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-[#1A1410]/5 last:border-0 hover:bg-[#FAF6EE]/50 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center text-emerald-700 text-xs font-semibold">
                        {sale.customer.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-[#1A1410] truncate">{sale.customer}</p>
                        {sale.phone && <p className="text-[11px] text-[#1A1410]/45">{sale.phone}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[#1A1410]/75">{sale.product}</td>
                  <td className="px-5 py-4 text-center text-[#1A1410]/75">×{sale.quantity}</td>
                  <td className="px-5 py-4 text-right font-semibold text-emerald-600 tabular-nums">{rs(sale.amount)}</td>
                  <td className="px-5 py-4"><Pill tone={PAYMENT_TONES[sale.paymentMethod]}>{sale.paymentMethod}</Pill></td>
                  <td className="px-5 py-4 text-[#1A1410]/45 text-xs">{new Date(sale.date).toLocaleDateString()}</td>
                  <td className="px-5 py-4 text-[#1A1410]/55 text-xs">
                    {sale.createdByAdmin?.name || "—"}
                    {sale.updatedByAdmin && <p className="text-[10px] text-[#1A1410]/30">edited by {sale.updatedByAdmin.name}</p>}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openForm(sale)}
                        className="h-8 w-8 rounded-lg bg-[#FAF6EE] text-[#1A1410]/60 hover:text-[#B8763E] hover:bg-[#B8763E]/10 transition-colors flex items-center justify-center"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setConfirmDel(sale)}
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
        {!loading && filtered.length === 0 && <EmptyState icon={ShoppingCart} title="No sales found" message="Try a different filter or add one." />}
        {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPage={setPage} />}
      </Card>

      <div className="md:hidden space-y-3">
        {loading ? (
          <Card><div className="p-6 text-center text-sm text-[#1A1410]/40">Loading…</div></Card>
        ) : filtered.length === 0 ? (
          <Card><EmptyState icon={ShoppingCart} title="No sales yet" message="Tap + to record one." /></Card>
        ) : (
          filtered.map((sale) => {
            const Icon = PM_ICONS[sale.paymentMethod];
            return (
              <motion.div key={sale.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center text-emerald-700 text-xs font-semibold shrink-0">
                      {sale.customer.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-[#1A1410] truncate">{sale.customer}</p>
                        <p className="font-semibold text-emerald-600 tabular-nums text-sm shrink-0">{rs(sale.amount)}</p>
                      </div>
                      <p className="text-xs text-[#1A1410]/50 truncate mt-0.5">{sale.product} · ×{sale.quantity}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Icon className="w-3.5 h-3.5 text-[#1A1410]/40" />
                          <Pill tone={PAYMENT_TONES[sale.paymentMethod]}>{sale.paymentMethod}</Pill>
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => openForm(sale)} className="h-8 w-8 rounded-lg bg-[#FAF6EE] text-[#1A1410]/60 flex items-center justify-center">
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setConfirmDel(sale)} className="h-8 w-8 rounded-lg bg-[#FAF6EE] text-rose-500 flex items-center justify-center">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })
        )}
        {totalPages > 1 && (
          <Card>
            <Pagination page={page} totalPages={totalPages} onPage={setPage} />
          </Card>
        )}
      </div>

      <button
        onClick={() => openForm()}
        className="md:hidden fixed bottom-24 right-4 h-14 w-14 rounded-2xl bg-gradient-to-br from-[#B8763E] to-[#9A5F2E] text-white shadow-2xl shadow-[#B8763E]/30 flex items-center justify-center z-20 active:scale-95 transition-transform"
      >
        <Plus className="w-5 h-5" />
      </button>

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? "Edit Sale" : "Record New Sale"}>
        <form onSubmit={submit} className="space-y-4">
          <Input
            label="Customer"
            required
            placeholder="Customer name"
            value={form.customer}
            onChange={(e) => setForm({ ...form, customer: e.target.value })}
          />
          <Input
            label="Phone (optional)"
            placeholder="98XXXXXXXX"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <Input
            label="Product"
            required
            placeholder="Product name"
            value={form.product}
            onChange={(e) => setForm({ ...form, product: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Quantity"
              type="number"
              min="1"
              required
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            />
            <Input
              label="Amount (Rs.)"
              type="number"
              required
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
          </div>
          <div>
            <label className="text-[11px] tracking-[0.14em] uppercase text-[#1A1410]/50 font-medium block mb-1.5">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["CASH", "ONLINE", "CREDIT"] as PaymentMethod[]).map((m) => {
                const active = form.paymentMethod === m;
                const Icon = PM_ICONS[m];
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setForm({ ...form, paymentMethod: m })}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs font-medium transition-all ${
                      active ? "bg-[#1A1410] text-[#FAF6EE] shadow-sm" : "bg-[#FAF6EE] text-[#1A1410]/55 hover:text-[#1A1410]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {m}
                  </button>
                );
              })}
            </div>
          </div>
          <Textarea
            label="Note (optional)"
            rows={2}
            placeholder="Anything to remember…"
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
              {submitting ? "Saving…" : editing ? "Update Sale" : "Record Sale"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirmDel}
        onClose={() => setConfirmDel(null)}
        onConfirm={remove}
        title="Delete sale?"
        message={`Remove the sale to ${confirmDel?.customer}? This cannot be undone.`}
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

function KPI({
  label,
  value,
  tone = "default",
  icon: Icon,
}: {
  label: string;
  value: string;
  tone?: "emerald" | "sky" | "orange" | "default";
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const tones = {
    emerald: "text-emerald-600",
    sky: "text-sky-600",
    orange: "text-[#C4623E]",
    default: "text-[#1A1410]",
  };
  return (
    <Card className="p-4 sm:p-5" hover>
      <div className="flex items-start justify-between">
        <p className="text-[11px] tracking-[0.18em] uppercase text-[#1A1410]/45 font-medium">{label}</p>
        {Icon && <Icon className={`w-4 h-4 ${tones[tone]}`} />}
      </div>
      <p className={`font-serif text-xl sm:text-2xl mt-1.5 tabular-nums tracking-tight ${tones[tone]}`}>{value}</p>
    </Card>
  );
}
