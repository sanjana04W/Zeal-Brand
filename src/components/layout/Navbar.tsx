"use client";

import Link from "next/link";
import { ShoppingBag, Menu, X, Search, Tag, User, Home, ShoppingBasket, LayoutGrid, Info, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/lib/store";
import { useAuthStore } from "@/lib/authStore";

const NAV_LINKS = [
  { label: "Home",       href: "/",           icon: Home },
  { label: "Shop",       href: "/shop",        icon: ShoppingBasket },
  { label: "Categories", href: "/categories",  icon: LayoutGrid },
  { label: "About",      href: "/about",       icon: Info },
  { label: "Contact",    href: "/contact",     icon: Phone },
];

export default function Navbar() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { items } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => { setMounted(true); }, []);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);
  const close = () => setDrawerOpen(false);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex h-14 sm:h-16 items-center justify-between gap-2">

            {/* ── Hamburger (mobile only) ── */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="md:hidden p-1.5 text-foreground focus:outline-none shrink-0"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            {/* ── Logo ── */}
            <div className="flex-1 md:flex-none flex justify-center md:justify-start">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden shrink-0 border border-neutral-300 shadow-sm bg-black">
                  <Image
                    src="/logo-black.jpg"
                    alt="Zeal Brand Logo"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <span className="text-lg sm:text-2xl font-black tracking-tighter uppercase">
                  Zeal Brand
                </span>
              </Link>
            </div>

            {/* ── Desktop Nav Links ── */}
            <div className="hidden md:flex flex-1 items-center justify-center gap-3 lg:gap-6">
              {NAV_LINKS.map((l) => {
                const isActive = pathname === l.href;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`transition-all duration-200 ${
                      isActive
                        ? "bg-neutral-900 text-white font-bold text-xs sm:text-sm px-4 py-1.5 rounded-full shadow-md"
                        : "text-xs sm:text-sm font-semibold text-neutral-600 hover:text-neutral-900 px-3 py-1.5 rounded-full hover:bg-neutral-100"
                    }`}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </div>

            {/* ── Right Icon Group ── */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              {/* Sale pill (hidden on smallest screens) */}
              <Link
                href="/sale"
                className="hidden sm:flex items-center gap-1.5 relative bg-red-500 hover:bg-red-600 text-white text-xs font-black tracking-widest uppercase px-3 sm:px-4 py-1.5 rounded-full transition-all duration-200 shadow-md overflow-hidden group"
              >
                <span className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-20 pointer-events-none" />
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none" />
                <Tag size={12} strokeWidth={3} className="animate-bounce" />
                Sale
              </Link>

              {/* Search (desktop only) */}
              <button className="text-foreground hover:text-muted-foreground transition-colors hidden md:block">
                <Search size={20} />
              </button>

              {/* Profile avatar / Sign-in */}
              {mounted && isAuthenticated && user ? (
                <Link
                  href="/profile"
                  title={`Signed in as ${user.name}`}
                  className="group"
                >
                  <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center font-black text-xs sm:text-sm uppercase shadow-sm ring-2 ring-transparent group-hover:ring-red-500 transition-all duration-200">
                    {user.name?.charAt(0) ?? "?"}
                  </span>
                </Link>
              ) : (
                <Link
                  href="/signin"
                  className="text-foreground hover:text-muted-foreground transition-colors p-1 flex items-center justify-center"
                  title="Sign In"
                >
                  <User size={18} />
                </Link>
              )}

              {/* Cart */}
              <Link href="/cart" className="relative p-1.5">
                <ShoppingBag size={20} />
                {mounted && cartItemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-600 text-[9px] font-bold flex items-center justify-center text-white">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════
          MOBILE SIDE DRAWER
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-xs md:hidden"
              onClick={close}
            />

            {/* Drawer Panel */}
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.28 }}
              className="fixed top-0 left-0 z-[70] h-full w-72 bg-white shadow-2xl flex flex-col md:hidden"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-neutral-300 shadow-sm bg-black">
                    <Image
                      src="/logo-black.jpg"
                      alt="Zeal Brand Logo"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-lg font-black tracking-tighter uppercase">
                    Zeal Brand
                  </span>
                </div>
                <button
                  onClick={close}
                  className="p-1.5 rounded-xl text-neutral-500 hover:bg-neutral-100 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* User greeting */}
              {mounted && isAuthenticated && user && (
                <div className="px-5 py-3 bg-neutral-50 border-b border-neutral-100 flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-neutral-900 text-white flex items-center justify-center font-black text-sm uppercase shrink-0">
                    {user.name?.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-neutral-900 leading-tight">{user.name}</p>
                    <p className="text-[11px] text-neutral-400 font-semibold">{user.email}</p>
                  </div>
                </div>
              )}

              {/* Nav Links */}
              <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
                {NAV_LINKS.map((l) => {
                  const Icon = l.icon;
                  const isActive = pathname === l.href;
                  return (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={close}
                      className={`flex items-center gap-3 px-4 py-3 rounded-full text-sm transition-all ${
                        isActive
                          ? "bg-neutral-900 text-white font-black shadow-md"
                          : "font-bold text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                      }`}
                    >
                      <Icon size={18} className={isActive ? "text-white" : "text-neutral-500 shrink-0"} />
                      {l.label}
                    </Link>
                  );
                })}

                {/* Sale link */}
                <Link
                  href="/sale"
                  onClick={close}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-black text-white bg-red-500 hover:bg-red-600 transition-all mt-2 relative overflow-hidden group"
                >
                  <span className="absolute inset-0 animate-ping bg-red-400 opacity-10 pointer-events-none rounded-xl" />
                  <Tag size={16} strokeWidth={3} className="animate-bounce shrink-0" />
                  SALE — Limited Offers
                </Link>
              </nav>

              {/* Bottom auth actions */}
              <div className="px-4 py-4 border-t border-neutral-100 space-y-2">
                {mounted && isAuthenticated ? (
                  <Link
                    href="/profile"
                    onClick={close}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-neutral-900 text-white text-xs font-black uppercase tracking-widest"
                  >
                    <User size={15} /> My Profile
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/signin"
                      onClick={close}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-neutral-900 text-white text-xs font-black uppercase tracking-widest"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      onClick={close}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-neutral-300 text-neutral-700 text-xs font-black uppercase tracking-widest hover:bg-neutral-50"
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
