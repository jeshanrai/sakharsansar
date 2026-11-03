"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { markInternalTraffic } from "@/lib/internal-traffic";
import AdminShell, { type Tab } from "./_components/AdminShell";
import { Toast, ConfirmDialog } from "./_components/primitives";
import OverviewPage from "./_pages/OverviewPage";
import OrdersPage from "./_pages/OrdersPage";
import EnquiriesPage from "./_pages/EnquiriesPage";
import SalesPage from "./_pages/SalesPage";
import DeliveryPage from "./_pages/DeliveryPage";
import ExpensesPage from "./_pages/ExpensesPage";
import B2BPage from "./_pages/B2BPage";
import UsersPage from "./_pages/UsersPage";
import SettingsPage from "./_pages/SettingsPage";
import { SeasonContext, type Season, type SeasonState } from "./_data/season";

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [adminName, setAdminName] = useState("");
  const [authReady, setAuthReady] = useState(false);
  const [toast, setToast] = useState<{ visible: boolean; message: string }>({ visible: false, message: "" });
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [seasons, setSeasons] = useState<Season[]>([{ number: 1, startsAt: null, endsAt: null, current: true }]);
  const [selected, setSelected] = useState(1);

  const current = seasons[seasons.length - 1].number;

  const loadSeasons = useCallback(async () => {
    const res = await apiFetch("/seasons");
    if (!res.ok) return;
    const data: { seasons: Season[]; current: number } = await res.json();
    setSeasons(data.seasons);
    // Land on the current year, including straight after one is closed.
    setSelected(data.current);
  }, []);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.replace("/portfolio");
      return;
    }
    apiFetch("/auth/me")
      .then(async (res) => {
        if (!res.ok) {
          router.replace("/portfolio");
          return;
        }
        const data = await res.json();
        markInternalTraffic();
        setAdminName(data.name);
        setIsOwner(data.isOwner === true);
        await loadSeasons();
        setAuthReady(true);
      })
      .catch(() => router.replace("/portfolio"));
  }, [router, loadSeasons]);

  const season = useMemo<SeasonState>(
    () => ({
      seasons,
      current,
      selected,
      setSelected,
      isOwner,
      canEdit: isOwner || selected === current,
      refresh: loadSeasons,
    }),
    [seasons, current, selected, isOwner, loadSeasons],
  );

  const showToast = (message: string) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: "" }), 2400);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/portfolio");
  };

  if (!authReady) {
    return (
      <div className="min-h-screen bg-[#FAF6EE] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#B8763E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <SeasonContext.Provider value={season}>
    <AdminShell
      activeTab={activeTab}
      onTabChange={setActiveTab}
      adminName={adminName}
      roleLabel={isOwner ? "Owner" : "Staff"}
      onLogout={() => setLogoutOpen(true)}
    >
      {selected !== current && (
        <div className="mb-5 rounded-2xl border border-[#E8A857]/40 bg-[#E8A857]/10 px-4 py-3 text-sm text-[#5A3B22] flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>
            You&apos;re looking at <strong>Year {selected}</strong>, which is closed.{" "}
            {isOwner ? "As the owner you can still change its records." : "Its records can't be changed."}
          </span>
          <button onClick={() => setSelected(current)} className="font-semibold underline underline-offset-2">
            Back to Year {current}
          </button>
        </div>
      )}
      {/* Keyed by year so each page refetches and starts on page 1. */}
      <div key={selected}>
        {activeTab === "overview" && <OverviewPage adminName={adminName} />}
        {activeTab === "orders" && <OrdersPage onToast={showToast} />}
        {activeTab === "enquiries" && <EnquiriesPage onToast={showToast} />}
        {activeTab === "sales" && <SalesPage onToast={showToast} />}
        {activeTab === "delivery" && <DeliveryPage onToast={showToast} />}
        {activeTab === "expenses" && <ExpensesPage onToast={showToast} />}
        {activeTab === "b2b" && <B2BPage onToast={showToast} />}
        {activeTab === "users" && <UsersPage />}
        {activeTab === "settings" && <SettingsPage onToast={showToast} />}
      </div>
      <Toast visible={toast.visible} message={toast.message} />
      <ConfirmDialog
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={handleLogout}
        title="Log out?"
        message="You'll need to sign in again to access the dashboard."
        variant="info"
        confirmLabel="Log out"
      />
    </AdminShell>
    </SeasonContext.Provider>
  );
}
