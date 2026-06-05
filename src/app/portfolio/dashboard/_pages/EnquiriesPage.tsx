"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Inbox,
  Phone,
  Mail,
  Calendar,
  Trash2,
  ChevronDown,
  MessageSquare,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Card, SectionHeading, Pill, EmptyState, Modal, Button, ConfirmDialog } from "../_components/primitives";
import {
  ENQUIRY_STATUSES,
  ENQUIRY_STATUS_TONES,
  ENQUIRY_TYPE_TONES,
  type Enquiry,
  type EnquiryStatus,
  type EnquiryType,
} from "../_data/types";

const STATUS_FILTERS: ("ALL" | EnquiryStatus)[] = ["ALL", "NEW", "READ", "REPLIED", "ARCHIVED"];
const TYPE_FILTERS: ("ALL" | EnquiryType)[] = ["ALL", "B2C", "B2B", "GIFTING", "PARTNERSHIP", "OTHER"];

const cap = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();
// A contact value is an email if it has an @, otherwise treat it as a phone.
const isEmail = (c: string) => c.includes("@");
const telHref = (c: string) => `tel:${c.replace(/[^\d+]/g, "")}`;
const waHref = (c: string) => `https://wa.me/${c.replace(/[^\d]/g, "")}`;

export default function EnquiriesPage({ onToast }: { onToast: (msg: string) => void }) {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [newCount, setNewCount] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"ALL" | EnquiryStatus>("ALL");
  const [type, setType] = useState<"ALL" | EnquiryType>("ALL");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<Enquiry | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Enquiry | null>(null);

  const fetchEnquiries = useCallback(
    async (p: number, s: "ALL" | EnquiryStatus, t: "ALL" | EnquiryType) => {
      setLoading(true);
      const qs = new URLSearchParams({ page: String(p), limit: "10" });
      if (s !== "ALL") qs.set("status", s);
      if (t !== "ALL") qs.set("type", t);
      const res = await apiFetch(`/enquiries?${qs.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setEnquiries(data.enquiries || []);
        setTotalPages(data.totalPages || 1);
        setNewCount(data.newCount || 0);
      }
      setLoading(false);
    },
    [],
  );

  useEffect(() => {
    fetchEnquiries(page, status, type);
  }, [page, status, type, fetchEnquiries]);

  const updateStatus = async (id: string, next: EnquiryStatus, prev: EnquiryStatus) => {
    if (next === prev) return;
    setEnquiries((cur) => cur.map((e) => (e.id === id ? { ...e, status: next } : e)));
    setActive((cur) => (cur && cur.id === id ? { ...cur, status: next } : cur));
    setNewCount((c) => c + (prev === "NEW" ? -1 : 0) + (next === "NEW" ? 1 : 0));
    const res = await apiFetch(`/enquiries/${id}`, { method: "PATCH", body: JSON.stringify({ status: next }) });
    if (res.ok) {
      onToast(`Marked as ${next.toLowerCase()}`);
    } else {
      setEnquiries((cur) => cur.map((e) => (e.id === id ? { ...e, status: prev } : e)));
      onToast("Update failed");
    }
  };

  const remove = async (enq: Enquiry) => {
    setConfirmDelete(null);
    setActive(null);
    setEnquiries((cur) => cur.filter((e) => e.id !== enq.id));
    const res = await apiFetch(`/enquiries/${enq.id}`, { method: "DELETE" });
    onToast(res.ok ? "Enquiry deleted" : "Delete failed");
    if (!res.ok) fetchEnquiries(page, status, type);
  };

  // Open an enquiry — auto-mark NEW → READ.
  const open = (enq: Enquiry) => {
    setActive(enq);
    if (enq.status === "NEW") updateStatus(enq.id, "READ", "NEW");
  };

  const filtered = useMemo(() => {
    if (!search) return enquiries;
    const q = search.toLowerCase();
    return enquiries.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.contact.toLowerCase().includes(q) ||
        e.message.toLowerCase().includes(q),
    );
  }, [enquiries, search]);

  const kpis = useMemo(() => {
    const replied = enquiries.filter((e) => e.status === "REPLIED").length;
    const b2b = enquiries.filter((e) => e.type === "B2B").length;
    return { total: enquiries.length, replied, b2b };
  }, [enquiries]);

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Inbox"
        title="Customer Enquiries"
        description="Every message from the storefront contact form — retail (B2C) and wholesale (B2B) alike."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPI label="On this page" value={String(kpis.total)} />
        <KPI label="New / unread" value={String(newCount)} tone="emerald" />
        <KPI label="Replied" value={String(kpis.replied)} tone="violet" />
        <KPI label="B2B (page)" value={String(kpis.b2b)} />
      </div>

      <Card className="p-3 sm:p-4 flex flex-col gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1410]/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search this page by name, contact, or message…"
            className="w-full h-10 pl-10 pr-3 rounded-xl bg-[#FAF6EE] border border-[#1A1410]/8 text-sm placeholder:text-[#1A1410]/30 focus:outline-none focus:border-[#B8763E]/50 focus:ring-2 focus:ring-[#B8763E]/15 transition-all"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1">
            <Filter className="w-4 h-4 text-[#1A1410]/40 shrink-0" />
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStatus(s);
                  setPage(1);
                }}
                className={`h-9 px-3 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  status === s ? "bg-[#1A1410] text-[#FAF6EE]" : "bg-[#FAF6EE] text-[#1A1410]/55 hover:text-[#1A1410]"
                }`}
              >
                {s === "ALL" ? "All status" : cap(s)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1 sm:border-l sm:border-[#1A1410]/8 sm:pl-3">
            {TYPE_FILTERS.map((t) => (
              <button
                key={t}
                onClick={() => {
                  setType(t);
                  setPage(1);
                }}
                className={`h-9 px-3 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  type === t ? "bg-[#B8763E] text-white" : "bg-[#FAF6EE] text-[#1A1410]/55 hover:text-[#1A1410]"
                }`}
              >
                {t === "ALL" ? "All types" : ENQUIRY_TYPE_TONES[t].label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Desktop table */}
      <Card className="hidden md:block overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#FAF6EE] border-b border-[#1A1410]/6">
                <Th>From</Th>
                <Th>Type</Th>
                <Th>Message</Th>
                <Th>Status</Th>
                <Th>Received</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((enq) => (
                <motion.tr
                  key={enq.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => open(enq)}
                  className={`border-b border-[#1A1410]/5 last:border-0 hover:bg-[#FAF6EE]/60 transition-colors cursor-pointer ${
                    enq.status === "NEW" ? "bg-emerald-50/30" : ""
                  }`}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#E8A857]/20 to-[#B8763E]/20 flex items-center justify-center text-[#B8763E] text-xs font-semibold shrink-0">
                        {enq.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-[#1A1410] truncate flex items-center gap-2">
                          {enq.name}
                          {enq.status === "NEW" && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
                        </p>
                        <p className="text-[11px] text-[#1A1410]/45 truncate">{enq.contact}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <Pill tone={ENQUIRY_TYPE_TONES[enq.type]}>{ENQUIRY_TYPE_TONES[enq.type].label}</Pill>
                  </td>
                  <td className="px-5 py-4 text-[#1A1410]/70 max-w-[320px]">
                    <p className="truncate">{enq.message}</p>
                  </td>
                  <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                    <StatusSelect enq={enq} onChange={updateStatus} />
                  </td>
                  <td className="px-5 py-4 text-[#1A1410]/45 text-xs whitespace-nowrap">
                    {new Date(enq.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setConfirmDelete(enq)}
                      className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-[#1A1410]/40 hover:bg-rose-50 hover:text-rose-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && filtered.length === 0 && (
          <EmptyState icon={Inbox} title="No enquiries found" message="New messages from the contact form land here." />
        )}
        {loading && <div className="p-8 text-center text-sm text-[#1A1410]/40">Loading…</div>}
        {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPage={setPage} />}
      </Card>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <Card><div className="p-6 text-center text-sm text-[#1A1410]/40">Loading…</div></Card>
        ) : filtered.length === 0 ? (
          <Card><EmptyState icon={Inbox} title="No enquiries found" message="New messages land here." /></Card>
        ) : (
          filtered.map((enq) => (
            <motion.div
              key={enq.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => open(enq)}
              className="cursor-pointer"
            >
              <Card className={`p-4 ${enq.status === "NEW" ? "ring-1 ring-emerald-200" : ""}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#E8A857]/20 to-[#B8763E]/20 flex items-center justify-center text-[#B8763E] text-xs font-semibold shrink-0">
                      {enq.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-[#1A1410] truncate">{enq.name}</p>
                      <p className="text-xs text-[#1A1410]/50 truncate">{enq.contact}</p>
                    </div>
                  </div>
                  <Pill tone={ENQUIRY_TYPE_TONES[enq.type]}>{ENQUIRY_TYPE_TONES[enq.type].label}</Pill>
                </div>
                <p className="mt-3 text-sm text-[#1A1410]/70 line-clamp-2">{enq.message}</p>
                <div className="mt-3 pt-3 border-t border-[#1A1410]/5 flex items-center justify-between gap-2">
                  <span className="text-xs text-[#1A1410]/45 flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" /> {new Date(enq.createdAt).toLocaleDateString()}
                  </span>
                  <div onClick={(e) => e.stopPropagation()}>
                    <StatusSelect enq={enq} onChange={updateStatus} />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
        {totalPages > 1 && (
          <Card><Pagination page={page} totalPages={totalPages} onPage={setPage} /></Card>
        )}
      </div>

      {/* Detail modal */}
      <Modal open={!!active} onClose={() => setActive(null)} title="Enquiry" size="lg">
        {active && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2.5">
              <Pill tone={ENQUIRY_TYPE_TONES[active.type]}>{ENQUIRY_TYPE_TONES[active.type].label}</Pill>
              <Pill tone={ENQUIRY_STATUS_TONES[active.status]}>{cap(active.status)}</Pill>
              <span className="text-xs text-[#1A1410]/45 ml-auto">
                {new Date(active.createdAt).toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-[#E8A857]/20 to-[#B8763E]/20 flex items-center justify-center text-[#B8763E] text-sm font-semibold">
                {active.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-[#1A1410]">{active.name}</p>
                <p className="text-sm text-[#1A1410]/55 truncate">{active.contact}</p>
              </div>
            </div>

            <div className="rounded-2xl bg-[#FAF6EE] p-4 text-[#1A1410]/80 text-sm leading-relaxed whitespace-pre-wrap">
              {active.message}
            </div>

            {/* Reply actions */}
            <div className="flex flex-wrap gap-2">
              {isEmail(active.contact) ? (
                <a href={`mailto:${active.contact}?subject=${encodeURIComponent("Re: your SakharSansar enquiry")}`}>
                  <Button variant="primary" size="sm"><Mail className="w-4 h-4" /> Email</Button>
                </a>
              ) : (
                <>
                  <a href={waHref(active.contact)} target="_blank" rel="noopener noreferrer">
                    <Button variant="primary" size="sm"><MessageSquare className="w-4 h-4" /> WhatsApp</Button>
                  </a>
                  <a href={telHref(active.contact)}>
                    <Button variant="secondary" size="sm"><Phone className="w-4 h-4" /> Call</Button>
                  </a>
                </>
              )}
              <div className="ml-auto flex gap-2">
                {active.status !== "REPLIED" && (
                  <Button variant="secondary" size="sm" onClick={() => updateStatus(active.id, "REPLIED", active.status)}>
                    Mark replied
                  </Button>
                )}
                {active.status !== "ARCHIVED" && (
                  <Button variant="ghost" size="sm" onClick={() => updateStatus(active.id, "ARCHIVED", active.status)}>
                    Archive
                  </Button>
                )}
                <Button variant="danger" size="sm" onClick={() => setConfirmDelete(active)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && remove(confirmDelete)}
        title="Delete enquiry?"
        message="This removes it from the inbox. This action can't be undone here."
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

function StatusSelect({
  enq,
  onChange,
}: {
  enq: Enquiry;
  onChange: (id: string, s: EnquiryStatus, prev: EnquiryStatus) => void;
}) {
  const tone = ENQUIRY_STATUS_TONES[enq.status];
  return (
    <div className="relative inline-block">
      <select
        value={enq.status}
        onChange={(e) => onChange(enq.id, e.target.value as EnquiryStatus, enq.status)}
        className={`appearance-none ${tone.bg} ${tone.text} font-medium text-[11px] tracking-wide rounded-full pl-3 pr-7 py-1.5 cursor-pointer outline-none`}
      >
        {ENQUIRY_STATUSES.map((s) => (
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

function KPI({ label, value, tone = "default" }: { label: string; value: string; tone?: "emerald" | "violet" | "default" }) {
  const tones = { emerald: "text-emerald-600", violet: "text-violet-600", default: "text-[#1A1410]" };
  return (
    <Card className="p-4 sm:p-5">
      <p className="text-[11px] tracking-[0.18em] uppercase text-[#1A1410]/45 font-medium">{label}</p>
      <p className={`font-serif text-2xl sm:text-3xl mt-1.5 tabular-nums tracking-tight ${tones[tone]}`}>{value}</p>
    </Card>
  );
}
