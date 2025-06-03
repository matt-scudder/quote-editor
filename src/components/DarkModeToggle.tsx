import { useState, useEffect } from "react";

function DarkModeToggle() {
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  // Update DOM class when isDark state changes
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  // Listen for system theme changes. If a system theme change occurs,
  // adopt the new theme and clear any user-set theme in localStorage.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handler = (e: MediaQueryListEvent) => {
      if (localStorage.getItem("theme")) {
        localStorage.removeItem("theme");
      }
      setIsDark(e.matches);
    };

    const systemDarkMode = window.matchMedia("(prefers-color-scheme: dark)");
    systemDarkMode.addEventListener("change", handler);
    return () => {
      systemDarkMode.removeEventListener("change", handler);
    };
  }, []);

  const handleToggle = () => {
    setIsDark(prevIsDark => {
      const newIsDark = !prevIsDark;
      // User manually toggled, so set an explicit preference in localStorage
      localStorage.setItem("theme", newIsDark ? "dark" : "light");
      return newIsDark;
    });
  };

  return (
    <button
      className="fixed top-4 right-4 z-50 px-3 py-2 rounded bg-gray-700 shadow hover:bg-gray-600 transition"
      onClick={handleToggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}

export default DarkModeToggle;
