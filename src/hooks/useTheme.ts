import { useEffect, useState } from "react";

const themeStorageKey = "sprintdesk-theme";

export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = window.localStorage.getItem(themeStorageKey);
    return savedTheme
      ? savedTheme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    window.localStorage.setItem(themeStorageKey, isDark ? "dark" : "light");
  }, [isDark]);

  return { isDark, toggleTheme: () => setIsDark((value) => !value) };
}
