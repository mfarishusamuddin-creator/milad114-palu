import { z } from "zod";
import type { DataRecord } from "@/features/core/types";
import { parseDateOnly } from "../lib/dateOnly";
import {
  makeItemId,
  type DashboardItem,
  type DashboardMetric,
} from "../types";
import type { ToolAdapter } from "./registry";

// ============================================================================
// §33 — Dokumentasi adapter murojaah.
//
// Tool                : Murojaah Tracker — pencatat sesi murojaah user.
// Slug                : murojaah-tracker
// Collections         : ["sessions"]. curriculum/settings SENGAJA tidak
//                       dibaca: settings hanya menyimpan interval; tanpa
//                       last-review per topik, jadwal review berikutnya tidak
//                       bisa dihitung — bentuk datanya tidak boleh ditebak.
// Allowed fields      : sessions → date, duration, rating (z.object strip:
//                       key lain dibuang sebelum diproses).
// Output types        : metric AGREGAT (pure, tanpa clock):
//                       - semantic "count"         key murojaah-sessions-total
//                       - semantic "rating-avg"    key murojaah-rating-avg
//                       - semantic "duration-total" key murojaah-duration-total
// Filters             :
//  - count    : hanya sesi dengan date ter-parse parseDateOnly; date
//               invalid/hilang → tidak dihitung.
//  - rating   : number finite ≥ 1 (di bawah 1 dianggap data rusak, bukan
//               skala rating; batas atas TIDAK ditebak).
//  - duration : number finite ≥ 0 (negatif = data rusak → diabaikan).
// Sensitive exclusions: output HANYA angka agregat — identitas, catatan, dan
//                       isi sesi user tidak pernah keluar per-record, jadi
//                       tidak ada PII yang bisa bocor dari adapter ini.
// Known edge cases    :
//  - Collection kosong → []. Record ada tapi semuanya invalid → tetap
//    dihasilkan metric count bernilai 0 (jujur: "belum ada sesi tercatat").
//  - date invalid → tidak dihitung di total, NAMUN rating/duration valid
//    milik sesi itu tetap masuk agregat masing-masing — validasi per field
//    (fail-soft): satu field rusak tidak membuang kontribusi field lain.
//  - Rata-rata rating dibulatkan 2 desimal.
//  - Metrik agregat tidak terikat satu record → makeItemId memakai "all"
//    sebagai recordId agar ID tetap deterministik.
// ============================================================================

const SLUG = "murojaah-tracker";
const COLLECTION = "sessions";

const sessionSchema = z.object({
  // `.optional()` PENTING di Zod v4: key hilang tidak menggagalkan parse objek
  // (z.unknown() polos membuat key wajib hadir) — satu field hilang tidak
  // boleh membuang kontribusi field lain. Nilai divalidasi parseDateOnly.
  date: z.unknown().optional(),
  duration: z.number().optional().catch(undefined),
  rating: z.number().optional().catch(undefined),
});

export const murojaahAdapter: ToolAdapter = {
  slug: SLUG,
  collections: [COLLECTION],
  description:
    "Agregat sesi murojaah user (tool murojaah-tracker): total sesi, rata-rata rating, total durasi (menit).",

  toItems(recordsByCollection) {
    const sessions = safeRecords(recordsByCollection, COLLECTION);
    if (sessions.length === 0) return []; // collection kosong → []

    let sessionsWithValidDate = 0;
    let ratingSum = 0;
    let ratingCount = 0;
    let durationSum = 0;
    let durationCount = 0;

    for (const record of sessions) {
      if (!record || typeof record !== "object") continue;

      const parsed = sessionSchema.safeParse(record.data);
      if (!parsed.success) continue;

      if (parseDateOnly(parsed.data.date)) sessionsWithValidDate += 1;

      const rating = parsed.data.rating;
      if (typeof rating === "number" && Number.isFinite(rating) && rating >= 1) {
        ratingSum += rating;
        ratingCount += 1;
      }

      const duration = parsed.data.duration;
      if (
        typeof duration === "number" &&
        Number.isFinite(duration) &&
        duration >= 0
      ) {
        durationSum += duration;
        durationCount += 1;
      }
    }

    const items: DashboardItem[] = [
      buildMetric(
        "count",
        "murojaah-sessions-total",
        "Total sesi murojaah tercatat",
        sessionsWithValidDate,
      ),
    ];

    if (ratingCount > 0) {
      items.push(
        buildMetric(
          "rating-avg",
          "murojaah-rating-avg",
          "Rata-rata rating sesi murojaah",
          round2(ratingSum / ratingCount),
        ),
      );
    }

    if (durationCount > 0) {
      items.push(
        buildMetric(
          "duration-total",
          "murojaah-duration-total",
          "Total durasi sesi murojaah",
          durationSum,
          // ASUMSI UNIT (didokumentasikan): tool tidak menulis unit eksplisit;
          // besaran durasi sesi nyata berada di orde puluhan (5–60), paling
          // masuk akal sebagai MENIT — bukan detik (terlalu kecil untuk
          // muraja'ah) maupun jam.
          "menit",
        ),
      );
    }

    return items;
  },
};

/** Metrik agregat: recordId "all" karena nilainya gabungan banyak record. */
function buildMetric(
  semantic: string,
  key: string,
  title: string,
  value: number,
  unit?: string,
): DashboardMetric {
  return {
    id: makeItemId(SLUG, COLLECTION, "all", semantic),
    source: SLUG,
    collection: COLLECTION,
    title,
    type: "metric",
    key,
    value,
    ...(unit !== undefined ? { unit } : {}),
  };
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Ambil collection secara defensif: kunci hilang / bukan array → []. */
function safeRecords(
  recordsByCollection: Record<string, DataRecord[]> | null | undefined,
  collection: string,
): DataRecord[] {
  const records = recordsByCollection?.[collection];
  return Array.isArray(records) ? records : [];
}
