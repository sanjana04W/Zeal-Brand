"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, Truck, X, LogIn, UserPlus, Mail, Lock, Eye, EyeOff, User, Phone, Sparkles, Flame, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store";
import { useAuthStore } from "@/lib/authStore";
import { useOrderStore, OrderRecord } from "@/lib/orderStore";
import { useNotificationStore } from "@/lib/notificationStore";
import emailjs from "@emailjs/browser";

/* ─── Auth Modal ──────────────────────────────────────────────── */
function AuthModal({ onClose }: { onClose: () => void }) {
  const { login, register } = useAuthStore();
  const [tab, setTab] = useState<"signin" | "register">("signin");

  const [siEmail, setSiEmail] = useState("");
  const [siPassword, setSiPassword] = useState("");
  const [siShowPw, setSiShowPw] = useState(false);
  const [siLoading, setSiLoading] = useState(false);

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regShowPw, setRegShowPw] = useState(false);
  const [regLoading, setRegLoading] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!siEmail || !siPassword) return;
    setSiLoading(true);
    setTimeout(() => {
      const name = siEmail.split("@")[0].replace(/[._-]/g, " ")
        .split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
      login({ name: name || "Zeal Customer", email: siEmail, phone: "+94 77 123 4567" });
      setSiLoading(false);
      onClose();
    }, 600);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) return;
    setRegLoading(true);
    setTimeout(() => {
      register({ name: regName, email: regEmail, phone: regPhone || "+94 77 123 4567" });
      setRegLoading(false);
      onClose();
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-xl text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-all"
        >
          <X size={18} />
        </button>

        <div className="flex border-b border-neutral-100">
          <button
            onClick={() => setTab("signin")}
            className={`flex-1 py-4 text-sm font-black uppercase tracking-widest transition-all ${
              tab === "signin" ? "text-neutral-900 border-b-2 border-neutral-900" : "text-neutral-400 hover:text-neutral-600"
            }`}
          >Sign In</button>
          <button
            onClick={() => setTab("register")}
            className={`flex-1 py-4 text-sm font-black uppercase tracking-widest transition-all ${
              tab === "register" ? "text-neutral-900 border-b-2 border-neutral-900" : "text-neutral-400 hover:text-neutral-600"
            }`}
          >Create Account</button>
        </div>

        <div className="p-7">
          {tab === "signin" && (
            <>
              <div className="flex justify-center mb-5">
                <div className="w-12 h-12 bg-neutral-900 rounded-2xl flex items-center justify-center">
                  <Flame className="text-red-500 fill-red-500" size={24} />
                </div>
              </div>
              <h2 className="text-2xl font-black text-neutral-900 text-center tracking-tight mb-1">Welcome Back!</h2>
              <p className="text-xs text-neutral-500 text-center font-semibold mb-6">Sign in to confirm your order.</p>

              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 block mb-1.5">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400"><Mail size={16} /></div>
                    <input type="email" required placeholder="you@example.com" value={siEmail}
                      onChange={(e) => setSiEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-2xl text-sm font-semibold bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-neutral-900 focus:outline-none transition-all" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 block mb-1.5">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400"><Lock size={16} /></div>
                    <input type={siShowPw ? "text" : "password"} required placeholder="••••••••" value={siPassword}
                      onChange={(e) => setSiPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 border border-neutral-200 rounded-2xl text-sm font-semibold bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-neutral-900 focus:outline-none transition-all" />
                    <button type="button" onClick={() => setSiShowPw(!siShowPw)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-neutral-700">
                      {siShowPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={siLoading}
                  className="w-full bg-neutral-900 hover:bg-black text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                  <LogIn size={16} />
                  {siLoading ? "Signing In..." : "Sign In & Confirm Order"}
                </button>
              </form>
              <p className="text-center text-xs text-neutral-500 font-semibold mt-5">
                No account?{" "}
                <button onClick={() => setTab("register")} className="font-black text-neutral-900 hover:underline">Create one free</button>
              </p>
            </>
          )}

          {tab === "register" && (
            <>
              <div className="flex justify-center mb-5">
                <div className="w-12 h-12 bg-neutral-900 text-amber-400 rounded-2xl flex items-center justify-center">
                  <Sparkles size={24} />
                </div>
              </div>
              <h2 className="text-2xl font-black text-neutral-900 text-center tracking-tight mb-1">Create Account</h2>
              <p className="text-xs text-neutral-500 text-center font-semibold mb-6">Register to place your order.</p>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 block mb-1.5">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400"><User size={16} /></div>
                    <input type="text" required placeholder="John Doe" value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-2xl text-sm font-semibold bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-neutral-900 focus:outline-none transition-all" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 block mb-1.5">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400"><Mail size={16} /></div>
                    <input type="email" required placeholder="you@example.com" value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-2xl text-sm font-semibold bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-neutral-900 focus:outline-none transition-all" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 block mb-1.5">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400"><Phone size={16} /></div>
                    <input type="tel" placeholder="077 123 4567" value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-2xl text-sm font-semibold bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-neutral-900 focus:outline-none transition-all" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 block mb-1.5">Password (min 6 chars)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400"><Lock size={16} /></div>
                    <input type={regShowPw ? "text" : "password"} required minLength={6} placeholder="••••••••" value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 border border-neutral-200 rounded-2xl text-sm font-semibold bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-neutral-900 focus:outline-none transition-all" />
                    <button type="button" onClick={() => setRegShowPw(!regShowPw)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-neutral-700">
                      {regShowPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={regLoading}
                  className="w-full bg-neutral-900 hover:bg-black text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                  <UserPlus size={16} />
                  {regLoading ? "Registering..." : "Register & Confirm Order"}
                </button>
              </form>
              <p className="text-center text-xs text-neutral-500 font-semibold mt-5">
                Have an account?{" "}
                <button onClick={() => setTab("signin")} className="font-black text-neutral-900 hover:underline">Sign in</button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Item colors for variety ─────────────────────────────────── */
const ITEM_COLORS = [
  "#C0392B", "#8E44AD", "#1A5276", "#117A65", "#B7770D", "#784212"
];

/* ─── Checkout Page ───────────────────────────────────────────── */
export default function Checkout() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { clearCart, items, getCartTotal } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const { setLastOrder, addOrder } = useOrderStore();
  const { addNotification } = useNotificationStore();

  // Verification State
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [enteredCode, setEnteredCode] = useState("");
  const [targetEmail, setTargetEmail] = useState("");
  const [verificationError, setVerificationError] = useState("");

  // We keep a ref to form data so we can submit after auth
  const [pendingFormData, setPendingFormData] = useState<FormData | null>(null);
  // Store captured form snapshot for confirmation page
  const [capturedFormData, setCapturedFormData] = useState<FormData | null>(null);

  const subtotal = getCartTotal();
  const delivery = 400;
  const total = subtotal + delivery;

  const executeOrderPlacement = async (fd: FormData | null) => {
    setIsSubmitting(true);
    setSubmitError("");
    const delivery = 400;
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const randomId = Math.floor(Math.random() * 90000) + 10000;
    const orderId = `ZB-${randomId}`;

    const emailFromForm = (fd?.get("email") as string) || "";
    const phoneFromForm = (fd?.get("phone") as string) || "";
    const nameFromForm = (fd?.get("firstName") as string) || "";

    const rawEmail = (emailFromForm || user?.email || "customer@zealbrand.com").trim().toLowerCase();
    const rawPhone = (phoneFromForm || user?.phone || "").trim();
    const rawName = (nameFromForm || user?.name || "Customer").trim();

    const orderRecord: OrderRecord = {
      orderId,
      userEmail: rawEmail,
      fullName: rawName,
      phone: rawPhone,
      district: (fd?.get("district") as string) || "Colombo",
      address: (fd?.get("address") as string) || "",
      deliveryDate: (fd?.get("deliveryDate") as string) || "",
      notes: (fd?.get("notes") as string) || "",
      items: items.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        size: i.size,
      })),
      subtotal,
      delivery,
      total: subtotal + delivery,
      status: "PENDING" as const,
      date: new Date().toISOString(),
    };

    // PRIMARY: Save to server database (orders.json) — required for admin panel
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderRecord),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error ${res.status}`);
      }
    } catch (err: any) {
      console.error("Order save failed:", err);
      setSubmitError(
        "⚠️ Failed to save your order. Please check your internet connection and try again."
      );
      setIsSubmitting(false);
      return; // STOP — do NOT navigate away, do NOT clear cart
    }

    // SECONDARY: Save to client store for same-device UI (confirmation page)
    addOrder(orderRecord);
    setLastOrder(orderRecord);

    // Notify admin
    addNotification({
      type: "ORDER",
      title: "New Order Placed",
      subtitle: orderId,
      detail: `${orderRecord.fullName} placed an order for Rs. ${orderRecord.total.toLocaleString()}`,
      link: "/admin/orders",
    });

    clearCart();
    setIsVerifyingEmail(false);
    setIsSubmitting(false);
    router.push(`/order-confirmation/${orderId}`);
  };

  const sendVerificationEmail = async (formData: FormData) => {
    setCapturedFormData(formData);
    const emailFromForm = formData.get("email") as string;
    const finalEmail = emailFromForm || user?.email || "";

    if (!finalEmail) {
      // If no email, proceed directly with order placement
      await executeOrderPlacement(formData);
      return;
    }

    setTargetEmail(finalEmail);
    setIsSendingCode(true);

    try {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(code);

      await emailjs.send(
        "service_a0e4sa8",
        "template_9vufr0e",
        {
          to_email: finalEmail,
          verification_code: code,
          otp_code: code,
          to_name: user?.name || formData.get("firstName") || "Customer",
          name: "Zeal Brand",
        },
        "lvv5ym7QOa6AWJB-K"
      );

      setIsVerifyingEmail(true);
      setVerificationError("");
    } catch (error) {
      console.warn("EmailJS verification failed or skipped, proceeding directly with order placement:", error);
      // Fallback: If EmailJS fails, do NOT lose the order — place it directly!
      await executeOrderPlacement(formData);
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isAuthenticated) {
      const formData = new FormData(e.currentTarget);
      setPendingFormData(formData);
      setShowAuthModal(true);
      return;
    }

    const formData = new FormData(e.currentTarget);
    await sendVerificationEmail(formData);
  };

  const handleModalClose = async () => {
    setShowAuthModal(false);
    // After login, send code or place order with pending form data
    if (pendingFormData) {
      await sendVerificationEmail(pendingFormData);
      setPendingFormData(null);
    }
  };

  const handleVerifyCode = async () => {
    if (enteredCode !== generatedCode) {
      setVerificationError("Invalid verification code. Please try again.");
      return;
    }
    await executeOrderPlacement(capturedFormData);
  };

  return (
    <>
      {showAuthModal && <AuthModal onClose={handleModalClose} />}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 max-w-6xl">
        {/* Back link */}
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft size={16} /> Return to Cart
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

          {/* ── LEFT COL: Delivery Form ── */}
          <div className="lg:w-1/2">
            <div className="mb-8">
              <h1 className="text-3xl font-black uppercase tracking-tighter mb-1 text-neutral-900">Delivery Information</h1>
              <p className="text-sm text-neutral-500">Please fill in your shipping details below.</p>
            </div>

            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
              {/* Server Save Error Banner */}
              {submitError && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-300 text-red-800 rounded-xl p-4">
                  <span className="text-red-500 text-lg shrink-0">⚠️</span>
                  <div>
                    <p className="font-bold text-sm">Order Could Not Be Saved</p>
                    <p className="text-xs mt-0.5">{submitError.replace("⚠️ ", "")}</p>
                    <p className="text-xs mt-1 text-red-600 font-semibold">Make sure the app is running (<code className="bg-red-100 px-1 rounded">npm run dev</code>) and try again.</p>
                  </div>
                </div>
              )}
              {/* Full Name + Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="fullName" className="text-[11px] font-extrabold uppercase tracking-widest text-neutral-400 block">
                    Full Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    required type="text" id="fullName" name="firstName"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-neutral-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all placeholder:text-neutral-300"
                    placeholder="Your full name"
                    defaultValue={user?.name || ""}
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="phone" className="text-[11px] font-extrabold uppercase tracking-widest text-neutral-400 block">
                    Mobile Phone <span className="text-red-600">*</span>
                  </label>
                  <input
                    required type="tel" id="phone" name="phone"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-neutral-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all placeholder:text-neutral-300"
                    placeholder="07XXXXXXXX"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-[11px] font-extrabold uppercase tracking-widest text-neutral-400 block">
                  Email Address
                </label>
                <input
                  type="email" id="email" name="email"
                  defaultValue={user?.email || ""}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-neutral-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all placeholder:text-neutral-300"
                  placeholder="your@email.com"
                />
              </div>

              {/* District + Delivery Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="district" className="text-[11px] font-extrabold uppercase tracking-widest text-neutral-400 block">
                    District <span className="text-red-600">*</span>
                  </label>
                  <select
                    required id="district" name="district"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-neutral-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                  >
                    <option value="">Select District</option>
                    <option value="Colombo">Colombo</option>
                    <option value="Gampaha">Gampaha</option>
                    <option value="Kalutara">Kalutara</option>
                    <option value="Kandy">Kandy</option>
                    <option value="Matale">Matale</option>
                    <option value="Nuwara Eliya">Nuwara Eliya</option>
                    <option value="Galle">Galle</option>
                    <option value="Matara">Matara</option>
                    <option value="Hambantota">Hambantota</option>
                    <option value="Jaffna">Jaffna</option>
                    <option value="Kilinochchi">Kilinochchi</option>
                    <option value="Mannar">Mannar</option>
                    <option value="Vavuniya">Vavuniya</option>
                    <option value="Mullaitivu">Mullaitivu</option>
                    <option value="Batticaloa">Batticaloa</option>
                    <option value="Ampara">Ampara</option>
                    <option value="Trincomalee">Trincomalee</option>
                    <option value="Kurunegala">Kurunegala</option>
                    <option value="Puttalam">Puttalam</option>
                    <option value="Anuradhapura">Anuradhapura</option>
                    <option value="Polonnaruwa">Polonnaruwa</option>
                    <option value="Badulla">Badulla</option>
                    <option value="Monaragala">Monaragala</option>
                    <option value="Ratnapura">Ratnapura</option>
                    <option value="Kegalle">Kegalle</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="deliveryDate" className="text-[11px] font-extrabold uppercase tracking-widest text-neutral-400 block">
                    Requested Delivery Date
                  </label>
                  <input
                    type="date" id="deliveryDate" name="deliveryDate"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-neutral-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Detailed Shipping Address */}
              <div className="space-y-1.5">
                <label htmlFor="address" className="text-[11px] font-extrabold uppercase tracking-widest text-neutral-400 block">
                  Detailed Shipping Address <span className="text-red-600">*</span>
                </label>
                <textarea
                  required id="address" name="address" rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-neutral-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all placeholder:text-neutral-300 resize-none"
                  placeholder="Street number, apartment details, landmark description..."
                />
              </div>

              {/* Order Notes */}
              <div className="space-y-1.5">
                <label htmlFor="notes" className="text-[11px] font-extrabold uppercase tracking-widest text-neutral-400 block">
                  Order Notes (Optional)
                </label>
                <textarea
                  id="notes" name="notes" rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-neutral-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all placeholder:text-neutral-300 resize-none"
                  placeholder="Allergen preferences or specific instructions for delivery rider..."
                />
              </div>
            </form>
          </div>

          {/* ── RIGHT COL: Order Summary + COD + Confirm + Verification ── */}
          <div className="lg:w-1/2">
            <div className="space-y-4">

              {/* Order Summary Card */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
                <h2 className="text-lg font-black text-neutral-900 mb-5">Your Order</h2>

                {/* Items */}
                <div className="space-y-3 mb-5">
                  {items.length === 0 ? (
                    <p className="text-sm text-neutral-400 text-center py-4">No items in cart.</p>
                  ) : (
                    items.map((item, idx) => (
                      <div key={`${item.id}-${item.size}`} className="flex justify-between items-center py-2 border-b border-neutral-100 last:border-none">
                        <div className="flex items-center gap-1.5 min-w-0 pr-3">
                          <span
                            className="font-semibold text-sm truncate"
                            style={{ color: ITEM_COLORS[idx % ITEM_COLORS.length] }}
                          >
                            {item.name}
                          </span>
                          <span
                            className="text-sm font-black shrink-0"
                            style={{ color: ITEM_COLORS[idx % ITEM_COLORS.length] }}
                          >
                            x{item.quantity}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-neutral-900 shrink-0">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* Totals */}
                <div className="space-y-2.5 pt-4 border-t border-neutral-100">
                  <div className="flex justify-between text-sm text-neutral-500">
                    <span>Cart Subtotal</span>
                    <span className="font-semibold text-neutral-900">Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-neutral-500">
                    <span className="flex items-center gap-1.5">Delivery Fee <Truck size={13} /></span>
                    <span className="font-semibold text-neutral-900">Rs. {delivery.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-black text-base pt-3 border-t border-neutral-200">
                    <span className="text-neutral-900">Payable Amount</span>
                    <span className="text-red-600">Rs. {total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Cash on Delivery Card */}
              <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-5 flex items-start gap-4">
                <div className="mt-0.5 shrink-0">
                  <CheckCircle2 className="text-green-600" size={22} />
                </div>
                <div>
                  <h3 className="font-black text-base text-neutral-900">Cash on Delivery (COD)</h3>
                  <p className="text-xs text-neutral-500 font-medium mt-1 leading-relaxed">
                    Pay with cash upon delivery. Islandwide COD available via our courier partners.
                  </p>
                </div>
              </div>

              {/* Confirm Button — only shown before verification */}
              {!isVerifyingEmail && (
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={isSubmitting || isSendingCode}
                  className="w-full bg-neutral-900 hover:bg-black text-white uppercase tracking-widest font-black py-5 px-6 rounded-2xl transition-all disabled:opacity-70 flex justify-center items-center gap-2 text-sm shadow-md"
                >
                  {isSendingCode ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending Code...
                    </>
                  ) : isSubmitting ? (
                    "Processing Order..."
                  ) : (
                    `Confirm Purchase (COD)`
                  )}
                </button>
              )}

              {/* Email Verification Card — appears below COD after clicking confirm */}
              {isVerifyingEmail && (
                <div className="bg-white rounded-2xl border-2 border-neutral-200 p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <h3 className="text-base font-black text-neutral-900 mb-1 flex items-center gap-2">
                    <ShieldCheck size={20} className="text-neutral-900" />
                    Email Verification
                  </h3>
                  <p className="text-sm text-neutral-500 mb-5 leading-relaxed">
                    We've sent a 6-digit verification code to{" "}
                    <strong className="text-neutral-900">{targetEmail}</strong>. Please enter it below to confirm your order.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      maxLength={6}
                      value={enteredCode}
                      onChange={(e) => {
                        setEnteredCode(e.target.value.replace(/\D/g, ""));
                        setVerificationError("");
                      }}
                      placeholder="Enter 6-digit code"
                      className="flex-1 px-4 py-3.5 border border-neutral-200 rounded-xl bg-neutral-50 text-neutral-900 font-bold text-center tracking-[0.4em] focus:outline-none focus:border-neutral-900 focus:bg-white text-base transition-all placeholder:tracking-normal placeholder:text-neutral-300"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyCode}
                      disabled={enteredCode.length !== 6 || isSubmitting}
                      className="bg-neutral-900 hover:bg-black text-white uppercase tracking-widest font-black px-8 py-3.5 rounded-xl transition-colors disabled:opacity-50 min-w-[110px] text-sm"
                    >
                      {isSubmitting ? (
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : "Verify"}
                    </button>
                  </div>

                  {verificationError && (
                    <p className="text-red-600 text-sm font-bold mt-3">{verificationError}</p>
                  )}

                  <div className="mt-4 flex items-center justify-between gap-4 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setIsVerifyingEmail(false)}
                      className="text-xs font-semibold text-neutral-400 hover:text-neutral-900 underline underline-offset-2 transition-colors cursor-pointer"
                    >
                      Change Email or Details
                    </button>

                    <button
                      type="button"
                      onClick={() => executeOrderPlacement(capturedFormData)}
                      className="text-xs font-bold text-neutral-900 hover:underline underline-offset-2 transition-colors cursor-pointer"
                    >
                      Didn't get code? Complete Order
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </>
  );
}
