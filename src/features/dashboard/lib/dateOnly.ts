import type { DayPoint } from "../types";

// ============================================================================
// parseDateOnly — konversi nilai bebas dari record tool menjadi DayPoint.
//
// KEPUTUSAN zona waktu (dokumentasikan, jangan diubah diam-diam):
//  - STRING ("YYYY-MM-DD" atau ISO datetime): bagian tanggal diambil dari
//    string APA ADANYA — "2026-09-10T23:30:00Z" → 10 September, TANPA
//    konversi ke zona lokal. Alasan: pengguna/tool menuliskan tanggal
//    kalender; mengonversi zona dapat menggeser hari ±1 dan merusak semantik
//    (§38 — hindari korupsi timezone).
//  - EPOCH-MS (number): satu-satunya kasus yang WAJIB memilih zona karena
//    number adalah titik waktu absolut, bukan tanggal. Dipakai UTC agar hasil
//    deterministik — perangkat di zona berbeda melihat tanggal yang sama.
//  - Selain itu ditolak → null (fail-closed): pemanggil (adapter) memutuskan
//    skip + diagnostic, bukan menebak.
// ============================================================================

// Prefix tanggal ISO: cocok untuk "YYYY-MM-DD" polos maupun ISO datetime
// dengan zona apa pun ("...T23:30:00Z", "...T23:30:00+07:00") — bagian
// tanggal selalu 10 karakter pertama, sisanya (waktu/zona) diabaikan.
const ISO_DATE_PREFIX = /^(\d{4})-(\d{2})-(\d{2})/;

/** Pure function: tanpa I/O, tanpa clock, tanpa zona lokal perangkat. */
export function parseDateOnly(input: unknown): DayPoint | null {
  if (typeof input === "string") {
    const match = ISO_DATE_PREFIX.exec(input.trim());
    if (!match) return null;
    return buildDayPoint(Number(match[1]), Number(match[2]), Number(match[3]));
  }

  if (typeof input === "number" && Number.isFinite(input)) {
    const date = new Date(input);
    return buildDayPoint(
      date.getUTCFullYear(),
      date.getUTCMonth() + 1,
      date.getUTCDate(),
    );
  }

  // null/undefined/boolean/object/array/NaN/Infinity — ditolak eksplisit.
  return null;
}

/**
 * Susun DayPoint + validasi kalender nyata. Date.UTC menormalkan overflow
 * (bulan 13 → Januari tahun berikutnya, 30 Februari → 2 Maret), jadi
 * round-trip komponen dipakai untuk menolak tanggal mustahil seperti
 * "2026-13-01" atau "2026-02-30" — bukan sekadar cek rentang.
 */
function buildDayPoint(year: number, month: number, day: number): DayPoint | null {
  const probe = new Date(Date.UTC(year, month - 1, day));
  if (
    probe.getUTCFullYear() !== year ||
    probe.getUTCMonth() !== month - 1 ||
    probe.getUTCDate() !== day
  ) {
    return null;
  }
  return { year, month, day };
}
