import type { AuthUser } from "@/lib/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { logoutUser, getMe } from "@/lib/api/auth";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (user: AuthUser) => void;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (user) => {
        set({ user, isAuthenticated: true });
      },

      logout: async () => {
        try {
          await logoutUser();
        } catch {
          // do nothing if error occurs
        }
        set({ user: null, isAuthenticated: false });
      },

      initializeAuth: async () => {
        try {
          const response = await getMe();
          const data = response.data;

          set({
            user: {
              id: data.id,
              email: data.email,
              first_name: data.first_name,
              last_name: data.last_name,
              role: data.role,
            },
            isAuthenticated: true,
          });
          return true;
        } catch {
          set({ user: null, isAuthenticated: false });
          return false;
        }
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
