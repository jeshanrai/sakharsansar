"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ClipboardList,
  ShoppingCart,
  Receipt,
  Users,
  Truck,
  Store,
  Inbox,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export type Tab = "overview" | "orders" | "enquiries" | "sales" | "delivery" | "expenses" | "b2b" | "users";

const NAV: { id: Tab; label: string; mobileLabel?: string; icon: typeof LayoutDashboard; hint: string }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, hint: "Today's snapshot" },
  { id: "orders", label: "Orders", icon: ClipboardList, hint: "Online orders" },
  { id: "enquiries", label: "Enquiries", mobileLabel: "Inbox", icon: Inbox, hint: "Contact messages" },
  { id: "sales", label: "Sales", icon: ShoppingCart, hint: "In-store + repeat" },
  { id: "delivery", label: "Delivery", icon: Truck, hint: "Shipments on the road" },
  { id: "expenses", label: "Expenses", icon: Receipt, hint: "Cash outflow" },
  { id: "b2b", label: "B2B Shops", mobileLabel: "Shops", icon: Store, hint: "Wholesale clients" },
  { id: "users", label: "Team", icon: Users, hint: "Staff activity" },
];

interface Props {
  activeTab: Tab;
  onTabChange: (t: Tab) => void;
  adminName: string;
  onLogout?: () => void;
  children: React.ReactNode;
}

export default function AdminShell({ activeTab, onTabChange, adminName, onLogout, children }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Close drawer when route/tab changes
    setDrawerOpen(false);
  }, [activeTab]);

  const initials = adminName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "A";

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#1A1410]">
      {/* ─── Desktop Sidebar ────────────────────────────────────── */}
      <aside className="hidden lg:flex fixed top-0 left-0 h-screen w-[260px] bg-[#1A1410] text-[#F5EDE0] flex-col z-40">
        <div className="px-6 pt-7 pb-6">
          <div className="relative w-[180px] h-10 brightness-0 invert">
            <Image src="/word-logo.svg" alt="SakharSansar" fill priority className="object-contain object-left" />
          </div>
          <p className="mt-2 text-[11px] tracking-[0.22em] uppercase text-[#E8A857] font-semibold">Admin Studio</p>
        </div>

        <div className="px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-[#F5EDE0]/15 to-transparent" />
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
          {NAV.map((item) => {
            const Active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] transition-all ${
                  Active
                    ? "bg-gradient-to-r from-[#B8763E]/35 via-[#B8763E]/15 to-transparent text-white font-semibold"
                    : "text-[#F5EDE0]/80 hover:text-white hover:bg-[#F5EDE0]/8 font-medium"
                }`}
              >
                {Active && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-7 w-[3px] rounded-r-full bg-[#E8A857] shadow-[0_0_12px_rgba(232,168,87,0.6)]"
                  />
                )}
                <item.icon className={`w-[18px] h-[18px] shrink-0 ${Active ? "text-[#E8A857]" : "text-[#F5EDE0]/70 group-hover:text-[#E8A857]"}`} />
                <span className="flex-1 text-left tracking-[0.005em]">{item.label}</span>
                <ChevronRight className={`w-3.5 h-3.5 transition-all ${Active ? "opacity-100 text-[#E8A857]" : "opacity-0 group-hover:opacity-60 group-hover:text-[#F5EDE0]"}`} />
              </button>
            );
          })}
        </nav>

        {/* Promo card */}
        <div className="mx-4 mb-4 rounded-2xl p-4 bg-gradient-to-br from-[#B8763E]/30 via-[#9A5F2E]/20 to-transparent border border-[#E8A857]/25 relative overflow-hidden">
          <Sparkles className="absolute -top-2 -right-2 w-12 h-12 text-[#E8A857]/15" />
          <p className="text-[11px] tracking-[0.18em] uppercase text-[#E8A857] font-semibold">Pro Tip</p>
          <p className="mt-1.5 text-sm leading-snug text-[#F5EDE0]">
            Use <span className="font-serif italic text-[#E8A857]">⌘K</span> to jump between sales fast.
          </p>
        </div>

        <div className="mx-4 mb-5 flex items-center gap-3 px-3.5 py-3 rounded-xl bg-[#F5EDE0]/8 border border-[#F5EDE0]/8">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#E8A857] to-[#B8763E] flex items-center justify-center text-[#1A1410] text-sm font-bold">
            {initials}
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-sm font-semibold text-white truncate">{adminName || "Admin"}</p>
            <p className="text-[11px] text-[#F5EDE0]/65 truncate font-medium">Owner</p>
          </div>
          <button
            onClick={onLogout}
            title="Log out"
            className="h-8 w-8 rounded-lg hover:bg-rose-500/20 text-[#F5EDE0]/70 hover:text-rose-300 flex items-center justify-center transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* ─── Mobile Drawer ─────────────────────────────────────── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="lg:hidden fixed inset-0 bg-[#1A1410]/60 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="lg:hidden fixed top-0 left-0 h-full w-[280px] bg-[#1A1410] text-[#F5EDE0] z-50 flex flex-col"
            >
              <div className="px-5 pt-6 pb-4 flex items-center justify-between">
                <div className="relative w-[150px] h-9 brightness-0 invert">
                  <Image src="/word-logo.svg" alt="SakharSansar" fill className="object-contain object-left" />
                </div>
                <button onClick={() => setDrawerOpen(false)} className="h-9 w-9 rounded-xl bg-[#F5EDE0]/5 flex items-center justify-center">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
                {NAV.map((item) => {
                  const Active = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onTabChange(item.id)}
                      className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm transition-all ${
                        Active
                          ? "bg-gradient-to-r from-[#B8763E]/35 via-[#B8763E]/15 to-transparent text-white"
                          : "text-[#F5EDE0]/80 hover:text-white hover:bg-[#F5EDE0]/8"
                      }`}
                    >
                      <item.icon className={`w-[18px] h-[18px] ${Active ? "text-[#E8A857]" : "text-[#F5EDE0]/70"}`} />
                      <div className="flex-1 text-left">
                        <p className={Active ? "font-semibold" : "font-medium"}>{item.label}</p>
                        <p className="text-[11px] text-[#F5EDE0]/55 font-medium">{item.hint}</p>
                      </div>
                    </button>
                  );
                })}
              </nav>

              <div className="px-4 pb-6">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F5EDE0]/5">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#E8A857] to-[#B8763E] flex items-center justify-center text-[#1A1410] font-bold">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{adminName || "Admin"}</p>
                    <p className="text-[11px] text-[#F5EDE0]/65 font-medium">Owner</p>
                  </div>
                  <button onClick={onLogout} className="h-9 w-9 rounded-xl bg-[#F5EDE0]/5 flex items-center justify-center text-rose-300/80">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ─── Main column ────────────────────────────────────────── */}
      <div className="lg:pl-[260px]">
        {/* Top bar */}
        <header
          className={`sticky top-0 z-30 transition-all ${
            scrolled
              ? "bg-[#FAF6EE]/85 backdrop-blur-xl border-b border-[#1A1410]/5"
              : "bg-transparent border-b border-transparent"
          }`}
        >
          <div className="px-4 sm:px-6 lg:px-8 py-3.5 flex items-center gap-3">
            <button
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden h-10 w-10 rounded-xl bg-white border border-[#1A1410]/8 flex items-center justify-center shadow-sm"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="flex-1 hidden sm:block max-w-md relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1410]/30" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search orders, sales, customers…"
                className="w-full h-10 pl-10 pr-12 rounded-xl bg-white border border-[#1A1410]/8 text-sm placeholder:text-[#1A1410]/30 focus:outline-none focus:border-[#B8763E]/40 focus:ring-2 focus:ring-[#B8763E]/15 transition-all"
              />
              <kbd className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 items-center gap-1 px-1.5 h-5 rounded-md bg-[#F5EDE0] text-[10px] text-[#1A1410]/40 font-mono">⌘K</kbd>
            </div>

            <div className="flex-1 sm:hidden">
              <p className="font-serif text-lg text-[#1A1410]">
                {NAV.find((n) => n.id === activeTab)?.label}
              </p>
            </div>

            <button className="relative h-10 w-10 rounded-xl bg-white border border-[#1A1410]/8 flex items-center justify-center shadow-sm hover:border-[#B8763E]/30 transition-colors">
              <Bell className="w-4 h-4 text-[#1A1410]/70" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#C4623E] ring-2 ring-white" />
            </button>

            <div className="hidden sm:flex h-10 px-3 items-center gap-2.5 rounded-xl bg-white border border-[#1A1410]/8 shadow-sm">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-[#E8A857] to-[#B8763E] flex items-center justify-center text-white text-xs font-semibold">
                {initials}
              </div>
              <span className="text-sm font-medium pr-1 hidden md:inline">{adminName || "Admin"}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="px-4 sm:px-6 lg:px-8 pt-3 pb-24 lg:pb-10 max-w-[1500px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* ─── Mobile bottom nav ──────────────────────────────────── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 px-3 pb-3 pt-2 bg-gradient-to-t from-[#FAF6EE] via-[#FAF6EE]/95 to-[#FAF6EE]/0">
        <div className="rounded-2xl bg-[#1A1410] text-[#F5EDE0] shadow-2xl shadow-[#1A1410]/20 p-1 flex items-center justify-between">
          {NAV.map((item) => {
            const Active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className="flex-1 min-w-0 relative h-12 flex flex-col items-center justify-center gap-0.5 rounded-xl transition-colors"
              >
                {Active && (
                  <motion.span
                    layoutId="mobile-active"
                    className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#B8763E] to-[#9A5F2E]"
                    transition={{ type: "spring", damping: 25, stiffness: 280 }}
                  />
                )}
                <item.icon className={`w-[17px] h-[17px] relative z-10 shrink-0 ${Active ? "text-white" : "text-[#F5EDE0]/70"}`} />
                <span className={`text-[9.5px] leading-none relative z-10 font-semibold tracking-tight ${Active ? "text-white" : "text-[#F5EDE0]/70"}`}>
                  {item.mobileLabel ?? item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
