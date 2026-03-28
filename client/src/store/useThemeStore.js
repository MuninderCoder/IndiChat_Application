import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("indichat-theme") || "dark",

  setTheme: (theme) => {
    localStorage.setItem("indichat-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    set({ theme });
  },

  initTheme: () => {
    const saved = localStorage.getItem("indichat-theme") || "dark";
    document.documentElement.setAttribute("data-theme", saved);
    set({ theme: saved });
  },
}));
