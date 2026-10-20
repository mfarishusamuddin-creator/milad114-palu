// ============================================================================
// Preferensi Tools Hub: Favorit + riwayat "terakhir dibuka".
//
// Dipakai oleh navigasi Tools (/admin/tools) untuk:
//  - menyematkan & menampilkan daftar tool favorit (tombol bintang),
//  - mengurutkan dashboard Overview berdasarkan tool yang terakhir dibuka.
//
// Disimpan di localStorage (per-browser) — konsisten dengan pola
// `admin-nav-visibility.ts`, sehingga TIDAK perlu skema settings/DB baru.
//
// Komponen React membaca data lewat `useToolsPrefs()` (useSyncExternalStore);
// store ini memberi tahu semua konsumen saat favorit/riwayat berubah, jadi
// tombol bintang di panel sisi maupun di kartu Overview selalu sinkron.
// ============================================================================

export interface ToolsPrefs {
  /** Slug tool favorit; yang paling baru difavoritkan berada di depan. */
  favorites: string[];
  /** Peta slug -> timestamp (ms) kapan tool terakhir dibuka. */
  recent: Record<string, number>;
}

const FAVORITES_KEY = "husam.tools.favorites";
const RECENT_KEY = "husam.tools.recent";

/** Batas jumlah entri riwayat agar localStorage tidak tumbuh tanpa batas. */
const RECENT_LIMIT = 300;

/**
 * Snapshot immutable yang stabil antar-perubahan.
 * Syarat `useSyncExternalStore`: `getSnapshot` harus mengembalikan referensi
 * yang sama selama data belum berubah — referensi diganti hanya di `commit()`.
 */
let snapshot: ToolsPrefs = loadFromStorage();

/** Kumpulan callback komponen yang berlangganan perubahan preferensi. */
const listeners = new Set<() => void>();

/** Baca preferensi dari localStorage dengan validasi bentuk (tahan data rusak). */
function loadFromStorage(): ToolsPrefs {
  const favorites: string[] = [];
  const recent: Record<string, number> = {};

  try {
    const favRaw = localStorage.getItem(FAVORITES_KEY);
    if (favRaw) {
      const parsed: unknown = JSON.parse(favRaw);
      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          if (typeof item === "string") favorites.push(item);
        }
      }
    }
  } catch {
    // localStorage nonaktif (private mode) atau JSON rusak — pakai daftar kosong.
  }

  try {
    const recentRaw = localStorage.getItem(RECENT_KEY);
    if (recentRaw) {
      const parsed: unknown = JSON.parse(recentRaw);
      if (parsed && typeof parsed === "object") {
        for (const [slug, ts] of Object.entries(parsed)) {
          if (typeof ts === "number" && Number.isFinite(ts)) recent[slug] = ts;
        }
      }
    }
  } catch {
    // Sama seperti di atas — abaikan dan lanjut dengan riwayat kosong.
  }

  return { favorites, recent };
}

/**
 * Ganti snapshot, tulis ke localStorage, lalu beri tahu semua subscriber.
 * In-memory SELALU diperbarui walau penulisan localStorage gagal, agar UI tetap
 * responsif di mode private.
 */
function commit(next: ToolsPrefs) {
  snapshot = next;
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next.favorites));
    localStorage.setItem(RECENT_KEY, JSON.stringify(next.recent));
  } catch {
    // Abaikan kegagalan persistensi — state in-memory sudah diperbarui.
  }
  for (const listener of listeners) listener();
}

/** Berlangganan perubahan preferensi (dipakai `useSyncExternalStore`). */
export function subscribeToolsPrefs(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Snapshot preferensi saat ini (referensi stabil antar-perubahan). */
export function getToolsPrefs(): ToolsPrefs {
  return snapshot;
}

/** Tambah/hapus sebuah slug dari daftar favorit. */
export function toggleFavorite(slug: string) {
  if (!slug) return;
  const favorites = snapshot.favorites.includes(slug)
    ? snapshot.favorites.filter((s) => s !== slug)
    : [slug, ...snapshot.favorites];
  commit({ ...snapshot, favorites });
}

/** Catat bahwa sebuah tool baru saja dibuka (untuk urutan "terakhir dibuka"). */
export function recordToolOpen(slug: string) {
  if (!slug) return;
  const recent: Record<string, number> = { ...snapshot.recent, [slug]: Date.now() };

  // Pangkas entri tertua bila melebihi batas agar storage tetap ramping.
  const entries = Object.entries(recent);
  if (entries.length > RECENT_LIMIT) {
    entries.sort((a, b) => a[1] - b[1]);
    for (const [oldSlug] of entries.slice(0, entries.length - RECENT_LIMIT)) {
      delete recent[oldSlug];
    }
  }

  commit({ ...snapshot, recent });
}
