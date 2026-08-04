"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/store";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, ArrowLeft } from "lucide-react";

const FREE_DELIVERY_THRESHOLD = 5000;
const DELIVERY_FEE = 400;

export default function CartPage() {
  const { items, removeItem, updateQuantity, getCartTotal } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const subtotal = getCartTotal();
  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;
  const freeDeliveryProgress = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8F8FF] flex flex-col items-center justify-center text-center px-4">
        <ShoppingBag size={64} className="text-neutral-300 mb-6" />
        <h1 className="text-3xl font-black uppercase tracking-tighter text-neutral-900 mb-3">Your cart is empty</h1>
        <p className="text-neutral-500 mb-8">Looks like you haven&apos;t added anything yet.</p>
        <Link
          href="/shop"
          className="bg-neutral-900 text-white font-black uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-black transition-all shadow-md flex items-center gap-2"
        >
          Start Shopping <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8FF]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-6xl">

        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter text-neutral-900 flex items-center gap-2 sm:gap-3">
            <ShoppingBag size={28} className="text-neutral-900 sm:w-9 sm:h-9" />
            Shopping Cart
          </h1>
          <p className="text-neutral-500 mt-1 text-xs sm:text-sm">{items.length} item{items.length !== 1 ? "s" : ""} in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Cart Items ── */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div
                key={`${item.id}-${item.size}`}
                className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-3 sm:p-5 flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-5 group hover:shadow-md transition-shadow relative"
              >
                {/* Image */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-neutral-100 bg-neutral-50">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-[120px]">
                  <h3 className="font-black text-neutral-900 text-xs sm:text-sm leading-tight line-clamp-2">{item.name}</h3>
                  <p className="text-[10px] sm:text-xs text-neutral-400 font-semibold mt-0.5 sm:mt-1">Size: {item.size}</p>
                  <p className="text-[10px] sm:text-xs text-neutral-500 font-semibold mt-0.5">
                    Rs. {item.price.toLocaleString()} each
                  </p>
                </div>

                {/* Quantity + Price + Delete row on mobile */}
                <div className="flex items-center justify-between w-full sm:w-auto gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-neutral-100 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateQuantity(item.id, item.size, Math.max(1, item.quantity - 1))}
                      className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg border border-neutral-200 hover:bg-neutral-100 text-neutral-700 font-bold text-xs"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-6 sm:w-8 text-center text-xs sm:text-sm font-black text-neutral-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                      className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg border border-neutral-200 hover:bg-neutral-100 text-neutral-700 font-bold text-xs"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  <div className="text-right ml-auto sm:ml-0">
                    <p className="font-black text-neutral-900 text-sm sm:text-base">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() => removeItem(item.id, item.size)}
                    className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            {/* Continue Shopping */}
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                <ArrowLeft size={15} /> Continue Shopping
              </Link>
            </div>
          </div>

          {/* ── Order Summary ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-black uppercase tracking-tight text-neutral-900 mb-5 pb-4 border-b border-neutral-100">
                Order Summary
              </h2>

              <div className="space-y-3.5 text-sm">
                {/* Subtotal */}
                <div className="flex justify-between">
                  <span className="text-neutral-500 font-semibold">Subtotal</span>
                  <span className="font-black text-neutral-900">Rs. {subtotal.toLocaleString()}</span>
                </div>

                {/* Delivery */}
                <div className="flex justify-between">
                  <span className="text-neutral-500 font-semibold">Estimated Delivery</span>
                  <span className={`font-black ${deliveryFee === 0 ? "text-emerald-600" : "text-neutral-900"}`}>
                    {deliveryFee === 0 ? "FREE" : `Rs. ${deliveryFee.toLocaleString()}`}
                  </span>
                </div>

                {/* Free delivery progress bar */}
                {remaining > 0 && (
                  <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3">
                    <p className="text-[11px] font-extrabold text-neutral-600 mb-2">
                      Add <span className="text-neutral-900">Rs. {remaining.toLocaleString()}</span> more for FREE delivery!
                    </p>
                    <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-neutral-900 rounded-full transition-all duration-500"
                        style={{ width: `${freeDeliveryProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {deliveryFee === 0 && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-[11px] font-extrabold text-emerald-700">
                    🎉 You&apos;ve unlocked FREE delivery!
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-neutral-100 my-5" />

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="font-black text-neutral-900 text-base">Total Amount</span>
                <span className="font-black text-2xl text-neutral-900">Rs. {total.toLocaleString()}</span>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="w-full bg-neutral-900 hover:bg-black text-white font-black uppercase tracking-widest py-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group"
              >
                Proceed to Checkout
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* COD note */}
              <p className="text-center text-[11px] text-neutral-400 font-semibold mt-4">
                💳 Cash on Delivery · Islandwide
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
