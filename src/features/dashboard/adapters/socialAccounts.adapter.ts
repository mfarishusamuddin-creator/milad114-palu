import { z } from "zod";
import { parseDateOnly } from "../lib/dateOnly";
import { lookupCountryCoords } from "../lib/countryCoords";
import { makeItemId, type DashboardItem } from "../types";
import type { ToolAdapter } from "./registry";

/**
 * §33 ADAPTER DOC — socialAccountsAdapter
 *
 * Tool: Social Account Manager Pro
 * Slug: husam-social-account-manager-pro
 * Collections: accounts
 * Allowed fields: name, handle, username, platform, status, priority,
 *  auditDate, country, countryCode
 * Output types: deadline (audit), geo (lokasi akun)
 * Filters:
 *  - Deadline hanya dibuat bila auditDate ter-parse parseDateOnly (ISO
 *    date/datetime atau epoch-ms); format lain/tanggal mustahil → skip.
 *  - Geo hanya dibuat bila lookupCountryCoords(countryCode||country) ≠ null;
 *    negara tak dikenal → skip (tanpa koordinat tebakan).
 *  - status/priority diteruskan hanya bila berupa string non-kosong.
 * Sensitive exclusions: subs, labels, tags, niche, monetization, dan key asing
 *  apa pun (mis. password, aiKey, token platform) TIDAK dibaca — schema Zod
 *  men-strip semua field di luar allowlist sebelum logika adapter berjalan.
 * Known edge cases:
 *  - ASUMSI terdokumentasi: auditDate dianggap JADWAL AUDIT BERIKUTNYA
 *    (deadline ke depan). Bila kelak terbukti di data nyata bahwa tool
 *    mengisinya dengan tanggal audit lampau (riwayat), item harus dipindah
 *    dari Deadline ke Event — jangan diubah diam-diam tanpa verifikasi.
 *  - Field nama mungkin tidak ada di skema tool: label memakai fallback
 *    berjenjang name → handle → username → platform → "Akun sosial" agar
 *    judul tetap manusiawi tanpa mengarang identitas.
 *  - countryCode (ISO alpha-2) lebih diprioritaskan daripada country karena
 *    lebih presisi; keduanya tidak ada / tak dikenal → tidak ada item geo,
 *    tapi deadline (bila ada) tetap dihasilkan.
 *  - Satu record dapat menghasilkan dua item (deadline + geo) dengan segmen
 *    semantic berbeda ("audit" vs "geo") agar ID tidak saling menimpa.
 *  - Field bertipe salah (mis. status number) dianggap tidak ada, bukan
 *    menggagalkan seluruh record.
 */

const SLUG = "husam-social-account-manager-pro";

// Field toleran: nilai hilang/bertipe salah → undefined (fail-soft per field).
// Catatan: .optional() sebelum .catch(undefined) agar def catch type-safe di Zod v4.
const optionalString = z.string().trim().min(1).optional().catch(undefined);

// z.object default = STRIP: key asing di luar allowlist dibuang di sini.
const accountSchema = z.object({
  name: optionalString,
  handle: optionalString,
  username: optionalString,
  platform: optionalString,
  status: optionalString,
  priority: optionalString,
  // auditDate dibiarkan bebas (string ISO / epoch-ms / apa pun) —
  // parseDateOnly yang memutuskan valid/tidak, schema tidak menebak format.
  auditDate: z.unknown().optional(),
  country: optionalString,
  countryCode: optionalString,
});

export const socialAccountsAdapter: ToolAdapter = {
  slug: SLUG,
  collections: ["accounts"],
  description:
    "Jadwal audit akun sosial (deadline) + lokasi akun (geo) dari Social Account Manager Pro.",

  toItems(recordsByCollection) {
    const items: DashboardItem[] = [];

    for (const record of recordsByCollection["accounts"] ?? []) {
      const parsed = accountSchema.safeParse(record.data);
      if (!parsed.success) continue; // bentuk tak terduga → skip, bukan lempar
      const row = parsed.data;

      // Fallback berjenjang: field nama tidak dijamin ada di skema tool.
      const label =
        row.name ?? row.handle ?? row.username ?? row.platform ?? "Akun sosial";

      // (a) auditDate valid → deadline audit (asumsi: jadwal berikutnya).
      const date = parseDateOnly(row.auditDate);
      if (date) {
        items.push({
          id: makeItemId(SLUG, "accounts", record.record_id, "audit"),
          source: SLUG,
          collection: "accounts",
          title: `Audit sosial: ${label}`,
          type: "deadline",
          date,
          ...(row.status !== undefined ? { status: row.status } : {}),
          ...(row.priority !== undefined ? { priority: row.priority } : {}),
        });
      }

      // (b) negara dikenal → pin geo; kode ISO lebih diprioritaskan.
      const countryKey = row.countryCode ?? row.country;
      if (countryKey !== undefined) {
        const coords = lookupCountryCoords(countryKey);
        if (coords) {
          items.push({
            id: makeItemId(SLUG, "accounts", record.record_id, "geo"),
            source: SLUG,
            collection: "accounts",
            title: `${label} — lokasi`,
            type: "geo",
            lat: coords.lat,
            lng: coords.lng,
            label,
            country: countryKey,
          });
        }
      }
    }

    return items;
  },
};
