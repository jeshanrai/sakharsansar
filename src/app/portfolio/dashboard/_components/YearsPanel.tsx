"use client";

import { useEffect, useState } from "react";
import { CalendarRange, Trophy, Flag, RotateCcw, Eye } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Card, SectionHeading, Button, Modal, Input } from "./primitives";
import { useSeason, seasonSpan, errorText, type SeasonSummary } from "../_data/season";

const rs = (n: number) => `Rs. ${(n || 0).toLocaleString()}`;

type Action = { kind: "close" | "reopen"; confirm: string };

/**
 * Season stats for every year, and (for the owner) the button that closes
 * the current year and starts the next. Closing moves nothing: the old year
 * keeps its records and stays viewable from the year picker.
 */
export default function YearsPanel({ onToast }: { onToast: (msg: string) => void }) {
  const { current, isOwner, setSelected, refresh } = useSeason();
  const [years, setYears] = useState<SeasonSummary[] | null>(null);
  const [action, setAction] = useState<Action | null>(null);
  const [typed, setTyped] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    apiFetch("/seasons/summary").then(async (res) => {
      if (alive && res.ok) setYears(await res.json());
    });
    return () => {
      alive = false;
    };
  }, []);

  const open = (kind: Action["kind"]) => {
    setAction({ kind, confirm: `YEAR ${kind === "close" ? current + 1 : current}` });
    setTyped("");
    setError(null);
  };

  const run = async () => {
    if (!action) return;
    setBusy(true);
    const res = await apiFetch(`/seasons/${action.kind}`, {
      method: "POST",
      body: JSON.stringify({ confirm: typed }),
    });
    setBusy(false);
    if (!res.ok) {
      setError(await errorText(res, "Something went wrong."));
      return;
    }
    setAction(null);
    onToast(action.kind === "close" ? `Year ${current + 1} started` : `Year ${current - 1} reopened`);
    // Reloads the year list and switches every page to the new current year.
    await refresh();
    const summary = await apiFetch("/seasons/summary");
    if (summary.ok) setYears(await summary.json());
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Seasons"
        title="Years"
        description="Each year keeps its own sales, expenses and orders. Closing a year starts the next from zero; the old one stays here and in the year picker."
        action={
          isOwner && (
            <Button onClick={() => open("close")}>
              <Flag className="w-4 h-4" /> Close Year {current} · Start Year {current + 1}
            </Button>
          )
        }
      />

      {!isOwner && (
        <p className="text-xs text-[#1A1410]/50 -mt-3">Only the owner can start a new year.</p>
      )}

      {!years ? (
        <Card className="p-6">
          <div className="w-6 h-6 border-2 border-[#B8763E] border-t-transparent rounded-full animate-spin" />
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          {years.map((y) => (
            <Card key={y.number} className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <CalendarRange className="w-4 h-4 text-[#B8763E]" />
                    <h3 className="font-serif text-xl text-[#1A1410]">Year {y.number}</h3>
                    {y.current ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-medium">Current</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium">Closed</span>
                    )}
                  </div>
                  <p className="text-xs text-[#1A1410]/45 mt-1">{seasonSpan(y)}</p>
                </div>
                <Button variant="secondary" size="sm" onClick={() => setSelected(y.number)}>
                  <Eye className="w-3.5 h-3.5" /> View
                </Button>
              </div>

              <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <Stat label="Sales" value={rs(y.sales)} sub={`${y.salesCount} recorded`} tone="text-emerald-600" />
                <Stat label="Expenses" value={rs(y.expenses)} sub={`${y.expensesCount} recorded`} tone="text-rose-500" />
                <Stat
                  label="Profit"
                  value={rs(y.profit)}
                  sub="Sales minus expenses"
                  tone={y.profit >= 0 ? "text-[#1A1410]" : "text-rose-600"}
                />
                <Stat label="Website orders" value={String(y.orders)} sub={rs(y.orderRevenue)} tone="text-[#1A1410]" />
              </dl>

              {y.topProduct && (
                <p className="mt-4 pt-4 border-t border-[#1A1410]/6 flex items-center gap-2 text-xs text-[#1A1410]/60">
                  <Trophy className="w-3.5 h-3.5 text-[#E8A857]" />
                  Best seller: <span className="font-medium text-[#1A1410]">{y.topProduct.name}</span> ×{y.topProduct.quantity}
                </p>
              )}

              {isOwner && y.current && y.number > 1 && (
                <button
                  onClick={() => open("reopen")}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs text-[#1A1410]/45 hover:text-[#B8763E]"
                >
                  <RotateCcw className="w-3 h-3" /> Undo: reopen Year {y.number - 1}
                </button>
              )}
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={!!action}
        onClose={() => setAction(null)}
        title={action?.kind === "close" ? `Start Year ${current + 1}?` : `Reopen Year ${current - 1}?`}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            run();
          }}
          className="space-y-4"
        >
          <p className="text-sm text-[#1A1410]/65 leading-relaxed">
            {action?.kind === "close" ? (
              <>
                Year {current} closes now and keeps all its records. The dashboard starts Year {current + 1} from zero.
                Staff will no longer be able to change Year {current}; you still can.
              </>
            ) : (
              <>
                Year {current} is removed and its records go back into Year {current - 1}, which becomes the current
                year again. Nothing is deleted.
              </>
            )}
          </p>
          <Input
            label={`Type ${action?.confirm ?? ""} to confirm`}
            value={typed}
            autoFocus
            onChange={(e) => {
              setTyped(e.target.value);
              setError(null);
            }}
          />
          {error && <p className="text-xs text-rose-600">{error}</p>}
          <div className="flex gap-2.5 pt-2">
            <Button variant="secondary" type="button" onClick={() => setAction(null)} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={busy || typed.trim().toUpperCase() !== action?.confirm}
            >
              {busy ? "Working…" : action?.kind === "close" ? `Start Year ${current + 1}` : `Reopen Year ${current - 1}`}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function Stat({ label, value, sub, tone }: { label: string; value: string; sub: string; tone: string }) {
  return (
    <div>
      <dt className="text-[11px] tracking-[0.14em] uppercase text-[#1A1410]/45 font-medium">{label}</dt>
      <dd className={`font-serif text-lg tabular-nums mt-0.5 ${tone}`}>{value}</dd>
      <dd className="text-[11px] text-[#1A1410]/40">{sub}</dd>
    </div>
  );
}
