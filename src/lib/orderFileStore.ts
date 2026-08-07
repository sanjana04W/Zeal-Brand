// Robust file-based store for orders.
// Reads ONLY from disk on every call to stay fresh across hot-reloads.
// Uses globalThis cache only as a write-buffer for the same request cycle.

import fs from "fs";
import path from "path";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
}

export interface OrderRecord {
  orderId: string;
  userEmail: string;
  fullName: string;
  phone: string;
  district: string;
  address: string;
  deliveryDate?: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  delivery: number;
  total: number;
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  date: string;
}

const DB_PATH = path.join(process.cwd(), "src", "lib", "orders.json");

function ensureFile(): void {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, "[]", "utf-8");
  }
}

function readFromDisk(): OrderRecord[] {
  try {
    ensureFile();
    const raw = fs.readFileSync(DB_PATH, "utf-8").trim();
    if (!raw || raw === "") return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("[orderFileStore] Failed to read orders.json:", err);
    return [];
  }
}

function writeToDisk(orders: OrderRecord[]): void {
  try {
    ensureFile();
    fs.writeFileSync(DB_PATH, JSON.stringify(orders, null, 2), "utf-8");
  } catch (err) {
    // Re-throw so API routes can return a 500 instead of silently failing
    throw new Error(`[orderFileStore] Failed to write orders.json: ${err}`);
  }
}

export const orderFileStore = {
  getAll(): OrderRecord[] {
    const orders = readFromDisk();
    return orders.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  },

  add(order: OrderRecord): OrderRecord {
    const orders = readFromDisk();
    const normalized: OrderRecord = {
      ...order,
      userEmail: (order.userEmail || "").trim().toLowerCase(),
      phone: (order.phone || "").trim(),
    };

    const existingIdx = orders.findIndex((o) => o.orderId === normalized.orderId);
    if (existingIdx !== -1) {
      orders[existingIdx] = normalized;
    } else {
      orders.unshift(normalized);
    }

    writeToDisk(orders); // Throws if write fails — API will return 500
    return normalized;
  },

  updateStatus(orderId: string, status: OrderRecord["status"]): boolean {
    const orders = readFromDisk();
    const idx = orders.findIndex((o) => o.orderId === orderId);
    if (idx === -1) return false;
    orders[idx] = { ...orders[idx], status };
    writeToDisk(orders);
    return true;
  },

  getPendingCount(): number {
    return readFromDisk().filter((o) => o.status === "PENDING").length;
  },

  getTotalRevenue(): number {
    return readFromDisk()
      .filter((o) => o.status !== "CANCELLED")
      .reduce((sum, o) => sum + o.total, 0);
  },
};
