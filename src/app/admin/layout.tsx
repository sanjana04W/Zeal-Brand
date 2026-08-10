"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Tags,
  BarChart3,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Bell,
  ChevronDown,
  ShieldAlert,
  Flame,
  Store,
  ArrowUpRight,
  TrendingUp,
  Inbox,
  Mail,
  X,
  CheckCheck,
  Menu,
} from "lucide-react";
import { useNotificationStore } from "@/lib/notificationStore";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: "Unread" | "Read" | "Replied";
  createdAt: number;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRoleState] = useState<"Owner" | "Staff">("Owner");
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    notifications,
    dismissedIds: persistedDismissedIds,
    readMessageIds,
    dismissNotification,
    dismissAll,
    addDismissedId,
    addDismissedIds,
    addReadMessageId,
  } = useNotificationStore();
  const notifRef = useRef<HTMLDivElement>(null);

  const [serverPendingOrders, setServerPendingOrders] = useState<any[]>([]);
  const [serverUnreadMessages, setServerUnreadMessages] = useState<any[]>([]);
  const [pendingOrderCount, setPendingOrderCount] = useState(0);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);

  // Fetch live counts and lists for pending orders and unread messages
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [ordersRes, msgsRes] = await Promise.all([
          fetch("/api/orders", { cache: "no-store" }),
          fetch("/api/messages", { cache: "no-store" }),
        ]);

        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          const allOrders = ordersData.orders ?? [];
          const pending = allOrders.filter((o: any) => o.status === "PENDING");
          setPendingOrderCount(pending.length);
          setServerPendingOrders(pending);
        }

        if (msgsRes.ok) {
          const msgsData = await msgsRes.json();
          const allMsgs = msgsData.messages ?? [];
          // Filter out messages that have been marked read on the server OR locally
          const unreadMsgs = allMsgs.filter(
            (m: any) => m.status === "Unread" && !readMessageIds.includes(m.id)
          );
          setUnreadMessageCount(unreadMsgs.length);
          setServerUnreadMessages(unreadMsgs);
        }
      } catch { /* ignore */ }
    };
    fetchCounts();
    const interval = setInterval(fetchCounts, 10000);
    return () => clearInterval(interval);
  }, [readMessageIds]);

  // Load persisted role from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("zeal-admin-role") as "Owner" | "Staff" | null;
    if (saved === "Owner" || saved === "Staff") {
      setRoleState(saved);
    }
  }, []);

  // Persist role to localStorage on every change
  const setRole = (newRole: "Owner" | "Staff") => {
    setRoleState(newRole);
    localStorage.setItem("zeal-admin-role", newRole);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Dynamically derive active notifications from server state + custom store
  // Use persisted dismissedIds so dismissed notifications don't reappear on refresh
  const dismissedSet = new Set(persistedDismissedIds);

  const allDerivedNotifications = [
    ...serverUnreadMessages
      .filter((msg) => !dismissedSet.has(`server-msg-${msg.id}`))
      .map((msg) => ({
        id: `server-msg-${msg.id}`,
        type: "MESSAGE" as const,
        title: "New Contact Message",
        subtitle: msg.name || "Customer Inquiry",
        detail: `"${(msg.message || "").slice(0, 45)}${(msg.message || "").length > 45 ? "..." : ""}"`,
        link: "/admin/messages",
        date: msg.date || "Just now",
        read: false,
      })),
    ...serverPendingOrders
      .filter((order) => !dismissedSet.has(`server-order-${order.orderId}`))
      .map((order) => ({
        id: `server-order-${order.orderId}`,
        type: "ORDER" as const,
        title: "New Order Placed",
        subtitle: order.orderId,
        detail: `${order.fullName || "Customer"} placed an order for Rs. ${(order.total || 0).toLocaleString()}`,
        link: "/admin/orders",
        date: order.date ? new Date(order.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Just now",
        read: false,
      })),
    ...notifications.filter((n) => !n.read && !dismissedSet.has(n.id)),
  ];

  // Deduplicate
  const notifMap = new Map<string, any>();
  for (const n of allDerivedNotifications) {
    if (n && n.id) notifMap.set(n.id, n);
  }
  const displayNotifications = Array.from(notifMap.values());
  const unreadCount = displayNotifications.length;

  // Dismiss (remove) a single notification — persisted so it doesn't come back
  const handleDismiss = (id: string) => {
    addDismissedId(id);
    dismissNotification(id);
    // If it's a message notification, also track the message as read
    if (id.startsWith("server-msg-")) {
      const msgId = id.replace("server-msg-", "");
      addReadMessageId(msgId);
      // Also update server status
      fetch("/api/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: msgId, status: "Read" }),
      }).catch(() => {});
    }
  };

  // Dismiss all unread notifications — persisted
  const handleDismissAll = () => {
    const allIds = displayNotifications.map((n) => n.id);
    addDismissedIds(allIds);
    // Mark all message notifications as read on server
    for (const n of displayNotifications) {
      if (n.id.startsWith("server-msg-")) {
        const msgId = n.id.replace("server-msg-", "");
        addReadMessageId(msgId);
        fetch("/api/messages", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: msgId, status: "Read" }),
        }).catch(() => {});
      }
    }
    dismissAll();
    setNotifOpen(false);
  };

  // Don't show admin sidebar/header on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const allNavItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard, staffAccess: true },
    { name: "Order Management", href: "/admin/orders", icon: ShoppingCart, badge: pendingOrderCount > 0 ? pendingOrderCount : undefined, badgeColor: "bg-red-600 text-white", staffAccess: true },
    { name: "Product Catalog", href: "/admin/products", icon: Package, staffAccess: false },
    { name: "Promotions & Offers", href: "/admin/promotions", icon: Tags, staffAccess: false },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3, staffAccess: false },
    { name: "User Management", href: "/admin/users", icon: Users, staffAccess: false },
    { name: "Messages", href: "/admin/messages", icon: MessageSquare, badge: unreadMessageCount > 0 ? unreadMessageCount : undefined, badgeColor: "bg-red-600 text-white", staffAccess: true },
    { name: "System Settings", href: "/admin/settings", icon: Settings, staffAccess: false },
  ];

  const navItems = role === "Staff"
    ? allNavItems.filter((item) => item.staffAccess)
    : allNavItems;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-neutral-900 flex flex-col font-sans">
      {/* Top Operations Header Bar */}
      <header className="h-14 sm:h-16 bg-neutral-900 text-white flex items-center justify-between px-3 sm:px-6 shrink-0 border-b border-neutral-800 shadow-sm z-30">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1.5 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-300 hover:text-white transition-all"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>

          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-neutral-800 border border-neutral-700 rounded-xl flex items-center justify-center font-black text-lg text-white shadow-inner">
            <Flame className="text-red-500 fill-red-500" size={18} />
          </div>
          <div className="hidden sm:block">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 block leading-tight">ZEAL BRAND</span>
            <h1 className="text-base sm:text-lg font-black tracking-tight leading-none">Operations Control Panel</h1>
          </div>
          <div className="sm:hidden">
            <h1 className="text-xs font-black tracking-tight whitespace-nowrap">Admin Panel</h1>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Stats Badges */}
          <div className="hidden lg:flex items-center gap-2">
            <div className="bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-extrabold px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-xs whitespace-nowrap">
              <Inbox size={14} className="text-neutral-400 shrink-0" />
              <span>{pendingOrderCount} Pending</span>
            </div>
            <div className="bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-extrabold px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-xs whitespace-nowrap">
              <TrendingUp size={14} className="text-emerald-400 shrink-0" />
              <span>LKR 124,500</span>
            </div>
          </div>

          {/* Test Role Switcher */}
          <div className="relative shrink-0">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white text-[11px] sm:text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-xl flex items-center gap-1.5 sm:gap-2 transition-all shadow-xs whitespace-nowrap"
            >
              <ShieldAlert size={14} className="text-amber-400 shrink-0" />
              <span className="whitespace-nowrap">TEST ROLE: <strong className="font-black underline underline-offset-2">{role}</strong></span>
              <ChevronDown size={14} className={`shrink-0 transition-transform duration-200 ${roleDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-2xl border border-neutral-200 text-neutral-800 text-xs font-bold py-1 z-50 overflow-hidden">
                <button
                  onClick={() => { setRole("Owner"); setRoleDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 hover:bg-neutral-100 transition-colors flex items-center justify-between ${role === "Owner" ? "text-neutral-900 bg-neutral-100 font-black" : ""}`}
                >
                  Owner {role === "Owner" && "✓"}
                </button>
                <button
                  onClick={() => { setRole("Staff"); setRoleDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 hover:bg-neutral-100 transition-colors flex items-center justify-between ${role === "Staff" ? "text-neutral-900 bg-neutral-100 font-black" : ""}`}
                >
                  Staff {role === "Staff" && "✓"}
                </button>
              </div>
            )}
          </div>

          {/* ── Notification Bell + Dropdown ── */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen((prev) => !prev)}
              className="relative w-9 h-9 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl flex items-center justify-center text-white transition-all shadow-xs"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-neutral-900 shadow pointer-events-none animate-pulse">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-neutral-200 z-50 overflow-hidden">
                {/* Panel Header */}
                <div className="px-4 py-3 bg-neutral-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell size={15} className="text-white" />
                    <span className="text-sm font-black text-white">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={handleDismissAll}
                        className="text-[10px] text-neutral-400 hover:text-white font-bold flex items-center gap-1 transition-colors"
                        title="Mark all as read"
                      >
                        <CheckCheck size={13} />
                        All read
                      </button>
                    )}
                    <button
                      onClick={() => setNotifOpen(false)}
                      className="text-neutral-400 hover:text-white transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {/* Notification Items */}
                <div className="max-h-80 overflow-y-auto divide-y divide-neutral-100">
                  {unreadCount === 0 ? (
                    <div className="py-10 text-center text-neutral-400">
                      <Bell size={28} className="mx-auto mb-2 text-neutral-300" />
                      <p className="text-sm font-semibold">All caught up!</p>
                      <p className="text-xs mt-1">No unread notifications.</p>
                    </div>
                  ) : (
                    displayNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="flex items-start gap-3 px-4 py-3.5 hover:bg-neutral-50 transition-colors group"
                      >
                        {/* Icon */}
                        <div
                          className={`w-9 h-9 text-white rounded-xl flex items-center justify-center shrink-0 font-black text-sm shadow-xs ${
                            notif.type === "ORDER" ? "bg-red-600" : "bg-neutral-900"
                          }`}
                        >
                          {notif.type === "ORDER" ? <ShoppingCart size={16} /> : <Mail size={16} />}
                        </div>

                        {/* Content — click to go to relevant page and dismiss */}
                        <button
                          className="flex-1 text-left"
                          onClick={() => {
                            handleDismiss(notif.id);
                            setNotifOpen(false);
                            router.push(notif.link);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-black text-neutral-900 leading-tight">{notif.title}</p>
                            <span className="text-[10px] font-bold text-neutral-400">{notif.date}</span>
                          </div>
                          <p className="text-[11px] text-neutral-700 font-extrabold mt-0.5">{notif.subtitle}</p>
                          <p className="text-[11px] text-neutral-500 line-clamp-2 mt-0.5 leading-relaxed">{notif.detail}</p>
                        </button>

                        {/* Dismiss ✕ */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDismiss(notif.id);
                          }}
                          className="shrink-0 p-1 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Dismiss notification"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Panel Footer */}
                <div className="px-4 py-3 border-t border-neutral-100 bg-neutral-50">
                  <Link
                    href="/admin/messages"
                    onClick={() => setNotifOpen(false)}
                    className="block text-center text-xs font-black text-neutral-900 hover:text-red-600 transition-colors uppercase tracking-widest"
                  >
                    View All Messages →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-2 border-l border-neutral-800">
            <div className={`w-9 h-9 border rounded-xl flex items-center justify-center text-white font-black text-sm shadow-xs ${
              role === "Owner"
                ? "bg-gradient-to-br from-rose-500 to-red-600 border-red-700"
                : "bg-neutral-700 border-neutral-600"
            }`}>
              {role === "Owner" ? "Z" : "S"}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-black leading-tight text-white">
                {role === "Owner" ? "Zeal Owner" : "Zeal Staff"}
              </p>
              <p className="text-[10px] font-extrabold uppercase tracking-wider" style={{ color: role === "Owner" ? "#f87171" : "#94a3b8" }}>
                {role === "Owner" ? "OWNER" : "STAFF"}
              </p>
            </div>
            <Link
              href="/admin/login"
              className="ml-1 p-2 bg-neutral-800 hover:bg-red-600 hover:text-white rounded-xl transition-all text-neutral-300"
              title="Logout"
            >
              <LogOut size={16} />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar — fixed overlay on mobile, static on desktop */}
        <aside className={`
          fixed top-0 left-0 h-full z-50 w-64 bg-white border-r border-neutral-200 flex flex-col p-4 justify-between shadow-xl
          transition-transform duration-300
          lg:static lg:translate-x-0 lg:shadow-xs lg:z-20
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
          <div>
            <div className="mb-4">
              <span className="text-[11px] font-black text-neutral-400 tracking-widest uppercase block mb-3 px-3">
                NAVIGATION
              </span>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 ${
                        isActive
                          ? "bg-neutral-900 text-white shadow-md shadow-neutral-900/20"
                          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={18} className={isActive ? "text-white" : "text-neutral-500"} />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Bottom Sidebar Controls */}
          <div className="space-y-2 pt-4 border-t border-neutral-100">
            <div className={`border rounded-xl p-3 text-center shadow-2xs ${
              role === "Staff"
                ? "bg-blue-50 border-blue-200"
                : "bg-neutral-100 border-neutral-200"
            }`}>
              <span className={`text-[11px] font-black tracking-widest uppercase flex items-center justify-center gap-1.5 ${
                role === "Staff" ? "text-blue-800" : "text-neutral-900"
              }`}>
                <ShieldAlert size={14} className={role === "Staff" ? "text-blue-600" : "text-neutral-900"} />
                {role === "Staff" ? "STAFF ACCESS" : "FULL OWNER ACCESS"}
              </span>
              {role === "Staff" && (
                <p className="text-[10px] text-blue-500 font-semibold mt-0.5">
                  Limited to 3 sections
                </p>
              )}
            </div>

            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl font-bold text-xs transition-all"
            >
              <div className="flex items-center gap-2">
                <Store size={16} />
                <span>Visit Online Store</span>
              </div>
              <ArrowUpRight size={14} />
            </Link>

            <button
              onClick={() => router.push("/admin/login")}
              className="w-full bg-[#111111] hover:bg-black text-white rounded-xl py-3 px-4 flex items-center justify-center gap-2 font-bold text-xs transition-all shadow-md"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#f8fafc]">
          {children}
        </main>
      </div>
    </div>
  );
}
