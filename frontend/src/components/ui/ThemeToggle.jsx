import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

function getInitialTheme() {
  return localStorage.getItem("lace-theme") || "dark";
}

function applyTheme(theme) {
  const root = document.documentElement;
  const palette = theme === "light"
    ? { background: "#fffafa", surface: "#f8e9e9", card: "#ffffff", primary: "#8f1d2c", "primary-fill": "#a61f30", "on-primary": "#ffffff", text: "#291b1d", muted: "#675457", border: "#dec8cb" }
    : { background: "#090909", surface: "#151515", card: "#1f1f1f", primary: "#d4af37", "primary-fill": "#d4af37", "on-primary": "#0d0b05", text: "#fafafa", muted: "#a1a1aa", border: "#3f3f46" };

  root.dataset.theme = theme;
  root.classList.toggle("theme-light", theme === "light");
  root.classList.toggle("theme-dark", theme === "dark");
  Object.entries(palette).forEach(([name, value]) => root.style.setProperty(`--app-${name}`, value));
  document.body.style.backgroundColor = palette.background;
  document.body.style.color = palette.text;
  localStorage.setItem("lace-theme", theme);
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState(getInitialTheme);
  const isDark = theme === "dark";

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  function toggleTheme() {
    const nextTheme = isDark ? "light" : "dark";
    applyTheme(nextTheme);
    setTheme(nextTheme);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
      title={isDark ? "Modo claro" : "Modo escuro"}
      className="flex h-10 cursor-pointer items-center gap-2 rounded-full border border-border bg-card px-3 text-sm font-semibold text-text transition hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
    >
      {isDark ? <Sun size={19} aria-hidden="true" /> : <Moon size={19} aria-hidden="true" />}
      <span className="hidden sm:inline">{isDark ? "Modo claro" : "Modo escuro"}</span>
    </button>
  );
}
