import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface StaffPermissionCategory {
  id: string;
  name: string;
  items: string[];
}

export const ALL_PERMISSIONS_LIST: Record<string, string[]> = {
  ORDERS: [
    "View Orders",
    "Update Order Status",
    "Contact Customers via WhatsApp",
  ],
  PRODUCTS_AND_INVENTORY: [
    "View Products",
    "Add New Products",
    "Edit Existing Products",
    "Delete Products",
    "Manage Stock & Inventory",
  ],
  CUSTOMERS: ["View Customer Profiles"],
  ANALYTICS: ["View Analytics & Revenue", "View Sales Reports"],
  SETTINGS: [
    "System Settings",
    "Promotions & Discounts",
    "Pixel & Integrations",
  ],
};

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: "SUPER ADMIN" | "STAFF";
  status: "Active" | "Inactive";
  permissions: string[]; // List of permission strings
  isBuiltIn?: boolean;
}

interface StaffStore {
  staffList: StaffMember[];
  addStaff: (member: Omit<StaffMember, "id">) => void;
  updateStaff: (id: string, updated: Partial<StaffMember>) => void;
  deleteStaff: (id: string) => void;
  toggleStatus: (id: string) => void;
}

export const useStaffStore = create<StaffStore>()(
  persist(
    (set) => ({
      staffList: [
        {
          id: "U-001",
          name: "Zeal Owner",
          email: "owner@zealbrand.com",
          role: "SUPER ADMIN",
          status: "Active",
          permissions: Object.values(ALL_PERMISSIONS_LIST).flat(),
          isBuiltIn: true,
        },
        {
          id: "U-002",
          name: "Zeal Staff",
          email: "staff@zealbrand.com",
          role: "STAFF",
          status: "Active",
          permissions: [
            "View Orders",
            "Update Order Status",
            "Contact Customers via WhatsApp",
            "View Products",
            "Add New Products",
            "Edit Existing Products",
            "Delete Products",
            "Manage Stock & Inventory",
          ],
          isBuiltIn: false,
        },
      ],

      addStaff: (member) =>
        set((state) => ({
          staffList: [
            ...state.staffList,
            { ...member, id: `U-${Date.now()}` },
          ],
        })),

      updateStaff: (id, updated) =>
        set((state) => ({
          staffList: state.staffList.map((s) =>
            s.id === id ? { ...s, ...updated } : s
          ),
        })),

      deleteStaff: (id) =>
        set((state) => ({
          staffList: state.staffList.filter((s) => s.id !== id || s.isBuiltIn),
        })),

      toggleStatus: (id) =>
        set((state) => ({
          staffList: state.staffList.map((s) =>
            s.id === id
              ? { ...s, status: s.status === "Active" ? "Inactive" : "Active" }
              : s
          ),
        })),
    }),
    { name: "zeal-staff-rbac" }
  )
);
