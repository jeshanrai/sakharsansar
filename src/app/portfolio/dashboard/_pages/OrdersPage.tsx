"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Download, ChevronDown, ClipboardList, Phone, MapPin, Calendar, ArrowRightLeft, CheckCircle2, Banknote, Landmark, CreditCard, QrCode, XCircle, Mail } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { orderRef } from "@/lib/order-pricing";
import { Card, SectionHeading, Button, Pill, EmptyState, Modal } from "../_components/primitives";
import { STATUS_TONES, type Order, type OrderStatus, type PaymentMethod } from "../_data/types";
import { useSeason, errorText } from "../_data/season";

const rs = (n: number) => `Rs. ${(n || 0).toLocaleString()}`;
const STATUSES: ("ALL" | OrderStatus)[] = ["ALL", "PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];
const PM_ICONS: Record<PaymentMethod, React.ComponentType<{ className?: string }>> = {
  CASH: Banknote,
  ONLINE: Landmark,
  CREDIT: CreditCard,
};

export default function OrdersPage({ onToast }: { onToast: (msg: string) => void }) {
  const { selected } = useSeason();
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | OrderStatus>("ALL");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [moving, setMoving] = useState<Order | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [submitting, setSubmitting] = useState(false);
  const [reviewing, setReviewing] = useState<Order | null>(null);
  const [proof, setProof] = useState<string | null>(null);
  const [proofLoading, setProofLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const fetchOrders = useCallback(async (p: number, status: "ALL" | OrderStatus) => {
    setLoading(true);
    const qs = new URLSearchParams({ page: String(p), limit: "10" });
    if (status !== "ALL") qs.set("status", status);
    qs.set("season", String(selected));
    const res = await apiFetch(`/orders?${qs.toString()}`);
    if (res.ok) {
      const data = await res.json();
      setOrders(data.orders || []);
      setTotalPages(data.totalPages || 1);
    }
    setLoading(false);
  }, [selected]);

  useEffect(() => {
    fetchOrders(page, filter);
  }, [page, filter, fetchOrders]);

  const updateStatus = async (id: string, status: OrderStatus, prev: OrderStatus) => {
    if (status === prev) return;
    // optimistic
    setOrders((cur) => cur.map((o) => (o.id === id ? { ...o, status } : o)));
    const res = await apiFetch(`/orders/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
    if (res.ok) {
      onToast(`Order updated to ${status.toLowerCase()}`);
    } else {
      setOrders((cur) => cur.map((o) => (o.id === id ? { ...o, status: prev } : o)));
      onToast("Update failed");
    }
  };

  const openMove = (order: Order) => {
    setPaymentMethod(order.paymentMethod === "FONEPAY" ? "ONLINE" : "CASH");
    setMoving(order);
  };

  const openReview = async (order: Order) => {
    setReviewing(order);
    setProof(null);
    if (!order.hasProof) return;
    setProofLoading(true);
    const res = await apiFetch(`/orders/${order.id}/proof`);
    if (res.ok) setProof((await res.json()).proof ?? null);
    setProofLoading(false);
  };

  const reviewPayment = async (action: "verify" | "reject") => {
    if (!reviewing) return;
    setVerifying(true);
    const res = await apiFetch(`/orders/${reviewing.id}/payment`, { method: "PATCH", body: JSON.stringify({ action }) });
    setVerifying(false);
    if (res.ok) {
      const updated = await res.json();
      setOrders((cur) => cur.map((o) => (o.id === reviewing.id ? { ...o, ...updated } : o)));
      onToast(
        action === "verify"
          ? `Payment verified · #${orderRef(reviewing.id)}${reviewing.email ? " · customer emailed" : ""}`
          : `Payment rejected · #${orderRef(reviewing.id)}${reviewing.email ? " · customer emailed" : ""}`,
      );
      setReviewing(null);
    } else {
      onToast(await errorText(res, "Could not update payment"));
    }
  };

  const moveToSales = async () => {
    if (!moving) return;
    setSubmitting(true);
    const res = await apiFetch(`/orders/${moving.id}/sale`, {
      method: "POST",
      body: JSON.stringify({ paymentMethod }),
    });
    setSubmitting(false);
    if (res.ok) {
      const sale = await res.json();
      setOrders((cur) => cur.map((o) => (o.id === moving.id ? { ...o, saleId: sale.id } : o)));
      onToast(`Order #${orderRef(moving.id)} moved to sales`);
      setMoving(null);
    } else {
      onToast(await errorText(res, "Could not move to sales"));
    }
  };

  const filtered = useMemo(() => {
    if (!search) return orders;
    const q = search.toLowerCase();
    return orders.filter(
      (o) =>
        o.customer.toLowerCase().includes(q) ||
        o.product.toLowerCase().includes(q) ||
        o.phone.includes(search) ||
        orderRef(o.id).toLowerCase().includes(q.replace(/^#/, "")),
    );
  }, [orders, search]);

  const kpis = useMemo(() => {
    const pending = orders.filter((o) => o.status === "PENDING" || o.paymentStatus === "PENDING").length;
    const delivered = orders.filter((o) => o.status === "DELIVERED").length;
    const revenue = orders.filter((o) => o.status !== "CANCELLED").reduce((s, o) => s + o.amount, 0);
    return { pending, delivered, revenue, total: orders.length };
  }, [orders]);

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Order Book"
        title="Customer Orders"
        description="Track every order from the storefront in one place. Update status in a tap."
        action={
          <div className="flex gap-2">
            <Button variant="secondary" size="md">
              <Download className="w-4 h-4" /> Export
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPI label="On this page" value={String(kpis.total)} />
        <KPI label="Needs action" value={String(kpis.pending)} tone="amber" />
        <KPI label="Delivered" value={String(kpis.delivered)} tone="emerald" />
        <KPI label="Page Revenue" value={rs(kpis.revenue)} />
      </div>

      <Card className="p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1410]/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search this page by customer, product, or phone…"
            className="w-full h-10 pl-10 pr-3 rounded-xl bg-[#FAF6EE] border border-[#1A1410]/8 text-sm placeholder:text-[#1A1410]/30 focus:outline-none focus:border-[#B8763E]/50 focus:ring-2 focus:ring-[#B8763E]/15 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1">
          <Filter className="w-4 h-4 text-[#1A1410]/40 shrink-0" />
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => {
                setFilter(s);
                setPage(1);
              }}
              className={`h-9 px-3 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                filter === s ? "bg-[#1A1410] text-[#FAF6EE]" : "bg-[#FAF6EE] text-[#1A1410]/55 hover:text-[#1A1410]"
              }`}
            >
              {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
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
                <Th>Status</Th>
                <Th>Date</Th>
                <Th>Address</Th>
                <Th className="text-right">Sales</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-[#1A1410]/5 last:border-0 hover:bg-[#FAF6EE]/50 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#E8A857]/20 to-[#B8763E]/20 flex items-center justify-center text-[#B8763E] text-xs font-semibold">
                        {order.customer.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-[#1A1410] truncate">{order.customer}</p>
                        <p className="text-[11px] text-[#1A1410]/45">#{orderRef(order.id)} · {order.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[#1A1410]/75">{order.product}</td>
                  <td className="px-5 py-4 text-center text-[#1A1410]/75">×{order.quantity}</td>
                  <td className="px-5 py-4 text-right font-semibold text-[#1A1410] tabular-nums">{rs(order.amount)}</td>
                  <td className="px-5 py-4">
                    <PaymentBadge order={order} onReview={openReview} />
                  </td>
                  <td className="px-5 py-4">
                    <StatusSelect order={order} onChange={updateStatus} />
                  </td>
                  <td className="px-5 py-4 text-[#1A1410]/45 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-4 text-[#1A1410]/45 text-xs max-w-[160px] truncate">{order.address}</td>
                  <td className="px-5 py-4 text-right">
                    <MoveToSales order={order} onMove={openMove} onReview={openReview} />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && filtered.length === 0 && <EmptyState icon={ClipboardList} title="No orders found" message="Try a different filter." />}
        {loading && <div className="p-8 text-center text-sm text-[#1A1410]/40">Loading…</div>}

        {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPage={setPage} />}
      </Card>

      <div className="md:hidden space-y-3">
        {loading ? (
          <Card><div className="p-6 text-center text-sm text-[#1A1410]/40">Loading…</div></Card>
        ) : filtered.length === 0 ? (
          <Card><EmptyState icon={ClipboardList} title="No orders found" message="Try a different filter." /></Card>
        ) : (
          filtered.map((order) => (
            <motion.div key={order.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#E8A857]/20 to-[#B8763E]/20 flex items-center justify-center text-[#B8763E] text-xs font-semibold shrink-0">
                      {order.customer.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-[#1A1410] truncate">{order.customer}</p>
                      <p className="text-xs text-[#1A1410]/50 truncate">#{orderRef(order.id)} · {order.product} · ×{order.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-[#1A1410] tabular-nums text-sm shrink-0">{rs(order.amount)}</p>
                </div>
                <div className="mt-3 pt-3 border-t border-[#1A1410]/5 grid grid-cols-2 gap-2 text-xs text-[#1A1410]/55">
                  <div className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> {order.phone}</div>
                  <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {new Date(order.createdAt).toLocaleDateString()}</div>
                  <div className="flex items-center gap-1.5 col-span-2"><MapPin className="w-3 h-3" /> <span className="truncate">{order.address}</span></div>
                  <div className="col-span-2"><PaymentBadge order={order} onReview={openReview} /></div>
                </div>
                <div className="mt-3 flex gap-2 items-center">
                  <div className="flex-1">
                    <StatusSelect order={order} onChange={updateStatus} fullWidth />
                  </div>
                  <MoveToSales order={order} onMove={openMove} onReview={openReview} />
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

      <Modal open={!!reviewing} onClose={() => setReviewing(null)} title="Fonepay Payment" size="sm">
        {reviewing && (
          <div className="space-y-4">
            <div className="rounded-xl bg-[#FAF6EE] p-4 text-sm space-y-1.5">
              <div className="flex justify-between">
                <span className="font-medium text-[#1A1410]">{reviewing.customer}</span>
                <span className="font-semibold text-[#1A1410] tabular-nums">{rs(reviewing.amount)}</span>
              </div>
              <p className="text-xs text-[#1A1410]/50">#{orderRef(reviewing.id)} · {reviewing.phone} · {new Date(reviewing.createdAt).toLocaleString()}</p>
              <p className="text-xs text-[#1A1410]/70">
                Transaction ID: <span className="font-mono font-semibold text-[#1A1410]">{reviewing.paymentRef || "not given"}</span>
              </p>
              {reviewing.email && (
                <p className="text-xs text-[#1A1410]/55 flex items-center gap-1.5"><Mail className="w-3 h-3" /> {reviewing.email}</p>
              )}
            </div>

            {reviewing.hasProof && (
              <div className="rounded-xl border border-[#1A1410]/8 overflow-hidden bg-[#FAF6EE]">
                {proofLoading ? (
                  <div className="p-6 text-center text-xs text-[#1A1410]/40">Loading screenshot…</div>
                ) : proof ? (
                  <a href={proof} target="_blank" rel="noreferrer" title="Open full size">
                    {/* eslint-disable-next-line @next/next/no-img-element -- data: URL from the API */}
                    <img src={proof} alt="Payment screenshot" className="w-full max-h-[50vh] object-contain" />
                  </a>
                ) : (
                  <div className="p-6 text-center text-xs text-[#1A1410]/40">Couldn&apos;t load the screenshot.</div>
                )}
              </div>
            )}

            <p className="text-xs text-[#1A1410]/50">
              Match the amount ({rs(reviewing.amount)}) and transaction ID against the Fonepay merchant app or bank statement
              (terminal 2222090020996830) before verifying. {reviewing.email ? "The customer is emailed either way." : "No customer email on this order: call them."}
            </p>

            {reviewing.paymentStatus !== "PENDING" && (
              <p className="text-xs font-medium text-[#1A1410]/70">Currently: {reviewing.paymentStatus?.toLowerCase()}</p>
            )}

            <div className="flex gap-2.5 pt-1">
              <Button
                variant="secondary"
                type="button"
                onClick={() => reviewPayment("reject")}
                className="flex-1"
                disabled={verifying || reviewing.paymentStatus === "REJECTED"}
              >
                <XCircle className="w-4 h-4" /> Not received
              </Button>
              <Button
                type="button"
                onClick={() => reviewPayment("verify")}
                className="flex-1"
                disabled={verifying || reviewing.paymentStatus === "VERIFIED"}
              >
                <CheckCircle2 className="w-4 h-4" /> {verifying ? "Saving…" : "Verify payment"}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!moving} onClose={() => setMoving(null)} title="Move to Sales" size="sm">
        {moving && (
          <div className="space-y-4">
            <div className="rounded-xl bg-[#FAF6EE] p-4 text-sm">
              <p className="font-medium text-[#1A1410]">{moving.customer}</p>
              <p className="text-xs text-[#1A1410]/50 mt-0.5">#{orderRef(moving.id)} · {moving.phone}</p>
              <div className="flex justify-between mt-3 text-[#1A1410]/75">
                <span>{moving.product} ×{moving.quantity}</span>
                <span className="font-semibold text-[#1A1410] tabular-nums">{rs(moving.amount)}</span>
              </div>
            </div>
            <div>
              <label className="text-[11px] tracking-[0.14em] uppercase text-[#1A1410]/50 font-medium block mb-1.5">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["CASH", "ONLINE", "CREDIT"] as PaymentMethod[]).map((m) => {
                  const Icon = PM_ICONS[m];
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMethod(m)}
                      className={`flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs font-medium transition-all ${
                        paymentMethod === m ? "bg-[#1A1410] text-[#FAF6EE] shadow-sm" : "bg-[#FAF6EE] text-[#1A1410]/55 hover:text-[#1A1410]"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {m}
                    </button>
                  );
                })}
              </div>
            </div>
            <p className="text-xs text-[#1A1410]/45">The sale is dated today and notes the order number and address.</p>
            <div className="flex gap-2.5 pt-1">
              <Button variant="secondary" type="button" onClick={() => setMoving(null)} className="flex-1">
                Cancel
              </Button>
              <Button type="button" onClick={moveToSales} className="flex-1" disabled={submitting}>
                {submitting ? "Moving…" : "Record Sale"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

const PAYMENT_TONES = {
  COD: "bg-[#1A1410]/5 text-[#1A1410]/60",
  PENDING: "bg-amber-100 text-amber-800",
  VERIFIED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-red-100 text-red-700",
} as const;

function PaymentBadge({ order, onReview }: { order: Order; onReview: (o: Order) => void }) {
  if (order.paymentMethod !== "FONEPAY") {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium whitespace-nowrap ${PAYMENT_TONES.COD}`}>
        <Banknote className="w-3 h-3" /> COD
      </span>
    );
  }
  const st = order.paymentStatus === "VERIFIED" || order.paymentStatus === "REJECTED" ? order.paymentStatus : "PENDING";
  const label = { PENDING: "Fonepay · verify", VERIFIED: "Fonepay · verified", REJECTED: "Fonepay · not found" }[st];
  return (
    <button
      type="button"
      onClick={() => onReview(order)}
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium whitespace-nowrap hover:opacity-80 transition-opacity ${PAYMENT_TONES[st]}`}
    >
      <QrCode className="w-3 h-3" /> {label}
    </button>
  );
}

function MoveToSales({ order, onMove, onReview }: { order: Order; onMove: (o: Order) => void; onReview: (o: Order) => void }) {
  if (order.saleId) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 whitespace-nowrap">
        <CheckCircle2 className="w-3.5 h-3.5" /> In sales
      </span>
    );
  }
  if (order.status === "CANCELLED") return null;
  if (order.paymentMethod === "FONEPAY" && order.paymentStatus !== "VERIFIED") {
    return (
      <Button size="sm" variant="secondary" onClick={() => onReview(order)} className="whitespace-nowrap">
        <QrCode className="w-3.5 h-3.5" /> Check payment
      </Button>
    );
  }
  return (
    <Button size="sm" variant="secondary" onClick={() => onMove(order)} className="whitespace-nowrap">
      <ArrowRightLeft className="w-3.5 h-3.5" /> Move to sales
    </Button>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`text-left px-5 py-3 font-medium text-[11px] tracking-[0.14em] uppercase text-[#1A1410]/50 ${className}`}>
      {children}
    </th>
  );
}

function StatusSelect({
  order,
  onChange,
  fullWidth,
}: {
  order: Order;
  onChange: (id: string, s: OrderStatus, prev: OrderStatus) => void;
  fullWidth?: boolean;
}) {
  const tone = STATUS_TONES[order.status];
  return (
    <div className={`relative ${fullWidth ? "w-full" : "inline-block"}`}>
      <select
        value={order.status}
        onChange={(e) => onChange(order.id, e.target.value as OrderStatus, order.status)}
        className={`appearance-none ${tone.bg} ${tone.text} font-medium text-[11px] tracking-wide rounded-full pl-3 pr-7 py-1.5 cursor-pointer outline-none ${
          fullWidth ? "w-full text-center" : ""
        }`}
      >
        {(["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"] as OrderStatus[]).map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-60" />
    </div>
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
      <div className="flex items-center gap-1">
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let n = i + 1;
          if (totalPages > 5 && page > 3) n = page - 2 + i;
          if (n > totalPages) return null;
          return (
            <button
              key={n}
              onClick={() => onPage(n)}
              className={`w-9 h-9 rounded-lg text-xs font-medium transition-all ${
                page === n ? "bg-[#1A1410] text-[#FAF6EE]" : "text-[#1A1410]/50 hover:bg-[#FAF6EE]"
              }`}
            >
              {n}
            </button>
          );
        })}
      </div>
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

function KPI({ label, value, tone = "default" }: { label: string; value: string; tone?: "amber" | "emerald" | "default" }) {
  const tones = {
    amber: "text-amber-600",
    emerald: "text-emerald-600",
    default: "text-[#1A1410]",
  };
  return (
    <Card className="p-4 sm:p-5">
      <p className="text-[11px] tracking-[0.18em] uppercase text-[#1A1410]/45 font-medium">{label}</p>
      <p className={`font-serif text-2xl sm:text-3xl mt-1.5 tabular-nums tracking-tight ${tones[tone]}`}>{value}</p>
    </Card>
  );
}
