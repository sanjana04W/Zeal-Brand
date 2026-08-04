import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Promotion {
  id: string;
  title: string;
  description: string;
  code: string;
  discount: string;
  type: "Percentage" | "Fixed Amount" | "Shipping";
  category: string;
  status: "ACTIVE" | "SCHEDULED" | "PAUSED" | "EXPIRED";
  uses: number;
  expiry: string;
}

interface PromoStore {
  promotions: Promotion[];
  addPromotion: (promo: Omit<Promotion, "id" | "uses">) => void;
  updatePromotion: (id: string, updated: Partial<Promotion>) => void;
  togglePause: (id: string) => void;
  deletePromotion: (id: string) => void;
}

export const usePromoStore = create<PromoStore>()(
  persist(
    (set) => ({
      promotions: [
        {
          id: "p-1",
          title: "Mega Zeal Price Drop",
          description: "25% Off Storewide Collection",
          code: "MEGA25",
          discount: "25% OFF",
          type: "Percentage",
          category: "ALL PRODUCTS",
          status: "ACTIVE",
          uses: 142,
          expiry: "2026-08-31",
        },
        {
          id: "p-2",
          title: "Premium Oversized Tee Sale",
          description: "35% Off Selected Drop Shoulder Tees",
          code: "OVERSIZED35",
          discount: "35% OFF",
          type: "Percentage",
          category: "OVERSIZED",
          status: "ACTIVE",
          uses: 89,
          expiry: "2026-12-31",
        },
        {
          id: "p-3",
          title: "Weekend Streetwear Bundle",
          description: "15% Off All Streetwear Items",
          code: "STREET15",
          discount: "15% OFF",
          type: "Percentage",
          category: "STREETWEAR",
          status: "SCHEDULED",
          uses: 0,
          expiry: "2026-09-15",
        },
      ],

      addPromotion: (promo) =>
        set((state) => ({
          promotions: [
            {
              ...promo,
              id: `p-${Date.now()}`,
              uses: 0,
            },
            ...state.promotions,
          ],
        })),

      updatePromotion: (id, updated) =>
        set((state) => ({
          promotions: state.promotions.map((p) =>
            p.id === id ? { ...p, ...updated } : p
          ),
        })),

      togglePause: (id) =>
        set((state) => ({
          promotions: state.promotions.map((p) =>
            p.id === id
              ? {
                  ...p,
                  status: p.status === "ACTIVE" ? "PAUSED" : "ACTIVE",
                }
              : p
          ),
        })),

      deletePromotion: (id) =>
        set((state) => ({
          promotions: state.promotions.filter((p) => p.id !== id),
        })),
    }),
    { name: "zeal-promotions-store" }
  )
);
