"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, TrendingUp, TrendingDown, MoreHorizontal, Users as UsersIcon } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Card, SectionHeading, Button, EmptyState } from "../_components/primitives";
import type { UserRow } from "../_data/types";

const rs = (n: number) => `Rs. ${(n || 0).toLocaleString()}`;

const initialsOf = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default function UsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await apiFetch("/dashboard/users-stats");
      if (!cancelled && res.ok) {
        setUsers(await res.json());
      }
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-44 rounded-3xl bg-white/60" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          {[0, 1, 2, 3].map((i) => <div key={i} className="h-48 rounded-2xl bg-white/60" />)}
        </div>
      </div>
    );
  }

  const topSeller = users.length ? [...users].sort((a, b) => b.totalSales - a.totalSales)[0] : null;

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Team"
        title="Staff Activity"
        description="Who's selling, who's spending — performance at a glance."
        action={<Button variant="secondary">Invite Member</Button>}
      />

      {users.length === 0 ? (
        <Card>
          <EmptyState icon={UsersIcon} title="No team members yet" message="Once admins are added, their activity shows up here." />
        </Card>
      ) : (
        <>
          {topSeller && (
            <Card className="p-6 sm:p-8 relative overflow-hidden bg-gradient-to-br from-[#1A1410] to-[#3D2817] text-[#F5EDE0] border-none">
              <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-gradient-to-br from-[#E8A857]/20 to-transparent blur-2xl" />
              <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-gradient-to-br from-[#E8A857] to-[#B8763E] flex items-center justify-center text-[#1A1410] text-xl font-semibold shrink-0">
                  {initialsOf(topSeller.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] tracking-[0.22em] uppercase text-[#E8A857] font-medium">Top Performer</p>
                  <h3 className="font-serif text-2xl sm:text-3xl mt-1">{topSeller.name}</h3>
                  <p className="text-sm text-[#F5EDE0]/60 mt-0.5">{topSeller.email} · {topSeller.totalSalesCount} sales</p>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="text-center sm:text-right">
                    <p className="text-[10px] tracking-[0.18em] uppercase text-[#F5EDE0]/45">Revenue</p>
                    <p className="font-serif text-xl sm:text-2xl text-[#E8A857] tabular-nums mt-1">{rs(topSeller.totalSales)}</p>
                  </div>
                  <div className="text-center sm:text-right">
                    <p className="text-[10px] tracking-[0.18em] uppercase text-[#F5EDE0]/45">Sales</p>
                    <p className="font-serif text-xl sm:text-2xl text-[#F5EDE0] tabular-nums mt-1">{topSeller.totalSalesCount}</p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            {users.map((user, i) => {
              const denom = user.totalSales + user.totalExpenses;
              const ratio = denom > 0 ? user.totalSales / denom : 0;
              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="p-5 sm:p-6" hover>
                    <div className="flex items-start gap-4">
                      <div className="relative shrink-0">
                        <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-gradient-to-br from-[#E8A857]/25 to-[#B8763E]/25 flex items-center justify-center text-[#B8763E] font-semibold">
                          {initialsOf(user.name)}
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-medium text-[#1A1410] truncate">{user.name}</p>
                            <p className="text-[11px] text-[#1A1410]/50">Admin</p>
                          </div>
                          <button className="h-8 w-8 rounded-lg hover:bg-[#FAF6EE] text-[#1A1410]/40 flex items-center justify-center shrink-0">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-[#1A1410]/45 flex items-center gap-1 mt-1.5">
                          <Mail className="w-3 h-3" /> {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-5">
                      <div className="bg-emerald-50/60 rounded-xl p-3.5">
                        <div className="flex items-center gap-1.5 text-emerald-700">
                          <TrendingUp className="w-3.5 h-3.5" />
                          <p className="text-[10px] tracking-[0.16em] uppercase font-medium">Sales</p>
                        </div>
                        <p className="font-serif text-lg sm:text-xl text-emerald-700 mt-1.5 tabular-nums">{rs(user.totalSales)}</p>
                        <p className="text-[11px] text-emerald-700/60 mt-0.5">{user.totalSalesCount} transactions</p>
                      </div>
                      <div className="bg-rose-50/60 rounded-xl p-3.5">
                        <div className="flex items-center gap-1.5 text-rose-700">
                          <TrendingDown className="w-3.5 h-3.5" />
                          <p className="text-[10px] tracking-[0.16em] uppercase font-medium">Expenses</p>
                        </div>
                        <p className="font-serif text-lg sm:text-xl text-rose-700 mt-1.5 tabular-nums">{rs(user.totalExpenses)}</p>
                        <p className="text-[11px] text-rose-700/60 mt-0.5">{user.totalExpensesCount} entries</p>
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="flex items-center justify-between text-[11px] text-[#1A1410]/55 mb-1.5">
                        <span>Net contribution</span>
                        <span className="font-medium text-[#1A1410]">{(ratio * 100).toFixed(0)}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[#FAF6EE] overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${ratio * 100}%` }}
                          transition={{ duration: 0.8, delay: i * 0.05 + 0.1, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-[#B8763E] to-[#E8A857]"
                        />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
