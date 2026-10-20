import { z } from "zod";
import type { DataRecord } from "@/features/core/types";
import { parseDateOnly } from "../lib/dateOnly";
import { makeItemId, type DashboardItem } from "../types";
import type { ToolAdapter } from "./registry";

// ============================================================================
// §33 — Dokumentasi adapter jaringan.
//
// Tool                : Jaringan — manajer kontak milik user/pengguna.
// Slug                : husam-jaringan
// Collections         : ["contacts"]
// Allowed fields      : id, name, birthDate. HANYA field ini yang dibaca;
//                       z.object (default strip) membuang key lain SEBELUM
//                       diproses, dan adapter hanya menyalin name + birthDate
//                       ke item — dua lapis agar data di luar allowlist
//                       mustahil ikut keluar.
// Output types        : reminder — "Ulang tahun: <name>", date = birthDate,
//                       recurring "yearly" (ulang tahun selalu kembali tiap
//                       tahun; tahun pada birthDate hanyalah tahun lahir,
//                       bukan tahun kejadian).
// Filters             : birthDate wajib ter-parse parseDateOnly menjadi
//                       DayPoint valid; hilang/invalid → record di-SKIP
//                       (fail-closed, tidak menebak tanggal).
// Sensitive exclusions: email/phone/location/org/notes/events/categories/
//                       links/tags SENGAJA tidak dibaca — PII berlebih untuk
//                       kebutuhan dashboard, dan sub-skema events[] belum
//                       pernah terisi data nyata sehingga bentuknya TIDAK
//                       boleh ditebak. Dashboard memang superadmin-only,
//                       namun prinsip PII-minimal tetap diterapkan. `name`
//                       sengaja ditampilkan (kebutuhan operasional): user
//                       perlu tahu ulang tahun SIAPA yang diingatkan.
// Known edge cases    :
//  - name bukan string / kosong / whitespace → judul fallback "Kontak";
//    field lain yang valid tetap diproses (satu field rusak tidak mematikan
//    seluruh record).
//  - Identitas item memakai record_id; bila kosong, fallback ke data.id
//    (field allowlist). Keduanya kosong → skip, karena tanpa identitas
//    stabil ID item antar-kontak bisa bertabrakan.
//  - birthDate number diperlakukan parseDateOnly sebagai epoch-ms UTC.
// ============================================================================

const SLUG = "husam-jaringan";
const COLLECTION = "contacts";

/**
 * Allowlist field kontak. `.catch(undefined)` per field membuat validasi
 * toleran per-field: maksudnya agar data user yang sebagian rusak tetap
 * menghasilkan pengingat dari bagian yang valid, bukan hilang semuanya.
 */
const contactSchema = z.object({
  id: z.union([z.string(), z.number()]).optional().catch(undefined),
  name: z.string().optional().catch(undefined),
  // `.optional()` PENTING di Zod v4: key yang hilang tidak menggagalkan parse
  // objek (z.unknown() polos membuat key wajib hadir). Nilai tetap divalidasi
  // parseDateOnly (string ISO / epoch-ms).
  birthDate: z.unknown().optional(),
});

export const jaringanAdapter: ToolAdapter = {
  slug: SLUG,
  collections: [COLLECTION],
  description:
    "Pengingat ulang tahun tahunan dari kontak user (tool husam-jaringan, field birthDate).",

  toItems(recordsByCollection) {
    const items: DashboardItem[] = [];

    for (const record of safeRecords(recordsByCollection, COLLECTION)) {
      if (!record || typeof record !== "object") continue;

      const parsed = contactSchema.safeParse(record.data);
      if (!parsed.success) continue; // data bukan objek → skip, tidak menebak

      // birthDate adalah inti item ini: tanpa tanggal valid tidak ada yang
      // bisa diingatkan → skip, bukan menebak.
      const birthDate = parseDateOnly(parsed.data.birthDate);
      if (!birthDate) continue;

      // ID deterministik butuh identitas record yang stabil (lihat doc block).
      const recordId =
        typeof record.record_id === "string" && record.record_id !== ""
          ? record.record_id
          : parsed.data.id !== undefined
            ? String(parsed.data.id)
            : "";
      if (recordId === "") continue;

      // Nama ditampilkan sengaja (operasional superadmin); fallback netral
      // menjaga judul tetap bermakna tanpa membocorkan data lain.
      const name =
        typeof parsed.data.name === "string" && parsed.data.name.trim() !== ""
          ? parsed.data.name.trim()
          : "Kontak";

      items.push({
        id: makeItemId(SLUG, COLLECTION, recordId, "birthday"),
        source: SLUG,
        collection: COLLECTION,
        title: `Ulang tahun: ${name}`,
        type: "reminder",
        date: birthDate,
        recurring: "yearly",
      });
    }

    return items;
  },
};

/** Ambil collection secara defensif: kunci hilang / bukan array → []. */
function safeRecords(
  recordsByCollection: Record<string, DataRecord[]> | null | undefined,
  collection: string,
): DataRecord[] {
  const records = recordsByCollection?.[collection];
  return Array.isArray(records) ? records : [];
}
