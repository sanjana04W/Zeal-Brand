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
// Ensure the directory for DB_PATH exists (important for serverless / fresh environments)
const DB_DIR = path.dirname(DB_PATH);
if (!fs.existsSync(DB_DIR)) {
  try {
    fs.mkdirSync(DB_DIR, { recursive: true });
  } catch (e) {
    console.warn("Failed to create messages directory:", e);
  }
}

declare global {
  var __messagesCache: Message[] | undefined;
}

function readMessages(): Message[] {
  let disk: Message[] = [];
  try {
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        disk = parsed;
      }
    }
  } catch {
    /* ignore read errors */
  }

  const cache = globalThis.__messagesCache || [];
  const map = new Map<string, Message>();

  for (const item of [...disk, ...cache]) {
    if (item && item.id) {
      map.set(item.id, item);
    }
  }

  const merged = Array.from(map.values()).sort((a, b) => b.createdAt - a.createdAt);
  globalThis.__messagesCache = merged;
  return merged;
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

    const cleanMsg = {
      name: (msg.name || "Customer").trim(),
      email: (msg.email || "").trim().toLowerCase(),
      phone: (msg.phone || "").trim(),
      subject: (msg.subject || "Customer Inquiry").trim(),
      message: (msg.message || "").trim(),
    };

    const newMsg: Message = {
      ...cleanMsg,
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
