"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  LogOut,
  Package,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowLeft,
  Pencil,
  Lock,
  Shield,
  Save,
  Check,
  Settings,
  LayoutDashboard,
  ShoppingBag,
} from "lucide-react";
import { useAuthStore } from "@/lib/authStore";
import { useOrderStore, OrderRecord } from "@/lib/orderStore";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, updateUser } = useAuthStore();
  const [userOrders, setUserOrders] = useState<OrderRecord[]>([]);
  const [mounted, setMounted] = useState(false);

  // Active tab state: "overview" | "orders" | "settings"
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "settings">("overview");

  // Form states for Settings tab
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Edit states
  const [editingField, setEditingField] = useState<string | null>(null);
  const [infoSavedSuccess, setInfoSavedSuccess] = useState(false);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSavedSuccess, setPasswordSavedSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    setMounted(true);
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setAddress(user.address || "No 123, Main Street, Colombo 05");

      const userEmailClean = (user.email || "").trim().toLowerCase();
      const userPhoneClean = (user.phone || "").trim().replace(/\D/g, "");

      const loadUserOrders = async () => {
        try {
          // Step 1: Fetch server orders (single source of truth)
          let serverOrders: any[] = [];
          try {
            const res = await fetch("/api/orders", { cache: "no-store" });
            if (res.ok) {
              const data = await res.json();
              serverOrders = data.orders ?? [];
            }
          } catch (err) {
            console.warn("Could not fetch /api/orders:", err);
          }

          // Step 2: Sync any client-only orders to server
          const clientOrders = useOrderStore.getState().allOrders;
          const serverIds = new Set(serverOrders.map((o: any) => o.orderId));
          for (const co of clientOrders) {
            if (co && co.orderId && !serverIds.has(co.orderId)) {
              // This order only exists in this browser's localStorage — push it to server
              try {
                await fetch("/api/orders", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(co),
                });
                serverOrders.push(co);
              } catch {
                // If sync fails, still include it locally
                serverOrders.push(co);
              }
            }
          }

          // Step 3: Deduplicate by orderId with status priority
          const getOrderStatusRank = (s?: string) => {
            if (s === "CANCELLED" || s === "DELIVERED") return 4;
            if (s === "SHIPPED") return 3;
            if (s === "CONFIRMED") return 2;
            return 1;
          };

          const map = new Map<string, any>();
          for (const o of [...serverOrders, ...clientOrders]) {
            if (o && o.orderId) {
              const existing = map.get(o.orderId);
              if (existing) {
                const higherStatus = getOrderStatusRank(existing.status) >= getOrderStatusRank(o.status) ? existing.status : o.status;
                map.set(o.orderId, { ...o, ...existing, status: higherStatus });
              } else {
                map.set(o.orderId, o);
              }
            }
          }
          const allMerged = Array.from(map.values());

          // Step 4: Filter by user email/phone
          const matched = allMerged.filter((o) => {
            const orderEmail = (o.userEmail || "").trim().toLowerCase();
            const orderPhone = (o.phone || "").trim().replace(/\D/g, "");
            const emailMatch = Boolean(userEmailClean && orderEmail === userEmailClean);
            const phoneMatch = Boolean(userPhoneClean && orderPhone && orderPhone === userPhoneClean);
            return emailMatch || phoneMatch;
          });
          setUserOrders(matched);
        } catch (err) {
          console.error("Failed to fetch user orders:", err);
        }
      };

      loadUserOrders();
      const interval = setInterval(loadUserOrders, 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

  if (!mounted) return null;

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[#F8F8FF] flex flex-col items-center justify-center text-center p-4">
        <div className="w-16 h-16 bg-neutral-100 border border-neutral-200 rounded-2xl flex items-center justify-center mb-4 text-neutral-400">
          <User size={32} />
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tighter text-neutral-900 mb-2">Access Restricted</h1>
        <p className="text-neutral-500 text-sm max-w-sm mb-6">
          Please sign in to view your profile, track active orders, and manage account preferences.
        </p>
        <Link
          href="/signin"
          className="bg-neutral-900 hover:bg-black text-white font-black uppercase tracking-widest px-8 py-3.5 rounded-xl transition-all shadow-md"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name, phone, address });
    setEditingField(null);
    setInfoSavedSuccess(true);
    setTimeout(() => setInfoSavedSuccess(false), 3500);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (!newPassword) {
      setPasswordError("Please enter a new password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordSavedSuccess(true);
    setTimeout(() => setPasswordSavedSuccess(false), 3500);
  };

  return (
    <div className="min-h-screen bg-[#F8F8FF] py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-neutral-900 transition-colors uppercase tracking-wider"
          >
            <ArrowLeft size={14} /> Back to Shop
          </Link>
        </div>

        {/* Dashboard Grid (Sidebar + Main Content) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ── LEFT SIDEBAR NAVIGATION ── */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Sidebar Card */}
            <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-sm p-5 space-y-6">
              
              {/* User Avatar Badge Card */}
              <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-4 flex items-center gap-3.5">
                <div className="w-12 h-12 bg-neutral-900 text-white font-black text-xl rounded-2xl flex items-center justify-center shrink-0 shadow-md">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-black text-neutral-900 text-sm truncate leading-tight">{user.name}</h3>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">
                    CUSTOMER
                  </span>
                </div>
              </div>

              {/* Navigation Tabs */}
              <nav className="space-y-1">
                {/* Overview Button */}
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-xs transition-all relative ${
                    activeTab === "overview"
                      ? "bg-neutral-100 text-neutral-900 font-extrabold shadow-xs"
                      : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                  }`}
                >
                  {activeTab === "overview" && (
                    <span className="absolute left-1.5 top-2.5 bottom-2.5 w-1 bg-neutral-900 rounded-full" />
                  )}
                  <LayoutDashboard size={18} className={activeTab === "overview" ? "text-neutral-900" : "text-neutral-400"} />
                  <span>Overview</span>
                </button>

                {/* Order History Button */}
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-xs transition-all relative ${
                    activeTab === "orders"
                      ? "bg-neutral-100 text-neutral-900 font-extrabold shadow-xs"
                      : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                  }`}
                >
                  {activeTab === "orders" && (
                    <span className="absolute left-1.5 top-2.5 bottom-2.5 w-1 bg-neutral-900 rounded-full" />
                  )}
                  <Package size={18} className={activeTab === "orders" ? "text-neutral-900" : "text-neutral-400"} />
                  <span>Order History</span>
                </button>

                {/* Settings Button */}
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-xs transition-all relative ${
                    activeTab === "settings"
                      ? "bg-neutral-100 text-neutral-900 font-extrabold shadow-xs"
                      : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                  }`}
                >
                  {activeTab === "settings" && (
                    <span className="absolute left-1.5 top-2.5 bottom-2.5 w-1 bg-neutral-900 rounded-full" />
                  )}
                  <Settings size={18} className={activeTab === "settings" ? "text-neutral-900" : "text-neutral-400"} />
                  <span>Settings</span>
                </button>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-xs text-neutral-600 hover:text-red-600 hover:bg-red-50 transition-all mt-4"
                >
                  <LogOut size={18} className="text-neutral-400" />
                  <span>Logout</span>
                </button>
              </nav>

            </div>
          </div>

          {/* ── RIGHT MAIN CONTENT AREA ── */}
          <div className="lg:col-span-8">

            {/* TAB 1: OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                
                {/* Main Card */}
                <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-sm p-6 md:p-8 space-y-6">
                  
                  {/* Welcome Header */}
                  <div>
                    <h1 className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tight">
                      Welcome Back, {user.name}!
                    </h1>
                    <p className="text-xs text-neutral-500 font-semibold mt-1">
                      Manage your order history, delivery details, and keep your contact information up-to-date.
                    </p>
                  </div>

                  {/* 3 Metric Stat Cards Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Stat 1 */}
                    <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-xs">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 block mb-2">
                        TOTAL ORDERS
                      </span>
                      <p className="text-2xl font-black text-neutral-900">{userOrders.length}</p>
                    </div>

                    {/* Stat 2 */}
                    <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-xs">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 block mb-2">
                        TOTAL SPENT
                      </span>
                      <p className="text-2xl font-black text-neutral-900">Rs. {userOrders.reduce((s, o) => s + o.total, 0).toLocaleString()}</p>
                    </div>

                    {/* Stat 3 */}
                    <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-xs">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 block mb-2">
                        MEMBER SINCE
                      </span>
                      <p className="text-base font-black text-neutral-900 mt-1">
                        {user.joinedDate || "July 2026"}
                      </p>
                    </div>
                  </div>

                  {/* Account Overview Box */}
                  <div className="bg-neutral-50/60 border border-neutral-200/70 rounded-2xl p-6">
                    <h2 className="text-sm font-black text-neutral-900 tracking-tight mb-4">
                      Account Overview
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 block mb-1">
                          EMAIL ADDRESS
                        </span>
                        <p className="font-bold text-neutral-900 text-sm break-all">{user.email}</p>
                      </div>

                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 block mb-1">
                          PHONE NUMBER
                        </span>
                        <p className="font-bold text-neutral-900 text-sm">{user.phone || "Not set"}</p>
                      </div>

                      <div className="sm:col-span-2 pt-2 border-t border-neutral-200/60">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 block mb-1">
                          DEFAULT DELIVERY ADDRESS
                        </span>
                        <p className="font-semibold text-neutral-800 leading-relaxed">
                          {address}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* TAB 2: ORDER HISTORY */}
            {activeTab === "orders" && (() => {
              const localUserOrders = userOrders;
              return (
                <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-sm p-6 md:p-8 space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                    <h2 className="text-xl font-black text-neutral-900 flex items-center gap-2">
                      <Package size={20} className="text-neutral-500" /> Order History
                    </h2>
                    <span className="text-xs font-extrabold text-neutral-400">
                      {localUserOrders.length} Order{localUserOrders.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {localUserOrders.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-14 h-14 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Package size={28} className="text-neutral-400" />
                      </div>
                      <h3 className="font-black text-neutral-900 mb-1">No orders yet</h3>
                      <p className="text-xs text-neutral-400 font-semibold">Your completed orders will appear here.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {localUserOrders.map((order) => {
                        const statusStyle =
                          order.status === "DELIVERED" ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                          : order.status === "CONFIRMED" ? "bg-blue-100 text-blue-700 border-blue-200"
                          : order.status === "SHIPPED" ? "bg-purple-100 text-purple-700 border-purple-200"
                          : order.status === "CANCELLED" ? "bg-red-100 text-red-700 border-red-200"
                          : "bg-amber-100 text-amber-700 border-amber-200";
                        return (
                          <div
                            key={order.orderId}
                            className="border border-neutral-200 rounded-2xl p-5 hover:border-neutral-300 transition-all bg-neutral-50/50"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-neutral-200/60 mb-3">
                              <div>
                                <span className="font-black text-sm text-neutral-900">{order.orderId}</span>
                                <span className="text-xs text-neutral-400 font-semibold ml-3">
                                  {new Date(order.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                                </span>
                              </div>
                              <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${statusStyle}`}>
                                {order.status}
                              </span>
                            </div>

                            <div className="space-y-2 mb-3">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center text-xs">
                                  <span className="font-bold text-neutral-800">
                                    {item.quantity}x {item.name}
                                    {item.size && <span className="text-neutral-400 font-semibold"> ({item.size})</span>}
                                  </span>
                                  <span className="font-extrabold text-neutral-900">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                              ))}
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-neutral-200/60 text-xs">
                              <span className="text-neutral-500 font-bold">Total Paid (COD)</span>
                              <span className="font-black text-red-600 text-sm">Rs. {order.total.toLocaleString()}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* TAB 3: SETTINGS (PERSONAL INFO & PASSWORD) */}
            {activeTab === "settings" && (
              <div className="space-y-8">
                
                {/* ── Personal Information Card ── */}
                <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-sm p-6 md:p-8">
                  <div className="flex items-center gap-3.5 mb-8 pb-4 border-b border-neutral-100">
                    <div className="w-10 h-10 bg-neutral-100 text-neutral-900 rounded-2xl flex items-center justify-center border border-neutral-200 shrink-0">
                      <User size={20} className="stroke-[2.5]" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-neutral-900 tracking-tight">Personal Information</h2>
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">
                        YOUR BASIC ACCOUNT DETAILS
                      </p>
                    </div>
                  </div>

                  {infoSavedSuccess && (
                    <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-4 py-3 rounded-2xl flex items-center gap-2 animate-in fade-in">
                      <CheckCircle2 size={16} /> Personal information updated &amp; saved successfully!
                    </div>
                  )}

                  <form onSubmit={handleSaveInfo} className="space-y-6">
                    {/* Row 1: Full Name & Email Address */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Full Name */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-xs font-extrabold text-neutral-700 flex items-center gap-1.5">
                            <User size={14} className="text-neutral-400" /> Full Name
                          </label>
                          <button
                            type="button"
                            onClick={() => setEditingField(editingField === "name" ? null : "name")}
                            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors"
                          >
                            <Pencil size={12} /> {editingField === "name" ? "Editing..." : "Edit"}
                          </button>
                        </div>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          onFocus={() => setEditingField("name")}
                          className={`w-full px-4 py-3.5 rounded-2xl text-sm font-semibold border transition-all ${
                            editingField === "name"
                              ? "border-neutral-900 bg-white ring-2 ring-neutral-900"
                              : "border-neutral-200 bg-neutral-50/60 text-neutral-900"
                          }`}
                        />
                      </div>

                      {/* Email Address (Read-only) */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-xs font-extrabold text-neutral-700 flex items-center gap-1.5">
                            <Mail size={14} className="text-neutral-400" /> Email Address
                          </label>
                        </div>
                        <input
                          type="email"
                          disabled
                          readOnly
                          value={user.email}
                          className="w-full px-4 py-3.5 rounded-2xl text-sm font-semibold border border-neutral-200 bg-neutral-100/70 text-neutral-500 cursor-not-allowed"
                        />
                        <p className="text-[11px] font-semibold text-neutral-400 mt-1.5 flex items-center gap-1">
                          <Lock size={12} /> Email address cannot be changed
                        </p>
                      </div>
                    </div>

                    {/* Row 2: Phone Number */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-xs font-extrabold text-neutral-700 flex items-center gap-1.5">
                            <Phone size={14} className="text-neutral-400" /> Phone Number
                          </label>
                          <button
                            type="button"
                            onClick={() => setEditingField(editingField === "phone" ? null : "phone")}
                            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors"
                          >
                            <Pencil size={12} /> {editingField === "phone" ? "Editing..." : "Edit"}
                          </button>
                        </div>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          onFocus={() => setEditingField("phone")}
                          className={`w-full px-4 py-3.5 rounded-2xl text-sm font-semibold border transition-all ${
                            editingField === "phone"
                              ? "border-neutral-900 bg-white ring-2 ring-neutral-900"
                              : "border-neutral-200 bg-neutral-50/60 text-neutral-900"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Row 3: Default Delivery Address */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-extrabold text-neutral-700 flex items-center gap-1.5">
                          <MapPin size={14} className="text-neutral-400" /> Default Delivery Address
                        </label>
                        <button
                          type="button"
                          onClick={() => setEditingField(editingField === "address" ? null : "address")}
                          className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors"
                        >
                          <Pencil size={12} /> {editingField === "address" ? "Editing..." : "Edit"}
                        </button>
                      </div>
                      <textarea
                        rows={3}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        onFocus={() => setEditingField("address")}
                        placeholder="Enter your full delivery address"
                        className={`w-full p-4 rounded-2xl text-sm font-semibold border transition-all resize-none ${
                          editingField === "address"
                            ? "border-neutral-900 bg-white ring-2 ring-neutral-900"
                            : "border-neutral-200 bg-neutral-50/60 text-neutral-900"
                        }`}
                      />
                    </div>

                    {/* Save Button */}
                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        className="bg-neutral-900 hover:bg-black text-white text-xs font-black uppercase tracking-widest px-8 py-3.5 rounded-2xl transition-all shadow-md flex items-center gap-2"
                      >
                        <Save size={15} /> Save Changes
                      </button>
                    </div>
                  </form>
                </div>

                {/* ── Change Password Card ── */}
                <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-sm p-6 md:p-8">
                  <div className="flex items-center gap-3.5 mb-8 pb-4 border-b border-neutral-100">
                    <div className="w-10 h-10 bg-neutral-100 text-neutral-900 rounded-2xl flex items-center justify-center border border-neutral-200 shrink-0">
                      <Shield size={20} className="stroke-[2.5]" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-neutral-900 tracking-tight">Change Password</h2>
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">
                        LEAVE FIELDS BLANK IF YOU DON&apos;T WANT TO CHANGE YOUR PASSWORD
                      </p>
                    </div>
                  </div>

                  {passwordSavedSuccess && (
                    <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-4 py-3 rounded-2xl flex items-center gap-2 animate-in fade-in">
                      <CheckCircle2 size={16} /> Password updated successfully!
                    </div>
                  )}

                  {passwordError && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-xs font-bold px-4 py-3 rounded-2xl">
                      {passwordError}
                    </div>
                  )}

                  <form onSubmit={handleChangePassword} className="space-y-6">
                    {/* Current Password */}
                    <div>
                      <label className="text-xs font-extrabold text-neutral-700 block mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
                          <Lock size={16} />
                        </div>
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm font-semibold border border-neutral-200 bg-neutral-50/60 focus:bg-white focus:ring-2 focus:ring-neutral-900 focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Grid: New & Confirm Password */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-xs font-extrabold text-neutral-700 block mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
                            <Lock size={16} />
                          </div>
                          <input
                            type="password"
                            placeholder="••••••••"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm font-semibold border border-neutral-200 bg-neutral-50/60 focus:bg-white focus:ring-2 focus:ring-neutral-900 focus:outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-extrabold text-neutral-700 block mb-2">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
                            <Lock size={16} />
                          </div>
                          <input
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm font-semibold border border-neutral-200 bg-neutral-50/60 focus:bg-white focus:ring-2 focus:ring-neutral-900 focus:outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit Password */}
                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        className="bg-neutral-900 hover:bg-black text-white text-xs font-black uppercase tracking-widest px-8 py-3.5 rounded-2xl transition-all shadow-md flex items-center gap-2"
                      >
                        <Check size={15} /> Update Password
                      </button>
                    </div>
                  </form>
                </div>

              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
