// ============================================================================
// Visibilitas navigasi atas admin (AdminHeader + AdminTopNav).
//
// Toggle "Tampilkan/Sembunyikan Navigasi" ada di Tools Hub (/admin/tools),
// tetapi bar navigasi dirender oleh AdminShell (induk semua halaman admin).
// Karena state-nya perlu dibaca oleh dua komponen berbeda sekaligus, disimpan
// di localStorage dan di-sinkronkan lewat custom event — sehingga keputusan
// user konsisten antar reload/halaman admin.
// ============================================================================

/** Custom event yang membawa nilai visibilitas baru (detail: boolean). */
export const ADMIN_NAV_EVENT = "husam:admin-nav-visibility";

const KEY = "husam.admin.navVisible";

/** Baca preferensi awal; default tampil. */
export function getAdminNavVisible(): boolean {
  try {
    return localStorage.getItem(KEY) !== "hidden";
  } catch {
    return true;
  }
}

/** Simpan preferensi + beri tahu AdminShell lewat custom event. */
export function setAdminNavVisible(visible: boolean) {
  try {
    localStorage.setItem(KEY, visible ? "visible" : "hidden");
  } catch {
    // localStorage mungkin nonaktif (private mode) — tetap lanjut via event.
  }
  window.dispatchEvent(new CustomEvent<boolean>(ADMIN_NAV_EVENT, { detail: visible }));
}
