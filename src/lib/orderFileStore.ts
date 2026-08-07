// Robust file-based store for orders with in-memory fallback.
// Ensures orders are never lost even if disk write fails or file is locked.

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

declare global {
  var __ordersCache: OrderRecord[] | undefined;
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
    console.warn("[orderFileStore] ensureFile warning:", err);
  }
}

function readFromDisk(): OrderRecord[] {
  let disk: OrderRecord[] = [];
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
    console.warn("[orderFileStore] Failed to read orders.json from disk:", err);
  }

  const cache = globalThis.__ordersCache || [];
  const map = new Map<string, OrderRecord>();

  for (const item of [...disk, ...cache]) {
    if (item && item.orderId) {
      map.set(item.orderId, item);
    }
  }

  const merged = Array.from(map.values()).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  globalThis.__ordersCache = merged;
  return merged;
}

function writeToDisk(orders: OrderRecord[]): void {
  globalThis.__ordersCache = orders;
  try {
    ensureFile();
    fs.writeFileSync(DB_PATH, JSON.stringify(orders, null, 2), "utf-8");
  } catch (err) {
    console.warn("[orderFileStore] Could not write orders.json to disk (using in-memory cache):", err);
  }
}

export const orderFileStore = {
  getAll(): OrderRecord[] {
    return readFromDisk().sort(
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

    writeToDisk(orders);
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
