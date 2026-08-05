"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  CheckCircle2,
  XCircle,
  Package,
} from "lucide-react";
import { useOrderStore } from "@/lib/orderStore";

const STATUS_CONFIG = [
  { label: "PENDING",    color: "bg-amber-500",   text: "text-amber-600" },
  { label: "CONFIRMED",  color: "bg-blue-600",    text: "text-blue-600" },
  { label: "PROCESSING", color: "bg-purple-500",  text: "text-purple-600" },
  { label: "SHIPPED",    color: "bg-indigo-500",  text: "text-indigo-600" },
  { label: "DELIVERED",  color: "bg-emerald-600", text: "text-emerald-600" },
  { label: "CANCELLED",  color: "bg-red-500",     text: "text-red-600" },
];

const pixelConversions = [
  { label: "PAGEVIEW", count: 450 },
  { label: "VIEWCONTENT", count: 280 },
  { label: "ADDTOCART", count: 95 },
  { label: "INITIATECHECKOUT", count: 48 },
  { label: "PURCHASE", count: 18 },
];

export default function AnalyticsDashboard() {
  const { allOrders: storeOrders } = useOrderStore();
  const [liveOrders, setLiveOrders] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchLiveData = async () => {
      try {
        const res = await fetch("/api/orders", { cache: "no-store" });
        const data = await res.json();
        if (Array.isArray(data.orders)) {
          setLiveOrders(data.orders);
        }
      } catch {
        /* fallback */
      }
    };

    fetchLiveData();
    const interval = setInterval(fetchLiveData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  const allOrders = liveOrders.length > 0 ? liveOrders : storeOrders;

  // ── Computed Metrics ──────────────────────────────────────
  const totalOrders = allOrders.length;
  const totalRevenue = allOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const uniqueCustomers = new Set(allOrders.map((o) => o.userEmail)).size;
  const completedOrders = allOrders.filter((o) => o.status === "DELIVERED").length;
  const cancelledOrders = allOrders.filter((o) => o.status === "CANCELLED").length;

  // ── Order Status Breakdown ────────────────────────────────
  const statusCounts: Record<string, number> = {
    PENDING: 0,
    CONFIRMED: 0,
    PROCESSING: 0,
    SHIPPED: 0,
    DELIVERED: 0,
    CANCELLED: 0,
  };
  allOrders.forEach((o) => {
    const key = o.status as string;
    if (key in statusCounts) statusCounts[key]++;
  });

  const maxCount = Math.max(...Object.values(statusCounts), 1);

  const orderStatuses = STATUS_CONFIG.map((cfg) => ({
    ...cfg,
    count: statusCounts[cfg.label] ?? 0,
    percentage:
      totalOrders === 0
        ? 0
        : Math.round(((statusCounts[cfg.label] ?? 0) / maxCount) * 100),
  }));

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-neutral-900">
          Analytics Dashboard
        </h1>
        <p className="text-xs font-semibold text-neutral-400 mt-1">
          Revenue, conversions &amp; business performance
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col justify-between min-h-[140px]">
          <div className="w-10 h-10 bg-neutral-100 text-neutral-900 rounded-xl flex items-center justify-center border border-neutral-200">
            <TrendingUp size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-1">
              TOTAL REVENUE
            </span>
            <h2 className="text-2xl font-black tracking-tight text-neutral-900">
              LKR {totalRevenue.toLocaleString()}
            </h2>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col justify-between min-h-[140px]">
          <div className="w-10 h-10 bg-neutral-100 text-neutral-900 rounded-xl flex items-center justify-center border border-neutral-200">
            <ShoppingBag size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-1">
              TOTAL ORDERS
            </span>
            <h2 className="text-2xl font-black tracking-tight text-neutral-900">
              {totalOrders} {totalOrders === 1 ? "Order" : "Orders"}
            </h2>
          </div>
        </div>

        {/* Unique Customers */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col justify-between min-h-[140px]">
          <div className="w-10 h-10 bg-neutral-100 text-neutral-900 rounded-xl flex items-center justify-center border border-neutral-200">
            <Users size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-1">
              UNIQUE CUSTOMERS
            </span>
            <h2 className="text-2xl font-black tracking-tight text-neutral-900">
              {uniqueCustomers} {uniqueCustomers === 1 ? "User" : "Users"}
            </h2>
          </div>
        </div>

        {/* Completed Orders */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col justify-between min-h-[140px]">
          <div className="w-10 h-10 bg-neutral-100 text-neutral-900 rounded-xl flex items-center justify-center border border-neutral-200">
            <CheckCircle2 size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-1">
              COMPLETED ORDERS
            </span>
            <h2 className="text-2xl font-black tracking-tight text-neutral-900">
              {completedOrders}
            </h2>
          </div>
        </div>

        {/* Cancelled Orders */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col justify-between min-h-[140px]">
          <div className="w-10 h-10 bg-neutral-100 text-neutral-900 rounded-xl flex items-center justify-center border border-neutral-200">
            <XCircle size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-1">
              CANCELLED ORDERS
            </span>
            <h2 className="text-2xl font-black tracking-tight text-neutral-900">
              {cancelledOrders}
            </h2>
          </div>
        </div>

        {/* Low Stock SKUs — static for now */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col justify-between min-h-[140px]">
          <div className="w-10 h-10 bg-neutral-100 text-neutral-900 rounded-xl flex items-center justify-center border border-neutral-200">
            <Package size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-1">
              LOW STOCK SKUS
            </span>
            <h2 className="text-2xl font-black tracking-tight text-neutral-900">
              3 Items
            </h2>
          </div>
        </div>
      </div>

      {/* Meta & TikTok Pixel Conversions */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 space-y-6">
        <h2 className="text-base font-black text-neutral-900 tracking-tight">
          Meta &amp; TikTok Pixel Conversions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {pixelConversions.map((pixel, idx) => (
            <div
              key={idx}
              className="bg-neutral-50 border border-neutral-200 p-4 rounded-xl text-center"
            >
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 block mb-2">
                {pixel.label}
              </span>
              <p className="text-2xl font-black text-neutral-900">
                {pixel.count}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Order Status Breakdown (Live from orderStore) ── */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-neutral-900 tracking-tight">
            Order Status Breakdown
          </h2>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">
            {totalOrders} total
          </span>
        </div>

        {totalOrders === 0 ? (
          <div className="text-center py-8 text-neutral-400">
            <ShoppingBag size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm font-semibold">No orders placed yet.</p>
            <p className="text-xs mt-1">Status breakdown will appear here once orders come in.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orderStatuses.map((st) => (
              <div key={st.label} className="flex items-center gap-4 text-xs font-bold">
                <span className={`w-24 text-[10px] font-extrabold tracking-wider ${st.text}`}>
                  {st.label}
                </span>
                <div className="flex-1 bg-neutral-100 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${st.color}`}
                    style={{ width: `${st.percentage}%` }}
                  />
                </div>
                <span className="w-6 text-right font-black text-neutral-900">
                  {st.count}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
