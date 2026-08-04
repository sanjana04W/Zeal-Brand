"use client";

import { Mail, Phone, CheckCircle2, Inbox, RefreshCw, Send, ArrowLeft } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  status: "Unread" | "Read" | "Replied";
  createdAt: number;
}

export default function MessagesManagement() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState("");
  const [repliedSuccess, setRepliedSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  // Mobile: controls whether the detail view is showing on small screens
  const [showDetail, setShowDetail] = useState(false);

  const fetchMessages = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await fetch("/api/messages", { cache: "no-store" });
      const data = await res.json();
      setMessages(data.messages ?? []);
      setLastRefreshed(new Date());
      setSelectedMessage((prev) =>
        prev ? (data.messages ?? []).find((m: Message) => m.id === prev.id) ?? prev : null
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => fetchMessages(true), 10000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const handleSelectMessage = async (msg: Message) => {
    setSelectedMessage(msg);
    setRepliedSuccess(false);
    setReplyText("");
    setShowDetail(true); // on mobile, slide to detail view
    if (msg.status === "Unread") {
      await fetch("/api/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: msg.id, status: "Read" }),
      });
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, status: "Read" } : m))
      );
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedMessage) return;
    await fetch("/api/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selectedMessage.id, status: "Replied" }),
    });
    setMessages((prev) =>
      prev.map((m) => (m.id === selectedMessage.id ? { ...m, status: "Replied" } : m))
    );
    setSelectedMessage((prev) => (prev ? { ...prev, status: "Replied" } : null));
    setRepliedSuccess(true);
    setReplyText("");
  };

  const unreadCount = messages.filter((m) => m.status === "Unread").length;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-neutral-900">
            Customer Messages
          </h1>
          <p className="text-neutral-500 text-xs sm:text-sm mt-1">
            Inquiries submitted through the Contact Us form.
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 sm:px-3 py-1.5 rounded-full whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
            Live — Auto-refreshes
          </span>
          <button
            onClick={() => fetchMessages(true)}
            disabled={refreshing}
            className="flex items-center gap-2 text-xs font-bold text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200 px-3 sm:px-4 py-2 rounded-xl transition-all hover:shadow-sm disabled:opacity-60 whitespace-nowrap"
          >
            <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 bg-white rounded-2xl border border-neutral-200">
          <div className="text-center text-neutral-400">
            <RefreshCw size={28} className="animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold">Loading messages...</p>
          </div>
        </div>
      ) : (
        /* ── Responsive layout: stacked on mobile, side-by-side on lg ── */
        <div className="relative">

          {/* ── Inbox List (always visible on desktop; hidden on mobile when detail is open) ── */}
          <div className={`lg:grid lg:grid-cols-3 lg:gap-6 lg:min-h-[550px] ${showDetail ? "hidden lg:grid" : "block"}`}>
            {/* Inbox panel */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
              {/* Inbox header */}
              <div className="px-4 sm:px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
                <span className="font-black text-sm text-neutral-900 flex items-center gap-2">
                  <Inbox size={16} className="text-neutral-500" />
                  Inbox ({messages.length})
                </span>
                <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                  unreadCount > 0 ? "bg-red-600 text-white" : "bg-neutral-100 text-neutral-500"
                }`}>
                  {unreadCount > 0 ? `${unreadCount} New` : "0 New"}
                </span>
              </div>

              {/* Message rows */}
              <div className="divide-y divide-neutral-100 overflow-y-auto flex-1 max-h-[600px]">
                {messages.length === 0 ? (
                  <div className="p-8 text-center text-neutral-400 text-sm leading-relaxed">
                    <Mail size={36} className="mx-auto mb-3 text-neutral-300" />
                    No messages yet.<br />They will appear here when customers submit the Contact Us form.
                  </div>
                ) : (
                  messages.map((msg) => (
                    <button
                      key={msg.id}
                      onClick={() => handleSelectMessage(msg)}
                      className={`w-full text-left px-4 sm:px-5 py-4 transition-colors flex flex-col gap-1 ${
                        selectedMessage?.id === msg.id
                          ? "bg-neutral-100 border-l-[3px] border-neutral-900"
                          : "hover:bg-neutral-50 border-l-[3px] border-transparent"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className={`font-bold text-sm text-neutral-900 truncate ${msg.status === "Unread" ? "font-black" : ""}`}>
                          {msg.name}
                        </span>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                          msg.status === "Unread"
                            ? "bg-neutral-900 text-white"
                            : msg.status === "Replied"
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            : "bg-neutral-200 text-neutral-600"
                        }`}>
                          {msg.status}
                        </span>
                      </div>
                      <p className="font-semibold text-xs text-neutral-700 line-clamp-1">{msg.subject}</p>
                      <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">{msg.message}</p>
                      <span className="text-[10px] text-neutral-400 mt-0.5">{msg.date}</span>
                    </button>
                  ))
                )}
              </div>

              {/* Last refreshed footer */}
              <div className="px-5 py-2.5 border-t border-neutral-100 text-[10px] text-neutral-400 font-semibold text-right">
                Updated {lastRefreshed.toLocaleTimeString()}
              </div>
            </div>

            {/* Desktop: placeholder when no message selected */}
            <div className="hidden lg:flex lg:col-span-2 bg-white rounded-2xl border border-neutral-200 shadow-sm p-12 flex-col items-center justify-center text-center text-neutral-400">
              <Mail size={40} className="mb-4 text-neutral-300" />
              <p className="text-sm font-semibold">Select a message from the inbox to read and reply.</p>
            </div>
          </div>

          {/* ── Desktop: side-by-side when a message is selected ── */}
          {selectedMessage && (
            <div className={`lg:grid lg:grid-cols-3 lg:gap-6 lg:min-h-[550px] absolute inset-0 ${showDetail ? "flex flex-col lg:static" : "hidden lg:grid"}`}>
              {/* Inbox panel (desktop only alongside detail) */}
              <div className="hidden lg:flex bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden flex-col">
                <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
                  <span className="font-black text-sm text-neutral-900 flex items-center gap-2">
                    <Inbox size={16} className="text-neutral-500" />
                    Inbox ({messages.length})
                  </span>
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                    unreadCount > 0 ? "bg-red-600 text-white" : "bg-neutral-100 text-neutral-500"
                  }`}>
                    {unreadCount > 0 ? `${unreadCount} New` : "0 New"}
                  </span>
                </div>
                <div className="divide-y divide-neutral-100 overflow-y-auto flex-1 max-h-[580px]">
                  {messages.length === 0 ? (
                    <div className="p-8 text-center text-neutral-400 text-sm">No messages yet.</div>
                  ) : (
                    messages.map((msg) => (
                      <button
                        key={msg.id}
                        onClick={() => handleSelectMessage(msg)}
                        className={`w-full text-left px-5 py-4 transition-colors flex flex-col gap-1 ${
                          selectedMessage?.id === msg.id
                            ? "bg-neutral-100 border-l-[3px] border-neutral-900"
                            : "hover:bg-neutral-50 border-l-[3px] border-transparent"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className={`font-bold text-sm text-neutral-900 truncate ${msg.status === "Unread" ? "font-black" : ""}`}>
                            {msg.name}
                          </span>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                            msg.status === "Unread"
                              ? "bg-neutral-900 text-white"
                              : msg.status === "Replied"
                              ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                              : "bg-neutral-200 text-neutral-600"
                          }`}>
                            {msg.status}
                          </span>
                        </div>
                        <p className="font-semibold text-xs text-neutral-700 line-clamp-1">{msg.subject}</p>
                        <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">{msg.message}</p>
                        <span className="text-[10px] text-neutral-400 mt-0.5">{msg.date}</span>
                      </button>
                    ))
                  )}
                </div>
                <div className="px-5 py-2.5 border-t border-neutral-100 text-[10px] text-neutral-400 font-semibold text-right">
                  Updated {lastRefreshed.toLocaleTimeString()}
                </div>
              </div>

              {/* ── Message Detail Panel ── */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200 shadow-sm p-4 sm:p-6 flex flex-col justify-between flex-1 min-h-0">
                <div className="flex-1 overflow-y-auto">
                  {/* Mobile back button */}
                  <button
                    onClick={() => setShowDetail(false)}
                    className="flex lg:hidden items-center gap-2 text-xs font-bold text-neutral-500 hover:text-neutral-900 mb-4 transition-colors"
                  >
                    <ArrowLeft size={14} /> Back to Inbox
                  </button>

                  {/* Detail Header */}
                  <div className="flex items-start justify-between pb-4 border-b border-neutral-100 mb-4 gap-3">
                    <div className="min-w-0">
                      <h2 className="text-lg sm:text-xl font-black text-neutral-900 mb-1 leading-snug">{selectedMessage.subject}</h2>
                      <p className="text-sm font-semibold text-neutral-700">From: {selectedMessage.name}</p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 mt-1.5">
                        <span className="flex items-center gap-1.5">
                          <Mail size={12} className="text-neutral-400" />
                          {selectedMessage.email}
                        </span>
                        {selectedMessage.phone && (
                          <span className="flex items-center gap-1.5">
                            <Phone size={12} className="text-neutral-400" />
                            {selectedMessage.phone}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs text-neutral-400 block">{selectedMessage.date}</span>
                      <span className={`mt-1.5 block text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                        selectedMessage.status === "Unread"
                          ? "bg-neutral-900 text-white"
                          : selectedMessage.status === "Replied"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-neutral-200 text-neutral-600"
                      }`}>
                        {selectedMessage.status}
                      </span>
                    </div>
                  </div>

                  {/* Message Body */}
                  <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 sm:p-5 text-neutral-800 text-sm leading-relaxed">
                    {selectedMessage.message}
                  </div>
                </div>

                {/* Reply Form */}
                <div className="pt-4 sm:pt-5 border-t border-neutral-100 mt-4 sm:mt-5">
                  {repliedSuccess && (
                    <div className="flex items-center gap-2 mb-3 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-semibold">
                      <CheckCircle2 size={16} />
                      Reply marked as sent!
                    </div>
                  )}
                  <form onSubmit={handleSendReply} className="space-y-3">
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">
                      Send Email Reply
                    </label>
                    <textarea
                      rows={3}
                      placeholder={`Write your response to ${selectedMessage.name}...`}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full p-3 sm:p-4 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none resize-none bg-neutral-50 focus:bg-white transition-all"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-neutral-900 hover:bg-black text-white text-xs font-black uppercase tracking-widest px-5 sm:px-7 py-3 rounded-xl transition-all shadow-md flex items-center gap-2"
                      >
                        <Send size={14} />
                        Send Reply
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
