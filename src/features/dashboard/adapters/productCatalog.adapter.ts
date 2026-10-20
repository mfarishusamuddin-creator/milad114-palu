import { z } from "zod";
import { parseDateOnly } from "../lib/dateOnly";
import { lookupCountryCoords } from "../lib/countryCoords";
import { makeItemId, type DashboardItem } from "../types";
import type { ToolAdapter } from "./registry";

/**
 * §33 ADAPTER DOC — productCatalogAdapter
 *
 * Tool: Product Catalog Pro
 * Slug: husam-product-catalog-pro
 * Collections: products
 * Allowed fields: name, publishDate, country, countryCode, status, price,
 *  currency (32 key lain pada skema tool TIDAK dibaca)
 * Output types: event (rilis produk), geo (lokasi pasar produk)
 * Filters:
 *  - Event hanya dibuat bila publishDate ter-parse parseDateOnly (ISO
 *    date/datetime atau epoch-ms); format lain/tanggal mustahil → skip.
 *  - Geo hanya dibuat bila lookupCountryCoords(countryCode||country) ≠ null;
 *    negara tak dikenal → skip (tanpa koordinat tebakan).
 *  - weight diisi hanya bila price berupa number finite valid.
 * Sensitive exclusions: field di luar allowlist (mis. password, aiKey,
 *  supplier/contact internal, catatan biaya modal) tidak pernah dibaca —
 *  schema Zod men-strip key asing sebelum logika adapter berjalan.
 * Known edge cases:
 *  - name mungkin tidak ada: judul event & label geo fallback ke "Produk"
 *    agar tetap manusiawi, bukan string kosong.
 *  - status & currency dibaca (allowlist) tapi v1 tidak memengaruhi output —
 *    filter per status (mis. hanya "published") menunggu semantik status
 *    terverifikasi terhadap data nyata; menebak filter = menyembunyikan data
 *    pengguna tanpa dasar.
 *  - country pada item geo diisi kunci yang dipakai untuk lookup
 *    (countryCode||country) — bila hanya countryCode yang ada, tampilan tetap
 *    punya negara; kasus-insensitivitas ditangani lookup, bukan adapter.
 *  - Satu record dapat menghasilkan dua item (event + geo) dengan segmen
 *    semantic berbeda ("publish" vs "geo") agar ID tidak saling menimpa.
 *  - Field bertipe salah (mis. price string "1250000") dianggap tidak ada —
 *    weight dibuang, item lain tetap dihasilkan (fail-soft per field).
 */

const SLUG = "husam-product-catalog-pro";

// Field toleran: nilai hilang/bertipe salah → undefined (fail-soft per field).
// Catatan: .optional() sebelum .catch(undefined) agar def catch type-safe di Zod v4.
const optionalString = z.string().trim().min(1).optional().catch(undefined);
const optionalNumber = z.number().finite().optional().catch(undefined);

// z.object default = STRIP: key asing di luar allowlist dibuang di sini.
const productSchema = z.object({
  name: optionalString,
  // publishDate dibiarkan bebas (string ISO / epoch-ms / apa pun) —
  // parseDateOnly yang memutuskan valid/tidak, schema tidak menebak format.
  publishDate: z.unknown().optional(),
  country: optionalString,
  countryCode: optionalString,
  status: optionalString,
  price: optionalNumber,
  currency: optionalString,
});

export const productCatalogAdapter: ToolAdapter = {
  slug: SLUG,
  collections: ["products"],
  description:
    "Jadwal rilis produk (event) + lokasi pasar produk (geo) dari Product Catalog Pro.",

  toItems(recordsByCollection) {
    const items: DashboardItem[] = [];

    for (const record of recordsByCollection["products"] ?? []) {
      const parsed = productSchema.safeParse(record.data);
      if (!parsed.success) continue; // bentuk tak terduga → skip, bukan lempar
      const row = parsed.data;
      const label = row.name ?? "Produk";

      // (a) publishDate valid → event rilis.
      const start = parseDateOnly(row.publishDate);
      if (start) {
        items.push({
          id: makeItemId(SLUG, "products", record.record_id, "publish"),
          source: SLUG,
          collection: "products",
          title: `Rilis produk: ${label}`,
          type: "event",
          start,
        });
      }

      // (b) negara dikenal → pin geo; kode ISO lebih diprioritaskan.
      const countryKey = row.countryCode ?? row.country;
      if (countryKey !== undefined) {
        const coords = lookupCountryCoords(countryKey);
        if (coords) {
          items.push({
            id: makeItemId(SLUG, "products", record.record_id, "geo"),
            source: SLUG,
            collection: "products",
            title: `${label} — lokasi`,
            type: "geo",
            lat: coords.lat,
            lng: coords.lng,
            label,
            country: countryKey,
            ...(row.price !== undefined ? { weight: row.price } : {}),
          });
        }
      }
    }

    return items;
  },
};
