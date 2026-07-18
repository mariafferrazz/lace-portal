import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { applyTheme, getStoredTheme } from "../../utils/theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(getStoredTheme);
  const isDark = theme === "dark";

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  function toggleTheme() {
    const nextTheme = isDark ? "light" : "dark";
    setTheme(applyTheme(nextTheme));
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
