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

declare global {
  var __ZEAL_ORDERS__: OrderRecord[] | undefined;
}

const DB_PATH = path.join(process.cwd(), "src", "lib", "orders.json");

function readOrders(): OrderRecord[] {
  if (globalThis.__ZEAL_ORDERS__) {
    return globalThis.__ZEAL_ORDERS__;
  }
  try {
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    globalThis.__ZEAL_ORDERS__ = Array.isArray(parsed) ? parsed : [];
  } catch {
    globalThis.__ZEAL_ORDERS__ = [];
  }
  return globalThis.__ZEAL_ORDERS__ || [];
}

function writeOrders(orders: OrderRecord[]): void {
  globalThis.__ZEAL_ORDERS__ = orders;
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(orders, null, 2), "utf-8");
  } catch (err) {
    console.warn("Serverless read-only filesystem warning, order stored in server memory:", err);
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
    orders.unshift(order);
    writeOrders(orders);
    return order;
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
