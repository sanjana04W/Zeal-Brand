import { create } from "zustand";
import { persist } from "zustand/middleware";

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

interface OrderStore {
  // For the confirmation page (last order placed)
  lastOrder: OrderRecord | null;
  setLastOrder: (order: OrderRecord) => void;

  // Full order history (all users)
  allOrders: OrderRecord[];
  addOrder: (order: OrderRecord) => void;
  updateOrderStatus: (orderId: string, status: OrderRecord["status"]) => void;
  clearLastOrder: () => void;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      lastOrder: null,
      allOrders: [],

      setLastOrder: (order) => set({ lastOrder: order }),
      clearLastOrder: () => set({ lastOrder: null }),

      addOrder: (order) =>
        set((state) => ({
          allOrders: [order, ...state.allOrders],
          lastOrder: order,
        })),

      updateOrderStatus: (orderId, status) =>
        set((state) => ({
          allOrders: state.allOrders.map((o) =>
            o.orderId === orderId ? { ...o, status } : o
          ),
        })),
    }),
    { name: "zeal-orders-v2" }
  )
);
