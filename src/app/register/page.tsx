"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";
import { useAuthStore } from "@/lib/authStore";
import { useAuthToastStore } from "@/lib/authToastStore";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/profile";
  const register = useAuthStore((state) => state.register);
  const showAuthToast = useAuthToastStore((state) => state.showAuthToast);

  const prefilledEmail = searchParams.get("email") || "";
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(prefilledEmail);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) return;
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          name: fullName,
          email,
          password,
          phone,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        const errText = data.error || "Failed to create account.";
        setErrorMessage(errText);
        showAuthToast({
          type: "error",
          title: "Registration Failed",
          message: errText,
        });
        setLoading(false);
        return;
      }

      register(data.user);
      showAuthToast({
        type: "welcome",
        title: "Account Created!",
        message: `Welcome to Zeal Brand, ${data.user.name || "Customer"}! Your account has been registered successfully. 🎉`,
      });
      router.push(returnUrl);
    } catch (err) {
      console.error(err);
      const networkErr = "Network error. Please try again.";
      setErrorMessage(networkErr);
      showAuthToast({
        type: "error",
        title: "Registration Failed",
        message: networkErr,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8FF] flex items-center justify-center p-4 md:p-8">
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-xl max-w-md w-full p-8 md:p-10 relative overflow-hidden">
        {/* Top Brand Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 bg-neutral-900 text-amber-400 rounded-2xl flex items-center justify-center border border-neutral-800 shadow-md">
            <Sparkles size={28} />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-neutral-900 tracking-tight">Create Account</h1>
          <p className="text-xs text-neutral-500 font-semibold mt-2 max-w-xs mx-auto leading-relaxed">
            Sign up now to order streetwear, track shipments, and more.
          </p>
        </div>

        {/* Error Message Banner */}
        {errorMessage && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs font-bold text-red-600 text-center animate-in fade-in duration-200">
            {errorMessage}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name Field */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 block mb-1.5">
              FULL NAME
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
                <User size={18} />
              </div>
              <input
                type="text"
                required
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 border border-neutral-200 rounded-2xl text-sm bg-neutral-50/50 text-neutral-900 font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Email Address Field */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 block mb-1.5">
              EMAIL ADDRESS
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 border border-neutral-200 rounded-2xl text-sm bg-neutral-50/50 text-neutral-900 font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Phone Number Field */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 block mb-1.5">
              PHONE NUMBER
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
                <Phone size={18} />
              </div>
              <input
                type="tel"
                placeholder="077 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 border border-neutral-200 rounded-2xl text-sm bg-neutral-50/50 text-neutral-900 font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 block mb-1.5">
              PASSWORD (MIN 6 CHARS)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-11 py-3.5 border border-neutral-200 rounded-2xl text-sm bg-neutral-50/50 text-neutral-900 font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-neutral-700 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neutral-900 hover:bg-black text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-md hover:shadow-xl flex items-center justify-center gap-2 group disabled:opacity-60 mt-2"
          >
            {loading ? "Registering..." : "Register"}
            {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 pt-6 border-t border-neutral-100 text-center">
          <p className="text-xs text-neutral-500 font-semibold">
            Already have an account?{" "}
            <Link href="/signin" className="font-black text-neutral-900 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8F8FF] flex items-center justify-center font-bold text-neutral-500 tracking-widest text-sm uppercase">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
