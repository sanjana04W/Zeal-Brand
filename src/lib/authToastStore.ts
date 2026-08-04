import { create } from "zustand";

export interface AuthToastData {
  type: "success" | "error" | "welcome";
  title: string;
  message: string;
}

interface AuthToastState {
  toast: AuthToastData | null;
  visible: boolean;
  showAuthToast: (data: AuthToastData) => void;
  hideAuthToast: () => void;
}

export const useAuthToastStore = create<AuthToastState>((set) => ({
  toast: null,
  visible: false,
  showAuthToast: (data) => set({ toast: data, visible: true }),
  hideAuthToast: () => set({ visible: false }),
}));
