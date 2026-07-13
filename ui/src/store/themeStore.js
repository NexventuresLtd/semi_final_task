import { create } from "zustand";

const getInitialTheme = () => {
  if (typeof window === "undefined") return "light";
  // Light is always the default — we deliberately ignore prefers-color-scheme
  // so the app opens in light mode for every new visitor, every time.
  return localStorage.getItem("ferwafa-theme") || "light";
};

const applyThemeClass = (theme) => {
  document.documentElement.classList.toggle("dark", theme === "dark");
};

export const useThemeStore = create((set, get) => ({
  theme: getInitialTheme(),
  toggleTheme: () => {
    const next = get().theme === "dark" ? "light" : "dark";
    localStorage.setItem("ferwafa-theme", next);
    applyThemeClass(next);
    set({ theme: next });
  },
  initTheme: () => applyThemeClass(get().theme),
}));