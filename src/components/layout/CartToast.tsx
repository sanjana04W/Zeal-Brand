"use client";

import { useEffect, useRef } from "react";
import { useCartStore } from "@/lib/store";
import { X, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartToast() {
  const { lastAdded, toastVisible, hideToast } = useCartStore();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-dismiss after 4 seconds
  useEffect(() => {
    if (toastVisible) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => hideToast(), 4000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [toastVisible, lastAdded, hideToast]);

  if (!toastVisible || !lastAdded) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-[340px] max-w-[92vw]
                 bg-white rounded-2xl shadow-2xl border border-neutral-200
                 flex items-center gap-3 px-4 py-3
                 animate-in slide-in-from-bottom-4 fade-in duration-300"
      role="alert"
      aria-live="polite"
    >
      {/* Product Thumbnail */}
      <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-neutral-100 bg-neutral-50">
        {lastAdded.image ? (
          <Image
            src={lastAdded.image}
            alt={lastAdded.name}
            fill
            className="object-cover"
            sizes="56px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag size={22} className="text-neutral-300" />
          </div>
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-black text-neutral-900 leading-tight">Added to Cart!</p>
        <p className="text-xs text-neutral-500 font-medium line-clamp-1 mt-0.5">
          {lastAdded.name}
          {lastAdded.size ? ` · Size ${lastAdded.size}` : ""}
        </p>
        <Link
          href="/cart"
          onClick={hideToast}
          className="mt-1.5 inline-block text-[11px] font-black uppercase tracking-wider text-red-600 hover:text-red-700 transition-colors"
        >
          View Cart &amp; Checkout →
        </Link>
      </div>

      {/* Dismiss */}
      <button
        onClick={hideToast}
        className="shrink-0 p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-all"
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] rounded-b-2xl overflow-hidden">
        <div className="h-full bg-red-600 animate-[shrink_4s_linear_forwards]" />
      </div>
    </div>
  );
}
