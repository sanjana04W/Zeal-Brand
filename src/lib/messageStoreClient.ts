import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ClientMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  status: "Unread" | "Read" | "Replied";
  createdAt: number;
}

interface MessageStoreState {
  messages: ClientMessage[];
  addMessage: (msg: Omit<ClientMessage, "id" | "date" | "status" | "createdAt"> & { id?: string; date?: string; status?: ClientMessage["status"] }) => ClientMessage;
  updateMessageStatus: (id: string, status: ClientMessage["status"]) => void;
  clearMessages: () => void;
}

export const useMessageStore = create<MessageStoreState>()(
  persist(
    (set) => ({
      messages: [
        {
          id: "M-1785816278003",
          name: "wenuri",
          email: "wenuris2004@gmail.com",
          phone: "",
          subject: "Message from wenuri",
          message: "test",
          date: "04 Aug 2026, 09:34",
          status: "Read",
          createdAt: 1785816278003,
        },
      ],

      addMessage: (msgData) => {
        const now = new Date();
        const id = msgData.id || `M-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
        const date = msgData.date || now.toLocaleString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "short",
          year: "numeric",
        });

        const newMsg: ClientMessage = {
          id,
          name: (msgData.name || "Customer").trim(),
          email: (msgData.email || "").trim().toLowerCase(),
          phone: (msgData.phone || "").trim(),
          subject: (msgData.subject || "Customer Inquiry").trim(),
          message: (msgData.message || "").trim(),
          date,
          status: msgData.status || "Unread",
          createdAt: Date.now(),
        };

        set((state) => {
          const exists = state.messages.some((m) => m.id === newMsg.id);
          if (exists) {
            return {
              messages: state.messages.map((m) => (m.id === newMsg.id ? newMsg : m)),
            };
          }
          return {
            messages: [newMsg, ...state.messages],
          };
        });

        return newMsg;
      },

      updateMessageStatus: (id, status) => {
        set((state) => ({
          messages: state.messages.map((m) => (m.id === id ? { ...m, status } : m)),
        }));
      },

      clearMessages: () => set({ messages: [] }),
    }),
    { name: "zeal-client-messages-store" }
  )
);
