export const THEME_STORAGE_KEY = "lace-theme";
export const THEME_VERSION_KEY = "lace-theme-version";
export const THEME_VERSION = "4";
export const DEFAULT_THEME = "dark";

export const THEME_PALETTES = {
  light: {
    background: "#fffafa",
    surface: "#f8e9e9",
    card: "#ffffff",
    primary: "#8f1d2c",
    "primary-fill": "#a61f30",
    "on-primary": "#ffffff",
    text: "#291b1d",
    muted: "#675457",
    border: "#dec8cb",
  },
  dark: {
    background: "#090909",
    surface: "#151515",
    card: "#1f1f1f",
    primary: "#d4af37",
    "primary-fill": "#d4af37",
    "on-primary": "#0d0b05",
    text: "#fafafa",
    muted: "#a1a1aa",
    border: "#3f3f46",
  },
};

export function normalizeTheme(theme) {
  return theme === "dark" || theme === "light" ? theme : DEFAULT_THEME;
}

export function getStoredTheme() {
  try {
    if (localStorage.getItem(THEME_VERSION_KEY) !== THEME_VERSION) {
      localStorage.setItem(THEME_STORAGE_KEY, DEFAULT_THEME);
      localStorage.setItem(THEME_VERSION_KEY, THEME_VERSION);
      return DEFAULT_THEME;
    }

    return normalizeTheme(localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    return DEFAULT_THEME;
  }
}

export function applyTheme(theme, { persist = true } = {}) {
  const nextTheme = normalizeTheme(theme);
  const palette = THEME_PALETTES[nextTheme];
  const root = document.documentElement;

  root.dataset.theme = nextTheme;
  root.classList.remove("theme-light", "theme-dark");
  root.classList.add(`theme-${nextTheme}`);
  root.style.colorScheme = nextTheme === "light" ? "only light" : "dark";

  Object.entries(palette).forEach(([name, value]) => {
    root.style.setProperty(`--app-${name}`, value);
  });

  if (document.body) {
    document.body.style.backgroundColor = palette.background;
    document.body.style.color = palette.text;
  }

  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) {
    themeColor.setAttribute("content", palette.background);
  }

  const colorScheme = document.querySelector('meta[name="color-scheme"]');
  if (colorScheme) {
    colorScheme.setAttribute("content", nextTheme === "light" ? "only light" : "dark light");
  }

  if (persist) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      localStorage.setItem(THEME_VERSION_KEY, THEME_VERSION);
    } catch {
      // Navegadores em modo privado podem bloquear localStorage.
    }
  }

  return nextTheme;
}
