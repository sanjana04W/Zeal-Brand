"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Tag,
  Calendar,
  Percent,
  Trash2,
  Edit,
  Power,
  X,
  CheckCircle2,
  AlertCircle,
  Flame,
} from "lucide-react";
import { usePromoStore, Promotion } from "@/lib/promoStore";

export default function PromotionsManagement() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [mounted, setMounted] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCode, setFormCode] = useState("");
  const [formDiscount, setFormDiscount] = useState("");
  const [formCategory, setFormCategory] = useState("ALL PRODUCTS");
  const [formStatus, setFormStatus] = useState<
    "ACTIVE" | "SCHEDULED" | "PAUSED" | "EXPIRED"
  >("ACTIVE");
  const [formExpiry, setFormExpiry] = useState("2026-12-31");

  // Delete State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchPromos = async () => {
    try {
      const res = await fetch("/api/promotions", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setPromotions(data.promotions || []);
      }
    } catch (err) {
      console.error("Error fetching promotions:", err);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchPromos();
  }, []);

  if (!mounted) return null;

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingPromo(null);
    setFormTitle("");
    setFormDescription("");
    setFormCode("");
    setFormDiscount("20% OFF");
    setFormCategory("ALL PRODUCTS");
    setFormStatus("ACTIVE");
    setFormExpiry("2026-12-31");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (promo: Promotion) => {
    setEditingPromo(promo);
    setFormTitle(promo.title);
    setFormDescription(promo.description);
    setFormCode(promo.code);
    setFormDiscount(promo.discount);
    setFormCategory(promo.category);
    setFormStatus(promo.status);
    setFormExpiry(promo.expiry);
    setIsModalOpen(true);
  };

  // Submit Form
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formCode) return;

    const payload = {
      id: editingPromo?.id,
      title: formTitle,
      description: formDescription,
      code: formCode.toUpperCase(),
      discount: formDiscount,
      type: formDiscount.includes("%") ? "Percentage" : "Fixed Amount",
      category: formCategory,
      status: formStatus,
      expiry: formExpiry,
    };

    await fetch("/api/promotions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    fetchPromos();
    setIsModalOpen(false);
  };

  const togglePause = async (id: string) => {
    const target = promotions.find((p) => p.id === id);
    if (!target) return;
    const newStatus = target.status === "ACTIVE" ? "PAUSED" : "ACTIVE";
    await fetch("/api/promotions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...target, status: newStatus }),
    });
    fetchPromos();
  };

  const deletePromotion = async (id: string) => {
    await fetch(`/api/promotions?id=${id}`, { method: "DELETE" });
    fetchPromos();
    setDeletingId(null);
  };

  const getStatusBadge = (status: Promotion["status"]) => {
    switch (status) {
      case "ACTIVE":
        return "bg-red-500 text-white";
      case "SCHEDULED":
        return "bg-purple-600 text-white";
      case "PAUSED":
        return "bg-amber-500 text-white";
      default:
        return "bg-neutral-400 text-white";
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">
            Promotions &amp; Offers
          </h1>
          <p className="text-neutral-500 text-sm">
            Manage discount campaigns, banner promotions, and promo codes.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 bg-neutral-900 text-white px-5 py-3 rounded-2xl uppercase tracking-widest text-xs font-black hover:bg-black transition-all shadow-md"
        >
          <Plus size={18} /> Create Promotion
        </button>
      </div>

      {/* ── Metric Summary Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 block mb-1">
              Active Campaigns
            </span>
            <p className="text-3xl font-black text-neutral-900">
              {promotions.filter((p) => p.status === "ACTIVE").length}
            </p>
          </div>
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center font-black">
            <Tag size={22} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 block mb-1">
              Total Coupon Uses
            </span>
            <p className="text-3xl font-black text-neutral-900">
              {promotions.reduce((acc, p) => acc + p.uses, 0)}
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black">
            <Percent size={22} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 block mb-1">
              Scheduled / Paused
            </span>
            <p className="text-3xl font-black text-neutral-900">
              {
                promotions.filter(
                  (p) => p.status === "SCHEDULED" || p.status === "PAUSED"
                ).length
              }
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center font-black">
            <Calendar size={22} />
          </div>
        </div>
      </div>

      {/* ── Promotion Cards Grid (Matches User Screenshot 4) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {promotions.map((promo) => (
          <div
            key={promo.id}
            className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm p-6 flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
          >
            <div>
              {/* Badge */}
              <div className="mb-3">
                <span
                  className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-2xs ${getStatusBadge(
                    promo.status
                  )}`}
                >
                  {promo.status}
                </span>
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-xl font-black text-neutral-900 tracking-tight leading-tight">
                {promo.title}
              </h3>
              <p className="text-xs text-neutral-500 font-semibold mt-1">
                {promo.description}
              </p>

              {/* Category */}
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mt-4">
                CATEGORY: {promo.category}
              </p>
            </div>

            {/* Action Buttons & Code */}
            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between gap-3">
              <span className="font-mono text-xs font-black bg-neutral-100 text-neutral-900 px-3 py-1.5 rounded-xl border border-neutral-200">
                {promo.code}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(promo)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 transition-colors"
                >
                  Edit Rules
                </button>

                <button
                  onClick={() => togglePause(promo.id)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-600 bg-neutral-100 hover:bg-neutral-200 transition-colors"
                >
                  {promo.status === "ACTIVE" ? "Pause" : "Activate"}
                </button>

                <button
                  onClick={() => setDeletingId(promo.id)}
                  className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  title="Delete Promotion"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Create New Promotion Dashed Card */}
        <div
          onClick={handleOpenCreate}
          className="border-2 border-dashed border-neutral-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-neutral-400 hover:bg-neutral-50/50 transition-all min-h-[220px]"
        >
          <div className="w-12 h-12 bg-neutral-100 text-neutral-600 rounded-full flex items-center justify-center mb-3">
            <Plus size={24} />
          </div>
          <span className="text-sm font-black text-neutral-700">
            Create New Promotion
          </span>
          <p className="text-xs text-neutral-400 font-semibold mt-1">
            Add discount codes or banner campaigns
          </p>
        </div>
      </div>

      {/* ── Promo Codes Table ── */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-neutral-900 tracking-tight">
              All Active Promo Codes
            </h2>
            <p className="text-xs text-neutral-400 font-semibold">
              Live coupons usable during checkout.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-neutral-100 text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 bg-neutral-50/60">
                <th className="px-6 py-4">CODE</th>
                <th className="px-6 py-4">DISCOUNT</th>
                <th className="px-6 py-4">TYPE</th>
                <th className="px-6 py-4">TIMES USED</th>
                <th className="px-6 py-4">STATUS</th>
                <th className="px-6 py-4">EXPIRES</th>
                <th className="px-6 py-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {promotions.map((promo) => (
                <tr
                  key={promo.id}
                  className="hover:bg-neutral-50/80 transition-colors"
                >
                  <td className="px-6 py-4 font-mono font-black text-red-600 text-sm">
                    {promo.code}
                  </td>
                  <td className="px-6 py-4 font-bold text-neutral-900">
                    {promo.discount}
                  </td>
                  <td className="px-6 py-4 text-neutral-600 font-semibold">
                    {promo.type}
                  </td>
                  <td className="px-6 py-4 text-neutral-600 font-semibold">
                    {promo.uses}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border shadow-2xs inline-block ${
                        promo.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : promo.status === "SCHEDULED"
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : "bg-neutral-100 text-neutral-500 border-neutral-200"
                      }`}
                    >
                      {promo.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutral-500 font-mono text-xs">
                    {promo.expiry}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(promo)}
                        className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-all"
                        title="Edit Code"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => togglePause(promo.id)}
                        className="p-2 text-neutral-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                        title="Toggle Active/Pause"
                      >
                        <Power size={16} />
                      </button>
                      <button
                        onClick={() => setDeletingId(promo.id)}
                        className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        title="Permanently Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── CREATE / EDIT PROMOTION MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-neutral-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 bg-neutral-50">
              <h2 className="text-base font-black uppercase tracking-tight text-neutral-900">
                {editingPromo ? "Edit Promotion Rules" : "Create New Promotion"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-900 hover:bg-neutral-200 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 mb-1.5">
                  Campaign Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mega Zeal Price Drop"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 mb-1.5">
                  Campaign Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. 25% Off Storewide Collection"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 mb-1.5">
                    Promo Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="MEGA25"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50 text-sm font-mono font-black uppercase text-red-600 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 mb-1.5">
                    Discount Amount *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="25% OFF or Rs. 500 OFF"
                    value={formDiscount}
                    onChange={(e) => setFormDiscount(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 mb-1.5">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    placeholder="ALL PRODUCTS"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 mb-1.5">
                    Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) =>
                      setFormStatus(e.target.value as Promotion["status"])
                    }
                    className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="SCHEDULED">SCHEDULED</option>
                    <option value="PAUSED">PAUSED</option>
                    <option value="EXPIRED">EXPIRED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 mb-1.5">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={formExpiry}
                  onChange={(e) => setFormExpiry(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex justify-end gap-3 border-t border-neutral-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 rounded-2xl text-xs font-extrabold text-neutral-500 hover:bg-neutral-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-white bg-red-600 hover:bg-red-700 transition-all shadow-md"
                >
                  Save Promotion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRMATION MODAL ── */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-neutral-200 w-full max-w-sm p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-lg font-black text-neutral-900 mb-1">
              Delete Promotion?
            </h3>
            <p className="text-xs text-neutral-500 font-semibold mb-6">
              Are you sure you want to permanently delete this promotion and promo code?
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 py-3 border border-neutral-200 rounded-2xl text-xs font-black text-neutral-700 hover:bg-neutral-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deletePromotion(deletingId);
                  setDeletingId(null);
                }}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-xs font-black transition-all shadow-md"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
