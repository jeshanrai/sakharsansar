"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import AdminShell, { type Tab } from "./_components/AdminShell";
import { Toast, ConfirmDialog } from "./_components/primitives";
import OverviewPage from "./_pages/OverviewPage";
import OrdersPage from "./_pages/OrdersPage";
import SalesPage from "./_pages/SalesPage";
import DeliveryPage from "./_pages/DeliveryPage";
import ExpensesPage from "./_pages/ExpensesPage";
import B2BPage from "./_pages/B2BPage";
import UsersPage from "./_pages/UsersPage";

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [adminName, setAdminName] = useState("");
  const [authReady, setAuthReady] = useState(false);
  const [toast, setToast] = useState<{ visible: boolean; message: string }>({ visible: false, message: "" });
  const [logoutOpen, setLogoutOpen] = useState(false);

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
        setAdminName(data.name);
        setAuthReady(true);
      })
      .catch(() => router.replace("/portfolio"));
  }, [router]);

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
    <AdminShell
      activeTab={activeTab}
      onTabChange={setActiveTab}
      adminName={adminName}
      onLogout={() => setLogoutOpen(true)}
    >
      {activeTab === "overview" && <OverviewPage adminName={adminName} />}
      {activeTab === "orders" && <OrdersPage onToast={showToast} />}
      {activeTab === "sales" && <SalesPage onToast={showToast} />}
      {activeTab === "delivery" && <DeliveryPage onToast={showToast} />}
      {activeTab === "expenses" && <ExpensesPage onToast={showToast} />}
      {activeTab === "b2b" && <B2BPage onToast={showToast} />}
      {activeTab === "users" && <UsersPage />}
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
  );
}
