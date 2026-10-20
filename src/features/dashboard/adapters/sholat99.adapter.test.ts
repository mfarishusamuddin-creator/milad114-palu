import { describe, expect, it } from "vitest";
import type { DataRecord } from "@/features/core/types";
import { dashboardItemSchema, makeItemId } from "../types";
import { sholat99Adapter } from "./sholat99.adapter";

const SLUG = "tracker-sholat-99-hari";

function rec(recordId: string, data: Record<string, unknown> = {}): DataRecord {
  return { id: `db-${recordId}`, record_id: recordId, data };
}

describe("sholat99Adapter", () => {
  it("kontrak: slug, allowlist collections, description terisi", () => {
    expect(sholat99Adapter.slug).toBe("tracker-sholat-99-hari");
    expect(sholat99Adapter.collections).toEqual(["days", "meta"]);
    expect(sholat99Adapter.description.length).toBeGreaterThan(0);
  });

  it("(1) valid: metric days + completion (%) + event mulai program", () => {
    const items = sholat99Adapter.toItems({
      days: [
        rec("2026-09-01", {
          prayers: { subuh: true, dzuhur: true, ashar: true, maghrib: true, isya: true },
        }),
        // Campuran bentuk value (defensive): true & 1 = done; 0/false/string = not;
        // "tahajud" bukan bagian allowlist 5 waktu → diabaikan.
        rec("2026-09-02", {
          prayers: { subuh: true, dzuhur: 1, ashar: 0, maghrib: false, isya: "sudah", tahajud: true },
        }),
      ],
      meta: [rec("m-1", { startDate: "2026-09-01" })],
    });

    // done = 5 + 2 = 7 dari 5*2 = 10 → 70%.
    expect(items).toEqual([
      {
        id: makeItemId(SLUG, "days", "all", "days"),
        source: SLUG,
        collection: "days",
        title: "Hari tercatat program 99 hari",
        type: "metric",
        key: "sholat-days-recorded",
        value: 2,
      },
      {
        id: makeItemId(SLUG, "days", "all", "completion"),
        source: SLUG,
        collection: "days",
        title: "Kelengkapan sholat lima waktu",
        type: "metric",
        key: "sholat-prayers-completion",
        value: 70,
        unit: "%",
      },
      {
        id: makeItemId(SLUG, "meta", "m-1", "start"),
        source: SLUG,
        collection: "meta",
        title: "Mulai program 99 hari",
        type: "event",
        start: { year: 2026, month: 9, day: 1 },
      },
    ]);

    for (const item of items) {
      expect(dashboardItemSchema.safeParse(item).success).toBe(true);
    }
  });

  it("(1b) data tipis (live baru ±1 hari): 1 hari penuh → completion 100%", () => {
    const items = sholat99Adapter.toItems({
      days: [
        rec("2026-09-01", {
          prayers: { subuh: true, dzuhur: true, ashar: true, maghrib: true, isya: true },
        }),
      ],
      meta: [],
    });
    expect(items).toEqual([
      expect.objectContaining({ key: "sholat-days-recorded", value: 1 }),
      expect.objectContaining({ key: "sholat-prayers-completion", value: 100, unit: "%" }),
    ]);
  });

  it("(1c) deterministik: dua kali panggil → output identik", () => {
    const input = {
      days: [rec("2026-09-01", { prayers: { subuh: true } })],
      meta: [rec("m-1", { startDate: "2026-09-01" })],
    };
    expect(sholat99Adapter.toItems(input)).toEqual(sholat99Adapter.toItems(input));
  });

  it("(2) field hilang: tanpa prayers → hari dihitung 0 done; meta tanpa startDate → tanpa event", () => {
    const items = sholat99Adapter.toItems({
      days: [rec("2026-09-01", {})],
      meta: [rec("m-1", {})],
    });
    expect(items).toEqual([
      expect.objectContaining({ key: "sholat-days-recorded", value: 1 }),
      expect.objectContaining({ key: "sholat-prayers-completion", value: 0, unit: "%" }),
    ]);
  });

  it("(3) malformed: prayers string/array, data null, value object/NaN → tidak crash", () => {
    const days = [
      rec("2026-09-01", { prayers: "bukan objek" }),
      rec("2026-09-02", { prayers: ["subuh", "dzuhur"] }),
      { id: "db-3", record_id: "2026-09-03", data: null },
      rec("2026-09-04", { prayers: { subuh: { done: true }, dzuhur: [], isya: NaN } }),
    ] as unknown as DataRecord[];

    // record_id tetap tanggal valid → 4 hari dihitung; tak satu pun prayer
    // terbaca "done" dari bentuk-bentuk aneh di atas → completion 0.
    const items = sholat99Adapter.toItems({ days, meta: [] });
    expect(items).toEqual([
      expect.objectContaining({ key: "sholat-days-recorded", value: 4 }),
      expect.objectContaining({ key: "sholat-prayers-completion", value: 0 }),
    ]);
  });

  it("(4) kosong → []; days kosong + meta valid → hanya event mulai", () => {
    expect(sholat99Adapter.toItems({})).toEqual([]);
    expect(sholat99Adapter.toItems({ days: [], meta: [] })).toEqual([]);

    const items = sholat99Adapter.toItems({
      days: [],
      meta: [rec("m-1", { startDate: "2026-09-01" })],
    });
    expect(items).toEqual([
      expect.objectContaining({
        type: "event",
        title: "Mulai program 99 hari",
        start: { year: 2026, month: 9, day: 1 },
      }),
    ]);
  });

  it("(5) tanggal invalid: record_id non-tanggal/number → tidak dihitung; startDate invalid → tanpa event", () => {
    const days = [
      // record_id number TIDAK dibaca sebagai epoch-ms (akan jadi 1970-an).
      { id: "db-1", record_id: 20260901, data: { prayers: { subuh: true } } },
      rec("2026-02-30", { prayers: { subuh: true } }), // 30 Februari tidak ada
      rec("bukan-tanggal", {}),
    ] as unknown as DataRecord[];

    const items = sholat99Adapter.toItems({
      days,
      meta: [rec("m-1", { startDate: "30/02/2026" }), rec("m-2", { startDate: null })],
    });

    // days ada tapi 0 valid → metric days 0, TANPA completion (hindari 0/0).
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ key: "sholat-days-recorded", value: 0 });
  });

  it("(6) KEAMANAN: key asing di data maupun prayers di-strip — tidak bocor ke output", () => {
    const items = sholat99Adapter.toItems({
      days: [
        rec("2026-09-01", {
          prayers: { subuh: true, password: "P4SS" }, // key asing DI DALAM prayers
          aiKey: "SECRET",
          catatan: "jurnal pribadi user",
        }),
      ],
      meta: [rec("m-1", { startDate: "2026-09-01", password: "P4SS" })],
    });

    expect(items).toHaveLength(3); // days + completion 20% + event
    const json = JSON.stringify(items);
    expect(json).not.toContain("P4SS");
    expect(json).not.toContain("SECRET");
    expect(json).not.toContain("password");
    expect(json).not.toContain("aiKey");
    expect(json).not.toContain("jurnal pribadi");
    expect(items[1]).toMatchObject({ key: "sholat-prayers-completion", value: 20 });
  });

  it("(7) unexpected schema aman: bukan array / null; meta ganda → yang valid pertama menang", () => {
    expect(
      sholat99Adapter.toItems({
        days: "x" as unknown as DataRecord[],
        meta: null as unknown as DataRecord[],
      }),
    ).toEqual([]);

    const items = sholat99Adapter.toItems({
      days: [],
      meta: [
        rec("m-1", { startDate: "bukan" }), // invalid → dilewati
        rec("m-2", { startDate: "2026-09-01" }), // valid pertama → menang
        rec("m-3", { startDate: "2026-10-01" }),
      ],
    });
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ id: makeItemId(SLUG, "meta", "m-2", "start") });
  });
});
