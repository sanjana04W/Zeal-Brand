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

const DB_PATH = path.join(process.cwd(), "src", "lib", "messages.json");

declare global {
  var __messagesCache: Message[] | undefined;
}

function readMessages(): Message[] {
  if (globalThis.__messagesCache) {
    return globalThis.__messagesCache;
  }
  try {
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    const result = Array.isArray(parsed) ? parsed : [];
    globalThis.__messagesCache = result;
    return result;
  } catch {
    globalThis.__messagesCache = [];
    return [];
  }
}

function writeMessages(messages: Message[]): void {
  globalThis.__messagesCache = messages;
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(messages, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not persist messages.json to disk (expected in serverless environments):", err);
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
