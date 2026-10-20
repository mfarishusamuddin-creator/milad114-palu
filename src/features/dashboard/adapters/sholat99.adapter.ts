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
// §33 — Dokumentasi adapter sholat 99 hari.
//
// Tool                : Tracker Sholat 99 Hari — program pembiasaan sholat
//                       lima waktu pengguna; satu record "days" = satu hari.
// Slug                : tracker-sholat-99-hari
// Collections         : ["days", "meta"]
// Allowed fields      : days  → prayers (HANYA 5 key: subuh, dzuhur, ashar,
//                               maghrib, isya; key lain di-strip zod)
//                       meta  → startDate
// Output types        :
//  - metric semantic "days"       key sholat-days-recorded   (hari tercatat)
//  - metric semantic "completion" key sholat-prayers-completion, unit "%"
//    (hanya bila days > 0; persen = done / (5 * days) * 100, dibulatkan)
//  - event semantic "start"       "Mulai program 99 hari" dari meta.startDate
// Filters             :
//  - Hari dihitung HANYA bila record_id adalah STRING tanggal "YYYY-MM-DD"
//    valid (parseDateOnly). record_id number TIDAK diinterpretasikan sebagai
//    epoch-ms — "20260901" sebagai epoch akan menjadi tahun 1970 (korupsi
//    diam-diam), lebih aman dilewati.
//  - Prayers DEFENSIF: bentuk value belum diketahui pasti (data live masih
//    tipis). Dianggap "done" bila boolean true ATAU number finite > 0;
//    selain itu (string, object, array, false, 0, NaN, Infinity) = not-done.
//    Tidak pernah crash, tidak pernah menebak makna bentuk lain.
//  - meta.startDate valid → event mulai; meta pertama yang valid menang
//    (program hanya punya satu tanggal mulai).
// Sensitive exclusions: tidak ada field pribadi user yang dibaca; catatan/
//                       key asing apa pun di data maupun prayers di-strip.
// Known edge cases    :
//  - Data live saat ini baru ±1 hari — adapter wajar pada data tipis:
//    1 hari terisi penuh → completion 100%.
//  - Hari dengan record_id valid tapi data rusak/hilang TETAP dihitung
//    sebagai hari (0 prayer done): record_id adalah identitas utama hari,
//    dan hari yang tercatat layak tampil meski penanda sholatnya belum rapi.
//  - Collection days kosong → tanpa metric; bila meta punya startDate valid,
//    event mulai tetap dihasilkan.
//  - days ada tapi tidak satu pun record_id valid → metric days bernilai 0,
//    tanpa metric completion (pembagian 0/0 dihindari).
// ============================================================================

const SLUG = "tracker-sholat-99-hari";
const DAYS = "days";
const META = "meta";
const PRAYERS_PER_DAY = 5;

/** Lima waktu sholat — hanya key ini yang dibaca dari prayers (allowlist). */
const PRAYER_KEYS = ["subuh", "dzuhur", "ashar", "maghrib", "isya"] as const;

// `.optional()` PENTING di Zod v4: key prayer yang belum diisi user tidak
// menggagalkan parse objek (z.unknown() polos membuat key wajib hadir) —
// prayer yang hilang cukup diperlakukan not-done.
const prayersSchema = z.object({
  subuh: z.unknown().optional(),
  dzuhur: z.unknown().optional(),
  ashar: z.unknown().optional(),
  maghrib: z.unknown().optional(),
  isya: z.unknown().optional(),
});

const daySchema = z.object({
  prayers: prayersSchema.optional().catch(undefined),
});

const metaSchema = z.object({
  startDate: z.unknown().optional(), // divalidasi parseDateOnly
});

export const sholat99Adapter: ToolAdapter = {
  slug: SLUG,
  collections: [DAYS, META],
  description:
    "Progres program 99 hari sholat lima waktu user (tool tracker-sholat-99-hari): hari tercatat, kelengkapan prayers, tanggal mulai.",

  toItems(recordsByCollection) {
    const items: DashboardItem[] = [];
    const dayRecords = safeRecords(recordsByCollection, DAYS);

    let daysRecorded = 0;
    let prayersDone = 0;

    for (const record of dayRecords) {
      if (!record || typeof record !== "object") continue;

      // record_id ADALAH tanggal kalender hari itu ("YYYY-MM-DD").
      if (typeof record.record_id !== "string") continue;
      if (!parseDateOnly(record.record_id)) continue;
      daysRecorded += 1;

      // data rusak/hilang → hari tetap dihitung, prayers dianggap belum ada
      // (defensif terhadap data tipis/baru — lihat doc block).
      const parsed = daySchema.safeParse(record.data);
      const prayers = parsed.success ? parsed.data.prayers : undefined;
      if (!prayers) continue;

      for (const key of PRAYER_KEYS) {
        if (isPrayerDone(prayers[key])) prayersDone += 1;
      }
    }

    if (dayRecords.length > 0) {
      items.push(
        buildMetric(
          DAYS,
          "days",
          "sholat-days-recorded",
          "Hari tercatat program 99 hari",
          daysRecorded,
        ),
      );

      if (daysRecorded > 0) {
        items.push(
          buildMetric(
            DAYS,
            "completion",
            "sholat-prayers-completion",
            "Kelengkapan sholat lima waktu",
            Math.round((prayersDone / (PRAYERS_PER_DAY * daysRecorded)) * 100),
            "%",
          ),
        );
      }
    }

    for (const record of safeRecords(recordsByCollection, META)) {
      if (!record || typeof record !== "object") continue;

      const parsed = metaSchema.safeParse(record.data);
      if (!parsed.success) continue;

      const start = parseDateOnly(parsed.data.startDate);
      if (!start) continue;

      items.push({
        id: makeItemId(
          SLUG,
          META,
          typeof record.record_id === "string" ? record.record_id : "",
          "start",
        ),
        source: SLUG,
        collection: META,
        title: "Mulai program 99 hari",
        type: "event",
        start,
      });
      break; // meta pertama yang valid menang — satu program, satu awal.
    }

    return items;
  },
};

/**
 * Parse defensif satu penanda prayer: true atau number finite > 0 = done.
 * Bentuk lain dianggap not-done TANPA melempar — bentuk value di data live
 * belum pasti, dan dashboard tidak boleh mati karena data aneh.
 */
function isPrayerDone(value: unknown): boolean {
  if (value === true) return true;
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

/** Metrik agregat: recordId "all" karena nilainya gabungan banyak record. */
function buildMetric(
  collection: string,
  semantic: string,
  key: string,
  title: string,
  value: number,
  unit?: string,
): DashboardMetric {
  return {
    id: makeItemId(SLUG, collection, "all", semantic),
    source: SLUG,
    collection,
    title,
    type: "metric",
    key,
    value,
    ...(unit !== undefined ? { unit } : {}),
  };
}

/** Ambil collection secara defensif: kunci hilang / bukan array → []. */
function safeRecords(
  recordsByCollection: Record<string, DataRecord[]> | null | undefined,
  collection: string,
): DataRecord[] {
  const records = recordsByCollection?.[collection];
  return Array.isArray(records) ? records : [];
}
