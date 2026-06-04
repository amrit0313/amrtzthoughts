import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  updateUser: (user: User) => void;
  logout: () => void;
}

// Helper to set cookie for middleware
const setTokenCookie = (token: string) => {
  if (typeof document !== "undefined") {
    document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
  }
};

const clearTokenCookie = () => {
  if (typeof document !== "undefined") {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        localStorage.setItem("token", token);
        setTokenCookie(token);
        set({ user, token });
      },
      updateUser: (user) => {
        set({ user });
      },
      logout: () => {
        localStorage.removeItem("token");
        clearTokenCookie();
        set({ user: null, token: null });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, token: state.token }),
    },
  ),
);
