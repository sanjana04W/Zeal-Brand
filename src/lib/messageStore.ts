// Robust file-based store for messages.
// Reads ONLY from disk on every call. writeToDisk throws on failure.

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

function ensureFile(): void {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, "[]", "utf-8");
  }
}

function readFromDisk(): Message[] {
  try {
    ensureFile();
    const raw = fs.readFileSync(DB_PATH, "utf-8").trim();
    if (!raw || raw === "") return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("[messageStore] Failed to read messages.json:", err);
    return [];
  }
}

function writeToDisk(messages: Message[]): void {
  try {
    ensureFile();
    fs.writeFileSync(DB_PATH, JSON.stringify(messages, null, 2), "utf-8");
  } catch (err) {
    throw new Error(`[messageStore] Failed to write messages.json: ${err}`);
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
    writeToDisk(messages); // Throws if write fails
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
