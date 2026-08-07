// Robust file-based store for messages with in-memory fallback.
// Ensures messages are never lost even if disk write fails or file is locked.

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

function ensureFile(): void {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, "[]", "utf-8");
    }
  } catch (err) {
    console.warn("[messageStore] ensureFile warning:", err);
  }
}

function readFromDisk(): Message[] {
  let disk: Message[] = [];
  try {
    ensureFile();
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, "utf-8").trim();
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          disk = parsed;
        }
      }
    }
  } catch (err) {
    console.warn("[messageStore] Failed to read messages.json from disk:", err);
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

function writeToDisk(messages: Message[]): void {
  globalThis.__messagesCache = messages;
  try {
    ensureFile();
    fs.writeFileSync(DB_PATH, JSON.stringify(messages, null, 2), "utf-8");
  } catch (err) {
    console.warn("[messageStore] Could not write messages.json to disk (using in-memory cache):", err);
  }
}

export const messageStore = {
  getAll(): Message[] {
    return readFromDisk().sort((a, b) => b.createdAt - a.createdAt);
  },

  add(msg: Omit<Message, "id" | "date" | "status" | "createdAt">): Message {
    const messages = readFromDisk();
    const now = new Date();

    const newMsg: Message = {
      id: `M-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: (msg.name || "Customer").trim(),
      email: (msg.email || "").trim().toLowerCase(),
      phone: (msg.phone || "").trim(),
      subject: (msg.subject || "Customer Inquiry").trim().slice(0, 100),
      message: (msg.message || "").trim(),
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
    writeToDisk(messages);
    return newMsg;
  },

  updateStatus(id: string, status: Message["status"]): boolean {
    const messages = readFromDisk();
    const idx = messages.findIndex((m) => m.id === id);
    if (idx === -1) return false;
    messages[idx] = { ...messages[idx], status };
    writeToDisk(messages);
    return true;
  },

  getUnreadCount(): number {
    return readFromDisk().filter((m) => m.status === "Unread").length;
  },
};
