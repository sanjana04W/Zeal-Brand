"use client";

import Link from "next/link";
import { CheckCircle2, Truck, Phone, MapPin, Calendar, Package, ShoppingBag } from "lucide-react";
import { useState, useEffect, use } from "react";
import { useOrderStore } from "@/lib/orderStore";

export default function OrderConfirmation({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;
  const { lastOrder } = useOrderStore();

  const [order, setOrder] = useState<any>(
    lastOrder?.orderId === orderId ? lastOrder : null
  );

  useEffect(() => {
    if (!order || order.orderId !== orderId) {
      fetch("/api/orders", { cache: "no-store" })
        .then((res) => res.json())
        .then((data) => {
          const found = (data.orders || []).find((o: any) => o.orderId === orderId);
          if (found) setOrder(found);
        })
        .catch((err) => console.error("Failed to load order confirmation:", err));
    }
  }, [orderId, order]);

  const delivery = 400;
  const subtotal = order?.items?.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0) ?? 0;
  const total = subtotal + delivery;

  const ITEM_COLORS = ["#C0392B", "#8E44AD", "#1A5276", "#117A65", "#B7770D", "#784212"];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">

        {/* ── Header ── */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-5">
            <div
              className="h-16 w-16 rounded-full flex items-center justify-center shadow-md"
              style={{ background: "linear-gradient(135deg, #d4f1e4, #a8e6c1)", border: "2px solid #4ade80" }}
            >
              <CheckCircle2 size={36} className="text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-neutral-900 mb-2">
            Thank You For Your Order!
          </h1>
          <p className="text-neutral-500 text-sm mb-5">
            Your order has been received successfully. Below are your reference and shipping expectations.
          </p>
          <span className="inline-block bg-neutral-100 text-neutral-700 text-xs font-black uppercase tracking-widest px-5 py-2.5 rounded-full border border-neutral-200">
            Order Number: {orderId.toUpperCase()}
          </span>
        </div>

        {/* ── Shipping + Order Info Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

          {/* Shipping Details */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
            <h2 className="text-xs font-black uppercase tracking-widest text-neutral-700 mb-4 flex items-center gap-2">
              <Truck size={16} className="text-red-500" />
              Shipping Details
            </h2>
            <div className="space-y-2.5 text-sm">
              <div>
                <span className="font-bold text-neutral-900">Recipient Name: </span>
                <span className="text-neutral-600">{order?.fullName || "—"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone size={13} className="text-neutral-400 shrink-0" />
                <span className="font-bold text-neutral-900">Mobile Contact: </span>
                <span className="text-neutral-600">{order?.phone || "—"}</span>
              </div>
              <div>
                <span className="font-bold text-neutral-900">District: </span>
                <span className="text-neutral-600">{order?.district || "—"}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <MapPin size={13} className="text-neutral-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-neutral-900">Address: </span>
                  <span className="text-neutral-600">{order?.address || "—"}</span>
                </div>
              </div>
              {order?.deliveryDate && (
                <div className="flex items-center gap-1.5 text-purple-600 font-semibold">
                  <Calendar size={13} className="shrink-0" />
                  Requested Delivery: {order.deliveryDate}
                </div>
              )}
            </div>
          </div>

          {/* Order Information */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
            <h2 className="text-xs font-black uppercase tracking-widest text-neutral-700 mb-4 flex items-center gap-2">
              <Package size={16} className="text-purple-500" />
              Order Information
            </h2>
            <div className="space-y-2.5 text-sm">
              <div>
                <span className="font-bold text-neutral-900">Payment Method: </span>
                <span className="text-neutral-600">Cash on Delivery (COD)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-neutral-900">Fulfillment Status: </span>
                <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
                  {order?.status || "PENDING"}
                </span>
              </div>
            </div>

            <div className="mt-4 bg-neutral-50 rounded-xl p-4 border border-neutral-100">
              <p className="text-xs font-black text-neutral-700 mb-2">Expected Delivery:</p>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Colombo/Gampaha: 1–3 Business Days.<br />
                Outstations: 3–5 Business Days.
              </p>
            </div>
          </div>
        </div>

        {/* ── Itemized Summary ── */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm mb-6">
          <h2 className="text-xs font-black uppercase tracking-widest text-neutral-700 mb-5 flex items-center gap-2">
            <ShoppingBag size={15} className="text-neutral-500" />
            Ordered Itemized Summary
          </h2>

          {/* Items */}
          <div className="divide-y divide-neutral-100">
            {order?.items && order.items.length > 0 ? (
              order.items.map((item: any, idx: number) => (
                <div key={`${item.id}-${idx}`} className="flex justify-between items-start py-4">
                  <div>
                    <p className="font-bold text-neutral-900 text-sm">{item.name}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Qty: {item.quantity} @ Rs. {item.price.toLocaleString()}
                    </p>
                  </div>
                  <span className="font-bold text-neutral-900 text-sm">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-neutral-400 py-4 text-center">No items found.</p>
            )}
          </div>

          {/* Totals */}
          <div className="pt-4 mt-2 border-t border-neutral-200 space-y-2">
            <div className="flex justify-between text-sm text-neutral-500">
              <span>Subtotal</span>
              <span>Rs. {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-neutral-500">
              <span className="flex items-center gap-1.5">Delivery Fee <Truck size={13} /></span>
              <span>Rs. {delivery.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-black text-base pt-2 border-t border-neutral-200 mt-2">
              <span className="text-neutral-900">Total COD Payment</span>
              <span className="text-red-600">Rs. {total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-black text-sm text-white transition-all"
            style={{ background: "linear-gradient(135deg, #dc2626, #b91c1c)" }}
          >
            Continue Shopping
          </Link>
          <a
            href="https://wa.me/94771234567"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-black text-sm text-white transition-all"
            style={{ background: "linear-gradient(135deg, #16a34a, #22c55e)" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp Support Follow-up
          </a>
        </div>

      </div>
    </div>
  );
}
