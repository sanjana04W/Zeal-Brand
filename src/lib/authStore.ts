import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address?: string;
  joinedDate?: string;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (user: UserProfile) => void;
  register: (user: UserProfile) => void;
  updateUser: (updated: Partial<UserProfile>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) =>
        set({
          user: {
            ...user,
            joinedDate: user.joinedDate || new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
          },
          isAuthenticated: true,
        }),
      register: (user) =>
        set({
          user: {
            ...user,
            joinedDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
          },
          isAuthenticated: true,
        }),
      updateUser: (updated) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updated } : null,
        })),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "zeal-user-auth",
    }
  )
);
