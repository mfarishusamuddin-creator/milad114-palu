import type { PageMeta } from "@/features/pages/types";

/**
 * Saring daftar tool berdasarkan kata kunci pencarian.
 * Cocok pada judul maupun slug, case-insensitive; query kosong = tanpa filter.
 */
export function filterTools(tools: PageMeta[], query: string): PageMeta[] {
  const q = query.trim().toLowerCase();
  if (!q) return tools;
  return tools.filter(
    (t) => t.title.toLowerCase().includes(q) || t.slug.toLowerCase().includes(q),
  );
}

/**
 * Urutkan tool untuk dashboard Overview:
 *  1. Favorit dipin paling atas,
 *  2. lalu berdasarkan terakhir dibuka (desc),
 *  3. lalu judul A–Z sebagai penstabil agar urutan deterministik.
 */
export function orderToolsForDashboard(
  tools: PageMeta[],
  favorites: string[],
  recent: Record<string, number>,
): PageMeta[] {
  const favSet = new Set(favorites);
  return [...tools].sort((a, b) => {
    const favDiff = Number(favSet.has(b.slug)) - Number(favSet.has(a.slug));
    if (favDiff !== 0) return favDiff;

    const recentDiff = (recent[b.slug] ?? 0) - (recent[a.slug] ?? 0);
    if (recentDiff !== 0) return recentDiff;

    return a.title.localeCompare(b.title);
  });
}

/**
 * Urutkan tool berdasarkan terakhir dibuka (desc), lalu judul A–Z.
 * Dipakai halaman Favorit agar tool yang baru dipakai muncul lebih dulu.
 */
export function orderToolsByRecent(
  tools: PageMeta[],
  recent: Record<string, number>,
): PageMeta[] {
  return [...tools].sort((a, b) => {
    const recentDiff = (recent[b.slug] ?? 0) - (recent[a.slug] ?? 0);
    if (recentDiff !== 0) return recentDiff;

    return a.title.localeCompare(b.title);
  });
}
