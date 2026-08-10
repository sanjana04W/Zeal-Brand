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
  // Persistent set of IDs dismissed by the admin
  dismissedIds: string[];
  // Persistent set of message IDs marked as read
  readMessageIds: string[];

  addNotification: (notif: Omit<AdminNotification, "id" | "date" | "read">) => void;
  dismissNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  dismissByType: (type: "ORDER" | "MESSAGE") => void;
  dismissAll: () => void;
  // Persist a dismissed server-derived notification ID
  addDismissedId: (id: string) => void;
  addDismissedIds: (ids: string[]) => void;
  // Persist a read message ID
  addReadMessageId: (id: string) => void;
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set) => ({
      notifications: [],
      dismissedIds: [],
      readMessageIds: [],

      addNotification: (notif) =>
        set((state) => ({
          notifications: [
            {
              ...notif,
              id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
              date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              read: false,
            },
            ...state.notifications,
          ],
        })),

      dismissNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
          dismissedIds: state.dismissedIds.includes(id)
            ? state.dismissedIds
            : [...state.dismissedIds, id],
        })),

      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
          dismissedIds: state.dismissedIds.includes(id)
            ? state.dismissedIds
            : [...state.dismissedIds, id],
        })),

      dismissByType: (type) =>
        set((state) => {
          const toDismiss = state.notifications.filter((n) => n.type === type).map((n) => n.id);
          return {
            notifications: state.notifications.filter((n) => n.type !== type),
            dismissedIds: [...new Set([...state.dismissedIds, ...toDismiss])],
          };
        }),

      dismissAll: () =>
        set((state) => ({
          notifications: [],
          dismissedIds: [
            ...new Set([...state.dismissedIds, ...state.notifications.map((n) => n.id)]),
          ],
        })),

      addDismissedId: (id) =>
        set((state) => ({
          dismissedIds: state.dismissedIds.includes(id)
            ? state.dismissedIds
            : [...state.dismissedIds, id],
        })),

      addDismissedIds: (ids) =>
        set((state) => ({
          dismissedIds: [...new Set([...state.dismissedIds, ...ids])],
        })),

      addReadMessageId: (id) =>
        set((state) => ({
          readMessageIds: state.readMessageIds.includes(id)
            ? state.readMessageIds
            : [...state.readMessageIds, id],
        })),
    }),
    { name: "zeal-admin-notifications-v4" }
  )
);
