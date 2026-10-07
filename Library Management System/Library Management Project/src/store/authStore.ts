import type { AuthUser } from "@/lib/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

let accessToken: string | null = null;

export const getAccessToken = () => accessToken;

export const setAccessToken = (token: string | null) => {
    accessToken = token;
};

// Simulates calling GET /auth/refresh and getting a new token back
export const silentRefresh = (): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { isAuthenticated } = useAuthStore.getState();

      if (isAuthenticated) {
        const newToken = `refreshed-token-${Date.now()}`;
        setAccessToken(newToken);
        console.log('Silent refresh succeeded — new token set in memory');
        resolve(true);
      } else {
        console.log('Silent refresh failed — no persisted session');
        resolve(false);
      }
    }, 500);
  });
};

interface AuthState {
  user: AuthUser | null,
  isAuthenticated: boolean,
  login: (user: AuthUser, token: string) => void,
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user, token) => {
        setAccessToken(token);
        set({ user, isAuthenticated: true })
      },
      logout: () => {
        setAccessToken(null);
        set({user: null, isAuthenticated: false})
      }
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);

