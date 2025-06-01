import { useState, useEffect } from "react";

function DarkModeToggle() {
  // Only check localStorage and system preference on first mount
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem("theme");
    if (stored === "dark") return true;
    if (stored === "light") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // On mount, sync state with class on <html> (handles SSR/static class)
  useEffect(() => {
    const classList = document.documentElement.classList;
    if (classList.contains("dark")) {
      setIsDark(true);
    } else {
      setIsDark(false);
    }
  }, []);

  // When isDark changes, update <html> class and localStorage
  useEffect(() => {
    const classList = document.documentElement.classList;
    if (isDark) {
      classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // Listen for system theme changes and update if user hasn't set a preference
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return; // Don't override user preference
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return (
    <button
      className="fixed top-4 right-4 z-50 px-3 py-2 rounded bg-gray-700 shadow hover:bg-gray-600 transition"
      onClick={() => setIsDark((d) => !d)}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}

export default DarkModeToggle;
