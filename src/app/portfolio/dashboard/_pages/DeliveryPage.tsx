"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Trash2,
  Search,
  Truck,
  MapPin,
  Phone,
  Calendar,
  ChevronDown,
  Package,
  PackageCheck,
  PackageX,
  Clock,
  Hash,
  Banknote,
} from "lucide-react";
import {
  Card,
  SectionHeading,
  Button,
  Pill,
  Modal,
  Input,
  Select,
  Textarea,
  ConfirmDialog,
  EmptyState,
} from "../_components/primitives";
import { DELIVERY_TONES, COURIERS, type Delivery, type DeliveryStatus } from "../_data/types";

const rs = (n: number) => `Rs. ${(n || 0).toLocaleString()}`;
const isoDaysFromNow = (d: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + d);
  return dt.toISOString();
};

const STATUSES: DeliveryStatus[] = ["PENDING_PICKUP", "OUT_FOR_DELIVERY", "DELIVERED", "FAILED", "RETURNED"];

// Frontend-only seed. Edits stay in local state.
const SEED: Delivery[] = [
  {
    id: "dlv_1",
    trackingId: "SS-2026-0541",
    customer: "Aarav Sharma",
    phone: "9841200341",
    address: "Lazimpat, Kathmandu",
    product: "Himalayan Jaggery 1kg",
    quantity: 2,
    courier: "Pathao",
    cost: 180,
    codAmount: 1850,
    status: "OUT_FOR_DELIVERY",
    eta: isoDaysFromNow(1),
    notes: "Call before delivery",
    createdAt: isoDaysFromNow(-1),
  },
  {
    id: "dlv_2",
    trackingId: "SS-2026-0540",
    customer: "Priya Thapa",
    phone: "9802288412",
    address: "Pulchowk, Lalitpur",
    product: "Gift Box — Trio",
    quantity: 1,
    courier: "Aramex Nepal",
    cost: 250,
    codAmount: 3200,
    status: "PENDING_PICKUP",
    eta: isoDaysFromNow(2),
    notes: null,
    createdAt: isoDaysFromNow(0),
  },
  {
    id: "dlv_3",
    trackingId: "SS-2026-0539",
    customer: "Manish Dhakal",
    phone: "9843123456",
    address: "Damak, Jhapa",
    product: "Jaggery Powder 250g",
    quantity: 5,
    courier: "Janaki Cargo",
    cost: 420,
    codAmount: 2750,
    status: "DELIVERED",
    eta: isoDaysFromNow(-2),
    notes: "Confirmed by recipient",
    createdAt: isoDaysFromNow(-5),
  },
  {
    id: "dlv_4",
    trackingId: "SS-2026-0538",
    customer: "Anjali Gurung",
    phone: "9818445120",
    address: "Pokhara — Lakeside",
    product: "Himalayan Jaggery 500g",
    quantity: 3,
    courier: "Daraz Logistics",
    cost: 320,
    codAmount: 1450,
    status: "DELIVERED",
    eta: isoDaysFromNow(-4),
    notes: null,
    createdAt: isoDaysFromNow(-7),
  },
  {
    id: "dlv_5",
    trackingId: "SS-2026-0537",
    customer: "Bikash Tamang",
    phone: "9869001234",
    address: "Itahari, Sunsari",
    product: "Jaggery Cubes 200g",
    quantity: 10,
    courier: "Local Rider",
    cost: 150,
    codAmount: 2400,
    status: "FAILED",
    eta: isoDaysFromNow(-1),
    notes: "Customer unreachable, retry tomorrow",
    createdAt: isoDaysFromNow(-3),
  },
  {
    id: "dlv_6",
    trackingId: "SS-2026-0536",
    customer: "Sneha Rana",
    phone: "9805512230",
    address: "Baneshwor, Kathmandu",
    product: "Honey Jaggery Blend",
    quantity: 2,
    courier: "Pathao",
    cost: 180,
    codAmount: 1650,
    status: "RETURNED",
    eta: isoDaysFromNow(-6),
    notes: "Wrong product, returning to warehouse",
    createdAt: isoDaysFromNow(-8),
  },
  {
    id: "dlv_7",
    trackingId: "SS-2026-0542",
    customer: "Roshan Bhandari",
    phone: "9851776633",
    address: "Thamel, Kathmandu",
    product: "Himalayan Jaggery 1kg",
    quantity: 4,
    courier: "InDriver",
    cost: 220,
    codAmount: 4200,
    status: "OUT_FOR_DELIVERY",
    eta: isoDaysFromNow(0),
    notes: null,
    createdAt: isoDaysFromNow(0),
  },
];

export default function DeliveryPage({ onToast }: { onToast: (msg: string) => void }) {
  const [deliveries, setDeliveries] = useState<Delivery[]>(SEED);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | DeliveryStatus>("ALL");
  const [page, setPage] = useState(1);
  const perPage = 8;

  const [formOpen, setFormOpen] = useState(false);
  const [confirmDel, setConfirmDel] = useState<Delivery | null>(null);

  const [form, setForm] = useState({
    customer: "",
    phone: "",
    address: "",
    product: "",
    quantity: "1",
    courier: COURIERS[0],
    cost: "",
    codAmount: "",
    status: "PENDING_PICKUP" as DeliveryStatus,
    eta: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const filtered = useMemo(() => {
    return deliveries.filter((d) => {
      const fMatch = filter === "ALL" || d.status === filter;
      const sMatch =
        !search ||
        d.customer.toLowerCase().includes(search.toLowerCase()) ||
        d.trackingId.toLowerCase().includes(search.toLowerCase()) ||
        d.address.toLowerCase().includes(search.toLowerCase()) ||
        d.phone.includes(search);
      return fMatch && sMatch;
    });
  }, [deliveries, filter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  const kpis = useMemo(() => {
    const pending = deliveries.filter((d) => d.status === "PENDING_PICKUP").length;
    const inTransit = deliveries.filter((d) => d.status === "OUT_FOR_DELIVERY").length;
    const delivered = deliveries.filter((d) => d.status === "DELIVERED").length;
    const shippingSpend = deliveries.reduce((s, d) => s + d.cost, 0);
    const totalCod = deliveries.reduce((s, d) => s + (d.codAmount || 0), 0);
    const codToCollect = deliveries
      .filter((d) => d.status === "PENDING_PICKUP" || d.status === "OUT_FOR_DELIVERY")
      .reduce((s, d) => s + (d.codAmount || 0), 0);
    const codCollected = deliveries
      .filter((d) => d.status === "DELIVERED")
      .reduce((s, d) => s + (d.codAmount || 0), 0);
    return { pending, inTransit, delivered, shippingSpend, totalCod, codToCollect, codCollected, total: deliveries.length };
  }, [deliveries]);

  const updateStatus = (id: string, status: DeliveryStatus) => {
    setDeliveries((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));
    onToast(`Marked as ${DELIVERY_TONES[status].label.toLowerCase()}`);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `dlv_${Date.now()}`;
    const trackingId = `SS-2026-${String(540 + deliveries.length + 1).padStart(4, "0")}`;
    const next: Delivery = {
      id: newId,
      trackingId,
      customer: form.customer,
      phone: form.phone,
      address: form.address,
      product: form.product,
      quantity: Number(form.quantity),
      courier: form.courier,
      cost: Number(form.cost),
      codAmount: Number(form.codAmount),
      status: form.status,
      eta: new Date(form.eta).toISOString(),
      notes: form.notes || null,
      createdAt: new Date().toISOString(),
    };
    setDeliveries((prev) => [next, ...prev]);
    onToast(`Delivery ${trackingId} created`);
    setFormOpen(false);
    setForm({
      customer: "",
      phone: "",
      address: "",
      product: "",
      quantity: "1",
      courier: COURIERS[0],
      cost: "",
      codAmount: "",
      status: "PENDING_PICKUP",
      eta: new Date().toISOString().split("T")[0],
      notes: "",
    });
    setPage(1);
  };

  const remove = () => {
    if (!confirmDel) return;
    setDeliveries((prev) => prev.filter((d) => d.id !== confirmDel.id));
    onToast(`Delivery ${confirmDel.trackingId} removed`);
    setConfirmDel(null);
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Logistics"
        title="Deliveries"
        description="Track every shipment from the workshop door to the customer's hand."
        action={
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="w-4 h-4" /> New Delivery
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <KPI label="Total" value={String(kpis.total)} icon={Package} />
        <KPI label="In Transit" value={String(kpis.inTransit)} tone="sky" icon={Truck} />
        <KPI label="Delivered" value={String(kpis.delivered)} tone="emerald" icon={PackageCheck} />
        <KPI label="Shipping Spend" value={rs(kpis.shippingSpend)} icon={Hash} />
        <Card className="p-4 sm:p-5 col-span-2 lg:col-span-1 relative overflow-hidden bg-gradient-to-br from-emerald-50 to-white border-emerald-100" hover>
          <div className="flex items-start justify-between">
            <p className="text-[11px] tracking-[0.18em] uppercase text-emerald-700 font-semibold">Total COD</p>
            <Banknote className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl mt-1.5 tabular-nums tracking-tight text-emerald-700">{rs(kpis.totalCod)}</p>
          <div className="mt-3 pt-3 border-t border-emerald-100 grid grid-cols-2 gap-2">
            <div>
              <p className="text-[10px] tracking-wider uppercase text-amber-600 font-semibold">To collect</p>
              <p className="text-sm font-bold text-[#1A1410] tabular-nums mt-0.5">{rs(kpis.codToCollect)}</p>
            </div>
            <div>
              <p className="text-[10px] tracking-wider uppercase text-emerald-600 font-semibold">Collected</p>
              <p className="text-sm font-bold text-[#1A1410] tabular-nums mt-0.5">{rs(kpis.codCollected)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Active deliveries strip */}
      {kpis.inTransit > 0 && (
        <Card className="p-5 sm:p-6 bg-gradient-to-br from-sky-50 to-white border-sky-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-2xl bg-sky-500 flex items-center justify-center shadow-lg shadow-sky-500/30">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[11px] tracking-[0.18em] uppercase text-sky-700 font-semibold">On the road</p>
              <h3 className="font-serif text-lg text-[#1A1410]">{kpis.inTransit} delivery{kpis.inTransit > 1 ? "ies" : ""} in transit</h3>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {deliveries
              .filter((d) => d.status === "OUT_FOR_DELIVERY")
              .slice(0, 6)
              .map((d, i) => (
                <motion.div
                  key={d.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-white rounded-xl p-3.5 border border-sky-100"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] tracking-[0.14em] uppercase text-sky-600 font-semibold">{d.trackingId}</p>
                      <p className="font-medium text-[#1A1410] truncate mt-0.5">{d.customer}</p>
                    </div>
                    <Clock className="w-3.5 h-3.5 text-sky-500 shrink-0 mt-1" />
                  </div>
                  <p className="text-[11px] text-[#1A1410]/55 truncate mt-1.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 shrink-0" /> {d.address}
                  </p>
                  <p className="text-[11px] text-[#1A1410]/45 mt-1">
                    ETA {new Date(d.eta).toLocaleDateString()} · via {d.courier}
                  </p>
                  {d.codAmount > 0 && (
                    <div className="mt-2 pt-2 border-t border-sky-100 flex items-center justify-between">
                      <span className="text-[10px] tracking-wider uppercase font-semibold text-amber-600">Collect COD</span>
                      <span className="text-sm font-bold text-[#1A1410] tabular-nums">{rs(d.codAmount)}</span>
                    </div>
                  )}
                </motion.div>
              ))}
          </div>
        </Card>
      )}

      {/* Search + filter bar */}
      <Card className="p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1410]/30" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by tracking ID, customer, address, or phone…"
            className="w-full h-10 pl-10 pr-3 rounded-xl bg-[#FAF6EE] border border-[#1A1410]/8 text-sm placeholder:text-[#1A1410]/30 focus:outline-none focus:border-[#B8763E]/50 focus:ring-2 focus:ring-[#B8763E]/15 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1">
          {(["ALL", ...STATUSES] as const).map((s) => (
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
              {s === "ALL" ? "All" : DELIVERY_TONES[s as DeliveryStatus].label}
            </button>
          ))}
        </div>
      </Card>

      {/* Desktop table */}
      <Card className="hidden md:block overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#FAF6EE] border-b border-[#1A1410]/6">
                <Th>Tracking</Th>
                <Th>Customer</Th>
                <Th>Address</Th>
                <Th>Courier</Th>
                <Th className="text-right">Shipping</Th>
                <Th className="text-right">COD</Th>
                <Th>Status</Th>
                <Th>ETA</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((d) => (
                <motion.tr
                  key={d.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-[#1A1410]/5 last:border-0 hover:bg-[#FAF6EE]/50 transition-colors"
                >
                  <td className="px-5 py-4">
                    <p className="font-mono text-[11px] text-[#B8763E] font-semibold">{d.trackingId}</p>
                    <p className="text-[11px] text-[#1A1410]/40 mt-0.5">{d.product} · ×{d.quantity}</p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-sky-100 to-sky-50 flex items-center justify-center text-sky-700 text-xs font-semibold">
                        {d.customer.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-[#1A1410] truncate">{d.customer}</p>
                        <p className="text-[11px] text-[#1A1410]/45">{d.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[#1A1410]/70 text-xs max-w-[180px] truncate">{d.address}</td>
                  <td className="px-5 py-4 text-[#1A1410]/75 text-xs">{d.courier}</td>
                  <td className="px-5 py-4 text-right font-semibold text-[#1A1410]/75 tabular-nums">{rs(d.cost)}</td>
                  <td className="px-5 py-4 text-right tabular-nums">
                    {d.codAmount > 0 ? (
                      <div>
                        <p className={`font-semibold ${d.status === "DELIVERED" ? "text-emerald-600" : "text-[#1A1410]"}`}>
                          {rs(d.codAmount)}
                        </p>
                        <p className={`text-[10px] tracking-[0.1em] uppercase font-medium ${d.status === "DELIVERED" ? "text-emerald-600/70" : "text-amber-600"}`}>
                          {d.status === "DELIVERED" ? "Collected" : "To collect"}
                        </p>
                      </div>
                    ) : (
                      <span className="text-[11px] text-[#1A1410]/30">Prepaid</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <StatusSelect delivery={d} onChange={updateStatus} />
                  </td>
                  <td className="px-5 py-4 text-[#1A1410]/45 text-xs">{new Date(d.eta).toLocaleDateString()}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => setConfirmDel(d)}
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
        {pageItems.length === 0 && <EmptyState icon={PackageX} title="No deliveries found" message="Try a different filter or create one." />}
        {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPage={setPage} />}
      </Card>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {pageItems.length === 0 ? (
          <Card><EmptyState icon={PackageX} title="No deliveries" message="Tap + to create one." /></Card>
        ) : (
          pageItems.map((d) => (
            <motion.div key={d.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[11px] text-[#B8763E] font-semibold">{d.trackingId}</p>
                    <p className="font-medium text-[#1A1410] truncate mt-0.5">{d.customer}</p>
                    <p className="text-xs text-[#1A1410]/50 truncate">{d.product} · ×{d.quantity}</p>
                  </div>
                  <div className="text-right shrink-0">
                    {d.codAmount > 0 ? (
                      <>
                        <p className={`font-semibold tabular-nums text-sm ${d.status === "DELIVERED" ? "text-emerald-600" : "text-[#1A1410]"}`}>
                          {rs(d.codAmount)}
                        </p>
                        <p className={`text-[9px] tracking-wider uppercase font-semibold ${d.status === "DELIVERED" ? "text-emerald-600/70" : "text-amber-600"}`}>
                          COD · {d.status === "DELIVERED" ? "Collected" : "To collect"}
                        </p>
                      </>
                    ) : (
                      <p className="text-[10px] tracking-wider uppercase text-[#1A1410]/40 font-semibold">Prepaid</p>
                    )}
                    <p className="text-[10px] text-[#1A1410]/45 mt-1 tabular-nums">Ship · {rs(d.cost)}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-[#1A1410]/5 grid grid-cols-1 gap-1.5 text-xs text-[#1A1410]/55">
                  <div className="flex items-center gap-1.5"><Phone className="w-3 h-3 shrink-0" /> {d.phone}</div>
                  <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3 shrink-0" /> <span className="truncate">{d.address}</span></div>
                  <div className="flex items-center gap-1.5"><Truck className="w-3 h-3 shrink-0" /> {d.courier}</div>
                  <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3 shrink-0" /> ETA {new Date(d.eta).toLocaleDateString()}</div>
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <StatusSelect delivery={d} onChange={updateStatus} fullWidth />
                  <button
                    onClick={() => setConfirmDel(d)}
                    className="h-9 w-9 rounded-lg bg-[#FAF6EE] text-rose-500 flex items-center justify-center shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
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

      {/* Floating add */}
      <button
        onClick={() => setFormOpen(true)}
        className="md:hidden fixed bottom-24 right-4 h-14 w-14 rounded-2xl bg-gradient-to-br from-[#B8763E] to-[#9A5F2E] text-white shadow-2xl shadow-[#B8763E]/30 flex items-center justify-center z-20 active:scale-95 transition-transform"
      >
        <Plus className="w-5 h-5" />
      </button>

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title="New Delivery" size="lg">
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Customer"
              required
              placeholder="Customer name"
              value={form.customer}
              onChange={(e) => setForm({ ...form, customer: e.target.value })}
            />
            <Input
              label="Phone"
              required
              placeholder="98XXXXXXXX"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <Input
            label="Delivery Address"
            required
            placeholder="Area, City"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Product"
              required
              placeholder="Product name"
              value={form.product}
              onChange={(e) => setForm({ ...form, product: e.target.value })}
            />
            <Input
              label="Quantity"
              type="number"
              min="1"
              required
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select label="Courier" value={form.courier} onChange={(e) => setForm({ ...form, courier: e.target.value })}>
              {COURIERS.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
            <Input
              label="Shipping Cost (Rs.)"
              type="number"
              required
              placeholder="0"
              value={form.cost}
              onChange={(e) => setForm({ ...form, cost: e.target.value })}
            />
          </div>
          <Input
            label="COD Amount (Rs.) — what the courier collects"
            type="number"
            min="0"
            placeholder="0 for prepaid"
            value={form.codAmount}
            onChange={(e) => setForm({ ...form, codAmount: e.target.value })}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as DeliveryStatus })}>
              {STATUSES.map((s) => <option key={s} value={s}>{DELIVERY_TONES[s].label}</option>)}
            </Select>
            <Input
              label="ETA"
              type="date"
              value={form.eta}
              onChange={(e) => setForm({ ...form, eta: e.target.value })}
            />
          </div>
          <Textarea
            label="Notes (optional)"
            rows={2}
            placeholder="Call before delivery, gate code, etc."
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
          <div className="flex gap-2.5 pt-2">
            <Button variant="secondary" type="button" onClick={() => setFormOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Create Delivery
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirmDel}
        onClose={() => setConfirmDel(null)}
        onConfirm={remove}
        title="Remove delivery?"
        message={`Tracking ${confirmDel?.trackingId} for ${confirmDel?.customer} will be removed.`}
        variant="danger"
        confirmLabel="Remove"
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

function StatusSelect({
  delivery,
  onChange,
  fullWidth,
}: {
  delivery: Delivery;
  onChange: (id: string, s: DeliveryStatus) => void;
  fullWidth?: boolean;
}) {
  const tone = DELIVERY_TONES[delivery.status];
  return (
    <div className={`relative ${fullWidth ? "flex-1" : "inline-block"}`}>
      <select
        value={delivery.status}
        onChange={(e) => onChange(delivery.id, e.target.value as DeliveryStatus)}
        className={`appearance-none ${tone.bg} ${tone.text} font-medium text-[11px] tracking-wide rounded-full pl-3 pr-7 py-1.5 cursor-pointer outline-none ${
          fullWidth ? "w-full text-center" : ""
        }`}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {DELIVERY_TONES[s].label}
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
  tone?: "sky" | "emerald" | "default";
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const tones = {
    sky: "text-sky-600",
    emerald: "text-emerald-600",
    default: "text-[#1A1410]",
  };
  return (
    <Card className="p-4 sm:p-5" hover>
      <div className="flex items-start justify-between">
        <p className="text-[11px] tracking-[0.18em] uppercase text-[#1A1410]/45 font-medium">{label}</p>
        {Icon && <Icon className={`w-4 h-4 ${tones[tone]}`} />}
      </div>
      <p className={`font-serif text-2xl sm:text-3xl mt-1.5 tabular-nums tracking-tight ${tones[tone]}`}>{value}</p>
    </Card>
  );
}
