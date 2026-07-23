import { create } from "zustand";
import axiosInstance from "../services/axiosInstance";

// Backend returns snake_case (signature_image); frontend components were
// written expecting camelCase (signatureImage). Normalizing once here
// means every component downstream can keep using user.signatureImage
// without needing individual fixes.
const normalizeUser = (user) => {
  if (!user) return user;
  const { signature_image, ...rest } = user;
  return {
    ...rest,
    signatureImage: signature_image ?? user.signatureImage ?? null,
  };
};

export const useAuthStore = create((set, get) => ({
  user: null, // { id, name, email, role, totp_enabled, signatureImage, ... }
  isAuthenticated: false,
  isLoading: true, // true until we've checked session on app load

  setUser: (user) => set({ user: normalizeUser(user), isAuthenticated: !!user, isLoading: false }),

  login: async (credentials) => {
    const { data } = await axiosInstance.post("/auth/login", credentials);
    if (data.requires_totp) {
      return { requiresTotp: true, tempToken: data.temp_token };
    }
    localStorage.setItem("ferwafa-access-token", data.access_token);
    set({ user: normalizeUser(data.user), isAuthenticated: true, isLoading: false });

    // First login before 2FA is enrolled — same access token works for the
    // enrollment endpoints, but the frontend needs to route there instead
    // of straight to the dashboard.
    if (!data.user.totp_enabled) {
      return { requiresTotp: false, needsTotpSetup: true };
    }
    return { requiresTotp: false, needsTotpSetup: false };
  },

  verifyTotp: async ({ tempToken, code }) => {
    const { data } = await axiosInstance.post("/auth/totp/verify", {
      temp_token: tempToken,
      code,
    });
    localStorage.setItem("ferwafa-access-token", data.access_token);
    set({ user: normalizeUser(data.user), isAuthenticated: true, isLoading: false });
  },

  // Called once on app load to restore session.
  // Strategy:
  //   1. Try GET /users/me with the stored access token (fast path — no cookie round-trip).
  //   2. If that fails, try POST /auth/refresh to get a new access token from the
  //      httpOnly refresh cookie, then retry GET /users/me with it.
  //   3. If both fail, clear state and let the user log in.
  //
  // _skipRefresh: true on the first request tells the axios interceptor NOT to
  // handle the 401 itself — we're doing the retry manually here to avoid the
  // infinite redirect loop (interceptor failure → window.location.href = /login
  // → reload → fetchSession → interceptor failure → ...).
  fetchSession: async () => {
    try {
      // Step 1: try with the existing access token
      const { data } = await axiosInstance.get("/users/me", {
        _skipRefresh: true,
      });
      // /users/me returns the profile object directly (not wrapped in { user: ... })
      set({ user: normalizeUser(data), isAuthenticated: true, isLoading: false });
    } catch (firstErr) {
      if (firstErr.response?.status !== 401) {
        // Non-auth error (network down, server error, etc.) — treat as logged out
        set({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }

      // Step 2: access token is expired — try the refresh cookie
      try {
        const { data: refreshData } = await axiosInstance.post("/auth/refresh");
        localStorage.setItem("ferwafa-access-token", refreshData.access_token);

        const { data: meData } = await axiosInstance.get("/users/me", {
          _skipRefresh: true,
        });
        set({ user: normalizeUser(meData), isAuthenticated: true, isLoading: false });
      } catch {
        // Both failed — user must log in again
        localStorage.removeItem("ferwafa-access-token");
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
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