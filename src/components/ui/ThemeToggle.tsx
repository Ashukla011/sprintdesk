import { useTheme } from "../../hooks/useTheme";

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      aria-pressed={isDark}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="inline-flex min-h-10 items-center gap-2 rounded-md border border-stone-200 bg-white px-3 py-2 text-sm font-bold text-stone-800 shadow-sm transition-colors hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-400 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:hover:bg-stone-800"
      onClick={toggleTheme}
      type="button"
    >
      <span aria-hidden="true" className="text-base leading-none">{isDark ? "☀" : "◐"}</span>
      {isDark ? "Light" : "Dark"}
    </button>
  );
}
