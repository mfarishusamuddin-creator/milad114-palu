import type { ColorMode, ThemeSettings } from "@/features/settings/types";

export const DEFAULT_THEME: ThemeSettings = {
  public: { mode: "light", accent: "#0e9f8c", radius: 18 },
  admin: { mode: "dark", accent: "#aef8eb", radius: 18 },
  font: "Inter",
};

/** Konversi hex (#rgb / #rrggbb) ke rgba() dengan alpha. */
export function hexToRgba(hex: string, alpha: number): string {
  let h = (hex || "").replace("#", "").trim();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h || "000000", 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Bangun object CSS variables dari sebuah scope tema.
 * Semua token Tailwind (bg-background, text-foreground, dll) merujuk ke var ini,
 * sehingga mengganti nilainya di :root akan mengubah seluruh UI sekaligus.
 */
export function buildPalette(mode: ColorMode, accent: string, radius: number): Record<string, string> {
  const r = Number.isFinite(radius) && radius > 0 ? radius : 18;
  const common = { "--radius": `${r}px` };

  if (mode === "light") {
    return {
      ...common,
      "--background": "#f4f9f7",
      "--foreground": "#0b1a19",
      "--panel": "rgba(255,255,255,0.72)",
      "--line": "rgba(11,26,25,0.12)",
      "--card": "#ffffff",
      "--card-foreground": "#0b1a19",
      "--border": "rgba(11,26,25,0.14)",
      "--input": "rgba(255,255,255,0.95)",
      "--ring": hexToRgba(accent, 0.5),
      "--primary": accent,
      "--primary-foreground": "#ffffff",
      "--muted": "#e7efed",
      "--muted-foreground": "#5b726e",
      "--kicker": accent,
      "--destructive": "#d64545",
      "--destructive-foreground": "#ffffff",
    };
  }

  // dark — mempertahankan palet asli, aksen & radius dikustom.
  return {
    ...common,
    "--background": "#06090a",
    "--foreground": "#eef8f5",
    "--panel": "rgba(10,18,19,0.72)",
    "--line": "rgba(196,255,247,0.19)",
    "--card": "rgba(17,30,31,0.79)",
    "--card-foreground": "#eef8f5",
    "--border": "rgba(208,255,248,0.15)",
    "--input": "rgba(2,7,8,0.48)",
    "--ring": hexToRgba(accent, 0.66),
    "--primary": "rgba(204,255,246,0.93)",
    "--primary-foreground": "#061010",
    "--muted": "#12191a",
    "--muted-foreground": "#91aaa5",
    "--kicker": accent,
    "--destructive": "#ff9e9a",
    "--destructive-foreground": "#06090a",
  };
}

/** Terapkan palet + font ke root (documentElement). */
export function applyPalette(palette: Record<string, string>, font: string) {
  const root = document.documentElement;
  for (const [k, v] of Object.entries(palette)) {
    root.style.setProperty(k, v);
  }
  if (font && document.body) {
    document.body.style.fontFamily = `"${font}", ui-sans-serif, system-ui, -apple-system, sans-serif`;
  }
}
