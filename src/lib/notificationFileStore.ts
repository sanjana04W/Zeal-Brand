import fs from "fs";
import path from "path";

export interface ServerNotification {
  id: string;
  type: "ORDER" | "MESSAGE";
  title: string;
  subtitle: string;
  detail: string;
  link: string;
  date: string;
  read: boolean;
  createdAt: number;
}

declare global {
  var __ZEAL_NOTIFICATIONS__: ServerNotification[] | undefined;
}

const SEED_PATH = path.join(process.cwd(), "src", "lib", "notifications.json");
const TMP_PATH = path.join("/tmp", "zeal_notifications.json");

function getFilePath(): string {
  try {
    if (fs.existsSync("/tmp")) return TMP_PATH;
  } catch {}
  return SEED_PATH;
}

function readNotifications(): ServerNotification[] {
  if (globalThis.__ZEAL_NOTIFICATIONS__) {
    return globalThis.__ZEAL_NOTIFICATIONS__;
  }
  
  const targetPath = getFilePath();
  try {
    if (fs.existsSync(targetPath)) {
      const raw = fs.readFileSync(targetPath, "utf-8");
      const parsed = JSON.parse(raw);
      globalThis.__ZEAL_NOTIFICATIONS__ = Array.isArray(parsed) ? parsed : [];
      return globalThis.__ZEAL_NOTIFICATIONS__;
    }
  } catch {}

  try {
    if (fs.existsSync(SEED_PATH)) {
      const raw = fs.readFileSync(SEED_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      globalThis.__ZEAL_NOTIFICATIONS__ = Array.isArray(parsed) ? parsed : [];
      return globalThis.__ZEAL_NOTIFICATIONS__;
    }
  } catch {}

  globalThis.__ZEAL_NOTIFICATIONS__ = [];
  return globalThis.__ZEAL_NOTIFICATIONS__;
}

function writeNotifications(notifs: ServerNotification[]): void {
  globalThis.__ZEAL_NOTIFICATIONS__ = notifs;
  const targetPath = getFilePath();
  try {
    fs.writeFileSync(targetPath, JSON.stringify(notifs, null, 2), "utf-8");
  } catch {}
  if (targetPath !== SEED_PATH) {
    try {
      fs.writeFileSync(SEED_PATH, JSON.stringify(notifs, null, 2), "utf-8");
    } catch {}
  }
}

export const notificationFileStore = {
  getAll(): ServerNotification[] {
    return readNotifications().sort((a, b) => b.createdAt - a.createdAt);
  },

  add(notif: Omit<ServerNotification, "id" | "date" | "read" | "createdAt">): ServerNotification {
    const list = readNotifications();
    const now = new Date();
    const newNotif: ServerNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      date: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: false,
      createdAt: Date.now(),
    };
    list.unshift(newNotif);
    writeNotifications(list);
    return newNotif;
  },

  markAsRead(id: string): boolean {
    const list = readNotifications();
    const idx = list.findIndex((n) => n.id === id);
    if (idx === -1) return false;
    list[idx] = { ...list[idx], read: true };
    writeNotifications(list);
    return true;
  },

  dismiss(id: string): boolean {
    let list = readNotifications();
    const initial = list.length;
    list = list.filter((n) => n.id !== id);
    if (list.length === initial) return false;
    writeNotifications(list);
    return true;
  },

  dismissAll(): void {
    writeNotifications([]);
  },

  getUnreadCount(): number {
    return readNotifications().filter((n) => !n.read).length;
  },
};
