export interface SwarmCursorSettings {
  color: string;
  accentColor: string;
  colorMode: "solid" | "rainbow";
  count: number;
  size: number;
  speed: number;
  wander: number;
  trail: number;
  scatterOnClick: boolean;
  enabled: boolean;
}

export interface SiteMetaSettings {
  title: string;
}

export interface NavLayoutSettings {
  sidePosition: "left" | "right";
}

export type ColorMode = "light" | "dark";

export interface ThemeScopeSettings {
  mode: ColorMode;
  /** Warna aksen/aksen (kicker, ring, glow). Hex, mis. "#0e9f8c". */
  accent: string;
  /** Border radius dalam px. */
  radius: number;
}

export interface ThemeSettings {
  public: ThemeScopeSettings;
  admin: ThemeScopeSettings;
  /** Nama font keluarga yang dipakai (diterapkan ke body). */
  font: string;
}

export interface SubmarineSettings {
  enabled: boolean;
  /** Sensitivitas respon submarine (%). 0..200. default 100. */
  sensitivity: number;
  /** Kelembutan gerak posisi (%). 0 = snap, 100 = sangat halus. default 60. */
  movementSmoothness: number;
  /** Kelembutan rotasi (%). 0 = cepat, 100 = sangat halus. default 70. */
  rotationSmoothness: number;
  /** Intensitas cahaya (%). 0..200. default 100. */
  lightIntensity: number;
  /** Jangkauan beam (%). 0..300. default 100. */
  lightRange: number;
  /** Lebar/spread beam (%). 0..300. default 100. */
  beamSpread: number;
  /** Kelembutan tepi beam (%). 0..100. default 60. */
  beamSoftness: number;
  /** Glow sumber cahaya (%). 0..200. default 100. */
  glow: number;
  /** Visibilitas halaman di luar beam (%). 0=gelap total, 100=terlihat penuh. default 40. */
  illumination: number;
}
