"use client";

import { useEffect, useRef } from "react";
import { useAuthToastStore } from "@/lib/authToastStore";
import { CheckCircle2, AlertCircle, Sparkles, X } from "lucide-react";

export default function AuthToast() {
  const { toast, visible, hideAuthToast } = useAuthToastStore();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        hideAuthToast();
      }, 4500);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible, toast, hideAuthToast]);

  if (!visible || !toast) return null;

  const isSuccess = toast.type === "success";
  const isWelcome = toast.type === "welcome";
  const isError = toast.type === "error";

  return (
    <div
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-[99999] w-[380px] max-w-[92vw] rounded-2xl shadow-2xl border p-4 flex items-start gap-3.5 animate-in slide-in-from-top-6 fade-in duration-300 backdrop-blur-md ${
        isSuccess
          ? "bg-emerald-950/95 border-emerald-700 text-white"
          : isWelcome
          ? "bg-neutral-950/95 border-neutral-700 text-white"
          : "bg-red-950/95 border-red-700 text-white"
      }`}
      role="alert"
      aria-live="polite"
    >
      {/* Icon */}
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${
          isSuccess
            ? "bg-emerald-600/30 text-emerald-400 border border-emerald-500/40"
            : isWelcome
            ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
            : "bg-red-600/30 text-red-400 border border-red-500/40"
        }`}
      >
        {isSuccess && <CheckCircle2 size={22} />}
        {isWelcome && <Sparkles size={22} />}
        {isError && <AlertCircle size={22} />}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-0.5">
        <h4 className="text-xs font-black uppercase tracking-widest leading-none mb-1">
          {toast.title}
        </h4>
        <p className="text-xs font-medium opacity-90 leading-relaxed">
          {toast.message}
        </p>
      </div>

      {/* Dismiss button */}
      <button
        onClick={hideAuthToast}
        className="p-1 rounded-lg opacity-60 hover:opacity-100 hover:bg-white/10 transition-all shrink-0"
        aria-label="Close notification"
      >
        <X size={16} />
      </button>

      {/* Auto-dismiss progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl overflow-hidden bg-white/10">
        <div
          className={`h-full animate-[shrink_4.5s_linear_forwards] ${
            isSuccess ? "bg-emerald-400" : isWelcome ? "bg-amber-400" : "bg-red-400"
          }`}
        />
      </div>
    </div>
  );
}
