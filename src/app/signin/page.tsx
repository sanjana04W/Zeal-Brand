"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Flame } from "lucide-react";
import { useAuthStore } from "@/lib/authStore";
import { useAuthToastStore } from "@/lib/authToastStore";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/profile";
  const login = useAuthStore((state) => state.login);
  const showAuthToast = useAuthToastStore((state) => state.showAuthToast);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email, password }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        const errorText = data.error || "Invalid email or password. Please try again.";
        setErrorMessage(errorText);
        showAuthToast({
          type: "error",
          title: "Login Failed",
          message: errorText,
        });
        setLoading(false);
        return;
      }

      login(data.user);
      showAuthToast({
        type: "success",
        title: "Login Successful",
        message: `Welcome back, ${data.user.name || "Customer"}! Logged in successfully. 👋`,
      });
      router.push(returnUrl);
    } catch (err) {
      console.error(err);
      const networkErr = "Network error. Please try again.";
      setErrorMessage(networkErr);
      showAuthToast({
        type: "error",
        title: "Login Failed",
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
          <div className="w-14 h-14 bg-neutral-900 text-white rounded-2xl flex items-center justify-center border border-neutral-800 shadow-md">
            <Flame className="text-red-500 fill-red-500" size={28} />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-neutral-900 tracking-tight">Welcome Back!</h1>
          <p className="text-xs text-neutral-500 font-semibold mt-2 max-w-xs mx-auto leading-relaxed">
            Log in to track orders, manage your profile, and checkout faster.
          </p>
        </div>

        {/* Error Message Banner */}
        {errorMessage && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs font-bold text-red-600 text-center animate-in fade-in duration-200">
            {errorMessage}
          </div>
        )}

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 block mb-2">
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

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">
                PASSWORD
              </label>
              <button
                type="button"
                onClick={() => alert("Password reset link sent to your email!")}
                className="text-xs font-bold text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
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
            className="w-full bg-neutral-900 hover:bg-black text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-md hover:shadow-xl flex items-center justify-center gap-2 group disabled:opacity-60"
          >
            {loading ? "Signing In..." : "Sign In"}
            {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-8 pt-6 border-t border-neutral-100 text-center space-y-2">
          <p className="text-xs text-neutral-500 font-semibold">
            New to Zeal Brand?{" "}
            <Link href="/register" className="font-black text-neutral-900 hover:underline">
              Create an Account
            </Link>
          </p>
          <p className="text-[11px] text-neutral-400 italic">
            Tip: You can use any test credentials or register a new user!
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8F8FF] flex items-center justify-center font-bold text-neutral-500 tracking-widest text-sm uppercase">Loading...</div>}>
      <SignInForm />
    </Suspense>
  );
}
