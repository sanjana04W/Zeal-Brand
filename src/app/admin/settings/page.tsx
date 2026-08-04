"use client";

import { Save, Store, Truck, Lightbulb, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function SystemSettings() {
  const [storeName, setStoreName] = useState("Zeal Brand");
  const [supportEmail, setSupportEmail] = useState("hello@zealbrand.com");
  const [contactPhone, setContactPhone] = useState("+94 78 858 5588");
  const [storeAddress, setStoreAddress] = useState("Online Exclusive, Delivery Islandwide, Sri Lanka");

  const [colomboFee, setColomboFee] = useState("250");
  const [outstationFee, setOutstationFee] = useState("450");
  const [freeDeliveryAbove, setFreeDeliveryAbove] = useState("5000");
  const [weightSurcharge, setWeightSurcharge] = useState("50");

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-neutral-900">System Settings</h1>
          <p className="text-xs font-semibold text-neutral-400 mt-1">
            Configure store information, delivery rates, and third-party integrations
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl flex items-center gap-1.5">
              <CheckCircle2 size={16} /> Settings saved!
            </span>
          )}

          <button
            type="submit"
            className="bg-neutral-900 hover:bg-black text-white text-xs font-black uppercase tracking-widest px-6 py-3 rounded-xl transition-all shadow-md flex items-center gap-2"
          >
            <Save size={16} /> Save All Settings
          </button>
        </div>
      </div>

      {/* Section 1: Store Profile */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 space-y-6">
        <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
          <div className="w-10 h-10 bg-neutral-100 text-neutral-900 rounded-xl flex items-center justify-center border border-neutral-200">
            <Store size={20} className="stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-base font-black text-neutral-900 tracking-tight">Store Profile</h2>
            <p className="text-xs text-neutral-400 font-semibold">
              Your brand identity and contact info shown across the website
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Store Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">
              STORE NAME
            </label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm font-semibold text-neutral-900 transition-all"
            />
          </div>

          {/* Support Email */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">
              SUPPORT EMAIL
            </label>
            <input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm font-semibold text-neutral-900 transition-all"
            />
          </div>

          {/* Contact Phone */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">
              CONTACT PHONE
            </label>
            <input
              type="text"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm font-semibold text-neutral-900 transition-all"
            />
          </div>

          {/* Store Address */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">
              STORE ADDRESS
            </label>
            <input
              type="text"
              value={storeAddress}
              onChange={(e) => setStoreAddress(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm font-semibold text-neutral-900 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Delivery & Pricing */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 space-y-6">
        <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
          <div className="w-10 h-10 bg-neutral-100 text-neutral-900 rounded-xl flex items-center justify-center border border-neutral-200">
            <Truck size={20} className="stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-base font-black text-neutral-900 tracking-tight">Delivery &amp; Pricing</h2>
            <p className="text-xs text-neutral-400 font-semibold">
              Zone-based delivery fees and free shipping thresholds (LKR)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Colombo Zone Fee */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">
              COLOMBO ZONE FEE
            </label>
            <div className="relative">
              <input
                type="number"
                value={colomboFee}
                onChange={(e) => setColomboFee(e.target.value)}
                className="w-full pl-4 pr-12 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm font-semibold text-neutral-900 transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">
                LKR
              </span>
            </div>
          </div>

          {/* Outstation Fee */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">
              OUTSTATION FEE
            </label>
            <div className="relative">
              <input
                type="number"
                value={outstationFee}
                onChange={(e) => setOutstationFee(e.target.value)}
                className="w-full pl-4 pr-12 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm font-semibold text-neutral-900 transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">
                LKR
              </span>
            </div>
          </div>

          {/* Free Delivery Above */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">
              FREE DELIVERY ABOVE
            </label>
            <div className="relative">
              <input
                type="number"
                value={freeDeliveryAbove}
                onChange={(e) => setFreeDeliveryAbove(e.target.value)}
                className="w-full pl-4 pr-12 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm font-semibold text-neutral-900 transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">
                LKR
              </span>
            </div>
          </div>

          {/* Weight Surcharge */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">
              WEIGHT SURCHARGE / KG
            </label>
            <div className="relative">
              <input
                type="number"
                value={weightSurcharge}
                onChange={(e) => setWeightSurcharge(e.target.value)}
                className="w-full pl-4 pr-12 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm font-semibold text-neutral-900 transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">
                LKR
              </span>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-neutral-100 border border-neutral-200 rounded-xl p-4 flex items-start gap-3 text-xs leading-relaxed text-neutral-700">
          <Lightbulb size={18} className="text-neutral-900 shrink-0 mt-0.5" />
          <p>
            <strong className="font-extrabold text-neutral-900">Colombo Zone</strong> includes Colombo, Gampaha, and Kalutara districts. All other districts use the Outstation rate. Orders above the Free Delivery threshold ship for free regardless of zone.
          </p>
        </div>
      </div>
    </form>
  );
}
