import { z } from "zod";

import { lookupCountryCoords } from "../lib/countryCoords";
import { parseDateOnly } from "../lib/dateOnly";
import { makeItemId, type DashboardItem } from "../types";
import type { ToolAdapter } from "./registry";

// ============================================================================
// ADAPTER Project Hub → DashboardItem                                        §33
// ============================================================================
// Tool                : Project Hub (manajemen proyek milik pengguna).
// Slug                : project-hub-v3
// Collections         : ["projects"] — allowlist fail-closed; key lain di
//                       recordsByCollection (mis. "prefs"/"cats") TIDAK dibaca.
// Allowed fields      : id, name, status, priority, progress, deadline,
//                       country. z.object biasa → key asing di-STRIP, tidak
//                       pernah dibaca apalagi diteruskan ke item.
// Output types        :
//   - deadline : jatuh tempo proyek (semantic "deadline") — dibuat HANYA bila
//                deadline lolos parseDateOnly; membawa status/priority/
//                progress bila tersedia dan valid.
//   - geo      : pin negara proyek (semantic "geo") — dibuat HANYA bila
//                country non-kosong DAN dikenal lookupCountryCoords.
// Filters             :
//   - deadline hilang/invalid ("2026-13-45", "abc", tipe salah) → tanpa item
//     deadline; item geo (bila memenuhi syarat) tetap dihasilkan;
//   - country kosong/tak dikenal → tanpa item geo; deadline tetap jalan —
//     koordinat tebakan lebih berbahaya daripada pin yang hilang;
//   - record gagal schema (tipe field allowlist salah, data null) → SKIP utuh,
//     tidak pernah menghasilkan item partial;
//   - collection kosong/hilang → [].
// Sensitive exclusions:
//   - Collection "prefs" SENGAJA tidak dibaca: menyimpan kredensial pengguna
//     (aiKey, aiEndpoint, gcalClientId) — tidak relevan dashboard dan wajib
//     tidak pernah mencapai UI.
//   - Collection "cats" tidak dibaca: kategori tidak menghasilkan item.
//   - Field subtasks/notes/people/links/catId/created tidak dibaca: detail
//     privat proyek yang tidak dibutuhkan dashboard.
// Known edge cases:
//   - deadline menerima string ISO-prefix atau epoch-ms (kontrak parseDateOnly);
//   - null pada field dianggap "tidak diisi pengguna" (nullish) — bukan tipe
//     salah; field-nya diabaikan, record tetap diproses;
//   - name kosong/hilang → title fallback "(Tanpa judul)";
//   - id masuk allowlist tapi TIDAK dipakai ke item (tipe apa pun ditoleransi);
//     provenance memakai record_id dari envelope DataRecord agar stabil;
//   - satu record dapat menghasilkan 0, 1, atau 2 item (deadline + geo).
// ============================================================================

const SLUG = "project-hub-v3";
const COLLECTION = "projects";

/**
 * Schema per record — HANYA field allowlist. Key asing (aiKey, password, dst.)
 * di-strip Zod sebelum kode adapter menyentuhnya, sehingga mustahil bocor.
 * `id` ditoleransi bertipe apa pun (z.unknown) karena tidak pernah masuk item;
 * field yang MENGALIR ke item diberi tipe ketat → tipe salah = record di-skip.
 */
const projectRecordSchema = z.object({
  // z.unknown() di Zod v4 bersifat "nonoptional" — .optional() agar key yang
  // tidak hadir tidak menggagalkan parse.
  id: z.unknown().optional(),
  name: z.string().nullish(),
  status: z.string().nullish(),
  priority: z.string().nullish(),
  progress: z.number().finite().nullish(),
  // String (ISO-prefix) atau epoch-ms; validitas kalender diputuskan
  // parseDateOnly, bukan schema.
  deadline: z.union([z.string(), z.number()]).nullish(),
  country: z.string().nullish(),
});

/** String terisi (bukan null/undefined/kosong-setelah-trim) → nilai apa adanya. */
function nonEmpty(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value : null;
}

export const projectHubAdapter: ToolAdapter = {
  slug: SLUG,
  collections: [COLLECTION],
  description:
    "Deadline dan pin negara proyek pengguna dari Project Hub (collection projects). " +
    "Collection prefs/cats sengaja tidak dibaca karena prefs memuat kredensial pengguna.",

  // PURE: tanpa I/O, tanpa clock, tanpa UI — aman dihitung ulang kapan pun.
  toItems(recordsByCollection) {
    const records = recordsByCollection[COLLECTION];
    if (!Array.isArray(records)) return [];

    const items: DashboardItem[] = [];
    for (const record of records) {
      if (!record || typeof record !== "object") continue;
      // record_id envelope = identitas provenance; tanpa itu id item tidak stabil.
      if (typeof record.record_id !== "string" || record.record_id === "") continue;

      const result = projectRecordSchema.safeParse(record.data);
      if (!result.success) continue; // tipe salah/malformed → skip utuh.
      const parsed = result.data;

      const title = nonEmpty(parsed.name) ?? "(Tanpa judul)";

      // (a) Deadline — hanya bila tanggal benar-benar bisa diparse.
      const date = parseDateOnly(parsed.deadline);
      if (date) {
        const status = nonEmpty(parsed.status);
        const priority = nonEmpty(parsed.priority);
        items.push({
          id: makeItemId(SLUG, COLLECTION, record.record_id, "deadline"),
          source: SLUG,
          collection: COLLECTION,
          title,
          type: "deadline",
          date,
          ...(status ? { status } : {}),
          ...(priority ? { priority } : {}),
          ...(typeof parsed.progress === "number" ? { progress: parsed.progress } : {}),
        });
      }

      // (b) Geo — country harus dikenal tabel statis; unknown → skip geo saja.
      const country = nonEmpty(parsed.country);
      if (country) {
        const coords = lookupCountryCoords(country);
        if (coords) {
          items.push({
            id: makeItemId(SLUG, COLLECTION, record.record_id, "geo"),
            source: SLUG,
            collection: COLLECTION,
            title,
            type: "geo",
            lat: coords.lat,
            lng: coords.lng,
            label: title,
            country,
          });
        }
      }
    }
    return items;
  },
};
