// File-based persistent message store — survives server restarts and re-logins
// Messages are written to src/lib/messages.json so they are never lost.

import fs from "fs";
import path from "path";

export interface Message {
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

declare global {
  var __ZEAL_MESSAGES__: Message[] | undefined;
}

const DB_PATH = path.join(process.cwd(), "src", "lib", "messages.json");

function readMessages(): Message[] {
  if (globalThis.__ZEAL_MESSAGES__) {
    return globalThis.__ZEAL_MESSAGES__;
  }
  try {
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    globalThis.__ZEAL_MESSAGES__ = Array.isArray(parsed) ? parsed : [];
  } catch {
    globalThis.__ZEAL_MESSAGES__ = [];
  }
  return globalThis.__ZEAL_MESSAGES__ || [];
}

function writeMessages(messages: Message[]): void {
  globalThis.__ZEAL_MESSAGES__ = messages;
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(messages, null, 2), "utf-8");
  } catch (err) {
    console.warn("Serverless read-only filesystem warning, message stored in server memory:", err);
  }
}

export const messageStore = {
  getAll(): Message[] {
    return readMessages().sort((a, b) => b.createdAt - a.createdAt);
  },

  add(msg: Omit<Message, "id" | "date" | "status" | "createdAt">): Message {
    const messages = readMessages();
    const now = new Date();
    const newMsg: Message = {
      ...msg,
      id: `M-${Date.now()}`,
      status: "Unread",
      createdAt: Date.now(),
      date: now.toLocaleString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    };
    messages.unshift(newMsg);
    writeMessages(messages);
    return newMsg;
  },

  updateStatus(id: string, status: Message["status"]): boolean {
    const messages = readMessages();
    const idx = messages.findIndex((m) => m.id === id);
    if (idx === -1) return false;
    messages[idx] = { ...messages[idx], status };
    writeMessages(messages);
    return true;
  },

  getUnreadCount(): number {
    return readMessages().filter((m) => m.status === "Unread").length;
  },
};
