import { z } from "zod";

import { parseDateOnly } from "../lib/dateOnly";
import { makeItemId, type DashboardItem } from "../types";
import type { ToolAdapter } from "./registry";

// ============================================================================
// ADAPTER Dosen Ledger → DashboardItem                                       §33
// ============================================================================
// Tool                : Dosen Ledger (pengerjaan tesis & buku milik pengguna).
// Slug                : dosen-ledger
// Collections         : ["tesis", "buku"] — allowlist fail-closed; key lain di
//                       recordsByCollection TIDAK dibaca.
// Allowed fields      : id, title, status, jenis, stageIndex, targetDate,
//                       milestones (element: title, date, done). z.object
//                       biasa → key asing di-STRIP sebelum kode menyentuhnya.
// Output types        :
//   - deadline : targetDate valid via parseDateOnly, semantic "deadline",
//                title "jenis: title" (prefix jenis hanya bila terisi);
//                collection item = "tesis"/"buku" apa adanya.
//   - event    : tiap element milestones ber-tanggal valid, semantic
//                "milestone-<index>" — index = posisi di ARRAY ASLI agar id
//                stabil walau sebagian element di-skip; done = (m.done === true).
// Filters             :
//   - targetDate hilang/invalid ("2026-13-45", "abc") → tanpa item deadline;
//     milestones tetap diproses;
//   - milestones bukan array/hilang → hanya deadline (tidak crash);
//   - element milestone cacat (bukan objek, tipe field salah, date invalid) →
//     HANYA element itu di-skip, deadline & element lain tetap jalan;
//   - record gagal schema (tipe field allowlist salah, data null) → SKIP utuh;
//   - collection kosong/hilang → [].
// Sensitive exclusions: notes/peopleIds/isbn/publisher/createdAt TIDAK dibaca —
//   catatan privat pengguna dan metadata penerbit tidak relevan dashboard;
//   sebagian record lama menyimpan epoch-ms di createdAt — tidak dibaca,
//   diabaikan sepenuhnya.
// Known edge cases:
//   - data live saat ini tipis (1 tesis hidup + 1 buku) — adapter tetap harus
//     benar untuk N record dan tidak boleh berasumsi jumlah;
//   - targetDate/date milestone menerima string ISO-prefix atau epoch-ms;
//   - null dianggap "tidak diisi pengguna" (nullish), bukan tipe salah;
//   - title kosong → fallback "(Tanpa judul)"; judul milestone kosong →
//     "Milestone";
//   - id/stageIndex masuk allowlist tapi tidak dipakai ke item (tipe apa pun
//     ditoleransi); provenance memakai record_id envelope agar stabil.
// ============================================================================

const SLUG = "dosen-ledger";
const COLLECTIONS = ["tesis", "buku"] as const;

/**
 * Schema per record — HANYA field allowlist. `milestones` sengaja z.unknown()
 * di gate utama: "bukan array" harus menghasilkan hanya-deadline (bukan skip
 * record), sehingga bentuknya diperiksa runtime + schema element terpisah.
 */
const dosenRecordSchema = z.object({
  // z.unknown() di Zod v4 bersifat "nonoptional" — .optional() agar key yang
  // tidak hadir tidak menggagalkan parse.
  id: z.unknown().optional(),
  title: z.string().nullish(),
  status: z.string().nullish(),
  jenis: z.string().nullish(),
  stageIndex: z.unknown().optional(),
  // String (ISO-prefix) atau epoch-ms; validitas kalender diputuskan parseDateOnly.
  targetDate: z.union([z.string(), z.number()]).nullish(),
  milestones: z.unknown().optional(),
});

/** Schema satu element milestone — gagal = element itu saja yang di-skip. */
const milestoneSchema = z.object({
  title: z.string().nullish(),
  date: z.union([z.string(), z.number()]).nullish(),
  done: z.boolean().nullish(),
});

/** String terisi (bukan null/undefined/kosong-setelah-trim) → nilai apa adanya. */
function nonEmpty(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value : null;
}

export const dosenLedgerAdapter: ToolAdapter = {
  slug: SLUG,
  collections: COLLECTIONS,
  description:
    "Deadline target dan event milestone pengerjaan tesis/buku pengguna dari Dosen Ledger " +
    "(collection tesis, buku). Field privat (notes/peopleIds/isbn/publisher/createdAt) tidak dibaca.",

  // PURE: tanpa I/O, tanpa clock, tanpa UI — aman dihitung ulang kapan pun.
  toItems(recordsByCollection) {
    const items: DashboardItem[] = [];

    for (const collection of COLLECTIONS) {
      const records = recordsByCollection[collection];
      if (!Array.isArray(records)) continue;

      for (const record of records) {
        if (!record || typeof record !== "object") continue;
        // record_id envelope = identitas provenance; tanpa itu id item tidak stabil.
        if (typeof record.record_id !== "string" || record.record_id === "") continue;

        const result = dosenRecordSchema.safeParse(record.data);
        if (!result.success) continue; // tipe salah/malformed → skip utuh.
        const parsed = result.data;

        const baseTitle = nonEmpty(parsed.title) ?? "(Tanpa judul)";
        const jenis = nonEmpty(parsed.jenis);

        // (a) Deadline target — hanya bila tanggal benar-benar bisa diparse.
        const date = parseDateOnly(parsed.targetDate);
        if (date) {
          const status = nonEmpty(parsed.status);
          items.push({
            id: makeItemId(SLUG, collection, record.record_id, "deadline"),
            source: SLUG,
            collection,
            title: `${jenis ? `${jenis}: ` : ""}${baseTitle}`,
            type: "deadline",
            date,
            ...(status ? { status } : {}),
          });
        }

        // (b) Milestones → event. Bukan array/hilang → blok ini dilewati.
        const milestones: unknown = parsed.milestones;
        if (Array.isArray(milestones)) {
          (milestones as unknown[]).forEach((raw: unknown, index: number) => {
            const element = milestoneSchema.safeParse(raw);
            if (!element.success) return; // element cacat → skip element saja.
            const start = parseDateOnly(element.data.date);
            if (!start) return; // tanggal invalid → skip element saja.
            items.push({
              id: makeItemId(SLUG, collection, record.record_id, `milestone-${index}`),
              source: SLUG,
              collection,
              title: `${baseTitle} — ${nonEmpty(element.data.title) ?? "Milestone"}`,
              type: "event",
              start,
              done: element.data.done === true,
            });
          });
        }
      }
    }

    return items;
  },
};
