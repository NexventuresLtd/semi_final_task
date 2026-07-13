import { create } from "zustand";
import axiosInstance from "../services/axiosInstance";

export const useAuthStore = create((set, get) => ({
  user: {
    id: "1",
    name: "Jean Claude",
    role: "staff",           // swap to "daf" or "sg" to preview those dashboards
    department: "referee",   // matches DEPARTMENTS in utils/constants.js
    email: "jean@ferwafa.rw",
  },
  isAuthenticated: false,
  isLoading: true, // true until we've checked session on app load

  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),

  login: async (credentials) => {
    const { data } = await axiosInstance.post("/auth/login", credentials);
    // If backend indicates TOTP is required next, don't set user yet —
    // the login page routes to the TOTP verification screen instead.
    if (data.requires_totp) {
      return { requiresTotp: true, tempToken: data.temp_token };
    }
    localStorage.setItem("ferwafa-access-token", data.access_token);
    set({ user: data.user, isAuthenticated: true, isLoading: false });
    return { requiresTotp: false };
  },

  verifyTotp: async ({ tempToken, code }) => {
    const { data } = await axiosInstance.post("/auth/totp/verify", {
      temp_token: tempToken,
      code,
    });
    localStorage.setItem("ferwafa-access-token", data.access_token);
    set({ user: data.user, isAuthenticated: true, isLoading: false });
  },

  // Called once on app load to restore session via the refresh cookie
  fetchSession: async () => {
    try {
      const { data } = await axiosInstance.get("/auth/me");
      set({ user: data.user, isAuthenticated: true, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } finally {
      localStorage.removeItem("ferwafa-access-token");
      set({ user: null, isAuthenticated: false });
      window.location.href = "/login";
    }
  },
}));