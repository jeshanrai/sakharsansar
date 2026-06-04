"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Trash2,
  Search,
  Store,
  MapPin,
  Phone,
  Mail,
  User,
  Pencil,
  ExternalLink,
  Navigation,
  Building2,
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
import { B2B_TONES, B2B_TYPES, type B2BClient, type B2BType } from "../_data/types";

const daysAgo = (d: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() - d);
  return dt.toISOString();
};

/** Build a Google Maps link for a shop — prefer a saved pin, else search the address. */
const mapsLink = (c: Pick<B2BClient, "mapUrl" | "address" | "shopName">) =>
  c.mapUrl?.trim()
    ? c.mapUrl
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${c.shopName} ${c.address}`)}`;

/** Keyless embeddable map — works off the address/pin with no API key. */
const mapsEmbed = (c: Pick<B2BClient, "address" | "shopName">) =>
  `https://maps.google.com/maps?q=${encodeURIComponent(`${c.shopName} ${c.address}`)}&z=14&output=embed`;

// Frontend-only seed. Edits stay in local state.
const SEED: B2BClient[] = [
  {
    id: "b2b_1",
    shopName: "Himalayan Organics Mart",
    contactPerson: "Suresh Maharjan",
    phone: "9841123456",
    altPhone: "01-4412233",
    email: "himalayanorganics@gmail.com",
    type: "RETAILER",
    address: "Jhamsikhel, Lalitpur",
    mapUrl: "https://maps.app.goo.gl/8xQ2",
    notes: "Orders ~40kg/month. Prefers delivery on Sundays.",
    createdAt: daysAgo(40),
  },
  {
    id: "b2b_2",
    shopName: "Annapurna Wholesale Suppliers",
    contactPerson: "Bhim Gurung",
    phone: "9856023344",
    altPhone: null,
    email: null,
    type: "WHOLESALER",
    address: "Pokhara — Mahendrapul",
    mapUrl: null,
    notes: "Bulk blocks only. Pays on 15-day credit.",
    createdAt: daysAgo(28),
  },
  {
    id: "b2b_3",
    shopName: "Everest Distribution Pvt. Ltd.",
    contactPerson: "Anita Shrestha",
    phone: "9801556677",
    altPhone: "9818002211",
    email: "sales@everestdist.com.np",
    type: "DISTRIBUTOR",
    address: "Biratnagar, Morang",
    mapUrl: null,
    notes: "Covers eastern Nepal. Monthly standing order.",
    createdAt: daysAgo(21),
  },
  {
    id: "b2b_4",
    shopName: "Roadhouse Café",
    contactPerson: "Niraj Lama",
    phone: "9803344556",
    altPhone: null,
    email: null,
    type: "CAFE_RESTAURANT",
    address: "Thamel, Kathmandu",
    mapUrl: null,
    notes: "Uses jaggery powder for desserts.",
    createdAt: daysAgo(12),
  },
  {
    id: "b2b_5",
    shopName: "Bhatbhateni Supermarket — Krishna Galli",
    contactPerson: "Procurement Desk",
    phone: "9851000111",
    altPhone: "01-5453000",
    email: "vendors@bbsm.com.np",
    type: "SUPERMARKET",
    address: "Krishna Galli, Lalitpur",
    mapUrl: null,
    notes: "Listed on shelf. Needs barcoded retail packs.",
    createdAt: daysAgo(7),
  },
];

const emptyForm = {
  shopName: "",
  contactPerson: "",
  phone: "",
  altPhone: "",
  email: "",
  type: "RETAILER" as B2BType,
  address: "",
  mapUrl: "",
  notes: "",
};

export default function B2BPage({ onToast }: { onToast: (msg: string) => void }) {
  const [clients, setClients] = useState<B2BClient[]>(SEED);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | B2BType>("ALL");
  const [page, setPage] = useState(1);
  const perPage = 8;

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<B2BClient | null>(null);
  const [viewing, setViewing] = useState<B2BClient | null>(null);
  const [confirmDel, setConfirmDel] = useState<B2BClient | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = useMemo(() => {
    return clients.filter((c) => {
      const fMatch = filter === "ALL" || c.type === filter;
      const q = search.toLowerCase();
      const sMatch =
        !search ||
        c.shopName.toLowerCase().includes(q) ||
        (c.contactPerson ?? "").toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q) ||
        c.phone.includes(search);
      return fMatch && sMatch;
    });
  }, [clients, filter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  const kpis = useMemo(() => {
    const by = (t: B2BType) => clients.filter((c) => c.type === t).length;
    return {
      total: clients.length,
      retailers: by("RETAILER"),
      wholesale: by("WHOLESALER") + by("DISTRIBUTOR"),
      pinned: clients.filter((c) => c.mapUrl?.trim()).length,
    };
  }, [clients]);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (c: B2BClient) => {
    setEditing(c);
    setForm({
      shopName: c.shopName,
      contactPerson: c.contactPerson ?? "",
      phone: c.phone,
      altPhone: c.altPhone ?? "",
      email: c.email ?? "",
      type: c.type,
      address: c.address,
      mapUrl: c.mapUrl ?? "",
      notes: c.notes ?? "",
    });
    setFormOpen(true);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      shopName: form.shopName.trim(),
      contactPerson: form.contactPerson.trim() || null,
      phone: form.phone.trim(),
      altPhone: form.altPhone.trim() || null,
      email: form.email.trim() || null,
      type: form.type,
      address: form.address.trim(),
      mapUrl: form.mapUrl.trim() || null,
      notes: form.notes.trim() || null,
    };

    if (editing) {
      setClients((prev) => prev.map((c) => (c.id === editing.id ? { ...c, ...payload } : c)));
      onToast(`${payload.shopName} updated`);
    } else {
      const next: B2BClient = {
        id: `b2b_${Date.now()}`,
        ...payload,
        createdAt: new Date().toISOString(),
      };
      setClients((prev) => [next, ...prev]);
      onToast(`${payload.shopName} added`);
      setPage(1);
    }
    setFormOpen(false);
    setEditing(null);
    setForm(emptyForm);
  };

  const remove = () => {
    if (!confirmDel) return;
    setClients((prev) => prev.filter((c) => c.id !== confirmDel.id));
    onToast(`${confirmDel.shopName} removed`);
    setConfirmDel(null);
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Wholesale · B2B"
        title="B2B Shops"
        description="Your directory of shops and businesses you supply — main contact and location for each."
        action={
          <Button onClick={openAdd}>
            <Plus className="w-4 h-4" /> Add Shop
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPI label="Total Shops" value={String(kpis.total)} icon={Store} />
        <KPI label="Retailers" value={String(kpis.retailers)} tone="sky" icon={Building2} />
        <KPI label="Wholesale / Dist." value={String(kpis.wholesale)} tone="violet" icon={Navigation} />
        <KPI label="Map Pinned" value={String(kpis.pinned)} tone="emerald" icon={MapPin} />
      </div>

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
            placeholder="Search by shop, contact, area, or phone…"
            className="w-full h-10 pl-10 pr-3 rounded-xl bg-[#FAF6EE] border border-[#1A1410]/8 text-sm placeholder:text-[#1A1410]/30 focus:outline-none focus:border-[#B8763E]/50 focus:ring-2 focus:ring-[#B8763E]/15 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1">
          {(["ALL", ...B2B_TYPES] as const).map((s) => (
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
              {s === "ALL" ? "All" : B2B_TONES[s as B2BType].label}
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
                <Th>Shop</Th>
                <Th>Main Contact</Th>
                <Th>Type</Th>
                <Th>Location</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((c) => (
                <motion.tr
                  key={c.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-[#1A1410]/5 last:border-0 hover:bg-[#FAF6EE]/50 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#E8A857]/30 to-[#B8763E]/20 flex items-center justify-center text-[#B8763E] shrink-0">
                        <Store className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <button
                          onClick={() => setViewing(c)}
                          className="font-medium text-[#1A1410] truncate hover:text-[#B8763E] transition-colors text-left"
                        >
                          {c.shopName}
                        </button>
                        {c.contactPerson && (
                          <p className="text-[11px] text-[#1A1410]/45 truncate">{c.contactPerson}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <a href={`tel:${c.phone}`} className="font-medium text-[#1A1410] hover:text-[#B8763E] transition-colors flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-[#1A1410]/40" /> {c.phone}
                    </a>
                    {c.altPhone && <p className="text-[11px] text-[#1A1410]/45 mt-0.5 pl-[18px]">{c.altPhone}</p>}
                  </td>
                  <td className="px-5 py-4">
                    <Pill tone={B2B_TONES[c.type]}>{B2B_TONES[c.type].label}</Pill>
                  </td>
                  <td className="px-5 py-4">
                    <a
                      href={mapsLink(c)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1A1410]/70 text-xs flex items-center gap-1.5 hover:text-[#B8763E] transition-colors max-w-[200px]"
                    >
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-[#1A1410]/40" />
                      <span className="truncate">{c.address}</span>
                    </a>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <a
                        href={mapsLink(c)}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open in Maps"
                        className="h-8 w-8 rounded-lg bg-[#FAF6EE] text-[#1A1410]/60 hover:text-emerald-600 hover:bg-emerald-50 transition-colors flex items-center justify-center"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => openEdit(c)}
                        title="Edit"
                        className="h-8 w-8 rounded-lg bg-[#FAF6EE] text-[#1A1410]/60 hover:text-[#B8763E] hover:bg-[#B8763E]/10 transition-colors flex items-center justify-center"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setConfirmDel(c)}
                        title="Remove"
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
        {pageItems.length === 0 && <EmptyState icon={Store} title="No shops found" message="Try a different filter or add one." />}
        {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPage={setPage} />}
      </Card>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {pageItems.length === 0 ? (
          <Card><EmptyState icon={Store} title="No shops" message="Tap + to add one." /></Card>
        ) : (
          pageItems.map((c) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <button onClick={() => setViewing(c)} className="font-medium text-[#1A1410] truncate text-left">
                      {c.shopName}
                    </button>
                    {c.contactPerson && <p className="text-xs text-[#1A1410]/50 truncate">{c.contactPerson}</p>}
                  </div>
                  <Pill tone={B2B_TONES[c.type]}>{B2B_TONES[c.type].label}</Pill>
                </div>
                <div className="mt-3 pt-3 border-t border-[#1A1410]/5 grid grid-cols-1 gap-1.5 text-xs text-[#1A1410]/55">
                  <a href={`tel:${c.phone}`} className="flex items-center gap-1.5 text-[#1A1410] font-medium">
                    <Phone className="w-3 h-3 shrink-0 text-[#1A1410]/40" /> {c.phone}
                  </a>
                  <a href={mapsLink(c)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 shrink-0 text-[#1A1410]/40" /> <span className="truncate">{c.address}</span>
                  </a>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <a
                    href={mapsLink(c)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 h-9 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium flex items-center justify-center gap-1.5"
                  >
                    <Navigation className="w-3.5 h-3.5" /> Map
                  </a>
                  <a
                    href={`tel:${c.phone}`}
                    className="flex-1 h-9 rounded-lg bg-[#1A1410] text-[#FAF6EE] text-xs font-medium flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call
                  </a>
                  <button
                    onClick={() => openEdit(c)}
                    className="h-9 w-9 rounded-lg bg-[#FAF6EE] text-[#1A1410]/60 flex items-center justify-center shrink-0"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setConfirmDel(c)}
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
        onClick={openAdd}
        className="md:hidden fixed bottom-24 right-4 h-14 w-14 rounded-2xl bg-gradient-to-br from-[#B8763E] to-[#9A5F2E] text-white shadow-2xl shadow-[#B8763E]/30 flex items-center justify-center z-20 active:scale-95 transition-transform"
      >
        <Plus className="w-5 h-5" />
      </button>

      {/* Add / Edit modal */}
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? "Edit Shop" : "Add B2B Shop"} size="lg">
        <form onSubmit={submit} className="space-y-4">
          <Input
            label="Shop / Business Name"
            required
            placeholder="e.g. Himalayan Organics Mart"
            value={form.shopName}
            onChange={(e) => setForm({ ...form, shopName: e.target.value })}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Contact Person"
              placeholder="Who to ask for"
              value={form.contactPerson}
              onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
            />
            <Select label="Shop Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as B2BType })}>
              {B2B_TYPES.map((t) => <option key={t} value={t}>{B2B_TONES[t].label}</option>)}
            </Select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Main Contact Number"
              required
              type="tel"
              placeholder="98XXXXXXXX"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <Input
              label="Alternate Phone"
              type="tel"
              placeholder="Optional"
              value={form.altPhone}
              onChange={(e) => setForm({ ...form, altPhone: e.target.value })}
            />
          </div>
          <Input
            label="Email"
            type="email"
            placeholder="Optional"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            label="Location / Address"
            required
            placeholder="Area, City"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <Input
            label="Google Maps Link (location pin)"
            type="url"
            placeholder="https://maps.app.goo.gl/…  (optional)"
            value={form.mapUrl}
            onChange={(e) => setForm({ ...form, mapUrl: e.target.value })}
          />
          <Textarea
            label="Notes (optional)"
            rows={2}
            placeholder="Order volume, credit terms, delivery preferences…"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
          <div className="flex gap-2.5 pt-2">
            <Button variant="secondary" type="button" onClick={() => setFormOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {editing ? "Save Changes" : "Add Shop"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Detail view with embedded map */}
      <Modal open={!!viewing} onClose={() => setViewing(null)} title={viewing?.shopName ?? "Shop"} size="lg">
        {viewing && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Pill tone={B2B_TONES[viewing.type]}>{B2B_TONES[viewing.type].label}</Pill>
              <span className="text-[11px] text-[#1A1410]/40">
                Added {new Date(viewing.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <DetailRow icon={User} label="Contact person" value={viewing.contactPerson ?? "—"} />
              <DetailRow icon={Phone} label="Main number" value={viewing.phone} href={`tel:${viewing.phone}`} />
              {viewing.altPhone && <DetailRow icon={Phone} label="Alternate" value={viewing.altPhone} href={`tel:${viewing.altPhone}`} />}
              {viewing.email && <DetailRow icon={Mail} label="Email" value={viewing.email} href={`mailto:${viewing.email}`} />}
              <DetailRow icon={MapPin} label="Location" value={viewing.address} />
            </div>

            {viewing.notes && (
              <div className="rounded-xl bg-[#FAF6EE] px-4 py-3 text-sm text-[#1A1410]/70">{viewing.notes}</div>
            )}

            {/* Keyless embedded map */}
            <div className="rounded-2xl overflow-hidden border border-[#1A1410]/8 aspect-video bg-[#FAF6EE]">
              <iframe
                title={`Map of ${viewing.shopName}`}
                src={mapsEmbed(viewing)}
                className="w-full h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="flex gap-2.5">
              <a href={`tel:${viewing.phone}`} className="flex-1">
                <Button className="w-full"><Phone className="w-4 h-4" /> Call</Button>
              </a>
              <a href={mapsLink(viewing)} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button variant="secondary" className="w-full"><ExternalLink className="w-4 h-4" /> Open in Maps</Button>
              </a>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!confirmDel}
        onClose={() => setConfirmDel(null)}
        onConfirm={remove}
        title="Remove shop?"
        message={`${confirmDel?.shopName} will be removed from your B2B directory.`}
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

function DetailRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
}) {
  const body = (
    <div className="flex items-start gap-2.5">
      <div className="h-8 w-8 rounded-lg bg-[#FAF6EE] flex items-center justify-center shrink-0">
        <Icon className="w-3.5 h-3.5 text-[#B8763E]" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] tracking-[0.14em] uppercase text-[#1A1410]/45 font-medium">{label}</p>
        <p className="text-sm text-[#1A1410] truncate">{value}</p>
      </div>
    </div>
  );
  return href ? (
    <a href={href} className="hover:opacity-75 transition-opacity">{body}</a>
  ) : (
    body
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
  tone?: "sky" | "emerald" | "violet" | "default";
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const tones = {
    sky: "text-sky-600",
    emerald: "text-emerald-600",
    violet: "text-violet-600",
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
