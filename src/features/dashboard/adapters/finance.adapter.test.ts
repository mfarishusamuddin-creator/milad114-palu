import { describe, expect, it } from "vitest";
import type { DataRecord } from "@/features/core/types";
import { dashboardItemSchema } from "../types";
import { financeAdapter } from "./finance.adapter";

function rec(recordId: string, data: Record<string, unknown>): DataRecord {
  return { id: `uuid-${recordId}`, record_id: recordId, data };
}

describe("financeAdapter", () => {
  it("metadata kontrak: slug, collections, description", () => {
    expect(financeAdapter.slug).toBe("finance-tracker-pro-1");
    expect(financeAdapter.collections).toEqual(["accounts", "sources", "assets"]);
    expect(financeAdapter.description.length).toBeGreaterThan(0);
  });

  it("(1) valid: accounts/sources → geo, assets → metric agregat ber-unit", () => {
    const items = financeAdapter.toItems({
      accounts: [
        rec("acc-1", {
          name: "BCA Utama",
          institution: "BCA",
          country: "Indonesia",
          lat: -6.2,
          lng: 106.8,
          openingBalance: 1_500_000,
        }),
      ],
      sources: [rec("src-1", { country: "SG" })],
      assets: [
        rec("a1", { type: "gold", currency: "IDR", quantity: 2, unitValue: 500_000 }),
        rec("a2", { currency: "IDR", quantity: 1.5, unitValue: 200_000 }),
      ],
    });

    // Semua output wajib lolos schema kanonik (gerbang repository).
    for (const item of items) {
      expect(dashboardItemSchema.safeParse(item).success).toBe(true);
    }

    // Koordinat eksplisit valid MENANG atas lookup negara.
    const geoAcc = items.find(
      (i) => i.id === "finance-tracker-pro-1:accounts:acc-1:geo",
    );
    expect(geoAcc).toMatchObject({
      type: "geo",
      lat: -6.2,
      lng: 106.8,
      label: "BCA Utama",
      country: "Indonesia",
      weight: 1_500_000,
      title: "BCA Utama — lokasi",
    });

    // Tanpa koordinat → fallback lookup negara; tanpa name → "Sumber dana".
    const geoSrc = items.find(
      (i) => i.id === "finance-tracker-pro-1:sources:src-1:geo",
    );
    expect(geoSrc).toMatchObject({
      type: "geo",
      lat: 1.35,
      lng: 103.82,
      label: "Sumber dana",
      country: "SG",
    });

    // Sigma: 2×500000 + 1.5×200000 = 1.300.000, satu currency → unit "IDR".
    const metric = items.find((i) => i.type === "metric");
    expect(metric).toMatchObject({
      id: "finance-tracker-pro-1:assets:aggregate:value",
      type: "metric",
      key: "finance-asset-value",
      value: 1_300_000,
      unit: "IDR",
    });
    expect(items).toHaveLength(3);
  });

  it("(2) field hilang: tanpa lokasi → skip; label fallback name→institution→'Akun'", () => {
    const items = financeAdapter.toItems({
      accounts: [
        rec("acc-noloc", { name: "Tanpa Lokasi", openingBalance: 10 }), // skip
        rec("acc-inst", { institution: "Mandiri", country: "ID" }), // label institution
        rec("acc-anon", { country: "ID" }), // label "Akun"
      ],
      sources: [],
      assets: [rec("a-noqty", { currency: "IDR", unitValue: 500_000 })], // tanpa quantity → di luar sigma
    });

    expect(items.find((i) => i.collection === "accounts" && i.title.startsWith("Tanpa Lokasi"))).toBeUndefined();
    expect(items.find((i) => i.id === "finance-tracker-pro-1:accounts:acc-inst:geo")).toMatchObject({
      label: "Mandiri",
    });
    expect(items.find((i) => i.id === "finance-tracker-pro-1:accounts:acc-anon:geo")).toMatchObject({
      label: "Akun",
    });
    // Tidak ada pasangan (quantity, unitValue) valid → TIDAK ada metric.
    expect(items.find((i) => i.type === "metric")).toBeUndefined();
  });

  it("(3) malformed: lat/lng luar range fallback negara; amount/quantity string dibuang", () => {
    const items = financeAdapter.toItems({
      accounts: [
        // lat luar range → fallback lookup "Indonesia".
        rec("acc-badlat", { name: "Rentang Rusak", country: "Indonesia", lat: 95, lng: 106.8 }),
        // lng luar range + tanpa negara → skip.
        rec("acc-badlng", { name: "Tanpa Negara", lat: -6.2, lng: -200 }),
        // openingBalance string → weight dibuang, pin tetap ada.
        rec("acc-strbal", { name: "Saldo String", country: "ID", openingBalance: "1000" }),
      ],
      assets: [
        rec("a-strqty", { currency: "USD", quantity: "3", unitValue: 10 }), // quantity string → skip sigma
        rec("a-ok", { currency: "USD", quantity: 2, unitValue: 10 }), // 20
      ],
    });

    expect(items.find((i) => i.id === "finance-tracker-pro-1:accounts:acc-badlat:geo")).toMatchObject({
      lat: -2.5,
      lng: 118,
    });
    expect(items.find((i) => i.id === "finance-tracker-pro-1:accounts:acc-badlng:geo")).toBeUndefined();
    const strBal = items.find((i) => i.id === "finance-tracker-pro-1:accounts:acc-strbal:geo");
    expect(strBal).toBeDefined();
    expect(strBal && "weight" in strBal).toBe(false);

    const metric = items.find((i) => i.type === "metric");
    expect(metric).toMatchObject({ value: 20, unit: "USD" });
  });

  it("(3b) multi-currency: sigma tetap, unit dibuang", () => {
    const items = financeAdapter.toItems({
      assets: [
        rec("a1", { currency: "IDR", quantity: 1, unitValue: 1000 }),
        rec("a2", { currency: "USD", quantity: 1, unitValue: 5 }),
      ],
    });
    const metric = items.find((i) => i.type === "metric");
    expect(metric).toMatchObject({ value: 1005 });
    expect(metric && "unit" in metric).toBe(false);
  });

  it("(4) kosong: input {} maupun collection kosong → []", () => {
    expect(financeAdapter.toItems({})).toEqual([]);
    expect(financeAdapter.toItems({ accounts: [], sources: [], assets: [] })).toEqual([]);
  });

  it("(5) tanggal invalid: field tanggal asing/rusak diabaikan, item valid tetap ada", () => {
    const items = financeAdapter.toItems({
      accounts: [
        rec("acc-date", { name: "Ada Tanggal Aneh", country: "ID", closingDate: "32-13-2026" }),
      ],
    });
    // finance tidak membaca tanggal: field asing di-strip, metric tanpa asOf.
    expect(items).toHaveLength(1);
    expect(JSON.stringify(items)).not.toContain("closingDate");
    expect(items.find((i) => i.type === "metric")).toBeUndefined();
  });

  it("(6) KEAMANAN: key asing sensitif tidak bocor ke output", () => {
    const items = financeAdapter.toItems({
      accounts: [
        rec("acc-sec", {
          name: "Rekening Utama",
          country: "ID",
          password: "P4SS",
          aiKey: "SECRET",
          cardNumber: "4111-1111",
        }),
      ],
      sources: [rec("src-sec", { country: "MY", password: "P4SS", aiKey: "SECRET" })],
      assets: [rec("a-sec", { quantity: 1, unitValue: 2, password: "P4SS", aiKey: "SECRET" })],
    });
    expect(items.length).toBeGreaterThan(0);
    const dumped = JSON.stringify(items);
    expect(dumped).not.toContain("P4SS");
    expect(dumped).not.toContain("SECRET");
    expect(dumped).not.toContain("password");
    expect(dumped).not.toContain("aiKey");
    expect(dumped).not.toContain("cardNumber");
    expect(dumped).not.toContain("4111");
  });

  it("(7) unexpected schema: data null/array/string/tipe acak → aman, tidak melempar", () => {
    const items = financeAdapter.toItems({
      accounts: [
        rec("bad-null", null as unknown as Record<string, unknown>),
        rec("bad-arr", [1, 2, 3] as unknown as Record<string, unknown>),
        rec("bad-str", "bukan objek" as unknown as Record<string, unknown>),
        rec("bad-types", { name: 42, country: true, lat: "x", lng: {}, openingBalance: [] }),
      ],
      sources: [rec("bad-nested", { name: { deep: "x" }, country: ["ID"] })],
      assets: [rec("bad-asset", { quantity: { v: 1 }, unitValue: NaN, currency: 7 })],
      unknownCollection: [rec("x", { a: 1 })],
    });
    // bad-types: semua field invalid → tanpa lokasi → skip; sisanya ditolak.
    expect(items).toEqual([]);
  });
});
