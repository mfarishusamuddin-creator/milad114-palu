import type { DashboardReminder, DayPoint } from "../types";

// ============================================================================
// today.ts — helper PURE untuk semantik "hari" di lapisan UI dashboard.
//
// Semua fungsi menerima parameter eksplisit (termasuk `today`) sehingga bisa
// diuji tanpa mock jam; satu-satunya yang membaca clock adalah localDayPoint()
// (sengaja — itu tugasnya). Aritmetika memakai Date native TANPA library
// tanggal; DayPoint mempertahankan semantik kalender (§38 — lihat types.ts),
// komponen lokal (bukan UTC) karena "hari ini" adalah konsep perangkat pengguna.
// ============================================================================

/** DayPoint dari Date lokal — cara widget mengetahui "hari ini" bagi pengguna. */
export function localDayPoint(): DayPoint {
  return dayPointFromDate(new Date());
}

/** Ambil komponen tanggal kalender LOKAL dari Date (jam/zona diabaikan). */
export function dayPointFromDate(date: Date): DayPoint {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
}

/** Kebalikan dayPointFromDate: Date tengah malam lokal — untuk aritmetika/format. */
export function toDate(point: DayPoint): Date {
  return new Date(point.year, point.month - 1, point.day);
}

/** Bandingkan dua tanggal: -1 bila a lebih awal, 0 sama hari, 1 bila a lebih akhir. */
export function compareDay(a: DayPoint, b: DayPoint): -1 | 0 | 1 {
  if (a.year !== b.year) return a.year < b.year ? -1 : 1;
  if (a.month !== b.month) return a.month < b.month ? -1 : 1;
  if (a.day !== b.day) return a.day < b.day ? -1 : 1;
  return 0;
}

/** True hanya bila ketiga komponen (year, month, day) sama. */
export function isSameDay(a: DayPoint, b: DayPoint): boolean {
  return compareDay(a, b) === 0;
}

/**
 * Penambahan kalender: DayPoint ± n hari (n negatif = mundur).
 * Date native menormalkan overflow bulan/tahun secara benar
 * (30 Sep + 1 → 1 Okt; 31 Des + 1 → 1 Jan tahun berikutnya),
 * jadi tidak perlu aritmetika panjang-bulan manual.
 */
export function addDays(point: DayPoint, days: number): DayPoint {
  return dayPointFromDate(new Date(point.year, point.month - 1, point.day + days));
}

/**
 * Apakah reminder jatuh pada hari `today`?
 *
 * Parameter `today` adalah "hari yang sedang diperiksa" — tanggal berjalan
 * untuk section Hari Ini, atau tanggal sel kalender untuk grid bulan;
 * fungsinya generik dan pure sehingga kalender memakai logika yang sama.
 *
 * KEBIJAKAN RECURRING v1 (TERDOKUMENTASI — jangan diubah diam-diam):
 * semantik recurring dari tool asal TIPIS (hanya enum, tanpa field anchor /
 * interval / tanggal selesai), jadi ini interpretasi sederhana yang dipilih
 * agar mudah diprediksi pengguna:
 *  - tanpa recurring : tanggal persis sama (year+month+day).
 *  - "yearly"  : month+day cocok, tahun diabaikan (perayaan tahunan).
 *  - "monthly" : day cocok, bulan diabaikan. Konsekuensi yang DITERIMA:
 *                anchor tanggal 29/30/31 tidak pernah muncul di bulan yang
 *                lebih pendek — tanpa clamping ke akhir bulan (v1 sederhana).
 *  - "weekly"  : weekday dari tanggal anchor asli cocok dengan weekday hari
 *                yang diperiksa (mis. anchor hari Senin → muncul setiap Senin).
 *  - "daily"   : selalu true (muncul setiap hari).
 */
export function matchesToday(reminder: DashboardReminder, today: DayPoint): boolean {
  const anchor = reminder.date;
  switch (reminder.recurring) {
    case undefined:
      return isSameDay(anchor, today);
    case "yearly":
      return anchor.month === today.month && anchor.day === today.day;
    case "monthly":
      return anchor.day === today.day;
    case "weekly":
      return toDate(anchor).getDay() === toDate(today).getDay();
    case "daily":
      return true;
  }
}

/**
 * Format pendek id-ID untuk baris UI, mis. "Sen, 10 Sep".
 * toLocaleDateString native — tanpa library tanggal.
 */
export function formatDayShort(point: DayPoint): string {
  return toDate(point).toLocaleDateString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}
