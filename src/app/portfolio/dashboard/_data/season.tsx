"use client";

import { createContext, useContext } from "react";

// Business years ("Year 1", "Year 2", …). A year is a span of dates; nothing
// is moved when one closes. See backend/src/lib/seasons.ts.
export interface Season {
  number: number;
  startsAt: string | null; // null for Year 1
  endsAt: string | null; // null for the current year
  current: boolean;
}

export interface SeasonSummary extends Season {
  sales: number;
  salesCount: number;
  expenses: number;
  expensesCount: number;
  orders: number;
  orderRevenue: number;
  profit: number;
  topProduct: { name: string; quantity: number } | null;
}

export interface SeasonState {
  seasons: Season[];
  current: number;
  /** The year every page is showing. */
  selected: number;
  setSelected: (n: number) => void;
  /** Jeshan: may delete sales, close/reopen years, change closed years. */
  isOwner: boolean;
  /** May add or change records in the selected year. */
  canEdit: boolean;
  /** Reload the list after a year is closed or reopened. */
  refresh: () => Promise<void>;
}

export const SeasonContext = createContext<SeasonState | null>(null);

export function useSeason(): SeasonState {
  const ctx = useContext(SeasonContext);
  if (!ctx) throw new Error("useSeason must be used inside the dashboard");
  return ctx;
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

/** "Since 2 Nov 2026", "Until 2 Nov 2026", "2 Nov 2026 – 3 Nov 2027". */
export function seasonSpan(s: Season): string {
  if (s.startsAt && s.endsAt) return `${fmt(s.startsAt)} – ${fmt(s.endsAt)}`;
  if (s.startsAt) return `Since ${fmt(s.startsAt)}`;
  if (s.endsAt) return `Until ${fmt(s.endsAt)}`;
  return "All records so far";
}

/** The error text the backend sent, or a fallback. */
export async function errorText(res: Response, fallback: string): Promise<string> {
  const data = await res.json().catch(() => null);
  return typeof data?.error === "string" ? data.error : fallback;
}
