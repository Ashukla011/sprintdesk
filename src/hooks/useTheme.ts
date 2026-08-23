import { create } from "zustand";

const themeStorageKey = "sprintdesk-theme";

function applyTheme(isDark: boolean) {
  const root = document.documentElement;
  root.classList.toggle("dark", isDark);
  root.dataset.theme = isDark ? "dark" : "light";
  root.style.colorScheme = isDark ? "dark" : "light";
  window.localStorage.setItem(themeStorageKey, isDark ? "dark" : "light");
}

function getInitialTheme() {
  if (document.documentElement.dataset.theme) {
    return document.documentElement.dataset.theme === "dark";
  }
  const savedTheme = window.localStorage.getItem(themeStorageKey);
  return savedTheme
    ? savedTheme === "dark"
    : window.matchMedia("(prefers-color-scheme: dark)").matches;
}

const initialIsDark = getInitialTheme();
applyTheme(initialIsDark);

type ThemeState = {
  isDark: boolean;
  toggleTheme: () => void;
};

const useThemeStore = create<ThemeState>((set) => ({
  isDark: initialIsDark,
  toggleTheme: () =>
    set((state) => {
      const isDark = !state.isDark;
      applyTheme(isDark);
      return { isDark };
    }),
}));

/** Shared theme state used by every page-level theme toggle. */
export function useTheme() {
  return useThemeStore();
}
