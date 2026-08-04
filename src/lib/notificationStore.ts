import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AdminNotification {
  id: string;
  type: "ORDER" | "MESSAGE";
  title: string;
  subtitle: string;
  detail: string;
  link: string;
  date: string;
  read: boolean;
}

interface NotificationStore {
  notifications: AdminNotification[];
  addNotification: (notif: Omit<AdminNotification, "id" | "date" | "read">) => void;
  dismissNotification: (id: string) => void;
  dismissAll: () => void;
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set) => ({
      notifications: [
        {
          id: "notif-demo-1",
          type: "ORDER",
          title: "New Order Placed",
          subtitle: "ZB-10003",
          detail: "wenuri sanjana placed an order for Rs. 3,950",
          link: "/admin/orders",
          date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: false,
        },
      ],

      addNotification: (notif) =>
        set((state) => ({
          notifications: [
            {
              ...notif,
              id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
              date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              read: false,
            },
            ...state.notifications,
          ],
        })),

      dismissNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      dismissAll: () =>
        set(() => ({
          notifications: [],
        })),
    }),
    { name: "zeal-admin-notifications" }
  )
);
