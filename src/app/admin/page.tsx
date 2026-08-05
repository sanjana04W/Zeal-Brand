"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Clock,
  ArrowUpRight,
  AlertTriangle,
  TrendingUp
} from "lucide-react";
import { useOrderStore } from "@/lib/orderStore";

export default function AdminDashboard() {
  const { allOrders: storeOrders } = useOrderStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders", { cache: "no-store" });
        const data = await res.json();
        if (Array.isArray(data.orders)) {
          setOrders(data.orders);
        } else {
          setOrders(storeOrders);
        }
      } catch {
        setOrders(storeOrders);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [storeOrders]);

  if (!mounted) return null;

  const allOrders = orders;

  const totalRevenue = allOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = allOrders.length;
  const pendingOrdersCount = allOrders.filter((o) => o.status === "PENDING").length;
  const recentOrders = allOrders.slice(0, 5);

  const lowStockItems = [
    { name: "Oversized 'Acid Wash' Tee", badge: "1 left", badgeColor: "bg-neutral-100 text-neutral-800 border-neutral-300" },
    { name: "Classic Logo Premium Tee", badge: "Out of Stock", badgeColor: "bg-red-100 text-red-700 border-red-200" },
    { name: "Vintage '84 Streetwear Edition", badge: "3 left", badgeColor: "bg-neutral-100 text-neutral-800 border-neutral-300" },
  ];

  const topProducts = [
    { name: "Oversized 'Acid Wash' Tee", percentage: 100, barColor: "bg-neutral-900" },
    { name: "Classic Logo Premium Tee", percentage: 60, barColor: "bg-neutral-800" },
    { name: "Allover Bow Print Drop Shoulder", percentage: 40, barColor: "bg-neutral-700" },
    { name: "Vintage '84 Streetwear Edition", percentage: 20, barColor: "bg-neutral-600" },
    { name: "Graphic Streetwear Tee", percentage: 20, barColor: "bg-neutral-500" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-neutral-900">Dashboard</h1>
          <p className="text-xs font-semibold text-neutral-400 mt-1">
            Welcome back! Here&apos;s real-time store activity at Zeal Brand.
          </p>
        </div>
      </div>

      {/* 4 Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 block mb-1">
              TOTAL REVENUE
            </span>
            <h3 className="text-2xl font-black text-neutral-900 tracking-tight">
              LKR {totalRevenue.toLocaleString()}
            </h3>
            <p className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-1">
              <TrendingUp size={12} /> Live from orders
            </p>
          </div>
          <div className="w-12 h-12 bg-neutral-100 text-neutral-900 rounded-2xl flex items-center justify-center shrink-0 border border-neutral-200 shadow-inner">
            <DollarSign size={22} className="stroke-[2.5]" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 block mb-1">
              TOTAL ORDERS
            </span>
            <h3 className="text-2xl font-black text-neutral-900 tracking-tight">{totalOrders}</h3>
            <p className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-1">
              <TrendingUp size={12} /> Active customer orders
            </p>
          </div>
          <div className="w-12 h-12 bg-neutral-100 text-neutral-900 rounded-2xl flex items-center justify-center shrink-0 border border-neutral-200 shadow-inner">
            <ShoppingBag size={22} className="stroke-[2.5]" />
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 block mb-1">
              TOTAL CUSTOMERS
            </span>
            <h3 className="text-2xl font-black text-neutral-900 tracking-tight">
              {new Set(allOrders.map((o) => o.userEmail)).size}
            </h3>
            <p className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-1">
              <TrendingUp size={12} /> Unique ordering customers
            </p>
          </div>
          <div className="w-12 h-12 bg-neutral-100 text-neutral-900 rounded-2xl flex items-center justify-center shrink-0 border border-neutral-200 shadow-inner">
            <Users size={22} className="stroke-[2.5]" />
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 block mb-1">
              PENDING ORDERS
            </span>
            <h3 className="text-2xl font-black text-neutral-900 tracking-tight">{pendingOrdersCount}</h3>
            <p className="text-xs font-bold text-amber-600 flex items-center gap-1 mt-1">
              Awaiting confirmation
            </p>
          </div>
          <div className="w-12 h-12 bg-neutral-100 text-neutral-900 rounded-2xl flex items-center justify-center shrink-0 border border-neutral-200 shadow-inner">
            <Clock size={22} className="stroke-[2.5]" />
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Orders (Left) & Right Sidebar Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders (2 Columns Width) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-neutral-900 tracking-tight">Recent Orders</h2>
              <Link
                href="/admin/orders"
                className="text-xs font-extrabold text-neutral-900 hover:text-black flex items-center gap-1 transition-colors underline underline-offset-4"
              >
                View All <ArrowUpRight size={14} />
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <p className="text-xs font-semibold text-neutral-400 py-6 text-center">No orders placed yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-neutral-100 text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">
                      <th className="py-3 px-2">ORDER ID</th>
                      <th className="py-3 px-2">CUSTOMER</th>
                      <th className="py-3 px-2">DATE</th>
                      <th className="py-3 px-2">STATUS</th>
                      <th className="py-3 px-2 text-right">AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {recentOrders.map((order) => (
                      <tr key={order.orderId} className="hover:bg-neutral-50 transition-colors">
                        <td className="py-3.5 px-2 font-mono font-bold text-neutral-800">{order.orderId}</td>
                        <td className="py-3.5 px-2 font-bold text-neutral-900 capitalize">{order.fullName || "Customer"}</td>
                        <td className="py-3.5 px-2 text-neutral-400 font-semibold">
                          {new Date(order.date).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })}
                        </td>
                        <td className="py-3.5 px-2">
                          <span
                            className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border shadow-2xs inline-block ${
                              order.status === "DELIVERED"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : order.status === "CONFIRMED"
                                ? "bg-blue-50 text-blue-600 border-blue-200"
                                : "bg-neutral-100 text-neutral-800 border-neutral-300"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-2 text-right font-black text-neutral-900">
                          LKR {order.total.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Low Stock Alerts & Top Products */}
        <div className="space-y-6">
          {/* Low Stock Alerts */}
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} className="text-neutral-900" />
                <h2 className="text-base font-black text-neutral-900 tracking-tight">Low Stock Alerts</h2>
              </div>
              <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse"></span>
            </div>

            <div className="space-y-3">
              {lowStockItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-2 border-b border-neutral-100 last:border-0">
                  <span className="font-bold text-neutral-800 truncate max-w-[180px]">{item.name}</span>
                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products (7 Days) */}
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
            <h2 className="text-base font-black text-neutral-900 tracking-tight mb-5">Top Products (7 Days)</h2>
            <div className="space-y-4">
              {topProducts.map((prod, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-neutral-800">
                    <span className="truncate max-w-[200px]">{prod.name}</span>
                    <span className="text-[11px] font-extrabold text-neutral-400">{prod.percentage}%</span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${prod.barColor}`}
                      style={{ width: `${prod.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
