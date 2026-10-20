import { describe, expect, it } from "vitest";
import type { DataRecord } from "@/features/core/types";
import { dashboardItemSchema } from "../types";
import { productCatalogAdapter } from "./productCatalog.adapter";

function rec(recordId: string, data: Record<string, unknown>): DataRecord {
  return { id: `uuid-${recordId}`, record_id: recordId, data };
}

const SLUG = "husam-product-catalog-pro";

describe("productCatalogAdapter", () => {
  it("metadata kontrak: slug, collections, description", () => {
    expect(productCatalogAdapter.slug).toBe(SLUG);
    expect(productCatalogAdapter.collections).toEqual(["products"]);
    expect(productCatalogAdapter.description.length).toBeGreaterThan(0);
  });

  it("(1) valid: publishDate → event 'publish', negara → geo ber-weight price", () => {
    const items = productCatalogAdapter.toItems({
      products: [
        rec("p-1", {
          name: "Kursi Ergonomis",
          publishDate: "2026-10-01",
          country: "Indonesia",
          status: "draft",
          price: 1_250_000,
          currency: "IDR",
          supplierSecret: "internal", // 32 key lain tidak dibaca
        }),
      ],
    });

    for (const item of items) {
      expect(dashboardItemSchema.safeParse(item).success).toBe(true);
    }

    const event = items.find((i) => i.id === `${SLUG}:products:p-1:publish`);
    expect(event).toMatchObject({
      type: "event",
      title: "Rilis produk: Kursi Ergonomis",
      start: { year: 2026, month: 10, day: 1 },
    });

    const geo = items.find((i) => i.id === `${SLUG}:products:p-1:geo`);
    expect(geo).toMatchObject({
      type: "geo",
      lat: -2.5,
      lng: 118,
      label: "Kursi Ergonomis",
      country: "Indonesia",
      weight: 1_250_000,
    });
    expect(items).toHaveLength(2);
  });

  it("(2) field hilang: tanpa name → 'Produk'; tanpa price → tanpa weight", () => {
    const items = productCatalogAdapter.toItems({
      products: [
        rec("p-anon", { publishDate: "2026-12-25", countryCode: "my" }),
        rec("p-nopub", { name: "Tanpa Tanggal", country: "SG" }), // hanya geo
      ],
    });

    expect(items.find((i) => i.id === `${SLUG}:products:p-anon:publish`)).toMatchObject({
      title: "Rilis produk: Produk",
    });
    const geoAnon = items.find((i) => i.id === `${SLUG}:products:p-anon:geo`);
    expect(geoAnon).toMatchObject({ label: "Produk", country: "my" });
    expect(geoAnon && "weight" in geoAnon).toBe(false);

    expect(items.find((i) => i.id === `${SLUG}:products:p-nopub:publish`)).toBeUndefined();
    expect(items.find((i) => i.id === `${SLUG}:products:p-nopub:geo`)).toMatchObject({
      label: "Tanpa Tanggal",
      country: "SG",
    });
    expect(items).toHaveLength(3);
  });

  it("(3) malformed: price string → weight dibuang; negara tak dikenal → geo skip", () => {
    const items = productCatalogAdapter.toItems({
      products: [
        rec("p-strprice", { name: "Harga String", publishDate: "2026-10-01", country: "ID", price: "1250000" }),
        rec("p-badcountry", { name: "Negara Antah", publishDate: "2026-10-01", country: "Wakanda" }),
      ],
    });
    const geo = items.find((i) => i.id === `${SLUG}:products:p-strprice:geo`);
    expect(geo).toBeDefined();
    expect(geo && "weight" in geo).toBe(false);
    // Event tetap ada meski price rusak.
    expect(items.find((i) => i.id === `${SLUG}:products:p-strprice:publish`)).toBeDefined();
    // "Wakanda" tak dikenal lookup → tanpa geo, event tetap ada.
    expect(items.find((i) => i.id === `${SLUG}:products:p-badcountry:geo`)).toBeUndefined();
    expect(items.find((i) => i.id === `${SLUG}:products:p-badcountry:publish`)).toBeDefined();
  });

  it("(4) kosong: input {} maupun products kosong → []", () => {
    expect(productCatalogAdapter.toItems({})).toEqual([]);
    expect(productCatalogAdapter.toItems({ products: [] })).toEqual([]);
  });

  it("(5) tanggal invalid: format salah/kalender mustahil → event skip, geo tetap", () => {
    const items = productCatalogAdapter.toItems({
      products: [
        rec("p-fmt", { name: "Format Salah", publishDate: "01-10-2026", country: "ID" }),
        rec("p-cal", { name: "30 Februari", publishDate: "2026-02-30", country: "ID" }),
        rec("p-obj", { name: "Tanggal Objek", publishDate: { y: 2026 }, country: "ID" }),
      ],
    });
    expect(items.find((i) => i.type === "event")).toBeUndefined();
    expect(items.filter((i) => i.type === "geo")).toHaveLength(3);
  });

  it("(6) KEAMANAN: key asing sensitif tidak bocor ke output", () => {
    const items = productCatalogAdapter.toItems({
      products: [
        rec("p-sec", {
          name: "Produk Rahasia",
          publishDate: "2026-10-01",
          country: "ID",
          password: "P4SS",
          aiKey: "SECRET",
          costOfGoods: 999,
        }),
      ],
    });
    expect(items.length).toBeGreaterThan(0);
    const dumped = JSON.stringify(items);
    expect(dumped).not.toContain("P4SS");
    expect(dumped).not.toContain("SECRET");
    expect(dumped).not.toContain("password");
    expect(dumped).not.toContain("aiKey");
    expect(dumped).not.toContain("costOfGoods");
  });

  it("(7) unexpected schema: data null/array/string/tipe acak → aman, tidak melempar", () => {
    const items = productCatalogAdapter.toItems({
      products: [
        rec("bad-null", null as unknown as Record<string, unknown>),
        rec("bad-arr", [1, 2] as unknown as Record<string, unknown>),
        rec("bad-str", "bukan objek" as unknown as Record<string, unknown>),
        rec("bad-types", { name: 42, publishDate: true, country: ["ID"], price: "x" }),
      ],
      unknownCollection: [rec("x", { a: 1 })],
    });
    expect(items).toEqual([]);
  });
});
