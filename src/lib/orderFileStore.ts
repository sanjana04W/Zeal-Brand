// File-based persistent order store — survives server restarts and re-logins
// Orders are written to src/lib/orders.json so they are never lost.

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
  date: string; // ISO string
}

const DB_PATH = path.join(process.cwd(), "src", "lib", "orders.json");

declare global {
  var __ordersCache: OrderRecord[] | undefined;
}

function getHigherOrderStatus(s1?: OrderRecord["status"], s2?: OrderRecord["status"]): OrderRecord["status"] {
  if (s1 === "CANCELLED" || s2 === "CANCELLED") return (s1 === "CANCELLED" ? s1 : s2) as OrderRecord["status"];
  if (s1 === "DELIVERED" || s2 === "DELIVERED") return "DELIVERED";
  if (s1 === "SHIPPED" || s2 === "SHIPPED") return "SHIPPED";
  if (s1 === "CONFIRMED" || s2 === "CONFIRMED") return "CONFIRMED";
  return "PENDING";
}

function readOrders(): OrderRecord[] {
  let disk: OrderRecord[] = [];
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

  const cache = globalThis.__ordersCache || [];
  const map = new Map<string, OrderRecord>();

  for (const item of [...disk, ...cache]) {
    if (item && item.orderId) {
      const existing = map.get(item.orderId);
      if (existing) {
        map.set(item.orderId, {
          ...item,
          ...existing,
          status: getHigherOrderStatus(existing.status, item.status),
        });
      } else {
        map.set(item.orderId, item);
      }
    }
  }

  const merged = Array.from(map.values()).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  globalThis.__ordersCache = merged;
  return merged;
}

function writeOrders(orders: OrderRecord[]): void {
  globalThis.__ordersCache = orders;
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(orders, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not persist orders.json to disk (expected in serverless environments):", err);
  }
}

export const orderFileStore = {
  getAll(): OrderRecord[] {
    return readOrders().sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  },

  add(order: OrderRecord): OrderRecord {
    const orders = readOrders();
    const normalizedOrder: OrderRecord = {
      ...order,
      userEmail: (order.userEmail || "").trim().toLowerCase(),
      phone: (order.phone || "").trim(),
    };

    // Check if order already exists to prevent duplicate submission
    const existingIdx = orders.findIndex((o) => o.orderId === normalizedOrder.orderId);
    if (existingIdx !== -1) {
      orders[existingIdx] = normalizedOrder;
    } else {
      orders.unshift(normalizedOrder);
    }
    writeOrders(orders);
    return normalizedOrder;
  },

  updateStatus(orderId: string, status: OrderRecord["status"]): boolean {
    const orders = readOrders();
    const idx = orders.findIndex((o) => o.orderId === orderId);
    if (idx === -1) return false;
    orders[idx] = { ...orders[idx], status };
    writeOrders(orders);
    return true;
  },

  getPendingCount(): number {
    return readOrders().filter((o) => o.status === "PENDING").length;
  },

  getTotalRevenue(): number {
    return readOrders()
      .filter((o) => o.status !== "CANCELLED")
      .reduce((sum, o) => sum + o.total, 0);
  },
};

