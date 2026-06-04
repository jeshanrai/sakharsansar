// Shared types & UI tone maps for the admin panel — no mock data here.
// All data is fetched from the backend at runtime.

export type OrderStatus = "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
export type PaymentMethod = "CASH" | "ONLINE" | "CREDIT";
export type DeliveryStatus = "PENDING_PICKUP" | "OUT_FOR_DELIVERY" | "DELIVERED" | "FAILED" | "RETURNED";

export interface Delivery {
  id: string;
  trackingId: string;
  customer: string;
  phone: string;
  address: string;
  product: string;
  quantity: number;
  courier: string;
  cost: number;
  codAmount: number;
  status: DeliveryStatus;
  eta: string;
  notes: string | null;
  createdAt: string;
}

export interface Order {
  id: string;
  customer: string;
  phone: string;
  address: string;
  product: string;
  quantity: number;
  amount: number;
  status: OrderStatus;
  createdAt: string;
}

export interface Sale {
  id: string;
  customer: string;
  phone: string | null;
  product: string;
  quantity: number;
  amount: number;
  paymentMethod: PaymentMethod;
  description: string | null;
  date: string;
  createdAt?: string;
  updatedAt?: string;
  createdByAdmin?: { name: string } | null;
  updatedByAdmin?: { name: string } | null;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  description: string | null;
  date: string;
}

export interface UserRow {
  id: string;
  name: string;
  email: string;
  totalSales: number;
  totalSalesCount: number;
  totalExpenses: number;
  totalExpensesCount: number;
}

export interface DashboardStats {
  totalOrders: number;
  monthlyOrders: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalExpenses: number;
  monthlyExpenses: number;
  totalProfit: number;
  monthlyProfit: number;
  recentOrders: Order[];
  recentExpenses: Expense[];
  recentSales: Sale[];
  ordersByStatus: { status: OrderStatus; _count: { id: number } }[];
  monthlyChart: { month: string; revenue: number; expenses: number }[];
  totalSales: number;
  monthlySales: number;
  totalSalesCount: number;
  monthlySalesCount: number;
  cashInHand: number;
  moneyInBank: number;
  creditAmount: number;
  salesByPaymentMethod: { paymentMethod: PaymentMethod; _sum: { amount: number | null }; _count: { id: number } }[];
}

// ── B2B clients — wholesale/retail shops we supply ────────────────
export type B2BType =
  | "RETAILER"
  | "WHOLESALER"
  | "DISTRIBUTOR"
  | "CAFE_RESTAURANT"
  | "SUPERMARKET"
  | "OTHER";

export interface B2BClient {
  id: string;
  shopName: string;
  contactPerson: string | null;
  phone: string;          // main contact number
  altPhone: string | null;
  email: string | null;
  type: B2BType;
  address: string;        // location, in words
  mapUrl: string | null;  // Google Maps link to the shop's pin
  notes: string | null;
  createdAt: string;
}

export const B2B_TYPES: B2BType[] = [
  "RETAILER",
  "WHOLESALER",
  "DISTRIBUTOR",
  "CAFE_RESTAURANT",
  "SUPERMARKET",
  "OTHER",
];

export const B2B_TONES: Record<B2BType, { bg: string; text: string; dot: string; label: string }> = {
  RETAILER: { bg: "bg-sky-50", text: "text-sky-700", dot: "bg-sky-500", label: "Retailer" },
  WHOLESALER: { bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-500", label: "Wholesaler" },
  DISTRIBUTOR: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", label: "Distributor" },
  CAFE_RESTAURANT: { bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-500", label: "Café / Restaurant" },
  SUPERMARKET: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", label: "Supermarket" },
  OTHER: { bg: "bg-slate-100", text: "text-slate-700", dot: "bg-slate-500", label: "Other" },
};

export const EXPENSE_CATEGORIES = [
  "Raw Materials",
  "Packaging",
  "Logistics",
  "Marketing",
  "Operations",
  "Labor",
  "Other",
];

export const STATUS_TONES: Record<OrderStatus, { bg: string; text: string; dot: string }> = {
  PENDING: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  CONFIRMED: { bg: "bg-sky-50", text: "text-sky-700", dot: "bg-sky-500" },
  SHIPPED: { bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-500" },
  DELIVERED: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  CANCELLED: { bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-500" },
};

export const PAYMENT_TONES: Record<PaymentMethod, { bg: string; text: string; dot: string }> = {
  CASH: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  ONLINE: { bg: "bg-sky-50", text: "text-sky-700", dot: "bg-sky-500" },
  CREDIT: { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500" },
};

export const DELIVERY_TONES: Record<DeliveryStatus, { bg: string; text: string; dot: string; label: string }> = {
  PENDING_PICKUP: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", label: "Pending Pickup" },
  OUT_FOR_DELIVERY: { bg: "bg-sky-50", text: "text-sky-700", dot: "bg-sky-500", label: "Out for Delivery" },
  DELIVERED: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", label: "Delivered" },
  FAILED: { bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-500", label: "Failed" },
  RETURNED: { bg: "bg-slate-100", text: "text-slate-700", dot: "bg-slate-500", label: "Returned" },
};

export const COURIERS = ["Pathao", "InDriver", "Aramex Nepal", "Janaki Cargo", "Daraz Logistics", "Local Rider"];

export const CATEGORY_COLORS: Record<string, string> = {
  "Raw Materials": "#B8763E",
  Packaging: "#E8A857",
  Logistics: "#4A5D3A",
  Marketing: "#C4623E",
  Operations: "#5A3B22",
  Labor: "#9A5F2E",
  Other: "#3D2817",
};
