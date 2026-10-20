import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { useSettings } from "@/features/settings/hooks/useSettings";
import type { ThemeSettings } from "@/features/settings/types";
import { applyPalette, buildPalette, DEFAULT_THEME } from "../lib/theme";

function mergeTheme(partial: Partial<ThemeSettings> | undefined): ThemeSettings {
  if (!partial) return DEFAULT_THEME;
  return {
    public: { ...DEFAULT_THEME.public, ...(partial.public ?? {}) },
    admin: { ...DEFAULT_THEME.admin, ...(partial.admin ?? {}) },
    font: partial.font ?? DEFAULT_THEME.font,
  };
}

/**
 * Terapkan tema (settings) ke :root secara runtime berdasarkan route:
 *  - path dimulai /admin  -> tema admin (default: gelap, mempertahankan desain lama)
 *  - lainnya             -> tema publik (default: terang)
 * Seluruh utility Tailwind warna merujuk CSS variables, jadi perubahan langsung
 * tercermin di semua halaman (publik + dashboard admin).
 */
export function ThemeProvider() {
  const { data: settings } = useSettings();
  const location = useLocation();

  useEffect(() => {
    const theme = mergeTheme(settings?.theme as Partial<ThemeSettings> | undefined);
    const scope = location.pathname.startsWith("/admin") ? theme.admin : theme.public;
    const palette = buildPalette(scope.mode, scope.accent, scope.radius);
    applyPalette(palette, theme.font);
  }, [settings, location.pathname]);

  return null;
}
