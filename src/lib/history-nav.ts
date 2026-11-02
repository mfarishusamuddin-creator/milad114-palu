import { scrollToAnchor } from "@/lib/anchor";

export type HistoryTrackId = "muhammadiyah" | "dahlan";
export type HistoryTableId = "leadership" | "aum";
export type HistorySelection = { track?: HistoryTrackId; table?: HistoryTableId };

/**
 * Event pemilihan jalur/tabel sejarah. Dipakai agar pemanggil (navbar,
 * hotspot hero, tautan dalam) bisa memilih tab sebelum section di-scroll.
 */
export const HISTORY_SELECT_EVENT = "site:history-select";

/**
 * Buka section Sejarah dengan pilihan jalur/tabel tertentu.
 *
 * Event dikirim LEBIH DULU, baru buka/scroll: isi section sudah ter-mount
 * di dalam CollapsibleSection (hanya panelnya yang tertutup), jadi
 * HistoryTimeline bisa langsung mengganti tab aktif, lalu panel dibuka.
 * Urutan sebaliknya akan membuat tab berganti setelah scroll, sehingga
 * tinggi panel berubah di tengah animasi.
 *
 * Untuk pilihan tabel, section dibuka tanpa scroll (`scroll: false`) dan
 * HistoryTables yang menggulir ke `#tabel-sejarah` setelah panel terbuka.
 * Ini mencegah dua animasi scroll bersaing (section vs tabel).
 */
export function openHistory(selection: HistorySelection): void {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent<HistorySelection>(HISTORY_SELECT_EVENT, {
      detail: selection,
    })
  );

  if (selection.table) {
    window.dispatchEvent(
      new CustomEvent<{ targetId: string; scroll: boolean }>(
        "site:anchor-navigation",
        { detail: { targetId: "sejarah", scroll: false } }
      )
    );

    const fullHash = "#sejarah";
    if (window.location.hash !== fullHash) {
      window.history.pushState(null, "", fullHash);
    } else {
      window.history.replaceState(null, "", fullHash);
    }
    return;
  }

  scrollToAnchor("#sejarah");
}
