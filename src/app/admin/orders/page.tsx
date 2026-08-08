"use client";

import { Search, ShoppingBag, RefreshCw, Package, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
}

interface OrderRecord {
  orderId: string;
  userEmail: string;
  fullName: string;
  phone: string;
  district: string;
  address: string;
  deliveryDate?: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  delivery: number;
  total: number;
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  date: string;
}

const STATUS_FILTERS = ["ALL", "PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  CONFIRMED: "bg-blue-50 text-blue-600 border-blue-200",
  SHIPPED: "bg-purple-50 text-purple-600 border-purple-200",
  DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-rose-50 text-rose-700 border-rose-200",
};

import { useOrderStore } from "@/lib/orderStore";

export default function OrdersManagement() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      let serverOrders: OrderRecord[] = [];
      try {
        const res = await fetch("/api/orders", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          serverOrders = data.orders ?? [];
        }
      } catch (e) {
        console.warn("Could not reach /api/orders, using persistent order store:", e);
      }

      const clientOrders = useOrderStore.getState().allOrders;
      const serverIds = new Set(serverOrders.map((o) => o.orderId));
      for (const co of clientOrders) {
        if (co && co.orderId && !serverIds.has(co.orderId)) {
          try {
            await fetch("/api/orders", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(co),
            });
            serverOrders.push(co);
          } catch {
            serverOrders.push(co);
          }
        }
      }

      const map = new Map<string, OrderRecord>();
      for (const o of serverOrders) {
        if (o && o.orderId) {
          map.set(o.orderId, o as OrderRecord);
        }
      }

      const merged = Array.from(map.values()).sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setOrders(merged);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => fetchOrders(), 10000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const handleStatusChange = async (orderId: string, status: string) => {
    // Update local client store
    useOrderStore.getState().updateOrderStatus(orderId, status as OrderRecord["status"]);

    // Optimistic UI update
    setOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, status: status as OrderRecord["status"] } : o))
    );
    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status }),
    });
  };

  const filteredOrders = orders.filter((o) => {
    const matchesFilter = filter === "ALL" || o.status === filter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      o.orderId.toLowerCase().includes(q) ||
      o.fullName.toLowerCase().includes(q) ||
      o.phone.includes(q) ||
      o.userEmail.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Order Management
          </h1>
          <p className="text-[11px] sm:text-xs font-semibold text-slate-400 mt-1">
            Process COD orders and update fulfillment status in real-time.
          </p>
        </div>
        <button
          onClick={() => { setLoading(true); fetchOrders(); }}
          className="flex items-center gap-2 self-start sm:self-auto text-xs font-bold text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200 px-4 py-2 rounded-xl transition-all hover:shadow-sm"
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Status filter tabs — horizontally scrollable */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {STATUS_FILTERS.map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-3 py-1.5 rounded-xl text-[10px] sm:text-xs font-extrabold transition-all border whitespace-nowrap shrink-0 ${
              filter === st
                ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {st}
            {st !== "ALL" && (
              <span className="ml-1 opacity-60">
                ({orders.filter((o) => o.status === st).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Order ID, Customer, Phone or Email..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs font-medium"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48 bg-white rounded-2xl border border-slate-200">
          <div className="text-center text-slate-400">
            <RefreshCw size={24} className="animate-spin mx-auto mb-2" />
            <p className="text-sm font-semibold">Loading orders...</p>
          </div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <ShoppingBag size={36} className="mx-auto text-slate-300 mb-3" />
          <p className="font-bold text-sm text-slate-700">No orders found</p>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Orders placed by customers will automatically appear here.
          </p>
        </div>
      ) : (
        <>
          {/* ── Desktop Table (hidden on mobile) ── */}
          <div className="hidden md:block bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 bg-slate-50/50">
                    <th className="px-5 py-4">Order ID</th>
                    <th className="px-5 py-4">Customer Details</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Items</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Total (LKR)</th>
                    <th className="px-5 py-4 text-right">Change Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map((order) => (
                    <tr key={order.orderId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-slate-700">{order.orderId}</td>
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-900 capitalize">{order.fullName || "Customer"}</p>
                        <p className="text-[11px] text-slate-400 font-semibold">
                          {order.phone} • {order.district}
                        </p>
                        <p className="text-[10px] text-slate-400">{order.userEmail}</p>
                      </td>
                      <td className="px-5 py-4 text-slate-400 font-semibold">
                        {new Date(order.date).toLocaleDateString("en-US", {
                          day: "2-digit", month: "short", year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-4 text-slate-500">
                        {order.items.slice(0, 2).map((item) => (
                          <p key={item.id} className="text-[11px]">
                            {item.name} × {item.quantity}{item.size ? ` (${item.size})` : ""}
                          </p>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-[10px] text-slate-400">+{order.items.length - 2} more</p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border shadow-xs inline-block ${STATUS_STYLES[order.status] || ""}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-black text-slate-900">
                        LKR {order.total.toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-900 font-extrabold text-[11px] focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer shadow-xs"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Mobile Cards (hidden on md+) ── */}
          <div className="md:hidden space-y-3">
            {filteredOrders.map((order) => {
              const isExpanded = expandedOrderId === order.orderId;
              return (
                <div key={order.orderId} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  {/* Card Header */}
                  <div
                    className="flex items-center justify-between px-4 py-3.5 cursor-pointer"
                    onClick={() => setExpandedOrderId(isExpanded ? null : order.orderId)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                        <Package size={16} className="text-slate-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-mono font-black text-slate-900 text-sm">{order.orderId}</p>
                        <p className="text-xs text-slate-500 font-semibold truncate">{order.fullName || "Customer"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${STATUS_STYLES[order.status] || ""}`}>
                        {order.status}
                      </span>
                      {isExpanded ? <ChevronUp size={15} className="text-slate-400" /> : <ChevronDown size={15} className="text-slate-400" />}
                    </div>
                  </div>

                  {/* Card Body (expanded) */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-slate-100 space-y-3 pt-3">
                      {/* Customer info */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-0.5">Phone</p>
                          <p className="font-semibold text-slate-700">{order.phone || "—"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-0.5">District</p>
                          <p className="font-semibold text-slate-700">{order.district || "—"}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-0.5">Email</p>
                          <p className="font-semibold text-slate-700 break-all">{order.userEmail || "—"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-0.5">Date</p>
                          <p className="font-semibold text-slate-700">
                            {new Date(order.date).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-0.5">Total</p>
                          <p className="font-black text-slate-900">LKR {order.total.toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Items */}
                      <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Items</p>
                        <div className="space-y-1">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-xs">
                              <span className="text-slate-700 font-semibold">
                                {item.name}{item.size ? ` (${item.size})` : ""} × {item.quantity}
                              </span>
                              <span className="text-slate-500">LKR {(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Status changer */}
                      <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">Update Status</p>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 font-extrabold text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      <p className="text-[11px] text-slate-400 text-right font-semibold">
        Showing {filteredOrders.length} of {orders.length} orders · Auto-refreshes every 15s
      </p>
    </div>
  );
}
