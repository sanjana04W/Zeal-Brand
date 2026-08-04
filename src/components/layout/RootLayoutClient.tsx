"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Marquee from "@/components/layout/Marquee";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import CartToast from "@/components/layout/CartToast";
import AuthToast from "@/components/layout/AuthToast";
import CustomCursor from "@/components/layout/CustomCursor";

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    // Admin pages: render children only — the admin layout handles its own chrome
    return (
      <>
        <CustomCursor />
        <AuthToast />
        {children}
      </>
    );
  }

  // Public website
  return (
    <>
      <CustomCursor />
      <AuthToast />
      <Navbar />
      <Marquee />
      <CartToast />
      <main className="flex-1">{children}</main>
      <Footer />
      <ScrollToTop />
    </>
  );
}

