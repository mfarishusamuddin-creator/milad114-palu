import type { DashboardGeoPoint } from "@/features/dashboard/types";

// ============================================================================
// Logika PURE untuk WorldMapWidget — dikelompokkan di luar komponen agar bisa
// diuji tanpa DOM (pola yang sama dengan features/dashboard/lib/*).
//
// Tiga tanggung jawab:
//  1. GROUPING: titik dengan koordinat yang dibulatkan 1 desimal identik
//     dianggap satu lokasi (kota/bangunan sama) dan digabung jadi satu marker
//     — tanpa ini pin saling menumpuk dan tidak bisa diklik.
//  2. RINGKASAN SUMBER: daftar source nyata (dari data, bukan hardcode) untuk
//     chip filter + legenda, dengan warna stabil per slug.
//  3. ESCAPE XML: label berasal dari tool pengguna dan masuk ke string SVG
//     (dangerouslySetInnerHTML) — karakter markup harus dinetralkan.
// ============================================================================

/** Palet warna marker per source (urutan slug); bila habis → warna fallback. */
export const SOURCE_PALETTE: readonly string[] = [
  "#aef8eb",
  "#9fd8ff",
  "#c9b6ff",
  "#ffd9a0",
];

/** Warna netral untuk source di luar palet — harmonis dengan marker HOME. */
export const FALLBACK_COLOR = "#ffffff";

/**
 * Nama pendek id-ID untuk slug tool yang sudah dikenal. HANYA label tampilan —
 * daftar source sendiri selalu diturunkan dari data nyata (summarizeGeoSources);
 * slug yang tidak ada di sini dilabeli otomatis oleh humanizeSlug.
 */
const SOURCE_LABEL: Record<string, string> = {
  "finance-tracker-pro-1": "Finance",
  "husam-social-account-manager-pro": "Sosial",
  "husam-product-catalog-pro": "Produk",
  "project-hub-v3": "Proyek",
};

/**
 * Label manusiawi dari slug tak dikenal: buang token branding/version
 * ("husam", "pro", "v3", "1") lalu kapitalisasi awal — legenda tetap terbaca
 * untuk tool baru tanpa perlu mengubah kode.
 */
export function humanizeSlug(slug: string): string {
  const cleaned = slug
    .toLowerCase()
    .split("-")
    .filter((token) => token !== "" && token !== "husam" && token !== "pro" && !/^v?\d+$/.test(token))
    .join(" ");
  if (cleaned === "") return slug;
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

/** Label tampilan sebuah source: nama dikenal > humanisasi slug. */
export function labelForSource(slug: string): string {
  return SOURCE_LABEL[slug] ?? humanizeSlug(slug);
}

/**
 * Escape teks yang disisipkan ke markup SVG (& HARUS pertama agar hasil
 * escape tidak di-escape ulang). Mencegah label tool pengguna memecah
 * struktur <title>/markup saat dirender via dangerouslySetInnerHTML.
 */
export function escapeXmlText(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Satu marker hasil grouping: bisa memuat banyak titik geo dari banyak source. */
export interface GeoGroup {
  /** Kunci grup = koordinat dibulatkan 1 desimal ("lat,lng") — stabil & unik. */
  key: string;
  /** Posisi marker = koordinat hasil pembulatan (deterministik). */
  lat: number;
  lng: number;
  /** Jumlah titik geo yang diwakili marker ini (untuk "×n" di tooltip). */
  count: number;
  /** SEMUA label anggota, apa adanya — tooltip menampilkan semuanya. */
  labels: string[];
  /** Source unik anggota, urut alfabet — warna grup memakai source pertama. */
  sources: string[];
  /** Jumlah weight anggota bila setidaknya satu titik punya weight. */
  weight?: number;
}

/**
 * Gabungkan titik geo per lokasi: koordinat dibulatkan 1 desimal → titik yang
 * "praktis sama" (selisih < ~11 km) menjadi satu marker. Weight diagregasi
 * (sigma) bila ada. Hasil diurutkan menurut key agar string SVG deterministik
 * antar-render — perubahan data terlihat sebagai update, bukan acakan.
 */
export function groupGeoPoints(points: readonly DashboardGeoPoint[]): GeoGroup[] {
  interface Accumulator {
    lat: number;
    lng: number;
    labels: string[];
    sources: Set<string>;
    weight?: number;
  }
  const byKey = new Map<string, Accumulator>();

  for (const point of points) {
    const lat = Math.round(point.lat * 10) / 10;
    const lng = Math.round(point.lng * 10) / 10;
    const key = `${lat.toFixed(1)},${lng.toFixed(1)}`;

    let acc = byKey.get(key);
    if (acc === undefined) {
      acc = { lat, lng, labels: [], sources: new Set() };
      byKey.set(key, acc);
    }
    acc.labels.push(point.label);
    acc.sources.add(point.source);
    if (point.weight !== undefined) acc.weight = (acc.weight ?? 0) + point.weight;
  }

  return [...byKey.entries()]
    .map(([key, acc]) => ({
      key,
      lat: acc.lat,
      lng: acc.lng,
      count: acc.labels.length,
      labels: acc.labels,
      sources: [...acc.sources].sort((a, b) => a.localeCompare(b)),
      ...(acc.weight !== undefined ? { weight: acc.weight } : {}),
    }))
    .sort((a, b) => a.key.localeCompare(b.key));
}

/** Teks tooltip <title>: semua label anggota + "×n" bila grup gabungan. */
export function groupTitle(group: GeoGroup): string {
  const labels = group.labels.join(" · ");
  return group.count > 1 ? `${labels} ×${group.count}` : labels;
}

/** Marker gabungan sedikit lebih besar — isyarat visual "mewakili n titik". */
export function radiusForCount(count: number): number {
  return 4.4 + Math.min(Math.max(count - 1, 0), 4) * 0.5;
}

/** Ringkasan satu source nyata untuk chip filter + legenda. */
export interface GeoSourceSummary {
  slug: string;
  label: string;
  color: string;
  /** Jumlah titik geo dari source ini (dipakai sebagai angka di chip). */
  count: number;
}

/**
 * Daftar source NYATA penyumbang titik geo (bukan hardcode): diurutkan menurut
 * slug agar warna dari palet stabil antar-render — source yang sama selalu
 * mendapat warna yang sama selama komposisi source tidak berubah.
 */
export function summarizeGeoSources(points: readonly DashboardGeoPoint[]): GeoSourceSummary[] {
  const counts = new Map<string, number>();
  for (const point of points) {
    counts.set(point.source, (counts.get(point.source) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([slug, count], index) => ({
      slug,
      label: labelForSource(slug),
      color: SOURCE_PALETTE[index] ?? FALLBACK_COLOR,
      count,
    }));
}
