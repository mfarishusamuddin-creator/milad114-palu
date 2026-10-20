"use client";

import { toggleTheme, useTheme } from "@/components/theme/useTheme";
import type { Dictionary } from "@/i18n/types";

export function ThemeToggle({ dict }: { dict: Dictionary }) {
  const theme = useTheme();
  const label = theme === "dark" ? dict.nav.themeLight : dict.nav.themeDark;

  return (
    <button
      type="button"
      onClick={() => toggleTheme(theme)}
      aria-label={label}
      title={label}
      aria-pressed={theme === "dark"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-line bg-surface text-ink-soft transition-colors hover:border-navy/30 hover:text-navy"
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function SunIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.8A8.5 8.5 0 1111.2 3 6.5 6.5 0 0021 12.8z" />
    </svg>
  );
}
