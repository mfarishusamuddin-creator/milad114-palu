import { z } from "zod";
import type { DataRecord } from "@/features/core/types";
import { lookupCountryCoords } from "../lib/countryCoords";
import { makeItemId, type DashboardItem } from "../types";
import type { ToolAdapter } from "./registry";

/**
 * §33 ADAPTER DOC — financeAdapter
 *
 * Tool: Finance Tracker Pro
 * Slug: finance-tracker-pro-1
 * Collections: accounts, sources, assets
 * Allowed fields:
 *  - accounts: name, institution, country, lat, lng, openingBalance
 *  - sources:  name, country, lat, lng
 *  - assets:   type, currency, quantity, unitValue
 * Output types: geo (accounts & sources), metric (agregat assets)
 * Filters:
 *  - Geo: koordinat eksplisit harus lengkap & valid (lat ∈ [-90,90],
 *    lng ∈ [-180,180], finite); jika tidak, fallback lookup negara; jika
 *    keduanya gagal → record dilewati (pin tebakan lebih berbahaya dari pin
 *    yang hilang).
 *  - Metric: hanya pasangan (quantity, unitValue) yang keduanya number valid
 *    yang dijumlahkan; aset tanpa pasangan valid dilewati dari sigma.
 * Sensitive exclusions: field di luar allowlist (mis. password, aiKey, nomor
 *  rekening/kartu) tidak pernah dibaca — schema Zod men-strip key asing, dan
 *  output hanya berisi field kontrak DashboardItem.
 * Known edge cases:
 *  - transactions SENGAJA ditunda ke v1 berikutnya: semantik `type` dan arah
 *    amount (masuk/keluar) belum terverifikasi terhadap data nyata; menebak
 *    arah cashflow = insight yang salah dan menyesatkan pengguna.
 *  - currencies tidak dibaca: data referensi (kurs/tabel mata uang), bukan
 *    insight yang layak tampil di dashboard.
 *  - CAVEAT multi-currency: bila aset memakai lebih dari satu currency, sigma
 *    tetap dijumlahkan lintas mata uang (angka campur) dan `unit` DIBUANG
 *    agar tidak mengklaim satuan yang salah. Nilai campuran hanya indikator
 *    kasar; konversi kurs nyata adalah pekerjaan versi berikutnya.
 *  - `type` pada assets dibaca (allowlist) tapi v1 tidak memengaruhi output —
 *    disiapkan bila kelak agregasi perlu dipecah per jenis aset.
 *  - Uniformitas currency case-sensitive ("IDR" vs "idr" dianggap campur) —
 *    sengaja konservatif, karena normalisasi tebakan bisa salah menyatukan
 *    satuan yang sebenarnya berbeda.
 *  - Metric agregat memakai segmen recordId sintetis "aggregate" (bukan ID
 *    satu record) karena nilainya gabungan seluruh collection — tetap
 *    deterministik antar-recompute.
 *  - Field bertipe salah (mis. openingBalance string) dianggap tidak ada,
 *    bukan menggagalkan seluruh record.
 */

const SLUG = "finance-tracker-pro-1";

// Field toleran: nilai hilang/bertipe salah → undefined (fail-soft per field),
// sehingga satu field rusak tidak membuang seluruh record yang masih berguna.
// Catatan: .optional() sebelum .catch(undefined) agar def catch type-safe di Zod v4.
const optionalString = z.string().trim().min(1).optional().catch(undefined);
const optionalNumber = z.number().finite().optional().catch(undefined);

// z.object default = STRIP: key asing (sensitif/tidak dikenal) dibuang di sini,
// sebelum sempat tersentuh logika adapter.
const accountSchema = z.object({
  name: optionalString,
  institution: optionalString,
  country: optionalString,
  lat: optionalNumber,
  lng: optionalNumber,
  openingBalance: optionalNumber,
});

const sourceSchema = z.object({
  name: optionalString,
  country: optionalString,
  lat: optionalNumber,
  lng: optionalNumber,
});

const assetSchema = z.object({
  type: optionalString,
  currency: optionalString,
  quantity: optionalNumber,
  unitValue: optionalNumber,
});

type AccountRow = z.infer<typeof accountSchema>;
type SourceRow = z.infer<typeof sourceSchema>;

/**
 * Resolusi koordinat: koordinat eksplisit (lengkap + dalam rentang) menang;
 * jika tidak, centroid negara via lookup; keduanya gagal → null (skip).
 */
function resolveCoords(
  lat: number | undefined,
  lng: number | undefined,
  country: string | undefined,
): { lat: number; lng: number } | null {
  if (
    lat !== undefined &&
    lng !== undefined &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  ) {
    return { lat, lng };
  }
  if (country !== undefined) {
    const lookup = lookupCountryCoords(country);
    if (lookup) return lookup;
  }
  return null;
}

function geoFromRow(
  record: DataRecord,
  collection: "accounts" | "sources",
  row: AccountRow | SourceRow,
  label: string,
  weight?: number,
): DashboardItem | null {
  const coords = resolveCoords(row.lat, row.lng, row.country);
  if (!coords) return null; // tanpa lokasi terpercaya → tidak layak jadi pin peta
  return {
    id: makeItemId(SLUG, collection, record.record_id, "geo"),
    source: SLUG,
    collection,
    title: `${label} — lokasi`,
    type: "geo",
    lat: coords.lat,
    lng: coords.lng,
    label,
    ...(row.country !== undefined ? { country: row.country } : {}),
    ...(weight !== undefined ? { weight } : {}),
  };
}

export const financeAdapter: ToolAdapter = {
  slug: SLUG,
  collections: ["accounts", "sources", "assets"],
  description:
    "Lokasi akun & sumber dana (geo) + agregat nilai aset (metric) dari Finance Tracker Pro.",

  toItems(recordsByCollection) {
    const items: DashboardItem[] = [];

    // --- accounts → pin geo per akun ---------------------------------------
    for (const record of recordsByCollection["accounts"] ?? []) {
      const parsed = accountSchema.safeParse(record.data);
      if (!parsed.success) continue; // bentuk tak terduga → skip, bukan lempar
      const row = parsed.data;
      const label = row.name ?? row.institution ?? "Akun";
      const item = geoFromRow(record, "accounts", row, label, row.openingBalance);
      if (item) items.push(item);
    }

    // --- sources → pin geo per sumber dana ----------------------------------
    for (const record of recordsByCollection["sources"] ?? []) {
      const parsed = sourceSchema.safeParse(record.data);
      if (!parsed.success) continue;
      const row = parsed.data;
      const item = geoFromRow(record, "sources", row, row.name ?? "Sumber dana");
      if (item) items.push(item);
    }

    // --- assets → SATU metric agregat nilai total ---------------------------
    let total = 0;
    let validPairs = 0;
    const currencies = new Set<string>();
    for (const record of recordsByCollection["assets"] ?? []) {
      const parsed = assetSchema.safeParse(record.data);
      if (!parsed.success) continue;
      const { currency, quantity, unitValue } = parsed.data;
      // Hanya pasangan number valid yang ikut sigma; aset tanpa itu dilewati.
      if (quantity === undefined || unitValue === undefined) continue;
      total += quantity * unitValue;
      validPairs += 1;
      if (currency !== undefined) currencies.add(currency);
    }
    if (validPairs > 0) {
      items.push({
        id: makeItemId(SLUG, "assets", "aggregate", "value"),
        source: SLUG,
        collection: "assets",
        title: "Nilai total aset",
        type: "metric",
        key: "finance-asset-value",
        value: total,
        // Unit hanya bila SATU currency seragam; campur → tanpa unit (caveat
        // multi-currency di doc block).
        ...(currencies.size === 1 ? { unit: [...currencies][0] } : {}),
      });
    }

    return items;
  },
};
