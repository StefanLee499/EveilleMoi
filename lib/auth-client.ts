"use client";

import { create } from "zustand";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: "customer" | "admin";
  phone?: string;
  birthDate?: string;
  preferences?: { newsletter?: boolean; moonReminders?: boolean };
};

type AuthState = {
  user: SessionUser | null;
  loaded: boolean;
  setUser: (u: SessionUser | null) => void;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  loaded: false,
  setUser: (u) => set({ user: u, loaded: true }),
  refresh: async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await res.json();
      set({ user: data.user ?? null, loaded: true });
    } catch {
      set({ user: null, loaded: true });
    }
  },
  logout: async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    set({ user: null });
  },
}));
